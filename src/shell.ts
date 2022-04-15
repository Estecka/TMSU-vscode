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

export type tmsuVerb = "files"|"tag"|"tags"|"untag";

export function TmsuExec(context:vscode.Uri, verb:tmsuVerb, args:string[] = []) : Promise<ExecResult> {
	const dir = vscode.workspace.getWorkspaceFolder(context)?.uri?.fsPath ?? path.dirname(context.fsPath);

	let command = `cd "${dir}" && tmsu ${verb}`;
	for (let arg of args)
		command += ` "${arg}"`;

	return Exec(command);
}
