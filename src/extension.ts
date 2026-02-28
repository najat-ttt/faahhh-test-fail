import * as vscode from 'vscode';
import { spawn, exec } from 'child_process';
import * as path from 'path';
import * as os from 'os';

let isPlaying = false;
let lastPlayed = 0;
let diagnosticTimer: NodeJS.Timeout | undefined;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext) {

    console.log('FAAAHHH !!!');

    // Status bar
    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'faahhh.toggle';
    statusBarItem.show();
    updateStatusBar();

    vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('faahhh.enable')) {
            updateStatusBar();
        }
    });

    // Task failure detection
    const taskListener = vscode.tasks.onDidEndTaskProcess(event => {
        const exitCode = event.exitCode;
        const taskName = event.execution.task.name.toLowerCase();

        if (exitCode !== 0 && isTestTask(taskName)) {
            triggerSound(context);
        }
    });

    // Terminal shell execution
    const startExecListener = vscode.window.onDidStartTerminalShellExecution(event => {
        // Will work on it later if needed...
    });

    const endExecListener = vscode.window.onDidEndTerminalShellExecution(event => {
        const exitCode = event.exitCode;

        if (typeof exitCode === 'number' && exitCode !== 0) {
            triggerSound(context);
        }
    });

    context.subscriptions.push(startExecListener, endExecListener);

    // Diagnostic detection (debounced)
    // Debounce timer for diagnostics
    let diagnosticTimer: NodeJS.Timeout | undefined;

    // Listen for diagnostic changes (errors/warnings)
    const diagnosticListener = vscode.languages.onDidChangeDiagnostics(() => {

        // Reset timer on every change (typing, paste, etc.)
        if (diagnosticTimer) {
            clearTimeout(diagnosticTimer);
        }

        diagnosticTimer = setTimeout(() => {

            const activeEditor = vscode.window.activeTextEditor;

            // Ensure there is an active editor
            if (!activeEditor) {
                return;
            }

            const activeUri = activeEditor.document.uri;

            // Get diagnostics only for active file
            const diagnostics = vscode.languages.getDiagnostics(activeUri);

            // Check if any error exists
            const hasError = diagnostics.some(d =>
                d.severity === vscode.DiagnosticSeverity.Error
            );

            // Trigger sound if error exists (cooldown handled inside)
            if (hasError) {
                triggerSound(context);
            }

        }, 4000); // Delay after typing stops (4 seconds)
    });



    // Toggle command
    const toggleCommand = vscode.commands.registerCommand('faahhh.toggle', async () => {

        const config = vscode.workspace.getConfiguration('faahhh');
        const current = config.get<boolean>('enable', true);

        await config.update('enable', !current, vscode.ConfigurationTarget.Global);
        updateStatusBar();
    });

    // ADVANCED: Run Test With Sound (bundled wrapper)
    const runTestCommand = vscode.commands.registerCommand('faahhh.runTest', async () => {

    const config = vscode.workspace.getConfiguration('faahhh');
    const command = config.get<string>('command', 'npm test');

    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];

    if (!workspaceFolder) {
        vscode.window.showErrorMessage('No workspace folder found.');
        return;
    }

    const cwd = workspaceFolder.uri.fsPath;

    const terminal = vscode.window.createTerminal({
        name: 'FAAAHHH Runner',
        cwd
    });

    terminal.show();

    const child = spawn(command, {
        cwd,
        shell: true
    });

    child.stdout.on('data', data => {
        terminal.sendText(data.toString(), false);
    });

    child.stderr.on('data', data => {
        terminal.sendText(data.toString(), false);
    });

    child.on('exit', code => {
        if (code !== 0) {
            triggerSound(context);
        }
    });

    terminal.sendText(command);
});

    context.subscriptions.push(
        taskListener,
        endExecListener,
        diagnosticListener,
        toggleCommand,
        runTestCommand,
        statusBarItem
    );
}

function updateStatusBar() {
    const config = vscode.workspace.getConfiguration('faahhh');
    const enabled = config.get<boolean>('enable', true);

    statusBarItem.text = enabled ? '$(bell) FAAA ON' : '$(bell-slash) FAAA OFF';
}

function triggerSound(context: vscode.ExtensionContext) {

    const config = vscode.workspace.getConfiguration('faahhh');
    const enabled = config.get<boolean>('enable', true);
    const cooldown = config.get<number>('cooldown', 3000);

    if (!enabled) return;

    const now = Date.now();
    if (isPlaying || now - lastPlayed < cooldown) return;

    isPlaying = true;
    lastPlayed = now;

    const audioPath = path.join(
        context.extensionPath,
        'media',
        'faaahhh.wav'
    );

    playSound(audioPath);

    setTimeout(() => {
        isPlaying = false;
    }, cooldown);
}

function isTestTask(taskName: string): boolean {
    return (
        taskName.includes('test') ||
        taskName.includes('jest') ||
        taskName.includes('mocha') ||
        taskName.includes('pytest') ||
        taskName.includes('vitest')
    );
}

function playSound(audioPath: string) {

    const platform = os.platform();

    if (platform === 'win32') {
        exec(`powershell -ExecutionPolicy Bypass -c (New-Object Media.SoundPlayer '${audioPath}').PlaySync();`);
    } else if (platform === 'darwin') {
        exec(`afplay "${audioPath}"`);
    } else {
        exec(`aplay "${audioPath}"`);
    }
}

export function deactivate() {}