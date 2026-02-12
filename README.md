# AMR Demo BAUS

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

This repository contains three main components:

### 1. [AMR_Demo](AMR_Demo/README.md) - TwinCAT Automation Project
The core automation project including:
- PLC control logic with PackML state machine
- TwinCAT Safety implementation
- Motion control (NC) configuration
- I/O and fieldbus configuration
- Navitrol navigation integration

**[→ Read AMR_Demo Documentation](AMR_Demo/README.md)**

### 2. [AMR_Demo_HMI](AMR_Demo_HMI/README.md) - Web-Based HMI
Browser-based visualization and control interface featuring:
- Real-time robot status monitoring
- PackML control interface
- Manual control and diagnostics
- Recipe management
- Event logging and alarms

**[→ Read AMR_Demo_HMI Documentation](AMR_Demo_HMI/README.md)**

### 3. [Documentation](Documentation/README.md) - Technical Documentation
Device specifications and configuration files:
- Navitrol navigation system parameters
- Leuze safety scanner configuration
- EtherCAT device descriptions
- CANopen motor controller setup
- IO-Link encoder specifications

**[→ Read Documentation Overview](Documentation/README.md)**

### Additional Resources

- **[CLAUDE.md](CLAUDE.md)** - Detailed architecture and development guide for AI assistants
- **WheelScope/** - TwinCAT Scope project for real-time data visualization

## Getting Started

### Prerequisites

- **TwinCAT 3.1** Build 4026.20 or later
- **Visual Studio 2015** or later with TwinCAT XAE Shell
- **TwinCAT HMI Server** (TE2000) for HMI functionality
- Windows 7/10/11 or TwinCAT/BSD target system

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd AMR_Demo_BAUS
   ```

2. **Open TwinCAT Project**:
   - Open `AMR_Demo/AMR_Demo.sln` in Visual Studio
   - Build PLC and Safety projects
   - Activate TwinCAT configuration

3. **Open HMI Project**:
   - Open `AMR_Demo_HMI/AMR_Demo_HMI.sln` in Visual Studio
   - Build HMI solution
   - Start TwinCAT HMI Server
   - Access HMI via browser: `http://localhost:1010`

### Quick Start

1. **PLC**: Set `Simulated := TRUE` in MAIN program for testing without hardware
2. **HMI**: Open web browser to HMI address after starting server
3. **Control**: Use PackML interface to Start → Execute for automatic operation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     AMR Demo System                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐         ┌──────────────────┐          │
│  │  TwinCAT HMI    │◄───ADS──┤   TwinCAT PLC    │          │
│  │  (Web Browser)  │         │   (PackML)       │          │
│  └─────────────────┘         └────────┬─────────┘          │
│                                        │                     │
│                              ┌─────────┼─────────┐          │
│                              │         │         │          │
│                    ┌─────────▼───┐ ┌──▼─────┐ ┌▼────────┐ │
│                    │ TwinCAT NC  │ │ Safety │ │   I/O   │ │
│                    │   (Motion)  │ │  (FSoE)│ │ (EtherCAT)│
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

## Key Features

### PackML State Machine
- Standardized state-based control (ISA-88 compliant)
- States: Stopped, Starting, Execute, Stopping, Aborting, Aborted, Clearing
- Mode selection and transition management

### Differential Drive Control
- Independent left/right wheel control
- Real-time velocity streaming from Navitrol
- Odometry feedback via encoders

### Navigation Integration
- TCP/IP communication with Navitrol supervisor
- Route following and waypoint navigation
- Collision avoidance with safety scanners

### Safety System
- TwinCAT Safety (TÜV certified)
- E-Stop monitoring with automatic reset
- Laser scanner integration (front/rear)
- Safety group management

### Recipe Management
- Persistent storage of axis parameters
- Load/save configurations via HMI
- User permission management

## Development

### Git Workflow

- **Main Branch**: `Development` (not `main`)
- Commit changes to Development branch
- Current status: Clean working directory

### Project Files

- **`.tsproj`** - TwinCAT System Project
- **`.plcproj`** - TwinCAT PLC Project
- **`.splcproj`** - TwinCAT Safety PLC Project
- **`.hmiproj`** - TwinCAT HMI Project
- **`.TcPOU`** - PLC Program Organization Unit
- **`.TcDUT`** - PLC Data Type
- **`.TcGVL`** - PLC Global Variable List

### Building Components

**PLC/Safety**:
- Build through Visual Studio with TwinCAT XAE
- Right-click project → Build
- Activate configuration to deploy

**HMI**:
- Build through Visual Studio: Build → Build Solution (F6)
- TypeScript compiles automatically on save
- Output in `HmiProj/bin/`

## Documentation Links

- **[PLC Project Documentation](AMR_Demo/README.md)** - Detailed PLC architecture
- **[HMI Project Documentation](AMR_Demo_HMI/README.md)** - HMI structure and development
- **[Device Documentation](Documentation/README.md)** - Hardware specifications
- **[CLAUDE.md](CLAUDE.md)** - Comprehensive development guide

## Support

For TwinCAT-specific issues:
- [Beckhoff Information System](https://infosys.beckhoff.com)
- [TwinCAT Documentation](https://www.beckhoff.com/twincat3)

For project-specific questions:
- Review documentation in this repository
- Check component-specific README files
