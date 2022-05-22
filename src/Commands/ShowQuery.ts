import * as vscode from 'vscode';
import QueryExplorer from '../TreeView/QueryExplorer';

export default async function ShowQuery(query?:string){
	if (!query)
		query = await vscode.window.showInputBox({
			placeHolder: "Query",
			prompt: "Query to be added to the explorer",
		});

	if (query)
		QueryExplorer.ShowQuery(query);
};
