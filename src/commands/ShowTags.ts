import * as vscode from 'vscode';

export default async function ShowTags(fileUri:any){
	vscode.window.showInformationMessage(`Show Tags: ${fileUri}`);

	if (!(fileUri instanceof vscode.Uri)){
		vscode.window.showErrorMessage(`Uri type unknown.`);
		console.error(fileUri);
	}
	else if(fileUri.scheme === "tmsu-tags"){
		vscode.window.showErrorMessage(`Already in a Tag View`)
		console.error(fileUri);
	}
	else {
		const tmsuUri = fileUri.with({scheme: "tmsu-tags"});
		const doc = await vscode.workspace.openTextDocument(tmsuUri);
		await vscode.window.showTextDocument(doc, { preview: false} );
	}
};
