import * as cp from 'child_process'

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
