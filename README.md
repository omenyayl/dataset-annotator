# Dataset Annotator
Tool for annotating image datasets.

Table of Contents
=================

 * [Installation](#installing-and-running-as-a-user)
 * [Running](#running)
 * [Instructions](#instructions)

## Demo
![demo pic](https://s3.amazonaws.com/olegpublicbucket/Screen+Shot+2018-07-14+at+12.26.19+PM.png)
[here](https://pastebin.com/BYk2EKhG) is what the exported data looks like (this data did not come from the same image shown above)

## Installing and Running as a user
* Windows: 
  * Download the .exe file [here](https://github.com/omenyayl/dataset-annotator/releases/download/v0.7.2/dataset-annotator-setup-0.7.2.exe) and install it.
  * Run the app from your desktop
* Mac:
  * Download the .dmg file [here](https://github.com/omenyayl/dataset-annotator/releases/download/v0.7.2/dataset-annotator-0.7.2.dmg) and install it
  * Run it from Applications
* Linux:
  * Download the .AppImage file [here](https://github.com/omenyayl/dataset-annotator/releases/download/v0.7.2/dataset-annotator-0.7.2-x86_64.AppImage) and run it - don't forget to add executable permissions to the file with chmod +x 

## Developing
### Installing
Go into the cloned directory, and install with
```
yarn add global ionic electron
yarn install
```

### Running
Run with
```
npm run dev
```

## Instructions
### Saving and Loading
*Loading Images*

Click the blue FAB button in the bottom right corner, followed by clicking the lower sub-icon (folder). This will bring up a folder selection window, which will allow you to load a folder of images into the annotator. The annotator currently accepts jpg and png images.


*Loading Annotations*

To load previous annotations click on the hamburger icon on the top left corner, and then select the Load Annotations option. This will bring up a file selection menu, which will allow you to select a *.json* file.

*Saving Annotations*

To save annotations start by clicking on the blue FAB button in the bottom right corner, and then selected the upper sub-icon (download).

### Hotkeys
There are several predefined hotkeys available to help you label quickly and efficiently.
A few of the hotkeys can be modified to your liking in the Settings menu. The keybindings menu can be found by clicking on the hamburger in the top left corner and opening the Settings option.
'''
picture pointing to hamburger
picture pointing to keybindings menu
'''

The full list of available hotkeys. Hotkeys are keyboard shortcuts to make complex tasks quick and easy.
 * *A & D* - Scroll back and forth through loaded annotations
 * *Q, W, E, and R* - Toggle between the Line, Rectangle, Polygon, and Polyline tool respectively
 * *X, Backspace, and Delete* - Deletes the currently selected annotation


### Labeling tools
#### Line
The line tool lets you create an annotation that is comprised of two points. To place a line left click to place the starting point, and left click again to place the second point.
#### Rectangle
This tool lets you create classic rectangle style annotations. Similar to the line tool, left click to place the first point, and left click once again to place the second point.
#### Polygon
This is a tool for more intricate labels. Left click to place new points, there is no limit on how many points you can place. End your annotation by clicking on the initial point for the polygon in order to close it. A polygon must have a minium of three seperate points.
#### Polyline
For line intricate line labeling. This tool works similarly to the polygon tool, but does not require you to close your annotation. To end a polyline annotation, right click to *place your final point*. A polyline annotation has no minimum or maximum amount of points.

### Labels and editing
'''
Labels menu
'''
The menu on the upper right handside of the labeling canvas will display a list of existing annotations, according to your selected tool. The left hand field as a numeric field made to correspond to defined actions across multiple frames (see the next section). The middle field is a field for the the annotation's label. The right hand trashcan button deletes labels.

#### Auto-labeling
Upon labeling an annotation, newly created annotations will be created with the same name. This is done to make labeling a sequence of the same object through frames very quick and easy to do.

#### Editing annotations
Each annotation has large circles at their respective corner and end points. By left clicking and dragging on these points you can edit existing labels. By clicking on these points you can also select an annotation both on the canvas and in the existing annotations menu. Note that there is no way to add more points to an existing annotation.

### Actions
'''
Actions menu
'''
Actions serve as a way for connecting selected labels across multiple frames. This should allow your to create intuitive label sequences for video classifiers. To create an action, click 'New Action' button at the bottom of the Actions menu. Each action will have an numeric ID field and an editable label field. To attach annotations to an action, simply edit the desired annotations left-hand numeric field to correspond with the action's given ID. Seperate instances of actions are meant to have seperate action IDs.
