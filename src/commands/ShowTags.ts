import * as vscode from 'vscode';

export default function ShowTags(fileUri:string){
	vscode.window.showInformationMessage(`Show Tags: ${fileUri}`);
};
