import * as vscode from 'vscode';
import TagView from '../TreeView/TagView';

export default async function HideTags(fileUri:any){
	if (!(fileUri instanceof vscode.Uri)){
		vscode.window.showErrorMessage(`Uri type unknown.`);
		console.error(fileUri);
	}
	else
		TagView.HideFile(fileUri);
};
