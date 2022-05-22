import * as vscode from 'vscode'
import * as shell from '../shell'

class FileItem extends vscode.TreeItem {
	public readonly iconPath = vscode.ThemeIcon.File;
	public readonly contextValue = "tmsu-gui.queryExplorer.file";
	public readonly resourceUri: vscode.Uri;

	constructor(uri:vscode.Uri){
		super(uri);
		this.resourceUri = uri;
		this.id = undefined;
		this.command = {
			title: "Open file",
			command: "tmsu-gui.open",
			arguments: [uri],
		};
	}
}

class QueryItem extends vscode.TreeItem {
	public readonly iconPath = new vscode.ThemeIcon("search");
	public readonly contextValue = "tmsu-gui.queryExplorer.query";
	public collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
	constructor(query:string){
		super(query);
		this.id = query;
	}
}

type QueryExplorerElt = string|vscode.Uri;
export default class QueryExplorer implements vscode.TreeDataProvider<QueryExplorerElt>
{
	private static _queries = new Set<string>()

	private static readonly _onDidChangeTreeData = new vscode.EventEmitter<void>();
	public readonly onDidChangeTreeData = QueryExplorer._onDidChangeTreeData.event;

	public static Refresh(){
		QueryExplorer._onDidChangeTreeData.fire();
	}

	async getChildren(element?:QueryExplorerElt) : Promise<QueryExplorerElt[]|undefined> {
		const workspace = vscode.workspace.workspaceFolders?.[0]?.uri;
		if (!workspace){
			vscode.window.showWarningMessage("No workspace found for Tag Explorer");
			return undefined;
		}

		if (!element)
			return Array.from(QueryExplorer._queries);
		else if (typeof(element) === "string"){
			const r = await shell.GetFilesForQuery(workspace, element);
			if (Array.isArray(r))
				return r;
			else 
				vscode.window.showErrorMessage(r.err?.message ?? "");
		}
		else 
			return undefined;
	}

	getTreeItem(element: QueryExplorerElt): vscode.TreeItem {
		if (element instanceof vscode.Uri)
			return new FileItem(element)
		else
			return new QueryItem(element);
	}

}