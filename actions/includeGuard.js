const vscode = require('vscode');
const { removePrefix } = require('./tools');

function includeGuard() {
	let editor = vscode.window.activeTextEditor;
	if (!editor) return;

	editor.edit(editBuilder => {
        const document = editor.document;
		const start = document.lineAt(0).range.start;
		const definition = getIncludeGuardDefine();
		editBuilder.insert(start, getIncludeGuardStart(definition));
		const end = document.lineAt(document.lineCount-1).range.end;
		editBuilder.insert(end, getIncludeGuardEnd(definition));
	});
}

function getIncludeGuardStart(definition) {
	return `#ifndef ${definition}\n#define ${definition}\n\n`;
}

function getIncludeGuardEnd(definition) {
	return `\n#endif${getComment(definition)}\n`;
}

function getIncludeGuardDefine(path) {
	path = path || vscode.window.activeTextEditor.document.fileName;
	const config = vscode.workspace.getConfiguration();
	const prefix = config.get('cpp_assist.includeGuard.prefix');
	let suffix = config.get('cpp_assist.includeGuard.suffix');
	if (config.get('cpp_assist.includeGuard.random')) {
		suffix = '_' + randomStr() + suffix;
	}

    return prefix + removePrefix(path).replace(/[\\\/\.-]/g, '_').toUpperCase() + suffix;
}

function randomStr(length = 12) {
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
}

function getComment(definition) {
	const config = vscode.workspace.getConfiguration();
	const commentStyle = config.get('cpp_assist.includeGuard.commentStyle');
	const spaces = ' '.repeat(config.get('cpp_assist.includeGuard.spacesBeforeComment'));
    return (commentStyle == 'None') ? '' :
            ((commentStyle == 'line comment') ? `${spaces}// ${definition}` : `${spaces}/* ${definition} */`);
}
module.exports = {
	includeGuard,
	getIncludeGuardStart,
	getIncludeGuardEnd,
	getIncludeGuardDefine
};
