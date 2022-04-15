import * as vscode from 'vscode';
import * as shell from '../shell'

export default class TagEditor implements vscode.TextDocumentContentProvider {
	private uri?:vscode.Uri;
	private result?:shell.ExecResult;
	private tags?:string[];
	
	public ondidChangeEmitter = new vscode.EventEmitter<vscode.Uri>();
	public onDidChange = this.ondidChangeEmitter.event;
	
	public provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
		if (!this.result || this.uri !== uri){
			shell.TmsuExec(uri, 'tags', [uri.fsPath]).then((r)=>{
				this.result = r;
				this.uri = uri;
				this.ondidChangeEmitter.fire(uri);
			})
			return `Loading tags...`
		}

		if (this.result.err){
			vscode.window.showErrorMessage(this.result.err.message);
			return this.result.stderr;
		}

		this.tags = this.ParseTags(this.result.stdout, uri);
		if (this.tags === undefined) {
			vscode.window.showErrorMessage("Unexpected return from TSMU");
			return this.result.stdout;
		}

		return this.tags.reduce((display, tag)=>display+tag+'\n', "");
	}

	private ParseTags(stdout:string, uri:vscode.Uri) : string[]|undefined{
		if (!stdout.startsWith(uri.fsPath+":")){
			console.warn("Expected:", uri.fsPath+":")
			return undefined;
		}
		return stdout.substring(uri.fsPath.length + 1).trim().split(' ');
	}
}
