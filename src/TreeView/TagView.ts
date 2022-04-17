import * as vscode from 'vscode'
import * as shell from '../shell';

type tag = string;
type TagViewElt = vscode.Uri|tag;

export default class TagView implements vscode.TreeDataProvider<TagViewElt>{
	private static _files = new Map<string, vscode.Uri>();

	private static readonly _onDidChangeTreeData = new vscode.EventEmitter<void>();
	public readonly onDidChangeTreeData = TagView._onDidChangeTreeData.event;

	public static ShowFile(file:vscode.Uri){
		TagView._files.set(file.fsPath, file);
		TagView._onDidChangeTreeData.fire();
		vscode.commands.executeCommand("tmsu-gui.tagView.focus");
	}
	public static HideFile(file:vscode.Uri){
		TagView._files.delete(file.fsPath);
		TagView._onDidChangeTreeData.fire();
	}

	async getChildren(element?: TagViewElt): Promise<TagViewElt[]|undefined> {
		if (!element)
			return Array.from(TagView._files.values());
		else if (element instanceof vscode.Uri){
			const r = await shell.GetTagsForfile(element);
			if (Array.isArray(r))
				return r;
			else
				vscode.window.showErrorMessage(r.err?.message ?? "")
		}
	}

	getTreeItem(element: TagViewElt): vscode.TreeItem | Thenable<vscode.TreeItem> {
		if (element instanceof vscode.Uri)
			return new vscode.TreeItem(element, vscode.TreeItemCollapsibleState.Expanded);
		else
			return new vscode.TreeItem(element);
	}
}
