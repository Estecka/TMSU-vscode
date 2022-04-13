import * as vscode from 'vscode';

export default class TagEditor implements vscode.TextDocumentContentProvider {
	provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): vscode.ProviderResult<string> {
		return `This is the tag view for :\n${uri}`
	}
}
