const vscode = require('vscode');

function removePrefix(path) {
	let newPath = path;
	let prefix = vscode.workspace.getConfiguration().get('cpp_helper.removePathUntil');
	if (prefix.length > 0) {
		if (!prefix[prefix.length-1].match(/[\/\\]/))
			prefix += '/';

		const deleteBefore = '\.*'+prefix.replace(/\\/g, '/');
		newPath = path.replace(/.*:/g, '').replace(/\\/g, '/').replace(new RegExp(deleteBefore, 'g'), '');
	}
	if (path === newPath) {
		prefix = vscode.workspace.rootPath + '/';
		const deleteBefore = '\.*'+prefix.replace(/\\/g, '/');
		newPath = path.replace(/.*:/g, '').replace(/\\/g, '/').replace(new RegExp(deleteBefore, 'g'), '');
	}
	return newPath;
}

function getSelectedText() {
	const editor = vscode.window.activeTextEditor;
    if (editor.selection.isEmpty) {
        editor.selection = selectLine(editor.document, editor.selection);
    }
    return editor.document.getText(editor.selection);
}

async function pasteToCurrentPosition(editor, selection = editor.selection) {
    const clipboardText = await vscode.env.clipboard.readText();
    await editor.edit(editBuilder => {
        editBuilder.insert(selection.active, clipboardText);
    });
    return selectLine(editor.document, selection);
}

function selectLine(document, selection) {
    const range = document.lineAt(selection.start.line).range;
    if (range.start != range.end) {
        selection = new vscode.Selection(range.start, range.end);
    }
    return selection;
}

function getRelativePath(document, path) {
    const currPath = document.uri.fsPath.replace(/[^\/]*$/, '');
    return require('path').relative(currPath, path);
}

let extensionPath = '';
function setExtensionPath(path) {
    extensionPath = path;
}
function getExtensionPath() {
    return extensionPath;
}

module.exports = {
    setExtensionPath,
    getExtensionPath,
    removePrefix,
    getSelectedText,
    selectLine,
    pasteToCurrentPosition,
    getRelativePath
};
