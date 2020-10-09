const vscode = require('vscode');
const fs = require('fs').promises;
const { getIncludeGuardStart, getIncludeGuardEnd, getIncludeGuardDefine } = require('./includeGuard');
const { getExtensionPath } = require('./tools');
const infoMsg = vscode.window.showInformationMessage;
const errorMsg = vscode.window.showErrorMessage;

async function createClass(folderData) {
    const wsPath = folderData.path;
    const className = await getClassName();
    if (!className) {
        errorMsg('Illegal class name');
        return;
    }
    await createCppFile(wsPath, className);
    await createHFile(wsPath, className);
    infoMsg(`Created class files: ${className}`);
}

async function createCppFile(wsPath, className) {
    const config = vscode.workspace.getConfiguration();
    const HExt = config.get('cpp_assist.createClass.hppExtension');

    let content = `#include "${className}.${HExt}"\n\n`;

    const template = await readTemplate('cppTemplate', 'default.cpp');
    if (template) {
        content += template.replace(/NEW_CLASS_NAME/g, className);

        const cppExt = config.get('cpp_assist.createClass.cppExtension');
        await writeSourceFile(wsPath, className, cppExt, content);
    }
}

async function createHFile(wsPath, className) {
    const config = vscode.workspace.getConfiguration();
    const HExt = config.get('cpp_assist.createClass.hppExtension');
    const useIncludeGuard = config.get('cpp_assist.createClass.useIncludeGuard');

    let guardDefinition = undefined, content = '';
    if (useIncludeGuard) {
        guardDefinition = getIncludeGuardDefine(`${className}.${HExt}`);
        content = getIncludeGuardStart(guardDefinition);
    }
    const template = await readTemplate('hppTemplate', 'default.h');
    if (template) {
        content += template.replace(/NEW_CLASS_NAME/g, className);
        if (useIncludeGuard) {
            content += '\n' + getIncludeGuardEnd(guardDefinition);
        }
        await writeSourceFile(wsPath, className, HExt, content);
    }
}

async function readTemplate(templateOption, defaultFile) {
    const config = vscode.workspace.getConfiguration();
    let templateFile = config.get(`cpp_assist.createClass.${templateOption}`);
    if (!templateFile) {
        templateFile = getExtensionPath() + '/templates/' + defaultFile;
    }
    const templateData = await fs.readFile(templateFile).catch(() => {
        const msg = `Could not read template file: ${templateFile}`;
        errorMsg(msg);
        throw new Error(msg);
    });
    return Buffer.from(templateData).toString('utf8');
}

async function writeSourceFile(wsPath, className, ext, content) {
    const filePath = vscode.Uri.file(`${wsPath}/${className}.${ext}`);
    await fs.writeFile(filePath.fsPath, content).catch(err => {
        if (err) {
            errorMsg(`Failed to write: ${filePath.fsPath}\n${err}`);
        }
    });
}

async function getClassName() {
    return await vscode.window.showInputBox({
        prompt: 'Enter a new class name',
        placeHolder: 'ClassName',
        validateInput: text => {
            if (text.search(/^[a-zA-Z]\w*$/) < 0) {
                return 'Illegal class name';
            }
            return undefined;
        }
    });
}
module.exports = createClass;
