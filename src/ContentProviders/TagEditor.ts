import * as vscode from 'vscode';
import * as shell from '../shell'

export default class TagEditor implements vscode.TextDocumentContentProvider {
	private result?:shell.ExecResult;
	
	ondidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
	onDidChange = this.ondidChangeEmitter.event;
	
	provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
		if (!this.result){
			const workspace = vscode.workspace.getWorkspaceFolder(uri.with({scheme: "file"}));
			if (!workspace) {
				vscode.window.showErrorMessage(`Workspace not found for uri: ${uri.fsPath}`);
				return ""
			}
			shell.Exec(`cd ${workspace.uri.fsPath} && tmsu tags ${uri.fsPath}`).then((r)=>{
				this.result = r;
				this.ondidChangeEmitter.fire(uri);
			})
			return `${uri}\nLoading tags...`
		}

		return `${this.result.stdout}\n${this.result.stderr}`;
	}
}
