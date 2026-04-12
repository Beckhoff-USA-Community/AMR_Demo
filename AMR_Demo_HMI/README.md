# AMR Demo HMI - TwinCAT HMI Project

This is the web-based Human-Machine Interface (HMI) for the Autonomous Mobile Robot demonstration system.

## Project Overview

The HMI provides a browser-based visualization and control interface for the AMR Demo system, built with TwinCAT HMI framework (version 1.12).

### Key Features

- **Real-time Monitoring**: Live status of robot position, axes, and safety systems
- **PackML Control**: Visualization and control of PackML state machine
- **Manual Control**: Direct control of axes and functions for testing/setup
- **Recipe Management**: Store and load operational parameters
- **Event Logging**: System event history and diagnostics
- **Scope Integration**: Real-time data plotting (Wheel Scope)

## Project Structure

```
AMR_Demo_HMI/
├── AMR_Demo_HMI.sln          # Visual Studio solution file
└── HmiProj/                   # HMI project
    ├── HmiProj.hmiproj       # HMI project file
    ├── tsconfig.json         # TypeScript configuration
    ├── Desktop.view          # Desktop layout configuration
    ├── Pages/                # HMI pages
    │   ├── Home.content      # Main operational view
    │   ├── Manual.content    # Manual control interface
    │   ├── Recipes.content   # Recipe management
    │   ├── Events.content    # Event log viewer
    │   └── Diagnostics/      # System diagnostics
    ├── UserControls/         # Reusable UI components
    │   ├── PackMLControl.usercontrol      # PackML state control
    │   ├── CoreButton.usercontrol         # Standardized button
    │   └── Panels/                        # Panel components
    │       ├── AxisPTPPanel.usercontrol
    │       ├── EncoderPanel.usercontrol
    │       ├── NavitrolPanel.usercontrol
    │       └── PackMLStatemachinePanel.usercontrol
    ├── Functions/            # JavaScript helper functions
    │   ├── BuildManualPage.js
    │   ├── DisplayPermissiveText.js
    │   ├── GetKinematicStatus.js
    │   └── GetModeName.js
    ├── Server/               # Server-side configuration
    │   ├── ADS/              # ADS connection to TwinCAT
    │   ├── TcHmiEventLogger/ # Event logging
    │   ├── TcHmiRecipeManagement/ # Recipe persistence
    │   └── TcHmiScope/       # Scope data visualization
    ├── Themes/               # Visual themes
    ├── Images/               # Image assets
    └── bin/                  # Build output
```

## Opening and Building

1. **Requirements**:
   - TwinCAT HMI Server (TE2000)
   - Visual Studio 2015 or later
   - TypeScript compiler (included in packages)

2. **Open the Project**:
   - Open `AMR_Demo_HMI.sln` in Visual Studio

3. **Build**:
   - Build solution: Build → Build Solution (or F6)
   - Output is generated in `HmiProj/bin/`

4. **Run**:
   - Start TwinCAT HMI Server
   - Access via web browser: `http://localhost:1010` (default port)

## Configuration

### TypeScript Settings

- **Target**: ES2022
- **Module**: none (global scope)
- **Compile on Save**: Enabled
- **Strict Null Checks**: Enabled

### Server Configuration

- **Communication Port**: 3001
- **Authentication Port**: 13001
- **Public Port**: 3443
- **Router Port**: 10101

### ADS Connection

Two configuration profiles:
- `ADS.Config.default.json` - Local development
- `ADS.Config.remote.json` - Remote target connection

## Pages

### Home Page
Main operational interface showing:
- PackML state machine control
- Current robot status (position, velocity)
- Navitrol connection status
- Safety status (E-Stop, scanners)
- Active alarms and warnings

### Manual Page
Manual control interface for:
- Individual axis jogging and positioning
- Direct function execution
- Component testing
- Parameter adjustment

### Recipes Page
Recipe management:
- Load/save axis configurations
- Parameter presets
- Recipe list management

### Events Page
Event log viewer:
- System events
- Alarms and warnings
- Historical event search
- Event filtering by severity

### Diagnostics
System diagnostics including:
- EtherCAT diagnostics
- Axis status and errors
- Communication status
- System health monitoring

## User Controls

### PackMLControl
Comprehensive PackML interface:
- State visualization
- Command buttons (Start, Stop, Reset, etc.)
- State transition conditions
- Mode selection

### Panel Components

- **AxisPTPPanel**: Axis control with position, velocity, and status
- **EncoderPanel**: Encoder position and speed display
- **NavitrolPanel**: Navitrol status, connection, and commands
- **PackMLStatemachinePanel**: Visual state machine diagram

## Data Binding

The HMI connects to PLC symbols via ADS:
- `MAIN.AmrModule` - Main control module
- `MAIN.AmrModule.AmrModule_HMI` - HMI interface structure
- `MAIN.AmrModule.Recipe_HMI` - Recipe data (persistent)
- `MAIN.AmrModule.Navitrol_HMI` - Navitrol interface

## Server Extensions

### Event Logger
Configured in `Server/TcHmiEventLogger/`:
- Automatic event storage
- Configurable retention
- Event filtering

### Recipe Management
Configured in `Server/TcHmiRecipeManagement/`:
- Recipe file storage
- User permissions
- Recipe validation

### Scope
Configured in `Server/TcHmiScope/`:
- Real-time data charting
- Y-T (time) charts
- Configurable axes and triggers

## See Also

- [AMR_Demo](../AMR_Demo/README.md) - TwinCAT automation project
- [Documentation](../Documentation/README.md) - Device and protocol documentation
