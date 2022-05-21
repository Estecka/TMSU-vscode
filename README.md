# TMSU integration for VSCode

An approximation of a GUI for [TMSU](https://github.com/oniony/TMSU/). In the form of a vscode extension, because this was easier to make than doing a standalone app.

This is only a prototype, so a lot of special case are not being properly handled. I am still fooling around to figure out what can and cannot be done, so a lot of things may change.

## Requirements

This has been developped with TMSU [0.6.0](https://github.com/oniony/TMSU/releases/tag/v0.6.0) on Windows. (The latest official window binary as of writting.)
It is unknown whether it will work on other platforms or with a more recent version of TMSU.

This uses the current workspace folder to figure out where to call tmsu from.
As of now, the extension runs under the assumption that one and only one workspace folder is open. Behaviours are undefined otherwise.

## Features

- Tag explorer view. Lists tags, which can be expanded to list the files using that tag. Selecting file here will attempt to open it with vscode, and temporarily pin it at the top of the Tag viewer.
- Tag viewer. Pin a file here to show its tag, and quickly add or remove tags from there.
