import * as vscode from 'vscode'
import * as shell from '../shell'
import { AttachedTag } from '../tmsu';

class FileItem extends vscode.TreeItem {
	public readonly iconPath = vscode.ThemeIcon.File;
	public readonly contextValue = "tmsu-gui.tagExplorer.file";
	public readonly label:string;
	public readonly resourceUri: vscode.Uri;

	constructor(tag:AttachedTag){
		super(tag.tagName);
		this.label = tag.tagName;
		this.resourceUri = tag.fileUri;
		this.id = `${tag.fileUri.fsPath}#${tag.tagName}`;
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

type TagExplorerElt = string|AttachedTag;
export default class TagExplorer implements vscode.TreeDataProvider<TagExplorerElt>{
	private static readonly _onDidChangeTreeData = new vscode.EventEmitter<void>();
	public readonly onDidChangeTreeData = TagExplorer._onDidChangeTreeData.event;

	public static Refresh(){
		TagExplorer._onDidChangeTreeData.fire();
	}

	async getChildren(element?: TagExplorerElt): Promise<TagExplorerElt[]|undefined> {
		if (!element) {
			const context = vscode.workspace.workspaceFolders?.[0]?.uri;
			if (!context)
				return undefined;
			const r = await shell.GetAllTags(context);
			if (Array.isArray(r))
				return r;
			else
				vscode.window.showErrorMessage(r.err?.message ?? "")
		}
		else{
			// return files for tag.
		}
	}

	getTreeItem(element: TagExplorerElt): vscode.TreeItem {
		if (element instanceof AttachedTag)
			return new FileItem(element);
		else
			return new TagItem(element);
	}
}
