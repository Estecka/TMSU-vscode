import * as vscode from 'vscode'

export class AttachedTag {
	constructor(
		public fileUri:vscode.Uri,
		public tagName:string,
	){}
};
