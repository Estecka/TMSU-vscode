import * as vscode from "vscode";
import * as shell from "../shell";

class TagItem implements vscode.QuickPickItem {
	public readonly label:string;

	constructor(tag:string){
		this.label = tag;
	}
};

export async function ShowTagPicker(context:vscode.Uri):Promise<string|undefined>{
	let r = await shell.GetAllTags(context);
	if (!Array.isArray(r)){
		vscode.window.showErrorMessage(r.err?.message ?? "Unknown error");
		r = [];
	}


	const qp = {
		ui: vscode.window.createQuickPick(),
		items: new Map<string, TagItem>(),
		toBeResolved: true,
	};
	for (let t of r)
		qp.items.set(t, new TagItem(t));
	qp.ui.placeholder = "Tag Name";
	qp.ui.ignoreFocusOut = true;
	qp.ui.canSelectMany = false;
	qp.ui.items = Array.from(qp.items.values());
	qp.ui.onDidHide(()=>qp.ui.dispose());


	qp.ui.onDidChangeValue((value)=>{
		const items:vscode.QuickPickItem[] = Array.from(qp.items.values());
		if (value && !qp.items.has(value)){
			items.unshift(new TagItem(value),
			);
		}
		qp.ui.items = items;
	});

	qp.ui.show()

	return new Promise(resolve=>{
		qp.ui.onDidAccept(()=>{
			if (qp.toBeResolved){
				resolve(qp.ui.selectedItems[0]?.label);
				qp.toBeResolved = false;
			}
		});
		qp.ui.onDidHide(()=>{
			if (qp.toBeResolved){
				resolve(undefined)
				qp.toBeResolved = false;
			}
		});
	});
}