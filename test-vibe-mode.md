# Cursor Vibe Mode Testing

This file is for testing the Cursor Vibe Mode extension.

## Test Commands

1. **Toggle Vibe Mode**: Press `Cmd+K V` (Mac) or `Ctrl+K V` (Windows/Linux)
   - Expected: Zen Mode should activate with AI panels still visible
   - Layout should NOT be centered
   - Status bar should show a notification "Vibe Mode activated. Focus and flow achieved! 🎵"

2. **Enable Vibe Mode**: Press `Cmd+K E` (Mac) or `Ctrl+K E` (Windows/Linux)
   - Expected: Same as Toggle Vibe Mode when Vibe Mode is inactive
   - If Vibe Mode is already active, should show "Vibe Mode is already active"

3. **Disable Vibe Mode**: Press `Cmd+K D` (Mac) or `Ctrl+K D` (Windows/Linux)
   - Expected: Exit Vibe Mode and restore UI based on configuration
   - If Vibe Mode is already inactive, should show "Vibe Mode is already inactive"

4. **Toggle AI Layout**: Press `Cmd+K L` (Mac) or `Ctrl+K L` (Windows/Linux)
   - Expected: AI panel position should toggle between side and bottom
   - Status bar should show a notification about the position change

5. **Toggle AI Sidebar**: Press `Ctrl+Cmd+B`
   - Expected: AI Sidebar should toggle visibility
   - Status bar should show a notification "AI Sidebar toggled"

## Configuration Testing

Open Settings (Cmd+, or Ctrl+,) and search for "cursor-vibe-mode" to test the following settings:

- `cursor-vibe-mode.keepAIVisible`: Toggle this setting and test Vibe Mode
- `cursor-vibe-mode.aiPanelPosition`: Change between "side" and "bottom" and test Vibe Mode
- `cursor-vibe-mode.hideStatusBar`: Toggle this setting and test Vibe Mode
- `cursor-vibe-mode.useFullScreen`: Toggle this setting to control whether full screen is used
- `cursor-vibe-mode.restoreBreadcrumbs`: Toggle this setting to control whether breadcrumbs are restored when exiting Vibe Mode

Note: Breadcrumbs are always hidden in Vibe Mode regardless of settings.

## Troubleshooting

If commands are not working:
1. Check Command Palette (Cmd+Shift+P or Ctrl+Shift+P) and search for "Vibe Mode"
2. Verify the extension is installed and enabled in the Extensions view
3. Check the Developer Tools console for any errors (Help > Toggle Developer Tools)
4. Check the "Cursor Vibe Mode" output channel for detailed logs

## Known Issues

- If the layout is still centered after entering Vibe Mode, try toggling Vibe Mode off and on again
- Vibe Mode by default doesn't use the centered layout, but users can manually enable centered layout after entering Vibe Mode if desired

## Cursor-Specific Notes

- This extension is optimized for Cursor AI's unique UI structure
- The extension avoids using commands that interact with the activity bar, which is displayed differently in Cursor
- State management has been simplified to avoid UI detection issues that could cause errors in Cursor