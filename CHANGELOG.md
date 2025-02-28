# Change Log

All notable changes to the "cursor-vibe-mode" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [0.0.4] - 2024-02-28

### Added
- Added SUPPORT.md file with comprehensive support information
- Added gallery banner for better marketplace presentation
- Improved documentation for marketplace integration

## [0.0.3] - 2024-02-26

### Added
- Smooth animations when entering and exiting Vibe Mode for a more elegant experience
- New setting for centered layout (`useCenteredLayout`, default: false)

### Changed
- Removed dependency on Zen Mode for better control and reliability
- Completely redesigned UI state management
- Improved error handling with try/catch blocks for all UI operations

### Fixed
- Fixed potential issues with UI element toggling
- Improved reliability of UI state detection and restoration

## [0.0.2] - 2024-02-25

### Added
- Separate commands for explicitly enabling and disabling Vibe Mode
- Keyboard shortcuts for enable (`Ctrl+K E` / `Cmd+K E`) and disable (`Ctrl+K D` / `Cmd+K D`) commands
- Automatic breadcrumbs hiding when in Vibe Mode
- New setting to control breadcrumbs restoration (`restoreBreadcrumbs`)

### Changed
- Completely redesigned state management to avoid UI detection issues
- Removed `hideBreadcrumbs` setting as breadcrumbs are now always hidden in Vibe Mode
- Improved code organization with separate functions for enabling and disabling Vibe Mode
- Removed references to activity bar as it's not present in Cursor AI
- Enhanced user feedback messages for Vibe Mode state changes
- Optimized for Cursor's unique UI structure to avoid conflicts

### Fixed
- Fixed issue with "Please quit and reopen for the activity bar to be displayed vertically" error
- Fixed issue with state restoration when exiting Vibe Mode
- Improved handling of breadcrumbs visibility state
- Enhanced centered layout handling with more reliable detection and toggling

## [0.0.1] - 2024-02-24

### Added
- Initial release of Cursor Vibe Mode
- Toggle Vibe Mode command with keyboard shortcut (Ctrl+K V / Cmd+K V)
- Toggle AI Layout command with keyboard shortcut (Ctrl+K L / Cmd+K L)
- Toggle AI Sidebar command with keyboard shortcut (Ctrl+Cmd+B) specifically for Cursor AI
- Configuration settings for customizing Vibe Mode behavior:
  - AI panel visibility
  - AI panel position (side/bottom)
  - Status bar visibility
  - Breadcrumbs visibility
  - Full screen mode toggle
- State preservation to restore original layout when exiting Vibe Mode
- Special integration with Cursor AI's auxiliarybar (Secondary Side Bar) toggle functionality
- Non-centered layout for a more natural coding experience

### Fixed
- Updated commands to work with Cursor AI's unique UI structure
- Added support for Cursor's auxiliarybar instead of standard sidebar for AI features
- Fixed issue with centered layout being enabled by default in Zen Mode
- Fixed compatibility issues with Cursor's VS Code version (1.93.x)