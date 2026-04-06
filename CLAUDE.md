# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AMR Demo BAUS — an Autonomous Mobile Robot demonstration built on the **Beckhoff TwinCAT 3** automation platform. Main components:

- `AMR_Demo/` — TwinCAT System Project (PLC + Safety + Motion NC + I/O)
- `AMR_Demo_HMI/` — TwinCAT HMI web interface (TypeScript + TwinCAT HMI framework)
- `WheelScope/` — TwinCAT Scope project for real-time wheel data visualization
- `Documentation/` — Device specs, Navitrol parameters, EtherCAT/CANopen/IO-Link descriptions; `AMR_Demo_Documentation.html` is the generated HTML API reference with class diagrams

## Building

**Requirements**: TwinCAT 3.1 Build 4026.20+, Visual Studio 2015+

**PLC / Safety**:
- Open `AMR_Demo/AMR_Demo.sln` in Visual Studio
- Right-click the PLC or Safety project → **Build**
- Deploy: **TwinCAT → Activate Configuration**

**HMI**:
- Open `AMR_Demo_HMI/AMR_Demo_HMI.sln` in Visual Studio
- **Build → Build Solution** (F6); output goes to `HmiProj/bin/`
- Access via browser at `http://localhost:1010` after starting TwinCAT HMI Server

**Simulation (no hardware)**:
- Set `Simulated := TRUE` in `AMR_Demo/PLC/MAIN.TcPOU` — bypasses physical safety hardware

## PLC Architecture

### Execution Flow

`MAIN.TcPOU` is the sole entry point. On first cycle it calls `AmrModule.Initialize()` and `MachineHmiTree.GetTree(AmrModule)` to build the HMI symbol tree, then every subsequent cycle calls `AmrModule.CyclicLogic()`.

**Task config**: PlcTask, Priority 20, 20 ms cycle (50 Hz), AMS Port 350.

### AmrModule

`AMR_Demo/PLC/AMR/AmrModule.TcPOU`

`AmrModule EXTENDS PackMLModule` is the central control block. It owns all subsystems as member variables (each registered via `RegisterWithParent()`) and implements the PackML state machine via override methods. Two modes: **Production** and **Manual**; mode changes are only allowed from `Stopped` or `Aborted`.

| State | Purpose |
|-------|---------|
| `Stopped` | Idle; manual axis control allowed |
| `Starting` | Transition to automatic; initializes Navitrol pose (x=21.23, y=36.92, θ=90°), enables axes, starts velocity streaming, moves lift to down |
| `Execute` | Active operation: cycles destinations, streams velocity, operates lift |
| `Stopping` | Controlled stop; disables velocity streaming then axes |
| `Aborting` | Emergency stop; disables streaming, halts and disables all axes |
| `Aborted` | Fault state; awaits operator reset |
| `Clearing` | Fault reset: pulse safety reset → wait 200 ms → `ResetComponents()` → release E-Stop |
| `Suspending` | Scanner obstruction: set E-Stop in Navitrol, stop lift, disable axes |
| `Suspended` | Waiting for scanner clearance; auto-transitions when both scanners report OK |
| `Unsuspending` | Reset scanner faults, re-enable axes, release E-Stop, re-send GoToDestination |

State transition code uses numbered `CASE SequenceState` steps (`NextStep` / `NextMinorStep` advance the counter).

### Navitrol TCP/IP Communication

All Navitrol message function blocks live in `PLC/Components/Navitrol/`. Each extends `TcpIpCommandResultFilter` and sends/receives over a shared `TcpIpConnection` object. Default TCP address: `127.0.0.1:2000`.

