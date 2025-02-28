// This extension provides a "Vibe Mode" for Cursor.ai that creates a distraction-free coding environment
// while keeping AI features accessible. Here's how it works:
//
// 1. The extension tracks whether Vibe Mode is active with the isVibeModeActive flag
// 2. When activated, it applies a series of UI changes to create a focused environment:
//    - Hides distracting UI elements like sidebars and breadcrumbs
//    - Optionally enables full screen mode
//    - Optionally uses centered layout for better focus
//    - Keeps AI features accessible
// 3. When deactivated, it restores the previous UI state
// 4. All operations are logged to an output channel for debugging
// 5. Configuration changes are monitored and reapplied if Vibe Mode is active
// 6. UI changes are applied with animation delays for a smooth transition
// 7. Error handling ensures graceful degradation if commands fail

// Import the VS Code API
import * as vscode from 'vscode';

// Track whether Vibe Mode is currently enabled
let isVibeModeActive = false;

// Output channel for logging extension activity
let outputChannel: vscode.OutputChannel;

// Configuration interface defining Vibe Mode settings
interface VibeConfig {
    hideStatusBar: boolean;      // Whether to hide the status bar
    useFullScreen: boolean;      // Whether to use full screen mode
    restoreBreadcrumbs: boolean; // Whether to restore breadcrumbs on exit
    useCenteredLayout: boolean;  // Whether to use centered editor layout
}

// Called when extension is activated
export function activate(context: vscode.ExtensionContext) {
    // Initialize the output channel
    outputChannel = vscode.window.createOutputChannel('Cursor Vibe Mode');
    outputChannel.show(true);
    
    outputChannel.appendLine('Cursor Vibe Mode is now active!');
    outputChannel.appendLine(`Cursor Version: ${vscode.version}`);
    console.log('Cursor Vibe Mode is now active!');

    // Register the toggle Vibe Mode command
    let toggleVibeMode = vscode.commands.registerCommand('cursor-vibe-mode.toggleVibeMode', async () => {
        outputChannel.appendLine('Toggle Vibe Mode command triggered');
        const config = vscode.workspace.getConfiguration('cursor-vibe-mode');
        
        if (!isVibeModeActive) {
            // Enable Vibe Mode
            await enableVibeModeFunc(config);
        } else {
            // Disable Vibe Mode
            await disableVibeModeFunc();
        }
    });

    // Listen for configuration changes
    context.subscriptions.push(
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('cursor-vibe-mode') && isVibeModeActive) {
                outputChannel.appendLine('Configuration changed, reapplying Vibe Mode');
                const config = vscode.workspace.getConfiguration('cursor-vibe-mode');
                applyVibeMode(getVibeConfig(config));
            }
        })
    );

    context.subscriptions.push(toggleVibeMode);
    context.subscriptions.push(outputChannel);
    
    outputChannel.appendLine('All commands registered successfully');
}

// Helper function to get current configuration settings
function getVibeConfig(config: vscode.WorkspaceConfiguration): VibeConfig {
    const vibeConfig = {
        hideStatusBar: config.get<boolean>('hideStatusBar', false),
        useFullScreen: config.get<boolean>('useFullScreen', true),
        restoreBreadcrumbs: config.get<boolean>('restoreBreadcrumbs', true),
        useCenteredLayout: config.get<boolean>('useCenteredLayout', false)
    };
    
    // Validate the configuration
    const validation = validateVibeConfig(vibeConfig);
    if (!validation.valid) {
        outputChannel.appendLine(`Configuration validation issues: ${validation.issues.join(', ')}`);
        vscode.window.showWarningMessage(
            'Cursor Vibe Mode: Some configuration settings have invalid types. Using defaults.',
            'View Details'
        ).then(selection => {
            if (selection === 'View Details') {
                outputChannel.show();
            }
        });
        
        // Return default configuration if validation fails
        return {
            hideStatusBar: false,
            useFullScreen: true,
            restoreBreadcrumbs: true,
            useCenteredLayout: false
        };
    }
    
    return vibeConfig;
}

// Function to validate configuration settings
function validateVibeConfig(config: VibeConfig): { valid: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Check each setting for correct type
    if (typeof config.hideStatusBar !== 'boolean') {
        issues.push(`hideStatusBar should be boolean, got ${typeof config.hideStatusBar}`);
    }
    
    if (typeof config.useFullScreen !== 'boolean') {
        issues.push(`useFullScreen should be boolean, got ${typeof config.useFullScreen}`);
    }
    
    if (typeof config.restoreBreadcrumbs !== 'boolean') {
        issues.push(`restoreBreadcrumbs should be boolean, got ${typeof config.restoreBreadcrumbs}`);
    }
    
    if (typeof config.useCenteredLayout !== 'boolean') {
        issues.push(`useCenteredLayout should be boolean, got ${typeof config.useCenteredLayout}`);
    }
    
    return {
        valid: issues.length === 0,
        issues
    };
}

