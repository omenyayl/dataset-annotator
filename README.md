# Dataset Annotator
Tool for annotating image datasets.

Table of Contents
=================

 * [Installation](#installing-and-running-as-a-user)
 * [Running](#running)
 * [Instructions](#instructions)

## Demo
![demo pic](https://s3.amazonaws.com/olegpublicbucket/annotator-test.PNG)
[here](https://s3.amazonaws.com/olegpublicbucket/annotator-test.json) is what the exported data looks like

## Installing and Running as a user
* Windows: 
  * Download the .exe file [here](https://github.com/omenyayl/dataset-annotator/releases/download/v0.8.0/dataset-annotator-setup-0.8.0.exe) and install it.
  * Run the app from your desktop
* Mac:
  * Download the .dmg file [here](https://github.com/omenyayl/dataset-annotator/releases/download/v0.8.0/dataset-annotator-0.8.0.dmg) and install it
  * Run it from Applications
* Linux:
  * Download the .AppImage file [here](https://github.com/omenyayl/dataset-annotator/releases/download/v0.8.0/dataset-annotator-0.8.0-x86_64.AppImage) and run it - don't forget to add executable permissions to the file with chmod +x 

## Developing
### Installing
Go into the cloned directory, and install with
```
git clone https://github.com/omenyayl/dataset-annotator
sudo npm install -g electron ionic
cd dataset-annotator
npm install
```

### Running
Run with
```
npm run dev
```

## Instructions
### Saving and Loading
*Loading Images*

To load images, click the deep blue plus button in the bottom right corner.

![FAB](https://s3.amazonaws.com/olegpublicbucket/FAB.png)

Two bright blue circle buttons will pop up, click the lower circle button with the folder on it. This will bring up a file selection window. From your computer, upload a load a folder of images into the annotator; the annotator currently accepts .jpg and .png images.

![Images](https://s3.amazonaws.com/olegpublicbucket/load_images.png)

*Loading Annotations*

To load previous annotations, click on the hamburger icon (the three lines) in the top left corner to bring out a side menu.

![Hamburger](https://s3.amazonaws.com/olegpublicbucket/Hamburger.png)

Then select the Load Annotations option. This will bring up a file selection window, which will allow you to select a *.json* file and import it. Click away from the side menu to see the annotations show up on your loaded images.

![Hamburger](https://s3.amazonaws.com/olegpublicbucket/load_annotations.png)

*Saving Annotations*

To save annotations start by clicking on the deep blue plus button in the bottom right corner, and then select the upper bright blue circle that has a download icon on it.

![Hamburger](https://s3.amazonaws.com/olegpublicbucket/save_annotations.png)

### Hotkeys
There are several predefined hotkeys available to help you label quickly and efficiently. (Hotkeys make certain buttons on the keyboard into shortcuts; for example, pressing the letter ‘w’ switches the current tool in use to a rectangle instead of a polyline; using hotkeys makes complex tasks easier by minimizing the effort needed). The current hotkey for an individual action, such as clicking the rectangle tool, is marked next to the tool name in parenthesis.
“Image of a button with a hotkeys distinction by it, plus little arrows pointing at the name and the hotkey”
A few of the hotkeys can be modified to your liking; for example, if you want to go to the next image, you can change the hotkey from ‘D’ to the ‘down’ arrow on the keyboard. Click the hamburger icon in the top left corner to pull up the side menu. Click the Settings option. The top option is called ‘keybindings’ and is where you can change what some of the hotkeys are.

![Keybindings](https://s3.amazonaws.com/olegpublicbucket/keybindings.png)


The full list of available hotkeys. Hotkeys are keyboard shortcuts to make complex tasks quick and easy.
 * *A & D* - Scroll back and forth through loaded annotations
 * *Q, W, E, and R* - Toggle between the Line, Rectangle, Polygon, and Polyline tool respectively
 * *X, Backspace, and Delete* - Deletes the currently selected annotation


### Labeling tools
#### Line
The line tool lets you create an annotation that is comprised of two points. To place a line left click to place the starting point, and left click again to place the second point.
#### Rectangle
This tool lets you create classic rectangle style annotations. Similar to the line tool, left click to place the starting point, and left click once again to place the finishing point, once the rectangle covers your desired object.
#### Polygon
This is a tool for more intricate labels. Left click to place new points of a multisided shape. End your annotation by clicking on the initial point of the polygon, as this will close out the figure. There is no limit on how many points you can place, but the polygon must have a minimum of three separate points.
#### Polyline
Polyline is used for intricate line labeling. Left click to place the initial point. Click other new points to change the direction of the line. To end a polyline annotation, right click. **This will place a final point**. A polyline annotation has no maximum amount of points.

### Labels and editing
On the right-hand\* side of the current image you are ready to label, there are two headers in deep blue and a button in gray. Under the two deep blue headers is a list of the existing annotations.

![Annotations](https://s3.amazonaws.com/olegpublicbucket/Annotations.png)

The top deep blue label changes names depending on what tool is selected, while the second deep blue header has the title ‘action’. This side display will not show all annotations on the image, only annotations that fall under the tool currently in use. For example, if you have the polyline tool selected, only the polylines you’ve created will appear on the display list. For multiple annotations of a certain tool on a single image, you might need to scroll under the tool title to see all of the objects. 
For each annotation, there are two fields and a trash can icon. The left-hand field is a numeric field made to correspond to defined actions across multiple frames (see the next section). The right-hand field is a name field for the annotation's label, such as “car”. The right-hand trashcan button deletes the annotation completely from the image.

\**When operating in a smaller window, this list moves to below the image*

#### Auto-labeling
Upon labeling an annotation, the next annotations created will have the same name. This is done to help label a sequence of the same object through frames more efficiently. However, you can easily change the name of the new annotation by typing it in the name field of the annotation.

#### Editing annotations
Each annotation has large circles at their respective corner and end points. By left clicking and dragging on these points you can edit existing labels. By clicking on these points you can also select an annotation both on the canvas and in the existing annotations menu. Note that there is no way to add more points to an existing annotation.

### Actions
![Actions](https://s3.amazonaws.com/olegpublicbucket/Actions.png)
Actions serve as a way for connecting selected labels across multiple frames. This should allow you to create label sequences for video classifiers. 
To create an action:
 1. Click “'New Action' button, this is the gray button on the bottom of the side display bar. Each action will have a numeric ID field and an editable name field.  
 2. Fill in the left-hand numeric field on the annotation you want to start a sequence of side display bar with a number ID. For example, if you know you want to label a person walking across multiple scenes, start on the first scene where the person appears. In the left-hand numeric field of the annotation, you fill in a number, such as “3”.
 3. Then fill in the corresponding number ID on the action you created on the left-hand numeric field. In the example above, you’d mark it “3” again.
 4. Don’t forget to name the action in the right-hand field

*Separate instances of actions are meant to have separate action IDs. A black car driving across a sequence of images should have a different action ID from a blue car driving across the same sequence of images. In addition, each object you’ve annotated must have a unique action ID.*
