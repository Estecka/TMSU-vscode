// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import AddTag from './Commands/AddTag';
import HideTags from './Commands/HideTags';
import RemoveTag from './Commands/RemoveTag';
import ShowTags from './Commands/ShowTags';
import TagExplorer from './TreeView/TagExplorer';
import TagView from './TreeView/TagView';


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "tmsu-gui" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	context.subscriptions.push(
		vscode.commands.registerCommand('tmsu-gui.showTags', ShowTags),
		vscode.commands.registerCommand('tmsu-gui.hideTags', HideTags),
		vscode.commands.registerCommand('tmsu-gui.addTag', AddTag),
		vscode.commands.registerCommand('tmsu-gui.removeTag', RemoveTag),
		vscode.commands.registerCommand('tmsu-gui.refreshTagView', TagView.Refresh),
		vscode.commands.registerCommand('tmsu-gui.refreshTagExplorer', TagExplorer.Refresh),
		vscode.window.registerTreeDataProvider("tmsu-gui.tagView", new TagView()),
		vscode.window.registerTreeDataProvider("tmsu-gui.tagExplorer", new TagExplorer()),
		vscode.commands.registerCommand('tmsu-gui.open', (uri:vscode.Uri)=>{
			vscode.commands.executeCommand("vscode.open", uri);
			TagView.SetPreview(uri);
		}),
	);
}

// this method is called when your extension is deactivated
export function deactivate() {}