// Helper function to add delays between UI changes for smooth animations
async function animationDelay(ms: number = 100): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to apply UI changes sequentially with animation delays
async function animatedUIChange(commands: Array<() => Promise<void>>, delayBetween: number = 150): Promise<void> {
    for (const command of commands) {
        await command();
        await animationDelay(delayBetween);
    }
}

// Function to enable Vibe Mode with current configuration
async function enableVibeModeFunc(config: vscode.WorkspaceConfiguration) {
    // Enter Vibe Mode directly without using Zen Mode
    await enterVibeMode(getVibeConfig(config));
    isVibeModeActive = true;
    vscode.window.showInformationMessage('Vibe Mode activated. Focus and flow achieved! 🎵');
    outputChannel.appendLine('Vibe Mode activated');
}

// Function to disable Vibe Mode and restore previous settings
async function disableVibeModeFunc() {
    // Exit Vibe Mode
    await exitVibeMode();
    isVibeModeActive = false;
    vscode.window.showInformationMessage('Vibe Mode deactivated.');
    outputChannel.appendLine('Vibe Mode deactivated');
}

// Refactored enterVibeMode function
async function enterVibeMode(config: VibeConfig) {
    const timestamp = new Date().toISOString();
    outputChannel.appendLine(`[${timestamp}] Entering Vibe Mode`);
    
    // Use the new enforceVibeMode function which has more reliable detection methods
    await enforceVibeMode(config);
    
    outputChannel.appendLine(`[${timestamp}] Vibe Mode entry complete`);
}

// Helper functions for UI element management
async function toggleFullScreen(enable: boolean): Promise<void> {
    const timestamp = new Date().toISOString();
    try {
        const isFullScreen = vscode.workspace.getConfiguration('window').get<boolean>('fullScreen', false);
        if (enable !== isFullScreen) {
            outputChannel.appendLine(`[${timestamp}] ${enable ? 'Enabling' : 'Disabling'} full screen`);
            await vscode.commands.executeCommand('workbench.action.toggleFullScreen');
        } else {
            outputChannel.appendLine(`[${timestamp}] Full screen already in desired state (${enable ? 'enabled' : 'disabled'})`);
        }
    } catch (error) {
        outputChannel.appendLine(`[${timestamp}] Error managing full screen: ${error}`);
    }
}

async function manageSidebar(visible: boolean): Promise<void> {
    const timestamp = new Date().toISOString();
    try {
        const sideBarVisible = vscode.workspace.getConfiguration('workbench').get<boolean>('sideBar.visible', true);
        if (visible !== sideBarVisible) {
            outputChannel.appendLine(`[${timestamp}] ${visible ? 'Opening' : 'Closing'} sidebar`);
            await vscode.commands.executeCommand('workbench.action.toggleSidebarVisibility');
        } else {
            outputChannel.appendLine(`[${timestamp}] Sidebar already in desired state (${visible ? 'visible' : 'hidden'})`);
        }
    } catch (error) {
        outputChannel.appendLine(`[${timestamp}] Error managing sidebar: ${error}`);
    }
}

async function manageBreadcrumbs(visible: boolean): Promise<void> {
    const timestamp = new Date().toISOString();
    try {
        const breadcrumbsEnabled = vscode.workspace.getConfiguration('breadcrumbs').get<boolean>('enabled', true);
        if (visible !== breadcrumbsEnabled) {
            outputChannel.appendLine(`[${timestamp}] ${visible ? 'Showing' : 'Hiding'} breadcrumbs`);
            await vscode.commands.executeCommand('breadcrumbs.toggle');
        } else {
            outputChannel.appendLine(`[${timestamp}] Breadcrumbs already in desired state (${visible ? 'visible' : 'hidden'})`);
        }
    } catch (error) {
        outputChannel.appendLine(`[${timestamp}] Error managing breadcrumbs: ${error}`);
    }
}

async function manageStatusBar(visible: boolean): Promise<void> {
    const timestamp = new Date().toISOString();
    try {
        // Note: There's no direct way to check status bar visibility, so we always toggle
        outputChannel.appendLine(`[${timestamp}] ${visible ? 'Showing' : 'Hiding'} status bar`);
        await vscode.commands.executeCommand('workbench.action.toggleStatusbarVisibility');
    } catch (error) {
        outputChannel.appendLine(`[${timestamp}] Error managing status bar: ${error}`);
    }
}

