const vscode = require('vscode');
const fs = require('fs');
const { getIncludeGuardStart, getIncludeGuardEnd } = require('./includeGuard');
const { getExtensionPath } = require('./tools');

async function createClass(folderData) {
    const wsPath = folderData.path;
    const className = await getClassName();
    if (!className) {
        vscode.window.showInformationMessage('Illegal class name');
        return;
    }
    await createCppFile(wsPath, className);
    await createHFile(wsPath, className);
    vscode.window.showInformationMessage(`Created class files: ${className}`);
}

async function createCppFile(wsPath, className) {
    const config = vscode.workspace.getConfiguration();
    const HExt = config.get(`cpp_helper.createClass.hppExtension`);

    let content = `#include "${className}.${HExt}"\n\n`;

    const template = readTemplate('cppTemplateFile', 'default.cpp');
    if (template) {
        content += template.replace(/NEW_CLASS_NAME/g, className);

        const cppExt = config.get(`cpp_helper.createClass.cppExtension`);
        await writeSourceFile(wsPath, className, cppExt, content);
    }
}

async function createHFile(wsPath, className) {
    const config = vscode.workspace.getConfiguration();
    const HExt = config.get(`cpp_helper.createClass.hppExtension`);

    let content = getIncludeGuardStart(`${className}.${HExt}`);

    const template = readTemplate('hppTemplateFile', 'default.h');
    if (template) {
        content += template.replace(/NEW_CLASS_NAME/g, className);
        content += "\n" + getIncludeGuardEnd(`${className}.${HExt}`);

        await writeSourceFile(wsPath, className, HExt, content);
    }
}

function readTemplate(templateOption, defaultFile) {
    const config = vscode.workspace.getConfiguration();
    let templateFile = config.get(`cpp_helper.createClass.${templateOption}`);
    if (!templateFile) {
        templateFile = getExtensionPath() + '/templates/' + defaultFile;
    }
    const templateData = fs.readFileSync(templateFile);
    return Buffer.from(templateData).toString('utf8');
}

async function writeSourceFile(wsPath, className, ext, content) {
    const filePath = vscode.Uri.file(`${wsPath}/${className}.${ext}`);
    fs.writeFile(filePath.fsPath, content, err => {
        if (err) {
            vscode.window.showInformationMessage(`Failed to write: ${filePath.fsPath}`);
        }
    });
}

async function getClassName() {
    return await vscode.window.showInputBox({
			prompt: "Enter a new class name",
			placeHolder: "ClassName",
			validateInput: text => {
				if (0 > text.search(/^[a-zA-Z]\w*$/)) {
					return 'You must enter a name';
				} else {
					return undefined;
				}
			}
		});
}
module.exports = createClass;
