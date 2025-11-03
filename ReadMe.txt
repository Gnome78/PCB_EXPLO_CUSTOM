[base 13/10/2025]

Hi there !
PCB Explorer Custom is a tool for oldschool computer repair.
It's inspired from the 'Amiga PCB explorer' project available only in 'surf mode' on internet.
No source available, no update.
Here it's not the case.
All data are proposed : Data mysql and PHP & Javascript code.

Please don't use this tool to really re-create pcb's, it was never intended for that and it won't work for sure.
Also understand that I'm not a developer. At the beginning of this project, I had never written a line of code in javascript.
The code is obviously not optimized and contains surely some errors but it has the advantage :
- To be available for everyone.
- You can use it, improve it, change it.
- Contains much less errors than the original tool.
- Brings new functions compared to the original tool.
- It contains extra data.

More information about table and data :
- COMPONENT	table containt information for search and over component and so, the 'finger/silk'
- DATASVG	table of all SVG elements of each PCB.
- FULL_SVG	a big one. table to point 'each click_dot' to a 'LINE' number and, a lot of information.
- LINE		each copper 'line' with all elements (flash, click, linetop, linebot...)

v1.0 13/10/2025


[Update 03/11/2025]
Now you can find a standalone version in 'release' directory.
No more Apache+mysql needen (and no more available), just launch the index.html

Only this version will be updated in the futur.

See You Soon
