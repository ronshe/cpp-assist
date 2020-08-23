// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { setExtensionPath } = require('./actions/tools');
const includeFile = require('./actions/includeFile');
const { includeGuard } = require('./actions/includeGuard');
const createClass = require('./actions/createClass');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	setExtensionPath(context.asAbsolutePath('.'))
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "cpp-helper" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(
		vscode.commands.registerCommand('extension.includeFile', includeFile),
		vscode.commands.registerCommand('extension.includeGuard', includeGuard),
		vscode.commands.registerCommand('extension.createClass', createClass)
	);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = { activate, deactivate };
