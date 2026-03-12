# AMR Demo BAUS

> **[Full Documentation](Documentation/AMR_Demo_Documentation.html)** — HTML reference with class diagram

Autonomous Mobile Robot (AMR) demonstration project built with Beckhoff TwinCAT 3 automation platform.

## Introduction

This project demonstrates a complete AMR system integrating:
- **Real-time motion control** for differential drive and lift mechanisms
- **Navigation integration** with Navitrol navigation supervisor
- **Functional safety** implementation with TwinCAT Safety
- **Web-based HMI** for monitoring and control
- **Industrial communication** via EtherCAT, CANopen, TCP/IP, and IO-Link

The system implements PackML (ISA-88) state machine patterns for standardized industrial automation control.

## Project Structure

| Component | Description |
|-----------|-------------|
| `AMR_Demo/` | TwinCAT System Project — PLC, Safety, Motion NC, I/O |
| `AMR_Demo_HMI/` | Web-based HMI (TwinCAT HMI framework, TypeScript) |
| `Documentation/` | Device specs, Navitrol parameters, EtherCAT/CANopen/IO-Link files |
| `WheelScope/` | TwinCAT Scope project for real-time data visualization |

## Getting Started

### Prerequisites

- **TwinCAT 3.1** Build 4026.20 or later
- **Visual Studio 2015** or later with TwinCAT XAE Shell
- **TwinCAT HMI Server** (TE2000) for HMI functionality

### Building and Running

**PLC / Safety**:
1. Open `AMR_Demo/AMR_Demo.sln` in Visual Studio
2. Right-click PLC or Safety project → **Build**
3. Deploy: **TwinCAT → Activate Configuration**

**HMI**:
1. Open `AMR_Demo_HMI/AMR_Demo_HMI.sln` in Visual Studio
2. **Build → Build Solution** (F6); output goes to `HmiProj/bin/`
3. Start TwinCAT HMI Server, then access via browser: `http://localhost:1010`

**Simulation (no hardware)**:
- Set `Simulated := TRUE` in `AMR_Demo/PLC/MAIN.TcPOU` to bypass physical safety hardware

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AMR Demo System                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐         ┌──────────────────┐          │
│  │  TwinCAT HMI    │◄───ADS──┤   TwinCAT PLC    │          │
│  │  (Web Browser)  │         │   (PackML)       │          │
│  └─────────────────┘         └────────┬─────────┘          │
│                                        │                     │
│                              ┌─────────┼─────────┐          │
│                              │         │         │          │
│                    ┌─────────▼───┐ ┌──▼─────┐ ┌▼────────┐ │
│                    │ TwinCAT NC  │ │ Safety │ │   I/O   │ │
│                    │   (Motion)  │ │  (FSoE)│ │(EtherCAT)│ │
│                    └──────┬──────┘ └───┬────┘ └─┬────────┘ │
│                           │            │        │          │
└───────────────────────────┼────────────┼────────┼──────────┘
                            │            │        │
                    ┌───────▼────────┐   │   ┌────▼────────┐
                    │ Drive Wheels   │   │   │  Sensors    │
                    │ (Left/Right)   │   │   │  (Encoder,  │
                    │ Lift Axis      │   │   │   Scanner)  │
                    └────────────────┘   │   └─────────────┘
                                         │
                                    ┌────▼────────┐
                                    │   Safety    │
                                    │  Devices    │
                                    │ (E-Stop,    │
                                    │  Scanners)  │
                                    └─────────────┘

          ┌──────────────────────────────────┐
          │   Navitrol Navigation System     │
          │   (TCP/IP Connection)            │
          └──────────────────────────────────┘
```

### PLC Execution

`MAIN.TcPOU` is the sole entry point. On the first cycle it calls `AmrModule.Initialize()` and builds the HMI symbol tree, then every subsequent cycle calls `AmrModule.CyclicLogic()`.

- **Task**: PlcTask, Priority 20, 20 ms cycle (50 Hz), AMS Port 350
- **Target NetId**: 5.135.212.84.1.1

`AmrModule` extends `PackMLModule` and owns all subsystems (axes, Navitrol messages, safety groups, encoder) as member variables registered via `RegisterWithParent()`.

## PackML State Machine

The robot operates under a standard ISA-88 PackML state machine with two modes: **Production** and **Manual**. Mode changes are allowed from `Stopped` and `Aborted`.

```
              ┌──────────┐
         ┌───►│ Aborted  │◄──────────────┐
         │    └────┬─────┘               │
         │         │ [Reset]          Aborting
         │         ▼                      │
         │    ┌──────────┐         ┌──────┴─────┐
     Abort    │ Clearing │         │  Any State │
         │    └────┬─────┘         └────────────┘
         │         │
         │         ▼
         │    ┌──────────┐
         │    │ Stopped  │◄──── Stopping ◄──────┐
         │    └────┬─────┘                      │
         │         │ [Start]               [Stop]│
         │         ▼                             │
         │    ┌──────────┐              ┌────────┴───┐
         └────┤ Starting │              │  Execute   │
              └────┬─────┘              └──────┬─────┘
                   │                           │ [scanner]
                   └──────────────────►  ┌─────▼──────┐
                                          │ Suspending │
                                          └─────┬──────┘
                                                │
                                          ┌─────▼──────┐
                                          │ Suspended  │
                                          └─────┬──────┘
                                                │ [scanner OK]
                                          ┌─────▼──────┐
                                          │Unsuspending│
                                          └────────────┘
