import { win32 } from 'path';
import * as vscode from 'vscode';
import * as shell from '../shell'

export default class TagEditor implements vscode.TextDocumentContentProvider {
	private result?:shell.ExecResult;
	
	public ondidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
	public onDidChange = this.ondidChangeEmitter.event;
	
	public provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
		if (!this.result){
			const workspace = vscode.workspace.getWorkspaceFolder(uri.with({scheme: "file"}));
			if (!workspace) {
				vscode.window.showErrorMessage(`Workspace not found for uri: ${uri.fsPath}`);
				//TODO: use the file's directory instead.
				return ""
			}
			else {
				shell.Exec(`cd ${workspace.uri.fsPath} && tmsu tags ${uri.fsPath}`).then((r)=>{
					this.result = r;
					this.ondidChangeEmitter.fire(uri);
				})
				return `Loading tags...`
			}
		}

		if (this.result.err){
			vscode.window.showErrorMessage(this.result.err.message);
			return this.result.stderr;
		}

		return this.result.stdout;
	}
}
