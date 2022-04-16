import * as vscode from 'vscode';
import TagView from '../TreeView/TagView';

export default async function ShowTags(fileUri:any){
	if (!(fileUri instanceof vscode.Uri)){
		vscode.window.showErrorMessage(`Uri type unknown.`);
		console.error(fileUri);
	}
	else
		TagView.ShowFile(fileUri);
};
