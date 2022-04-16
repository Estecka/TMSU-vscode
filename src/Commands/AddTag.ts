import * as vscode from 'vscode'
import * as shell from '../shell';

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
	let workspace = shell.GetContext(files[0]);
	for (let uri of files){
		let wp = shell.GetContext(uri);
		if (workspace !== wp){
			vscode.window.showErrorMessage("Unable to single out a shared workspace for all files");
			return;
		}
	}

	// Repetitively ask for tags until no tag is entered.
	do {
		tag = await vscode.window.showInputBox({
			prompt: "Pick a tag to add to the files.",
			placeHolder: "one tag",
			ignoreFocusOut: true,
		})
		if (tag){
			const args = files.map(uri=>uri.fsPath);
			args.push(`--tags='${tag}'`);
			shell.TmsuExec(workspace!, "tag", args).then(r=>{
				if (!r.err)
					vscode.window.showInformationMessage(`Tagged with ${tag}`);
				else{
					vscode.window.showErrorMessage(`Failed to add tag: ${r.err?.message}`);
				}
			});
		}
	} while (tag !== undefined);
}
