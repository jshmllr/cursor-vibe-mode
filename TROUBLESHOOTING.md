# Troubleshooting Cursor Vibe Mode

This guide helps you troubleshoot common issues with the Cursor Vibe Mode extension.

## Common Issues

### Commands Not Showing Up

If the commands are not showing up in the Command Palette:

1. **Check VS Code Version Compatibility**:
   - Cursor uses VS Code version 1.93.x
   - Make sure your extension's `package.json` has:
     ```json
     "engines": {
       "vscode": "^1.93.0"
     },
     "devDependencies": {
       "@types/vscode": "^1.93.0",
       // other dependencies
     }
     ```
   - After updating, run `npm install` and repackage the extension

2. **Verify Extension Installation**:
   - Check if the extension is installed and enabled in the Extensions view
   - Try uninstalling and reinstalling the extension

3. **Check Activation Events**:
   - The extension might not be activating properly
   - Add `*` to `activationEvents` in `package.json` for testing purposes

### AI Sidebar Not Toggling

If the AI sidebar is not toggling properly:

1. **Check Extension Logs**:
   - Open the Output panel (View > Output)
   - Select "Cursor Vibe Mode" from the dropdown
   - Look for error messages related to toggling the AI sidebar
   - Pay attention to timestamps and command execution attempts

2. **Try Direct Keyboard Shortcut**:
   - Use `Ctrl+Cmd+B` (the default Cursor shortcut for toggling the AI sidebar)
   - If this works but the extension command doesn't, there might be an issue with how the extension is calling the command

3. **Check Cursor Version**:
   - Different versions of Cursor might use different commands for the AI sidebar
   - The extension tries multiple commands, but newer versions might use different ones
   - Check your Cursor version in Help > About and include it in any bug reports

4. **Manual Toggle**:
   - Try manually toggling the AI sidebar using the View menu
   - If this works, note the UI changes to help diagnose the issue

5. **Command Availability**:
   - The extension now checks which commands are available in your Cursor version
   - Look for "Available commands:" in the logs to see which commands were detected
   - If no commands are available, this indicates a compatibility issue with your Cursor version

6. **Configuration Settings**:
   - Check if the `workbench.auxiliaryBar.visible` setting exists in your VS Code settings
   - This setting is used to detect the current state of the AI sidebar
   - If this setting doesn't exist in your Cursor version, detection may fail

### Vibe Mode Not Working as Expected

If Vibe Mode is not applying all expected changes:

1. **Check Configuration**:
   - Verify your settings in VS Code's Settings UI
   - Make sure the settings have the expected values

2. **Check Extension Logs**:
   - Open the Output panel and select "Cursor Vibe Mode"
   - The logs will show which UI changes were attempted and any errors

3. **Try Individual Commands**:
   - Try running individual commands like toggling full screen or centered layout
   - If these work individually but not through Vibe Mode, there might be an issue with the sequence

## Collecting Logs for Troubleshooting

If you're experiencing issues, follow these steps to collect logs for troubleshooting:

1. Open the Output panel (View > Output)
2. Select "Cursor Vibe Mode" from the dropdown
3. Clear the output (click the "Clear Output" button)
4. Reproduce the issue
5. Copy all the log output
6. Create a GitHub issue with the logs and steps to reproduce

## Known Limitations

Cursor Vibe Mode has some inherent limitations due to how it interacts with Cursor.ai:

1. **No Direct API Access**: The extension uses VS Code commands to manipulate the UI, which can be fragile if Cursor changes its implementation.

2. **Command Availability**: Some commands might not be available in all versions of Cursor, which can cause features to fail.

3. **UI Detection**: The extension tries to detect the current state of UI elements, but this detection isn't always reliable.

4. **Animation Timing**: The animation delays are fixed and might not work well on all systems. If animations appear jerky, try adjusting the delay in settings.

## Contributing

If you encounter issues not covered in this guide, please consider contributing:

1. **Report Issues**: Create detailed GitHub issues with logs and reproduction steps
2. **Suggest Improvements**: If you have ideas for better ways to implement features, share them
3. **Submit Pull Requests**: Code contributions are welcome, especially for fixing bugs or improving reliability 