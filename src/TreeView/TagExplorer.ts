import * as vscode from 'vscode'
import * as shell from '../shell'
import { AttachedTag } from '../tmsu';

class FileItem extends vscode.TreeItem {
	public readonly iconPath = vscode.ThemeIcon.File;
	public readonly contextValue = "tmsu-gui.tagExplorer.file";
	public readonly resourceUri: vscode.Uri;

	constructor(tag:AttachedTag){
		super(tag.fileUri);
		this.resourceUri = tag.fileUri;
		this.id = `${tag.fileUri.fsPath}#${tag.tagName}`;
		this.command = {
			title: "Open file",
			command: "tmsu-gui.open",
			arguments: [tag.fileUri],
		};
	}
}

class TagItem extends vscode.TreeItem {
	public readonly iconPath = new vscode.ThemeIcon("tag");
	public readonly contextValue = "tmsu-gui.tagExplorer.tag";
	public collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
	constructor(name:string){
		super(name);
		this.id = name;
	}
}

const nontag = ".";
class UntaggedItem extends vscode.TreeItem {
	public readonly label  = "untagged"
	public readonly contextValue = "tmsu-gui.tagExplorer.untagged";
	public collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
	constructor(){
		super(nontag);
	}
}


type TagExplorerElt = string|AttachedTag;
export default class TagExplorer implements vscode.TreeDataProvider<TagExplorerElt>{
	private static readonly _onDidChangeTreeData = new vscode.EventEmitter<void>();
	public readonly onDidChangeTreeData = TagExplorer._onDidChangeTreeData.event;

	public static Refresh(){
		TagExplorer._onDidChangeTreeData.fire();
	}

	async getChildren(element?: TagExplorerElt): Promise<TagExplorerElt[]|undefined> {
		const workspace = vscode.workspace.workspaceFolders?.[0]?.uri;
		if (!workspace){
			vscode.window.showWarningMessage("No workspace found for Tag Explorer");
			return undefined;
		}

		if (!element) {
			const r = await shell.GetAllTags(workspace);
			if (Array.isArray(r)){
				r.push(nontag);
				return r;
			}
			else
				vscode.window.showErrorMessage(r.err?.message ?? "")
		}
		else if (typeof(element) === "string") {
			let r;
			if (element !== nontag)
				r = await shell.GetFilesForQuery(workspace, element);
			else
				r = await shell.GetUntagged(workspace);
			if (Array.isArray(r))
				return r.map( uri=>new AttachedTag(uri, element) );
			else vscode.window.showErrorMessage(r.err?.message ?? "");
		}
	}

	getTreeItem(element: TagExplorerElt): vscode.TreeItem {
		if (element instanceof AttachedTag)
			return new FileItem(element);
		else if (element !== nontag)
			return new TagItem(element);
		else 
			return new UntaggedItem();
	}
}
