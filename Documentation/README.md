# AMR Demo - Documentation

This folder contains technical documentation, configuration files, and device specifications for the AMR Demo project.

## Contents

### Navitrol/
Navigation system documentation and configuration.

- **`params.txt`**: Navitrol parameter configuration file
  - Vehicle dimensions (front, rear, left, right)
  - Scanner configuration (front/rear models)
  - Machine type ID: 10017
  - Navigation parameters (speeds, accelerations, safety margins)
  - Simulation settings

- **`Beckhoff_ver1.ntm`**: Navitrol map file for Beckhoff environment
  - Route definition
  - Waypoint coordinates
  - Zone configuration

- **`LicenseDetails_Standalone.json`**: Navitrol license information

**Key Parameters** (from params.txt):
- Robot dimensions: 1000mm x 700mm (length x width)
- Scanner models: Navitec proprietary (front and rear)
- Simulation mode: Enabled for scanner simulation

### Leuze/
Leuze safety scanner documentation.

- **`AMRDemoLeuze.xml`**: Leuze safety scanner configuration
  - Protective field definitions
  - Warning field configurations
  - Safety zone parameters
  - Device settings for AMR Demo integration

- **`PW.txt`**: Password/access credentials for Leuze device configuration

**Device**: Leuze RSL400 series safety laser scanners (front and rear)

### EtherCAT/
EtherCAT device description files.

- **`HOKUYO_UAM-05LECA_1_0.xml`**: Hokuyo laser scanner EtherCAT device description
  - Device profile
  - PDO (Process Data Objects) mapping
  - Configuration parameters

**Device**: Hokuyo UAM-05LP laser scanner

### CANopen/
CANopen device description files.

- **`PD4-CB59M024035-E-08.eds`**: Electronic Data Sheet for Nanotec motor controller
  - Object dictionary
  - Communication parameters
  - CSP (Cyclic Synchronous Position) mode configuration

**Device**: Nanotec PD4-CB59 CANopen motor controller (used for lift axis)

### IODD/
IO-Link Device Description files for IO-Link devices.

- **BEI Sensors DHx5 Series Files**:
  - `BEI_Sensors-DHx5-RGY-20220321-IODD1.1.xml`: IODD XML description
  - Icon and picture files (*.png): Device visualization assets
  - Supported models: DHK5 (incremental), DHM5 (absolute magnetic), DHO5 (optical)

**Device**: BEI Sensors (Mouser) DHK5 rotary encoder via IO-Link
- Used for: Speed and position feedback on drive wheels
- Interface: IO-Link
- Resolution: Configurable via IO-Link parameters

## Device Network Overview

```
TwinCAT System
├── EtherCAT
│   ├── Safety Terminals (EL/EP series)
│   ├── Digital I/O
│   ├── Analog I/O
│   └── IO-Link Master
│       └── BEI Encoder (DHK5)
├── CANopen
│   └── Nanotec PD4 (Lift Motor)
└── TCP/IP
    ├── Navitrol Supervisor
    └── Leuze Safety Scanners
```

## File Formats

- **`.xml`**: Device descriptions, configurations (EtherCAT, IO-Link, Leuze)
- **`.eds`**: CANopen Electronic Data Sheet
- **`.ntm`**: Navitrol map file (proprietary)
- **`.txt`**: Parameter files, credentials
- **`.json`**: License and configuration data
- **`.png`**: Device icons and images for visualization

## Related Resources

- TwinCAT I/O configuration: `../AMR_Demo/_Config/IO/`
- PLC Navitrol integration: `../AMR_Demo/PLC/Components/Navitrol/`
- Safety configuration: `../AMR_Demo/Safety/`
- HMI diagnostics: `../AMR_Demo_HMI/HmiProj/Pages/Diagnostics/`