async function manageCenteredLayout(enable: boolean): Promise<void> {
    const timestamp = new Date().toISOString();
    try {
        const isCentered = vscode.workspace.getConfiguration('editor').get<boolean>('centerLayout', false);
        if (enable !== isCentered) {
            outputChannel.appendLine(`[${timestamp}] ${enable ? 'Enabling' : 'Disabling'} centered layout`);
            await vscode.commands.executeCommand('workbench.action.toggleCenteredLayout');
        } else {
            outputChannel.appendLine(`[${timestamp}] Centered layout already in desired state (${enable ? 'enabled' : 'disabled'})`);
        }
    } catch (error) {
        outputChannel.appendLine(`[${timestamp}] Error managing centered layout: ${error}`);
    }
}

async function applyVibeMode(config: VibeConfig) {
    outputChannel.appendLine('Applying Vibe Mode settings');
    outputChannel.appendLine(`Settings: ${JSON.stringify(config)}`);
    
    // Apply UI visibility settings
    if (config.hideStatusBar) {
        outputChannel.appendLine('Hiding status bar');
        await vscode.commands.executeCommand('workbench.action.toggleStatusbarVisibility');
    }
    
    // Always hide breadcrumbs in Vibe Mode
    outputChannel.appendLine('Hiding breadcrumbs');
    await vscode.commands.executeCommand('breadcrumbs.toggle');
}

async function exitVibeMode() {
    outputChannel.appendLine('Exiting Vibe Mode');
    
    const config = vscode.workspace.getConfiguration('cursor-vibe-mode');
    const vibeConfig = getVibeConfig(config);
    
    // Create array of UI changes to restore
    const uiChanges: Array<() => Promise<void>> = [];
    
    // Restore centered layout if it was enabled
    if (vibeConfig.useCenteredLayout) {
        uiChanges.push(async () => {
            try {
                outputChannel.appendLine('Disabling centered layout');
                const isCentered = vscode.workspace.getConfiguration('editor').get<boolean>('centerLayout', false);
                if (isCentered) {
                    await vscode.commands.executeCommand('workbench.action.toggleCenteredLayout');
                }
            } catch (error) {
                outputChannel.appendLine(`Error toggling centered layout: ${error}`);
            }
        });
    }
    
    // Restore fullscreen if needed
    if (vibeConfig.useFullScreen) {
        uiChanges.push(async () => {
            const isFullScreen = vscode.workspace.getConfiguration('window').get<boolean>('fullScreen', false);
            if (isFullScreen) {
                outputChannel.appendLine('Exiting full screen');
                await vscode.commands.executeCommand('workbench.action.toggleFullScreen');
            }
        });
    }
    
    // Restore sidebar
    uiChanges.push(async () => {
        try {
            outputChannel.appendLine('Restoring sidebar');
            const sideBarVisible = vscode.workspace.getConfiguration('workbench').get<boolean>('sideBar.visible', false);
            if (!sideBarVisible) {
                await vscode.commands.executeCommand('workbench.action.toggleSidebarVisibility');
            }
        } catch (error) {
            outputChannel.appendLine(`Error restoring sidebar: ${error}`);
        }
    });
    
    // Restore status bar if it was hidden
    if (vibeConfig.hideStatusBar) {
        uiChanges.push(async () => {
            try {
                outputChannel.appendLine('Restoring status bar');
                await vscode.commands.executeCommand('workbench.action.toggleStatusbarVisibility');
            } catch (error) {
                outputChannel.appendLine(`Error restoring status bar: ${error}`);
            }
        });
    }
    
    // Restore breadcrumbs if configured
    if (vibeConfig.restoreBreadcrumbs) {
        uiChanges.push(async () => {
            try {
                outputChannel.appendLine('Restoring breadcrumbs');
                const breadcrumbsEnabled = vscode.workspace.getConfiguration('breadcrumbs').get<boolean>('enabled', true);
                if (breadcrumbsEnabled) {
                    await vscode.commands.executeCommand('breadcrumbs.toggle');
                }
            } catch (error) {
                outputChannel.appendLine(`Error restoring breadcrumbs: ${error}`);
            }
        });
    }
    
    // Execute all UI changes with animation delays
    await animatedUIChange(uiChanges);
    
    outputChannel.appendLine('Vibe Mode exit complete');
}

// Called when extension is deactivated
export function deactivate() {
    // Clean up by exiting Vibe Mode if still active
    if (isVibeModeActive) {
        exitVibeMode().catch(err => {
            console.error('Error exiting Vibe Mode during deactivation:', err);
        });
    }
}

