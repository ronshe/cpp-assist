const vscode = require('vscode');
const { removePrefix, getSelectedText, getRelativePath } = require('./tools');

async function includeFile() {
	const editor = vscode.window.activeTextEditor;
	if (!editor) return;

    let text = getSelectedText();
    if (text.length == 0) {
        text = await vscode.env.clipboard.readText();
    }
    if (text.length > 0) {
        editor.edit(editBuilder => {
        	const config = vscode.workspace.getConfiguration();
            const isRelative = config.get('cpp_assist.includeFile.isRelative');
            const path = isRelative ? getRelativePath(editor.document, text) : removePrefix(text);
            editBuilder.replace(editor.selection, `#include "${path}"\n`);
        });
    }
}

module.exports = includeFile;
