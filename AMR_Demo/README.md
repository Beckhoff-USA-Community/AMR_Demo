# AMR Demo - TwinCAT 3 Project

This is the TwinCAT 3 automation project for the Autonomous Mobile Robot (AMR) demonstration system.

## Project Overview

The AMR Demo project integrates PLC control, TwinCAT Safety, Motion Control (NC), and I/O configuration for a differential-drive mobile robot with navigation capabilities.

### Key Features

- **PackML State Machine**: ISA-88 compliant state machine for standardized control
- **Navitrol Integration**: TCP/IP communication with Navitrol navigation supervisor
- **Differential Drive Control**: Independent control of left and right drive wheels
- **Lift Axis Control**: Vertical positioning via CANopen (CSP mode)
- **Safety Integration**: TwinCAT Safety with E-Stop and laser scanner monitoring
- **Recipe Management**: Persistent storage of axis parameters and operational settings

## Project Structure

```
AMR_Demo/
├── AMR_Demo.sln          # Visual Studio solution file
├── AMR_Demo.tsproj       # TwinCAT System Project
├── PLC/                  # PLC project
│   ├── PLC.plcproj      # PLC project file
│   ├── MAIN.TcPOU       # Main program entry point
│   ├── AMR/             # AMR-specific modules
│   │   ├── AmrModule.TcPOU          # Core control logic
│   │   ├── AmrModule_HMI.TcPOU      # HMI interface
│   │   └── DUT/                     # Data structures
│   └── Components/      # Reusable components
│       ├── Navitrol/    # Navitrol communication
│       └── Encoder/     # Encoder handling
├── Safety/              # TwinCAT Safety project
│   ├── Safety.splcproj  # Safety PLC project
│   ├── Inputs/          # Safety inputs (E-Stop, scanners)
│   └── Outputs/         # Safety outputs
├── _Boot/               # Bootable TwinCAT configuration
└── _Config/             # Runtime configuration
    ├── PLC/             # PLC configuration
    ├── NC/              # Motion configuration
    ├── IO/              # I/O configuration
    └── SPLC/            # Safety configuration
```

## Opening and Building

1. **Requirements**:
   - TwinCAT 3.1 Build 4026.20 or later
   - Visual Studio 2015 or later with TwinCAT XAE Shell

2. **Open the Project**:
   - Open `AMR_Demo.sln` in Visual Studio

3. **Build**:
   - Build the PLC project: Right-click on PLC project → Build
   - Build the Safety project: Right-click on Safety project → Build
   - Activate configuration: TwinCAT → Activate Configuration

## Architecture

### Main Program Flow

The `MAIN` program (`PLC/MAIN.TcPOU`):
1. Initializes the `AmrModule` on first cycle
2. Generates HMI tree structure for web interface
3. Calls `AmrModule.CyclicLogic()` every PLC cycle

### AmrModule

`AmrModule` extends `PackMLModule` and implements the core control logic:

- **PackML States**:
  - `Stopped`: Idle state, manual control allowed
  - `Starting`: Transition to automatic operation
  - `Execute`: Active operation with velocity streaming
  - `Stopping`: Controlled stop
  - `Aborting`: Emergency transition to error state
  - `Aborted`: Error state requiring fault clearing
  - `Clearing`: Error reset transition

- **Drive Components**:
  - Left/Right wheels: NC axis control with velocity streaming
  - Lift axis: CANopen CSP (Cyclic Synchronous Position) mode
  - Encoder integration for odometry feedback

- **Safety Components**:
  - `SafetyEstop` — E-Stop monitoring with automatic reset
  - `SafetyScannerLeuze` — Leuze RSL400 safety scanner for obstruction detection
  - `SafetyScannerHokuyo` — Hokuyo UAM-05LP scanner for obstruction detection
  - Three safety groups: Input, Motion, Lift Speed

### Navitrol Communication

The robot communicates with a Navitrol navigation system via TCP/IP:

- **Message Types**:
  - `1001`: Initialize position
  - `1016`: Odometry measurement updates (differential drive)
  - `3001`: Hold/Release control
  - `3002`: Status exchange (bidirectional)
  - `3005`: Go to destination command
  - `3024`: Return to route

- **Velocity Streaming**: Real-time velocity commands sent to wheel axes

## Configuration

### Target System

- **Target NetId**: 5.135.212.84.1.1
- **Task Configuration**:
  - PlcTask: Priority 20, Cycle Time 20ms (50Hz)
  - AMS Port: 350

### Simulation Mode

Set `Simulated := TRUE` in MAIN to enable:
- Safety simulation (bypasses physical safety hardware)
- Useful for testing without connected hardware

## See Also

- [AMR_Demo_HMI](../AMR_Demo_HMI/README.md) - Web-based HMI interface
- [Documentation](../Documentation/README.md) - Device and protocol documentation
