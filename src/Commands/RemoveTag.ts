import * as vscode from 'vscode'
import * as shell from '../shell';
import TagView, { AttachedTag } from "../TreeView/TagView";

export default async function RemoveTag(arg:any){
	if (!(arg instanceof AttachedTag)){
		vscode.window.showInformationMessage("Invalid argument");
		console.warn(typeof(arg), arg);
		return;
	}
	
	let uri = arg.fileUri;
	let tag = arg.tagName;
	shell.TmsuExec(uri, 'untag', [uri?.fsPath, tag]);
	vscode.window.showInformationMessage(`Tag Removed: ${tag}`);
	TagView.Refresh();
}
