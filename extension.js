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
	const deleteUntil = vscode.workspace.getConfiguration().get('cpp_helper.removePathUntil');
	let path = removePrefix(document.getText(selection), deleteUntil);
	editor.edit(editBuilder => {
		editBuilder.replace(selection, `#include "${path}"`);
	});
}

function includeGuard() {
	let editor = vscode.window.activeTextEditor;
	if (!editor) return;

	const deleteUntil = vscode.workspace.getConfiguration().get('cpp_helper.removePathUntil');
	const prefix = vscode.workspace.getConfiguration().get('cpp_helper.includeGuard.prefix');
	const suffix = vscode.workspace.getConfiguration().get('cpp_helper.includeGuard.suffix');
	const commentStyle = vscode.workspace.getConfiguration().get('cpp_helper.includeGuard.commentStyle');
	const spaces = ' '.repeat(vscode.workspace.getConfiguration().get('cpp_helper.includeGuard.spacesBeforeComment'));

	const document = editor.document;
	const path = document.fileName;
	const definition = prefix + removePrefix(path, deleteUntil).replace(/[\\\/\.-]/g, '_').toUpperCase() + suffix;
	editor.edit(editBuilder => {
		const start = document.lineAt(0).range.start;
		editBuilder.insert(start, `#ifndef ${definition}\n#define ${definition}\n\n`);
		const end = document.lineAt(document.lineCount-1).range.end;
		const comment = (commentStyle == 'None') ? '' :
					 ((commentStyle == 'C++') ? `${spaces}// ${definition}` : `${spaces}/* ${definition} */`);
		editBuilder.insert(end, `\n#endif${comment}\n`);
	});
}

function removePrefix(path, prefix) {
	if (prefix.length == 0 || !prefix[prefix.length-1].match(/[\/\\]/))
		prefix += '/';

	const deleteBefore = '\.*'+prefix.replace(/\\/g, '/');
	return path.replace(/.*:/g, '').replace(/\\/g, '/').replace(new RegExp(deleteBefore, 'g'), '');
}