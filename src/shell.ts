import * as cp from 'child_process'
import * as vscode from 'vscode'
import path = require('path');

export interface ExecResult {
	err:cp.ExecException|null;
	stdout:string;
	stderr:string;
}

export function Exec(command:string) : Promise<ExecResult> {
	return new Promise((resolve)=>{
		cp.exec(command, (err, stdout, stderr)=>{
			resolve({err, stdout, stderr});
		});
	});
}

export function GetContext(uri:vscode.Uri) : string {
	return vscode.workspace.getWorkspaceFolder(uri)?.uri?.fsPath ?? path.dirname(uri.fsPath);
}

export type tmsuVerb = "files"|"tag"|"tags"|"untag";

export function TmsuExec(context:vscode.Uri|string, verb:tmsuVerb, args:string[] = []) : Promise<ExecResult> {
	if (context instanceof vscode.Uri)
		context = GetContext(context);

	let command = `cd "${context}" && tmsu ${verb}`;
	for (let arg of args)
		command += ` "${arg}"`;

	return Exec(command);
}