```

### State Descriptions

| State | Description |
|-------|-------------|
| **Stopped** | Idle; no active motion. Manual axis control is allowed via HMI. |
| **Starting** | Transition to automatic operation: initialize Navitrol position (x=21.23, y=36.92, θ=90°), enable all axes, enable velocity streaming, move lift to down position. |
| **Execute** | Active operation: cycles through destinations 1–4, streams Navitrol velocity setpoints to wheel axes, raises/lowers lift at each stop. Immediately triggers `Suspend` if either safety scanner is obstructed. |
| **Stopping** | Controlled stop: waits for Navitrol setpoint to reach zero and wheels to stop, then disables velocity streaming, stops lift, and disables all axes. |
| **Aborting** | Emergency transition: immediately disables velocity streaming, stops wheels, stops lift, disables all axes. |
| **Aborted** | Fault state; robot is idle and all axes are disabled. Operator must issue Reset command. |
| **Clearing** | Fault reset sequence: pulse safety reset → wait 200 ms for signal propagation → `ResetComponents()` on all subsystems → release E-Stop in Navitrol Msg3002. |
| **Suspending** | Safety obstruction detected: set E-Stop flag in Navitrol, stop lift, disable all axes. |
| **Suspended** | Waiting for scanner clearance; automatically transitions to `Unsuspending` when both `SafetyScannerLeuze` and `SafetyScannerHokuyo` report OK. |
| **Unsuspending** | Scanner cleared: reset Leuze and Hokuyo scanner faults, re-enable axes, release E-Stop in Navitrol, move lift to down position, then re-send GoToDestination command to resume route. |

## Navitrol Communication

The robot communicates with Navitrol via TCP/IP (default `127.0.0.1:2000`). All message function blocks extend `TcpIpCommandResultFilter` and share a single `TcpIpConnection` instance.

| Function Block | Sends | Receives | Interval | Purpose |
|----------------|-------|----------|----------|---------|
| `Msg3002_NavitrolStatus` | 3002 | 3102 | 100 ms | Bidirectional status; carries E-Stop flag |
| `Msg1001_InitializePosition` | 1001 | 1100/1101 | On demand | Set initial robot pose |
| `Msg1016_MeasurmentUpdateDifferentialDrive` | 1016 | 1116 | 30 ms | Odometry upload + receive wheel velocity setpoints |
| `Msg3005_GoToDestination` | 3005 | 3105 | On demand | Command navigation to a waypoint |
| `Msg3024_ReturnToRoute` | 3024 | 3124 | On demand | Resume an interrupted route |
| `Msg3001_HoldRelease` | 3001 | 3101 | On demand | Hold / release motion |

Msg1016 interval (30 ms) must match the Navitrol parameter `control_interval_us`.

Velocity conversion from Navitrol (m/s) to NC (°/s):
```
ω = (360 × v) / (π × WHEEL_DIAMETER)    [WHEEL_DIAMETER = 0.160 m]
```

## Safety System

Safety signals are grouped in `SafetyGroup_TcEvents` groups with `AutoResetFaults := TRUE`:

- **`SafetyEstop`** — E-Stop; sets the E-Stop flag in the Msg3002 Navitrol status message
- **`SafetyScannerLeuze`** — Leuze RSL400 safety laser scanner; triggers `Suspend` from within `Execute`
- **`SafetyScannerHokuyo`** — Hokuyo UAM-05LP laser scanner; triggers `Suspend` from within `Execute`

Safety reset sequence (in `Clearing`): `SafetyResetPulse` → 200 ms delay → `ResetComponents()` → release E-Stop in Msg3002.

## Axes

| Axis | Mode | Notes |
|------|------|-------|
| Wheel Left / Right | NC velocity streaming | `Navitrol_StreamVelocity` with PT1 smoothing (τ = 100 ms); toggles two `MC_MoveVelocity` instances with `MC_Aborting` buffer for seamless setpoint changes |
| Lift | NC point-to-point (`AxisPTP`) | CANopen CSP mode (`Lift_CanOpMode := 8`); target positions from persistent `Recipe_HMI` |

## HMI

TypeScript ES2022 (global scope, no modules). Pages are `.content` files; reusable components are `.usercontrol` files; helpers are `.js` files in `HmiProj/Functions/`.

ADS symbol bindings:
- `MAIN.AmrModule` — main control module
- `MAIN.AmrModule.AmrModule_HMI` — HMI interface structure
- `MAIN.AmrModule.Recipe_HMI` — persistent recipe data (Admin only)
- `MAIN.AmrModule.Navitrol_HMI` — Navitrol interface

Two ADS profiles: `ADS.Config.default.json` (local) and `ADS.Config.remote.json` (remote target).

## Development

### Git Workflow

- **Working branch**: `Development`
- **Merge target**: `Release`

### TwinCAT File Types

| Extension | Description |
|-----------|-------------|
| `.TcPOU` | Program Organization Unit (XML wrapping Structured Text) |
| `.TcDUT` | Data Unit Type (struct / enum / union) |
| `.TcGVL` | Global Variable List |
| `.TcIO` | Interface definition |
| `.tsproj` | TwinCAT System Project |
| `.plcproj` | PLC project |
| `.splcproj` | Safety PLC project |
| `.hmiproj` | HMI project |

### Support

- [Beckhoff Information System](https://infosys.beckhoff.com)
- [TwinCAT Documentation](https://www.beckhoff.com/twincat3)
