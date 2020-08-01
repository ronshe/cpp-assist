const vscode = require('vscode');
const { removePrefix } = require('./tools');

function includeGuard() {
	let editor = vscode.window.activeTextEditor;
	if (!editor) return;

	editor.edit(editBuilder => {
        const document = editor.document;
        const definition = getIncludeGuardDefine();
		const start = document.lineAt(0).range.start;
		editBuilder.insert(start, `#ifndef ${definition}\n#define ${definition}\n\n`);
		const end = document.lineAt(document.lineCount-1).range.end;
		editBuilder.insert(end, `\n#endif${getComment(definition)}\n`);
	});
}

function getIncludeGuardDefine() {
	const path = vscode.window.activeTextEditor.document.fileName;
	const config = vscode.workspace.getConfiguration();
	const prefix = config.get('cpp_helper.includeGuard.prefix');
	const suffix = config.get('cpp_helper.includeGuard.suffix');

    return prefix + removePrefix(path).replace(/[\\\/\.-]/g, '_').toUpperCase() + suffix;
}

function getComment(definition) {
	const config = vscode.workspace.getConfiguration();
	const commentStyle = config.get('cpp_helper.includeGuard.commentStyle');
	const spaces = ' '.repeat(config.get('cpp_helper.includeGuard.spacesBeforeComment'));
    return (commentStyle == 'None') ? '' :
            ((commentStyle == 'line comment') ? `${spaces}// ${definition}` : `${spaces}/* ${definition} */`);
}
module.exports = includeGuard;
