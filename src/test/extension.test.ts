import * as assert from 'assert';
import * as vscode from 'vscode';
// We'll add sinon back when we need it for mocking
// import * as sinon from 'sinon';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as myExtension from '../extension';

// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	// Setup and teardown
	setup(async () => {
		// Ensure Vibe Mode is deactivated before each test
		await vscode.commands.executeCommand('cursor-vibe-mode.disableVibeMode');
	});

	teardown(async () => {
		// Clean up after tests
		await vscode.commands.executeCommand('cursor-vibe-mode.disableVibeMode');
	});

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('jshmllr.cursor-vibe-mode'));
	});

	test('Commands should be registered', async () => {
		const commands = await vscode.commands.getCommands();
		assert.ok(commands.includes('cursor-vibe-mode.toggleVibeMode'));
		assert.ok(commands.includes('cursor-vibe-mode.toggleAISidebar'));
	});

	test('Configuration should load correctly', () => {
		const config = vscode.workspace.getConfiguration('cursor-vibe-mode');
		assert.strictEqual(typeof config.get('keepAIVisible'), 'boolean');
		assert.strictEqual(typeof config.get('hideStatusBar'), 'boolean');
		assert.strictEqual(typeof config.get('useFullScreen'), 'boolean');
		assert.strictEqual(typeof config.get('restoreBreadcrumbs'), 'boolean');
		assert.strictEqual(typeof config.get('useCenteredLayout'), 'boolean');
	});

	// More tests would be added for specific functionality
	// These would use sinon to mock VS Code API calls
});
