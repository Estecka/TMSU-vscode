import * as vscode from 'vscode'
import * as shell from '../shell';
import { AttachedTag } from '../tmsu';

class TagItem extends vscode.TreeItem {
	public readonly iconPath = new vscode.ThemeIcon("tag");
	public readonly contextValue = "tmsu-gui.tagView.tag";
	public readonly label:string;
	public readonly resourceUri: vscode.Uri;

	constructor(tag:AttachedTag){
		super(tag.tagName);
		this.label = tag.tagName;
		this.resourceUri = tag.fileUri;
		this.id = `${tag.fileUri.fsPath}#${tag.tagName}`;
	}
}
class FileItem extends vscode.TreeItem {
	public readonly iconPath = vscode.ThemeIcon.File;
	public readonly contextValue = "tmsu-gui.tagView.file";
	public collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
	constructor(uri:vscode.Uri){
		super(uri);
		this.id = uri.fsPath;
	}
}

type TagViewElt = vscode.Uri|AttachedTag;
export default class TagView implements vscode.TreeDataProvider<TagViewElt>{
	private static _preview?:vscode.Uri
	private static _files = new Map<string, vscode.Uri>();

	private static readonly _onDidChangeTreeData = new vscode.EventEmitter<void>();
	public readonly onDidChangeTreeData = TagView._onDidChangeTreeData.event;

	public static Refresh(){
		TagView._onDidChangeTreeData.fire();
	}
	public static SetPreview(file?:vscode.Uri){
		if (file && TagView._files.has(file?.fsPath))
			file = undefined;
		TagView._preview = file;
		TagView._onDidChangeTreeData.fire();
	}
	public static ShowFile(file:vscode.Uri){
		TagView._files.set(file.fsPath, file);
		if (TagView._preview?.fsPath == file.fsPath)
			TagView._preview = undefined;
		TagView._onDidChangeTreeData.fire();
		vscode.commands.executeCommand("tmsu-gui.tagView.focus");
	}
	public static HideFile(file:vscode.Uri){
		TagView._files.delete(file.fsPath);
		if (TagView._preview == file)
			TagView._preview = undefined;
		TagView._onDidChangeTreeData.fire();
	}

	async getChildren(element?: TagViewElt): Promise<TagViewElt[]|undefined> {
		if (!element) {
			let elts = Array.from(TagView._files.values());
			if (TagView._preview)
				elts.unshift(TagView._preview);
			return elts;
		}
		else if (element instanceof vscode.Uri){
			const r = await shell.GetTagsForFile(element);
			if (Array.isArray(r))
				return r.map( tag=>new AttachedTag(element, tag) );
			else
				vscode.window.showErrorMessage(r.err?.message ?? "")
		}
	}

	getTreeItem(element: TagViewElt): vscode.TreeItem {
		if (element instanceof vscode.Uri)
			return new FileItem(element)
		else
			return new TagItem(element);
	}
}