// New function to enforce Vibe Mode UI state using getContext for more reliable detection
async function enforceVibeMode(config: VibeConfig): Promise<void> {
    const timestamp = new Date().toISOString();
    outputChannel.appendLine(`[${timestamp}] Enforcing Vibe Mode UI state`);
    
    // Create a sequence of UI changes to animate
    const uiChanges: Array<() => Promise<void>> = [];
    
    // Handle fullscreen
    if (config.useFullScreen) {
        uiChanges.push(async () => {
            try {
                // Don't use getContext as it's not available
                const isFullScreen = vscode.workspace.getConfiguration('window').get<boolean>('fullScreen', false);
                outputChannel.appendLine(`[${timestamp}] Fullscreen state: ${isFullScreen}`);
                
                if (!isFullScreen) {
                    outputChannel.appendLine(`[${timestamp}] Enabling fullscreen`);
                    await vscode.commands.executeCommand('workbench.action.toggleFullScreen');
                }
            } catch (error) {
                outputChannel.appendLine(`[${timestamp}] Error managing fullscreen: ${error}`);
                // Fall back to the old method
                await toggleFullScreen(true);
            }
        });
    }
    
    // Hide left sidebar - CHANGED: Now we explicitly hide it instead of ensuring it's visible
    uiChanges.push(async () => {
        try {
            // Don't use getContext as it's not available
            const sideBarVisible = vscode.workspace.getConfiguration('workbench').get<boolean>('sideBar.visible', true);
            outputChannel.appendLine(`[${timestamp}] Left sidebar visible: ${sideBarVisible}`);
            
            if (sideBarVisible) {
                outputChannel.appendLine(`[${timestamp}] Hiding left sidebar`);
                await vscode.commands.executeCommand('workbench.action.toggleSidebarVisibility');
            } else {
                outputChannel.appendLine(`[${timestamp}] Left sidebar already hidden`);
            }
        } catch (error) {
            outputChannel.appendLine(`[${timestamp}] Error managing left sidebar: ${error}`);
            // Try direct method without checking state
            try {
                outputChannel.appendLine(`[${timestamp}] Attempting to hide sidebar directly`);
                await vscode.commands.executeCommand('workbench.action.toggleSidebarVisibility');
            } catch (directError) {
                outputChannel.appendLine(`[${timestamp}] Direct sidebar toggle failed: ${directError}`);
            }
        }
    });
    
    // Hide breadcrumbs
    uiChanges.push(async () => {
        try {
            // Don't use getContext as it's not available
            const breadcrumbsEnabled = vscode.workspace.getConfiguration('breadcrumbs').get<boolean>('enabled', true);
            outputChannel.appendLine(`[${timestamp}] Breadcrumbs enabled: ${breadcrumbsEnabled}`);
            
            if (breadcrumbsEnabled) {
                outputChannel.appendLine(`[${timestamp}] Hiding breadcrumbs`);
                await vscode.commands.executeCommand('breadcrumbs.toggle');
            } else {
                outputChannel.appendLine(`[${timestamp}] Breadcrumbs already hidden`);
            }
        } catch (error) {
            outputChannel.appendLine(`[${timestamp}] Error managing breadcrumbs: ${error}`);
            // Try direct method without checking state
            try {
                outputChannel.appendLine(`[${timestamp}] Attempting to hide breadcrumbs directly`);
                await vscode.commands.executeCommand('breadcrumbs.toggle');
            } catch (directError) {
                outputChannel.appendLine(`[${timestamp}] Direct breadcrumbs toggle failed: ${directError}`);
            }
        }
    });
    
    // Handle status bar
    if (config.hideStatusBar) {
        uiChanges.push(async () => {
            try {
                // No reliable way to check status bar visibility, so we'll just toggle it
                outputChannel.appendLine(`[${timestamp}] Hiding status bar`);
                await vscode.commands.executeCommand('workbench.action.toggleStatusbarVisibility');
            } catch (error) {
                outputChannel.appendLine(`[${timestamp}] Error managing status bar: ${error}`);
            }
        });
    }
    
    // Handle centered layout
    if (config.useCenteredLayout) {
        uiChanges.push(async () => {
            try {
                // Don't use getContext as it's not available
                const isCentered = vscode.workspace.getConfiguration('editor').get<boolean>('centerLayout', false);
                outputChannel.appendLine(`[${timestamp}] Centered layout: ${isCentered}`);
                
                if (!isCentered) {
                    outputChannel.appendLine(`[${timestamp}] Enabling centered layout`);
                    await vscode.commands.executeCommand('workbench.action.toggleCenteredLayout');
                } else {
                    outputChannel.appendLine(`[${timestamp}] Centered layout already enabled`);
                }
            } catch (error) {
                outputChannel.appendLine(`[${timestamp}] Error managing centered layout: ${error}`);
                // Fall back to the old method
                await manageCenteredLayout(true);
            }
        });
    }
    
    // Execute all UI changes with animation delays
    await animatedUIChange(uiChanges);
    outputChannel.appendLine(`[${timestamp}] Vibe Mode enforcement complete`);
}
