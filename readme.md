# RPG Maker MV TypeScript Port

## TODO: Write a proper readme

This is a work-in-progress port of CoreScript, the Javascript (nw.js/pixi.js) 2D RPG engine for RPG Maker MV, to TypeScript.

Many files have been completely ported. All of the engine files have at least had all their functions typed in a placeholder fashion.

Installing this port should be reasonably simple. Create a new RPG Maker MV project and pull the master branch of this git repository into the main folder of that project. Make sure you have TypeScript (otherwise you cannot actually transpile the code!). You will also want Node. Once you have pulled the repo onto your project, run ```npm install``` to grab the libraries that the TypeScript codebase uses. To transpile the code, use ```tsc```.

This project recommends Visual Studio Code as an IDE.

This project is provided AS-IS and it will require some jury-rigging to work for the time being. There are several graphical defects to do with late loading of assets and not all of the stock MV features have been tested. Plugins for Corescript (normal RPG Maker MV) will likely require modification to work.