| FB | Msg sent | Msg received | Purpose |
|----|----------|--------------|---------|
| `Msg3002_NavitrolStatus` | 3002 (100 ms timer) | 3102 | Bidirectional status exchange; also carries E-Stop flag |
| `Msg1001_InitializePosition` | 1001 | 1100/1101 | Set initial robot pose |
| `Msg1016_MeasurmentUpdateDifferentialDrive` | 1016 (30 ms timer) | 1116 | Odometry + receive wheel velocity setpoints |
| `Msg3005_GoToDestination` | 3005 | 3105 | Command navigation to a waypoint |
| `Msg3024_ReturnToRoute` | 3024 | 3124 | Resume interrupted route |
| `Msg3001_HoldRelease` | 3001 | 3101 | Hold / release motion |

**Critical**: `Msg1016` cycle time (30 ms) must match the Navitrol parameter `control_interval_us`.

### Velocity Streaming

`Navitrol_StreamVelocity` (`PLC/Components/Navitrol/Navitrol_StreamVelocity.TcPOU`) drives each wheel via `MC_MoveVelocity`. Key design:
- Toggles between two `MC_MoveVelocity` FB instances with `MC_Aborting` buffer mode to allow smooth setpoint changes every cycle.
- Optional PT1 first-order filter (`FilterTimeConstant := T#100MS`, toggled via `EnableSmoothing`).
- Stops via `MC_Halt` when |velocity| < `VelocityTolerance`.
- Navitrol sends velocity in m/s; conversion to NC °/s: `ω = (360 × v) / (π × WHEEL_DIAMETER)`.

### Safety

Safety signals flow through `SafetyGroup_TcEvents` groups with `AutoResetFaults := TRUE`:
- `SafetyEstop` — triggers E-Stop flag in Msg3002
- `SafetyScannerLeuze` (Leuze RSL400) / `SafetyScannerHokuyo` (Hokuyo UAM-05LP) — trigger `Suspend` PackML command from within `Execute`

Reset sequence in `Clearing`: pulse `SafetyResetPulse` → 200 ms delay → `ResetComponents()` → release E-Stop in Msg3002.

### Axes

| Axis | Control | Notes |
|------|---------|-------|
| Wheel Left / Right | NC velocity streaming | Via `Navitrol_StreamVelocity`; uses `AXIS_REF` linked to NC axis |
| Lift | NC point-to-point (`AxisPTP`) | CANopen CSP mode (`Lift_CanOpMode := 8`); positions from `Recipe_HMI` |

Wheel diameter constant: `AMR_CONSTANT.WHEEL_DIAMETER := 0.160` m.

### HMI Symbol Exposure

PLC variables exposed to HMI use the attribute `{ attribute 'TcHmiSymbol.AddSymbol' }`. Persistent recipe data with restricted access:
```
{ attribute 'TcHmiSymbol.AddSymbol.UserGroups' := '__SystemAdministrators, Admin' }
VAR PERSISTENT
    Recipe_HMI : ST_Recipe;
END_VAR
```
HMI binds to `MAIN.AmrModule`, `MAIN.AmrModule.AmrModule_HMI`, `MAIN.AmrModule.Recipe_HMI`, `MAIN.AmrModule.Navitrol_HMI`.

## HMI Architecture

TypeScript target ES2022, no module system (global scope). Pages are `.content` files, reusable components are `.usercontrol` files. JavaScript helper functions in `HmiProj/Functions/`. Two ADS profiles: `ADS.Config.default.json` (local) and `ADS.Config.remote.json` (remote target `5.135.212.84.1.1`).

## File Types

| Extension | Description |
|-----------|-------------|
| `.TcPOU` | Program Organization Unit (XML wrapping Structured Text) |
| `.TcDUT` | Data Unit Type (struct/enum/union definitions) |
| `.TcGVL` | Global Variable List |
| `.TcIO` | Interface definition |
| `.tsproj` | TwinCAT System Project |
| `.plcproj` | PLC project |
| `.splcproj` | Safety PLC project |
| `.hmiproj` | HMI project |

All `.TcPOU` / `.TcDUT` / `.TcGVL` / `.TcIO` files are XML; the actual Structured Text code is inside `<ST><![CDATA[...]]></ST>` sections.

## Git Workflow

- Working branch: `Development`
- Merge target: `Release`
