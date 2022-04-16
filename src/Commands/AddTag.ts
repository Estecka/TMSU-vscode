import * as vscode from 'vscode'
import { basename, dirname } from 'path';

export default async function AddTag(files?:vscode.Uri[]|vscode.Uri, tag?:string){
	if (files instanceof vscode.Uri)
		files = [files];

	// Ask for files
	if (!files || !Array.isArray(files)) {
		files = await vscode.window.showOpenDialog({
			title: "Select files for tagging",
			openLabel: "Select",
			canSelectFolders: false,
			canSelectFiles: true,
			canSelectMany: true,
		});
		if (!files)
			return;
	}

	// Figure out which workspaces to work with
	let workspaces = new Set<string>();
	for (let uri of files){
		let wp = vscode.workspace.getWorkspaceFolder(uri)?.uri.fsPath ?? dirname(uri.fsPath);
		workspaces.add(wp);
			
	}
	if (workspaces.size !== 1){
		vscode.window.showErrorMessage("Unable to single out a shared workspace for all files");
		return;
	}

	// Repetitively ask for tags until no tag is entered.
	do {
		tag = await vscode.window.showInputBox({
			prompt: "Pick a tag to add to the files.",
			placeHolder: "tag",
			ignoreFocusOut: true,
		})
		tag && vscode.window.showInformationMessage(tag);
	} while (tag !== undefined);
}
