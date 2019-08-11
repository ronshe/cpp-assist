// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cpp-helper" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(
		vscode.commands.registerCommand('extension.includeFile', includeFile),
		vscode.commands.registerCommand('extension.includeGuard', includeGuard)
	);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = { activate, deactivate };

function includeFile() {
	let editor = vscode.window.activeTextEditor;
	if (!editor) return;

	let document = editor.document;
	let selection = editor.selection;
	if (selection.isEmpty) {
		let range = document.lineAt(selection.start.line).range;
        selection = new vscode.Selection(range.start, range.end);
	}

	// Get the word within the selection
	let path = document.getText(selection).replace(/\/.*src\//, '');
	editor.edit(editBuilder => {
		editBuilder.replace(selection, `#include "${path}"`);
	});
}

function includeGuard() {
	let editor = vscode.window.activeTextEditor;
	if (!editor) return;

	let document = editor.document;
	let path = document.fileName;
	const definition = path.replace(/\/.*src\//, '').replace(/[\/\.]/g, '_').toUpperCase() + '_';
	editor.edit(editBuilder => {
		const start = document.lineAt(0).range.start;
		editBuilder.insert(start, `#ifndef ${definition}\n#define ${definition}\n\n`);
		const end = document.lineAt(document.lineCount-1).range.end;
		editBuilder.insert(end, `\n#endif  // ${definition}\n`);
	});
}