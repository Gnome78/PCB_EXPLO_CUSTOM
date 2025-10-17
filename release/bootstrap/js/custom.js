//**************************************************************************************************************************************************
//1.0a	base : 07 december 2022
//1.1	Add    s.setAttribute("fill", COLOR); in function Click_DOT.
//1.2	Remove s.setAttribute("fill", COLOR); in function Click_DOT.
//1.2	Correct integration of 'stroke' in a 'style' when modifying line attributes (random color).
//1.2	Random color is not 'necessarily' a good idea, we can fall on colors by terrible for the tracks view.
//1.2.1 Modification custom.js and traceLine.php to display correctly (side by side) the tabs of the signals when clicking.
//1.3	Deplacement header of line tracing response from PHP to javascript, add color under each tab created.
//1.4	Mutualization subroutine ChangeStyle().
//1.4.1	Add image on line tab, correction class [RemoveStyle( tab_flash_BOT]
//1.5	Add variable listLine (list line drawn) in html file and manage it in functions Click_DOT & CloseOnglet.
//1.5.1	Adding a tab limiter possible for the 'countSeekListeLine' tracing
//1.6	Add color management for tabs. Add display function 'Max 16 line' and integrate it in the html code.
//1.6.1	Fix bug in test more than 16 colors.
//1.7	New Html base, complete restructuring of it and associated DIV html<->custom.js.
//1.8	Catch Style change, Zoom, Top and Bottom, CleanUp this document.
//1.9	Add Menu 'Layers Select', rename 'Click_DOT' function to 'Select_DOT', re-design 'Select_DOT' function
//2.0	Add Trace Line on MouseOver and a lot of new features. (Full redesign of this file, all the functions have been, either : changed/removed/re-builded or just created... Big update)
//------Rev 2.0 is given the status of stable. (maybe some bugs but, tag as 'stable')
//------Rev 2.1	DataBases modification and a lot of addOn.
//3.0	Database and Code ModificationS to fully manage the Click_Top and Click_Bot on all layers,  redesign of all SVG layers.
//4.0	Major changement Database. All data given from DotClick, not SIGNAL because on some PCB, Original Databases are corrupt (like 'null' or 'uknown'... or double dot but not 'linked')
//
//Date : 3 February 2023
//4.1	A500 rev8A, A600 rev2A, A1200 rev1D1, A1200 rev2B are now available.
//4.2	A4000 rev2, CD32 rev4.1 are now available, add inner and holes layers. Variable position for Response_search_table and 'onglet' of 'signal line, re-design 'Blink' function.
//4.3	Database Optimisation. (ex : Database 50 Mega  -> GiveUsNow 1.5Mo). SVG Data work now with 'LINE number.
//4.4.2	Fix bugs into GoToLayer and ZoOm functions. Now they are working well. selhover class is now 'add', not replace. Display set to none and not to hidden.
//4.5	Add 'SIDE' in traceline function and new value for tracing or not, GND : TRACEGND. Some modifications into function(s) to include 'null' for lineTop and lineBot and a lot of modification in All Database.
//4.6	Issue in Zoom and GoToLayer function (don't work well to correct number Zoom), Corrected.
//4.6b	ChangeStyle function now 'add' trace_hi and not 'change to'. CleanAllPreTrace function now 'remove' a class and not 'change to'. Add button 'Display GND' or not.
//4.7	Retreive Zoom and Side value and use it. Each loading, set to 'true' all options in 'layers selected'.
//4.8	Add a Setting box to change the colors palette.
//4.9	Add new function, BlinkAll. (click under search div table, TH element)
//5.0 	Add Full multi layers INNER & PC_BOARD, add 'Version box' info (on title).'
//5.0	note : Don't forget to push over limit the Database_Finger, sometime 255 is not enough.
//5.0	note : Don't put the PrimaryKey to Finger but on ID and change Finger size to max. data in real use (see data in excel and count it)
//5.1 	Add RGoTOLayer oTate function. 90/180 (Beta)
//5.1a	Patch OverDOT & ClickDOT & TraceLine functions to do NOTHING if it's a flash_drl. Patch ChangeStyle function to return good class for specifi 'PAD' aka CONN
//5.1b	Patch clickedot function to verify clickDot before starting
//5.2	Rotation full implemented
//5.3   Fix Bug into RoTate function.
//5.4	Rotate -90° Add
//6.0	Full LocalApp migration - NoMore Ajax :) 
//6.1	New method to hidden/print trace.
//**************************************************************************************************************************************************

//*********************************************************************
//* Remember : LINE0	Always	'not connected'  (no data collected)  *
//* Remember : LINE1	Always	'Global Ground'  (if data exist)      *
//*********************************************************************

var VeRsion = "6.1";				// Based version
var timer;							// Init value
var timeoutPreTrace = 250; 			// Timer before pre-tracing
var SIDE="TOP";						// Set 'SIDE' to TOP for starting  [no more used]

$(document).ready(function() {
//Retreive configurations and set value
//**************************************************************************
var Zoom = document.getElementById("pcb-zoom_sel").value;
var Rotate = document.getElementById("pcb-rotate_sel").value;
var SIDEelect = document.getElementById("view-top-label").classList;
if(SIDEelect.contains("active")){ SIDE = "TOP" } else { SIDE = "BOT" }

//Force set to true all 'LayerSelect'
document.getElementById("layer_sel-signal").selected = "true";
document.getElementById("layer_sel-silk").selected = "true";
document.getElementById("layer_sel-holes").selected = "true";
document.getElementById("layer_sel-inner1").selected = "";
document.getElementById("layer_sel-inner2").selected = "";
document.getElementById("layer_pcb-board").selected = "true";
$('#pcb-layer_sel').selectpicker('refresh');
//**************************************************************************
//GoToLayer("BASE");					// Start as 'BASE' display (aka TOP). [no more used]
GoToLayer(SIDE);
ZoOm(Zoom);

document.onmousemove = function(e) { xMousePos = e.clientX + window.pageXOffset; yMousePos = e.clientY + window.pageYOffset };	//retreive coord. of mouse.
//*******************************************************************************************
$("#pcb-pcb_sel").on("change", function() {				//Catch Change style button
   var Style = document.getElementById("pcb-pcb_sel").value;
   switch(Style) {
	case "red":
	pcb_view_background_color="#301010";
	pcb_background_background_color="#701010";
	frame_fill="#701010";
	board_stroke="#600707";
	rect_board_fill="#701010";
	circle_board_fill="#600707";
	path_draw_stroke="#c03030";
	path_pads_stroke="#D0D0D0";
	circle_draw_fill="#C03030";
	circle_hi_fill="#FFFA20";
	rect_draw_fill="#C03030";
	circle_draw2_fill="#DDAA00";
	rect_draw2_fill="#DDAA00";
	path_draw2_stroke="#DDAA00";
	circle_draw3_fill="#FFFF00";
	rect_draw3_fill="#FFFF00";
	path_draw3_stroke="#FFFF00";
	trace_hi_stroke="#F0F020";
	trace_hi2_stroke="#C0C020";
	trace_xray_stroke="#FFFF30";
	pads_fill="#D0D0D0";
	pads_hi_fill="#FAFA20";
	pads_sel_hover="#FAFA20";
break;
	
	case "green":
	pcb_view_background_color="#103010";
	pcb_background_background_color="#107010";
	frame_fill="#107010";
	board_stroke="#076707";
	rect_board_fill="#107010";
	circle_board_fill="#076707";
	path_draw_stroke="#30c030";
	path_pads_stroke="#D0D0D0";
	circle_draw_fill="#30c030";
	circle_hi_fill="#FFFF00";
	rect_draw_fill="#30c030";
	circle_draw2_fill="#FF9020";
	rect_draw2_fill="#FF9020";
	path_draw2_stroke="#FF9020";
	circle_draw3_fill="#FF33DD";
	rect_draw3_fill="#FF33DD";
	path_draw3_stroke="#FF33DD";
	trace_hi_stroke="#F0F020";
	trace_hi2_stroke="#C0C020";
	trace_xray_stroke="#FFFF30";
	pads_fill="#D0D0D0";
	pads_hi_fill="#FFFF00";
	pads_sel_hover="#FAFA20";
break;

case "blue":
	pcb_view_background_color="#101030";
	pcb_background_background_color="#101070";
	frame_fill="#101070";
	board_stroke="#070767";
	rect_board_fill="#101070";
	circle_board_fill="#070767";
	path_draw_stroke="#3030c0";
	path_pads_stroke="#D0D0D0";
	circle_draw_fill="#3030c0";
	circle_hi_fill="#FFFA20";
	rect_draw_fill="#3030c0";
	circle_draw2_fill="#DDAA00";
	rect_draw2_fill="#DDAA00";
	path_draw2_stroke="#DDAA00";
	circle_draw3_fill="#FFFF00";
	rect_draw3_fill="#FFFF00";
	path_draw3_stroke="#FFFF00";
	trace_hi_stroke="#F0F020";
	trace_hi2_stroke="#C0C020";
	trace_xray_stroke="#FFFF30";
	pads_fill="#D0D0D0";
	pads_hi_fill="#FFFF00";
	pads_sel_hover="#FAFA20";
break;

case "proto":
	pcb_view_background_color="#201000";
	pcb_background_background_color="#504030";
	frame_fill="#504030";
	board_stroke="#473727";
	rect_board_fill="#504030";
	circle_board_fill="#473727";
	path_draw_stroke="#b08050";
	path_pads_stroke="#D0D0D0";
	circle_draw_fill="#b08050";
	circle_hi_fill="#FFFA20";
	rect_draw_fill="#b08050";
	circle_draw2_fill="#FF9020";
	rect_draw2_fill="#FF9020";
	path_draw2_stroke="#FF9020";
	circle_draw3_fill="#FF33DD";
	rect_draw3_fill="#FF33DD";
	path_draw3_stroke="#FF33DD";
	trace_hi_stroke="#F0F020";
	trace_hi2_stroke="#C0C020";
	trace_xray_stroke="#FFFF30";
	pads_fill="#D0D0D0";
	pads_hi_fill="#FFFF00";
	pads_sel_hover="#FAFA20";
break;

case "dark":
	pcb_view_background_color="#000000";
	pcb_background_background_color="#101010";
	frame_fill="#101010";
	board_stroke="#070707";
	rect_board_fill="#101010";
	circle_board_fill="#070707";
	path_draw_stroke="#404040";
	path_pads_stroke="#D0D0D0";
	circle_draw_fill="#404040";
	circle_hi_fill="#FFFA20";
	rect_draw_fill="#404040";
	circle_draw2_fill="#DDAA00";
	rect_draw2_fill="#DDAA00";
	path_draw2_stroke="#DDAA00";
	circle_draw3_fill="#FFFF00";
	rect_draw3_fill="#FFFF00";
	path_draw3_stroke="#FFFF00";
	trace_hi_stroke="#F0F020";
	trace_hi2_stroke="#C0C020";
	trace_xray_stroke="#FFFF30";
	pads_fill="#D0D0D0";
	pads_hi_fill="#FFFF00";
	pads_sel_hover="#FAFA20";
break;
   
   default:
            console.warn("Style inconnu : " + Style);
	return;
   }
   
   //const css = `#pcb_view { background-color:	${pcb_view_background_color}; }`;
   const css = `/*Version 5.0 */
   	   path.trace_hi {
	fill:			none;
	stroke:			${trace_hi_stroke};
	stroke-linecap:		round;
	stroke-linejoin:	round;
	stroke-opacity:		1.0;
	fill-opacity:		1.0;
}

#pcb_view {
	background-color:	${pcb_view_background_color};
}

.pcb_background {
	background-color:	${pcb_background_background_color};
}

.frame {
	fill:			${frame_fill};
	stroke:			black;
	stroke-linejoin:	round;
}
	
.board {
	fill:			none;
	stroke:			${board_stroke};
	stroke-linecap:		round;
	stroke-linejoin:	round;
	stroke-opacity:		1.0;
	fill-opacity:		1.0;
}

rect.board {
	fill:			${rect_board_fill};
}

circle.board {
	fill:			${circle_board_fill};
}

path.draw {
	fill:			none;
	stroke:			${path_draw_stroke};
	stroke-linecap:		round;
	stroke-linejoin:	round;
	stroke-opacity:		1.0;
	fill-opacity:		1.0;
}

path.pads {
	stroke-opacity:		1.0;
	fill-opacity:		1.0;
	stroke:			${path_pads_stroke};
	fill:			none;
}

circle.draw {
	fill:			${circle_draw_fill};
	stroke-width:		72;
}

circle.hi {
	fill:			${circle_hi_fill};
	stroke-width:		72;
}

rect.draw {
	fill:			${rect_draw_fill};
	stroke-width:		72;
}

circle.draw2 {
	fill:			${circle_draw2_fill};
	stroke-width:		72;
}

rect.draw2 {
	fill:			${rect_draw2_fill};
	stroke-width:		72;
}

path.draw2 {
	fill:			none;
	stroke:			${path_draw2_stroke};
	stroke-linecap:		round;
	stroke-linejoin:	round;
	stroke-opacity:		1.0;
	fill-opacity:		1.0;
}

circle.draw3 {
	fill:			${circle_draw3_fill};
	stroke-width:		72;
}

rect.draw3 {
	fill:			${rect_draw3_fill};
	stroke-width:		72;
}

path.draw3 {
	fill:			none;
	stroke:			${path_draw3_stroke};
	stroke-linecap:		round;
	stroke-linejoin:	round;
	stroke-opacity:		1.0;
	fill-opacity:		1.0;
}


.trace_hi2 {
	fill:			none;
	stroke:			${trace_hi2_stroke};
	stroke-linecap:		round;
	stroke-linejoin:	round;
	stroke-opacity:		1.0;
	fill-opacity:		1.0;
	stroke-dasharray:	1,4;
}

.trace_xray {
	fill:			none;
	stroke:			${trace_xray_stroke};
	stroke-linecap:		round;
	stroke-linejoin:	round;
	stroke-opacity:		0.6;
	fill-opacity:		0.6;
	stroke-dasharray:	4,4;
}

.pads {
	stroke-opacity:		1.0;
	fill-opacity:		1.0;
	fill:			${pads_fill};
	pointer-events:		all;
}

.pads_hi {
	fill:			${pads_hi_fill};
	cursor:			pointer;
}

.selhover {
	fill:			${pads_sel_hover};
	cursor:			pointer;
}

.pads_xray {
	fill:			#FFFF30;
	stroke-linecap:		round;
	stroke-linejoin:	round;
	stroke-opacity:		0.6;
	fill-opacity:		0.4;
	stroke-dasharray:	4,4;
}

.pads_click {
	stroke-opacity:		0.0;
	fill-opacity:		0.0;
	fill:			#FF00FF;
	cursor:			pointer;
}

.silk {
	fill:			none;
	stroke:			#FFFFFF;
	stroke-linecap:		round;
	stroke-linejoin:	round;
	stroke-opacity:		1.0;
	fill-opacity:		0.0;
}

.svghidden {
	fill:			none !important;
	stroke-opacity:		0.0 !important;
	fill-opacity:		0.0 !important;
}

@keyframes silk_blink {
	0%	{ stroke: #FA2020; fill: none;    fill-opacity: 0.25; }
	50%	{ stroke: #FFFFFF; fill: #000000; fill-opacity: 0.25; }
	100%	{ stroke: #FA2020; fill: none;    fill-opacity: 0.25; }
}

path.silk_blink {
	animation: silk_blink 1s linear infinite;
}

path.draw_connect {
	fill:				none;
	stroke:				##D0D0D0;
	stroke-linecap:		round;
	stroke-linejoin:	round;
	stroke-opacity:		1.0;
	fill-opacity:		1.0;
}
`;
   
   const style = document.createElement("style");
   style.type = "text/css";
   style.appendChild(document.createTextNode(css.trim()));
   document.head.appendChild(style);
});
   
   

$("#pcb-zoom_sel").on("change", function() { ZoOm() })		//Catch zoom button.
$("#pcb-rotate_sel").on("change", function() { RoTate() })	//Catch rotate button.
$(".settingsMe").on("click", function() { Settings() })		    // Catch setting 'button'.

//**********************************************************************************************************************************
$("#view-bot").on("change", function() { var pcbrev= $('#pcb_view').attr("pcbrev"); GoToLayer("BOT"); });	//Catch Side select BOT
$("#view-top").on("change", function() { var pcbrev= $('#pcb_view').attr("pcbrev"); GoToLayer("TOP"); });	//Catch Side select BOT
//**********************************************************************************************************************************

$("#pcb-layer_sel").on("change", function() {		//Catch the 'Layer menu'
var str = "";
// For multiple choice
$( "select option:selected" ).each(function() {
str += $( this ).val() + " "; 
});

//************************** Choice #1 :Copper 
if(str.includes("signal")) { 
	console.log("Layer select + ", SIDE);
	switch (SIDE) {
		case 'TOP':	
			window.L_COPPER=1 ;
			console.log("TOP Selected + COPPER");
			var LayerTopMe = document.getElementById("layer_top"); var LayerBotMe = document.getElementById("layer_bot"); 
			LayerTopMe.setAttribute("visibility", "visible") ; LayerBotMe.setAttribute("visibility", "hidden"); 
			
			//NEW
			//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
			var LayerTopMe_draw = LayerTopMe.querySelectorAll('[class*="draw"]:not([class*="draw2"]):not([class*="draw3"])');
			if ( LayerTopMe_draw.length != 0 ) { for (var i = 0; i < LayerTopMe_draw.length; i++) { LayerTopMe_draw[i].classList.remove("svghidden"); window.L_INNER='1' ; }}
			
			var LayerTopMe_pads = LayerTopMe.querySelectorAll('[class*="pads"]');
			if ( LayerTopMe_pads.length != 0 ) { for (var i = 0; i < LayerTopMe_pads.length; i++) { LayerTopMe_pads[i].classList.remove("svghidden"); window.L_INNER='1' ; }}
			//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
			
			var LayerBotMe = document.getElementById("layer_bot"); LayerBotMe.setAttribute("visibility", "hidden") ;
			//******************************************************************************************************************************************************************
			var Layer_Already_Traced = document.querySelector('#svg_drawbox'); var tabLayer_Already_Traced = Layer_Already_Traced.querySelectorAll(`[class^="trace_hi"]`);
			for (var i = 0; i < tabLayer_Already_Traced.length; i++) { tabLayer_Already_Traced[i].setAttribute("visibility", "visible"); }
			//***
			var Layer_Already_XTraced = document.querySelector('#svg_drawbox'); var tabLayer_Already_XTraced = Layer_Already_XTraced.querySelectorAll(`[class^="trace_xray"]`);
			for (var i = 0; i < tabLayer_Already_XTraced.length; i++) { tabLayer_Already_XTraced[i].setAttribute("visibility", "visible"); }
			//******************************************************************************************************************************************************************
			break;
		case 'BOT':
			window.L_COPPER=1 ;
			console.log("BOT Selected + COPPER");
			var LayerTopMe = document.getElementById("layer_top"); var LayerBotMe = document.getElementById("layer_bot"); 
			LayerTopMe.setAttribute("visibility", "hidden") ; LayerBotMe.setAttribute("visibility", "visible") ; 

			//NEW
			//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
			var LayerToptMe_pads = LayerTopMe.querySelectorAll('[class*="pads"]');
			if ( LayerToptMe_pads.length != 0 ) { for (var i = 0; i < LayerToptMe_pads.length; i++) { LayerToptMe_pads[i].classList.add("svghidden"); window.L_INNER='1' ; }}
				
			var LayerTopMe_draw = LayerTopMe.querySelectorAll('[class*="draw"]:not([class*="draw2"]):not([class*="draw3"])');
			if ( LayerTopMe_draw.length != 0 ) { for (var i = 0; i < LayerTopMe_draw.length; i++) { LayerTopMe_draw[i].classList.add("svghidden"); window.L_INNER='1' ; }}
				
			var LayerBotMe_draw = LayerBotMe.querySelectorAll('[class*="draw"]:not([class*="draw2"]):not([class*="draw3"])');
			if ( LayerBotMe_draw.length != 0 ) { for (var i = 0; i < LayerBotMe_draw.length; i++) { LayerBotMe_draw[i].classList.remove("svghidden"); window.L_INNER='1' ; }}
			//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
			
			
			//******************************************************************************************************************************************************************
			var Layer_Already_Traced = document.querySelector('#svg_drawbox'); var tabLayer_Already_Traced = Layer_Already_Traced.querySelectorAll(`[class^="trace_hi"]`);
			for (var i = 0; i < tabLayer_Already_Traced.length; i++) { tabLayer_Already_Traced[i].setAttribute("visibility", "visible"); }
			//***
			var Layer_Already_XTraced = document.querySelector('#svg_drawbox'); var tabLayer_Already_XTraced = Layer_Already_XTraced.querySelectorAll(`[class^="trace_xray"]`);
			for (var i = 0; i < tabLayer_Already_XTraced.length; i++) { tabLayer_Already_XTraced[i].setAttribute("visibility", "visible"); }
			//******************************************************************************************************************************************************************
		break;
	}}
	else 
			{
			window.L_COPPER=0 ;
			var LayerTopMe = document.getElementById("layer_top");
			//LayerTopMe.setAttribute("visibility", "hidden") ; 		<-- Old method
			
			//NEW
			//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
			var LayerTopMe_draw = LayerTopMe.querySelectorAll('[class*="draw"]:not([class*="draw2"]):not([class*="draw3"])');
			if ( LayerTopMe_draw.length != 0 ) { for (var i = 0; i < LayerTopMe_draw.length; i++) { LayerTopMe_draw[i].classList.add("svghidden"); window.L_INNER='1' ; }}
			
			var LayerTopMe_pads = LayerTopMe.querySelectorAll('[class*="pads"]');
			if ( LayerTopMe_pads.length != 0 ) { for (var i = 0; i < LayerTopMe_pads.length; i++) { LayerTopMe_pads[i].classList.add("svghidden"); window.L_INNER='1' ; }}
			//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
			
			var LayerBotMe = document.getElementById("layer_bot");
			//LayerBotMe.setAttribute("visibility", "hidden") ;			<-- Old method
			
			var LayerBotMe_draw = LayerBotMe.querySelectorAll('[class*="draw"]:not([class*="draw2"]):not([class*="draw3"])');
			if ( LayerBotMe_draw.length != 0 ) { for (var i = 0; i < LayerBotMe_draw.length; i++) { LayerBotMe_draw[i].classList.add("svghidden"); window.L_INNER='1' ; }}
			
			
			//******************************************************************************************************************************************************************
			var Layer_Already_Traced = document.querySelector('#svg_drawbox'); var tabLayer_Already_Traced = Layer_Already_Traced.querySelectorAll(`[class^="trace_hi"]`);
			for (var i = 0; i < tabLayer_Already_Traced.length; i++) { tabLayer_Already_Traced[i].setAttribute("visibility", "hidden"); }
			//***
			var Layer_Already_XTraced = document.querySelector('#svg_drawbox'); var tabLayer_Already_XTraced = Layer_Already_XTraced.querySelectorAll(`[class^="trace_xray"]`);
			for (var i = 0; i < tabLayer_Already_XTraced.length; i++) { tabLayer_Already_XTraced[i].setAttribute("visibility", "hidden"); }

			//******************************************************************************************************************************************************************
			}

//************************** Choice #2 :SilkScreen
if(str.includes("silk"))  {
	SilkElementT = document.querySelectorAll('#layer_top .silk'); 
	SilkElementB = document.querySelectorAll('#layer_bot .silk'); 

	switch (SIDE) {
		case 'TOP':
			window.L_MASK='1' ;
			for (var i = 0; i < SilkElementT.length; i++) { SilkElementT[i].setAttribute("visibility", "visible"); }
			for (var i = 0; i < SilkElementB.length; i++) { SilkElementB[i].setAttribute("visibility", "hidden");	}
			break ;
			
		case 'BOT':
			window.L_MASK='1' ;
			for (var i = 0; i < SilkElementT.length; i++) { SilkElementT[i].setAttribute("visibility", "hidden");	}
			for (var i = 0; i < SilkElementB.length; i++) { SilkElementB[i].setAttribute("visibility", "visible"); }
			break ;
			
			}}
		else
	{	window.L_MASK='0' ; var SilkElement  = document.querySelectorAll(".silk") ; 
		for (var i = 0; i < SilkElement.length; i++) { SilkElement[i].setAttribute("visibility", "hidden");	} 
		}

//Test data returned containe the word pcboard
if(str.includes("pcboard")) {var LayerInner = document.getElementById("pcb_board"); if ( LayerInner != null  ) { LayerInner.setAttribute("visibility", "visible") ; }}
else { var LayerInner = document.getElementById("pcb_board"); if ( LayerInner.length != 0 ) { LayerInner.setAttribute("visibility", "hidden") ; }}


if(str.includes("inner1"))
		{
			console.log("LOG : Inner1 Visible");
			var LayerInner = document.getElementById("layer_INNER") ; LayerInner.setAttribute("visibility", "visible") ;
			var Inner_Layer = document.querySelector('#layer_INNER');
			var tab_Inner_Layer = Inner_Layer.querySelectorAll('[class*="draw2"]');
			if ( tab_Inner_Layer.length != 0 ) { for (var i = 0; i < tab_Inner_Layer.length; i++) { tab_Inner_Layer[i].classList.remove("svghidden"); }}
		}
		else
			{
			console.log("LOG : Inner1 Hidden");
			var Inner_Layer = document.querySelector('#svg_drawbox'); var tab_Inner_Layer = Inner_Layer.querySelectorAll('[class*="draw2"]');
			if ( tab_Inner_Layer.length != 0 ) { for (var i = 0; i < tab_Inner_Layer.length; i++) { tab_Inner_Layer[i].classList.add("svghidden"); window.L_INNER='1' ; }}
			}

if(str.includes("inner2")) 
		{ 
			console.log("LOG : Inner2 Visible");
			var LayerInner = document.getElementById("layer_INNER"); LayerInner.setAttribute("visibility", "visible") ; 
			var Inner_Layer = document.querySelector('#svg_drawbox');
			var tab_Inner_Layer = Inner_Layer.querySelectorAll('[class*="draw3"]');
			if ( tab_Inner_Layer.length != 0 ) { for (var i = 0; i < tab_Inner_Layer.length; i++) { tab_Inner_Layer[i].classList.remove("svghidden"); window.L_INNER='0' ; }}
		}
		else
			{
			console.log("LOG : Inner2 Hidden");
			var Inner_Layer = document.querySelector('#layer_INNER, #layer_top'); 
			var tab_Inner_Layer = Inner_Layer.querySelectorAll('[class*="draw3"]');
			if ( tab_Inner_Layer.length != 0 ) { for (var i = 0; i < tab_Inner_Layer.length; i++) { tab_Inner_Layer[i].classList.add("svghidden"); window.L_INNER='1' ; }}
			}

if(str.includes("holes")) 
		{ 
		var Hole_Layer = document.querySelector('#svg_drawbox'); var tab_Hole_Layer = Hole_Layer.querySelectorAll('[class*="hole"]');
		if ( tab_Hole_Layer.length != 0 ) { for (var i = 0; i < tab_Hole_Layer.length; i++) { tab_Hole_Layer[i].classList.remove("svghidden"); window.L_HOLES='0' ; }}
		}
		else {
		var Hole_Layer = document.querySelector('#svg_drawbox'); var tab_Hole_Layer = Hole_Layer.querySelectorAll('[class*="hole"]');
		if ( tab_Hole_Layer.length != 0 ) { for (var i = 0; i < tab_Hole_Layer.length; i++) { tab_Hole_Layer[i].classList.add("svghidden"); window.L_HOLES='1' ;}}
		}

});		// End Catch the 'Layer menu'
//*******************************************************************************************
$("circle").mouseover(OverDOT);
$("rect").mouseover  (OverDOT);

$("circle").click(ClickDOT);
$("rect").click(ClickDOT);

$("circle").on("mouseout", function() { CleanAllPreTrace() })			// Clean all -re-trace when mouseOut of Circle
$("rect").on("mouseout",   function() { CleanAllPreTrace() })			// Clean all -re-trace when mouseOut of Rect


$("#searchform").on("mouseover", function () { Unblink() });			// Unblink all elements when mouseOver the Signal search box
$("#searchform1").on("mouseover", function () { Unblink() });			// Unblink all elements when mouseOver the Component search box


$( "input" ).focus(function() { $( this ).next( "span" ).css( "display", "inline" ).fadeOut( 3000 ); })
})

//*******************************************************************************************
function RoTate(Rotate) {
	var Rotate = document.getElementById("pcb-rotate_sel").value;
	var Zoom = document.getElementById("pcb-zoom_sel").value;
	var  TransGo = document.getElementById("svg_drawbox");
	var GeXsizeFromSvg = $(pcb_view).attr("xx");
	var GeYsizeFromSvg = $(pcb_view).attr("yy");
	let xx = GeXsizeFromSvg * Zoom; let yy = GeYsizeFromSvg * Zoom;

	switch (Rotate) {
		case '0':
			if ( SIDE == "TOP" ) 
			{
			TransGo.setAttribute("transform", "scale("+Zoom+","+Zoom+")");
			document.getElementById("pcb_div").style.width=xx+"px"; document.getElementById("pcb_div").style.height=yy+"px";
			document.getElementById("pcb_view").style.width=xx+"px";document.getElementById("pcb_view").style.height=yy+"px";
			}
			else
			{
				var ActualScaleFull= $('#svg_drawbox').attr("transform").replace('scale(', '').replace(')','');
				var ActualScale_XB = ActualScaleFull.split(',');
				var ActualScale_YB = ActualScale_XB[1].split(' ');
				const ActualScaleXB = ActualScale_XB[0].replace("-", "");
				const ActualScaleYB = ActualScale_YB[0].replace("-", "");
				TransGo.setAttribute("transform", "scale(-"+ActualScaleXB+","+ActualScaleYB+") translate(-"+GeXsizeFromSvg+",0.0)"); 
				document.getElementById("pcb_div").style.width=xx+"px"; document.getElementById("pcb_div").style.height=yy+"px";
				document.getElementById("pcb_view").style.width=xx+"px";document.getElementById("pcb_view").style.height=yy+"px";
			}
			break;

		case '1':	TransGo.setAttribute("transform", "scale("+Zoom+","+Zoom+") rotate(90) translate(0 -"+GeYsizeFromSvg+")");
		document.getElementById("pcb_div").style.width=yy+"px"; document.getElementById("pcb_div").style.height=xx+"px";
		document.getElementById("pcb_view").style.width=yy+"px";document.getElementById("pcb_view").style.height=xx+"px";
		break;

		case '2':	TransGo.setAttribute("transform", "scale("+Zoom+","+Zoom+") rotate(180) translate(-"+GeXsizeFromSvg+" -"+GeYsizeFromSvg+")");
		document.getElementById("pcb_div").style.width=yy+"px"; document.getElementById("pcb_div").style.height=xx+"px";
		document.getElementById("pcb_view").style.width=xx+"px";document.getElementById("pcb_view").style.height=yy+"px";
		break;
		
		case '3':	TransGo.setAttribute("transform", "scale("+Zoom+","+Zoom+") rotate(-90) translate(-" + GeXsizeFromSvg + " 0)");
		document.getElementById("pcb_div").style.width=yy+"px"; document.getElementById("pcb_div").style.height=xx+"px";
		document.getElementById("pcb_view").style.width=yy+"px";document.getElementById("pcb_view").style.height=xx+"px";
		break;
			}
}
//*******************************************************************************************
function ZoOm(Zoom) {

try {
if (!Zoom) { var Zoom = document.getElementById("pcb-zoom_sel").value; }
    var  TransGo = document.getElementById("svg_drawbox");
	TransGo.setAttribute("transform", "scale("+Zoom+","+Zoom+")");

	var GeXsizeFromSvg = $(pcb_view).attr("xx");
	var GeYsizeFromSvg = $(pcb_view).attr("yy");
	let xx = GeXsizeFromSvg * Zoom; let yy = GeYsizeFromSvg * Zoom;
	
	document.getElementById("pcb_div").style.width=xx+"px"; document.getElementById("pcb_div").style.height=yy+"px";
	document.getElementById("pcb_view").style.width=xx+"px";document.getElementById("pcb_view").style.height=yy+"px";
	//*****************************************
	if (SIDE == "TOP" ) { GoToLayer("TOP"); }
	if (SIDE == "BOT" ) { GoToLayer("BOT"); }
	//*****************************************
	
} catch (err) { Guru("Error in ZoOm function") }
}
//*******************************************************************************************
function OverDOT() {
    if (!window.fullSetData || window.fullSetData.length === 0) {
        console.error('The FULL_SET data is not yet loaded');
        return;
    }

    CleanAllPreTrace();
    ListView_CleanAll();
    $('#pcb-searchbox').val('');
    $('#pcb-searchbox2').val('');
    
    window.Over_DOT = $(this).attr("id");
    
    if(Over_DOT) {
        const Identify_click = Over_DOT.slice(0, 10);
        $('#searchresult-div').html("");
        document.getElementById("searchresult-div").style.display = 'none';
        
        switch (Identify_click) {
            case 'flash_DRL_': 
                break;
                
            case 'click_TOP_':
            case 'click_BOT_': {
                var element = document.getElementById(Over_DOT);
                element.classList.add("selhover");
                
                window.GePcbRev = $(pcb_view).attr("pcbrev");
                
                const results = window.fullSetData.filter(item => item._DOT === Over_DOT);
                
                if (results.length > 0) {
                    const row = results[0];
                    window.SIGNALL = row._SIGNAL;
                    
                    let htmlContent = `<div class="panel amigapcb-rooltip amigapcb-window" style="display: block; opacity: 1; width: auto; height: auto; position: absolute; top: ${yMousePos + 10}px; left: ${xMousePos + 10}px;">`;
                    htmlContent += `<div style="font-size: 12px; padding-left: 5px; padding-right: 5px;">`;
                    
                    if (row._NAME !== "Via") {
                        htmlContent += `<b>${row._NAME}:</b>&nbsp;${row._PARTVALUE}</b><br>`;
                        htmlContent += `<b>Pin:</b>&nbsp;${row._PININFO}</b><br>`;
                        htmlContent += `<b>Signal:</b>&nbsp;${row._SIGNAL}</b>`;
                    } else {
                        htmlContent += `<b>${row._NAME}:</b>&nbsp;, <b>Signal:</b>&nbsp;${row._SIGNAL}</b>`;
                    }
                    
                    htmlContent += `</div></div>`;
                    $('#over').html(htmlContent);
                    
                    const SeekListeLine = listeLine.includes(SIGNALL + ";");
                    
                    if (!SeekListeLine && typeof Over_DOT !== 'undefined') {
                        timer = setTimeout(function() {
                            TraceLine(Over_DOT, 0);
                        }, timeoutPreTrace);
                    }
                } else {
                    $('#over').html('Error: no SIGNAL find for this DOT');
                }
                break;
            }
        }
    }
}
//*******************************************************************************************
function ClickDOT() {
	try {
	window.Clicked_DOT = $(this).attr("id");
	if (! Clicked_DOT) { window.Clicked_DOT = Over_DOT }

	if(Clicked_DOT) { 
	//Cut to keep only the identifier (flash_SMT, click_TOP,...)
	const Identify_click = Clicked_DOT.slice(0, 10);
	
	switch (Identify_click) {
	case 'flash_DRL_': {}; break ;
	case 'click_TOP_':
	case 'click_BOT_': { 
				//Only the ID is kept
				TraceLine(Clicked_DOT, 1);
				break ;}
							}
					}
	} catch (err) { Guru("Error in ClickDOT function") }
}
//*******************************************************************************************
function TraceLine(clickedot, pretrace) {
const dotData = window.fullSetData.find(item => item._DOT === clickedot);
			
// Retrieve info from the JSON data
const SIGNAL = dotData._SIGNAL.trim();
const LINE = dotData._LINE;

// Now search for LINE info in lineData to get SVG drawing info
const lineInfo = window.lineData.find(item => item._LINE === LINE);

if (!lineInfo) {
	console.error('No LINE data found for: ' + LINE);
	return;
	}

	if (clickedot != null) {										// Just in case
		const Identify_click = clickedot.slice(0, 10);			//Cut to keep only the identifier (flash_SMT, click_TOP,...)
		
		if (Identify_click != "flash_DRL_") {
			if ($("#gnd").is(":checked")) { TRACEGND="true"; } else { var TRACEGND="false"; }
			
			window.GePcbRev = $(pcb_view).attr("pcbrev");
			
			// Search in local JSON data instead of AJAX
			const dotData = window.fullSetData.find(item => item._DOT === clickedot);
			
			if (dotData) {
				// Retrieve info from the JSON data
				const SIGNAL = dotData._SIGNAL.trim();
				const LINE = dotData._LINE;
				
				//**********************************************
				//Request a free color in the table if necessary
				if (pretrace == "1") {
					var SeekListeLine = listeLine.includes(LINE+";");		// Search SIGNAL under SeekListeLine list.
					if (!SeekListeLine) { GiveMeFreeColor(); }				// SIGNAL not find in 'listeLine'
					
					if (FreeColor !== -1) { 								// If COLOR IS give, let's set a lot of color value.
						TakeColor((ListCol[FreeColor].color));
						window.COLOR_BCKG = ListCol[FreeColor].color;
						window.COLOR_FONT = ListCol[FreeColor].font;
						window.COLOR_TRACE_STROKE = "stroke: "+COLOR_BCKG+" !important";	// stroke var.
						window.COLOR_TRACE_FILL = "fill: "+COLOR_BCKG;					// fill var.
						window.SIGNAL_ID = FreeColor;								// Just for fun.
						
						ListView(LINE);											// Create 'table' of all component for this 'LINE'
					}																// End of 'color is give'
					else { NoMore(); return; }									// Else... no more signal is allow and so, end of this function.
				}																// End of test pretrace value.
				else { window.COLOR_TRACE_STROKE = ""; window.COLOR_TRACE_FILL = ""; }	// So, here pretrace=0, so no color to Set.
				
				//****************************************************************
				// Extract all LINE data from lineData (LINE.json)
				const LIST_LINETOP = lineInfo.LINETOP || "";
				const LIST_LINEBOT = lineInfo.LINEBOT || "";
				const LIST_flash_BOT = lineInfo.flash_BOT || "";
				const LIST_flash_TOP = lineInfo.flash_TOP || "";
				const LIST_flash_SMT = lineInfo.flash_SMT || "";
				const LIST_flash_SMB = lineInfo.flash_SMB || "";
				const LIST_flash_CPT = lineInfo.CPT || "";
				const LIST_flash_CPB = lineInfo.CPB || "";
				const LIST_PAD_TOP = lineInfo.PAD_TOP || "";
				const LIST_PAD_BOT = lineInfo.PAD_BOT || "";
				const DOT_CLICKed = clickedot;

				////Formatting the header and send it if necessary
				if (pretrace == "1" && !SeekListeLine) { 					// Trace NOW and create 'tab'
					let LETTER = ('<div onmouseover="ListView_display_or_hide(\''+(LINE)+'\', \'1\')" onclick="CloseOnglet(\''+(LINE)+'\',\''+(COLOR_BCKG)+'\',\''+(DOT_CLICKed)+'\')" class="closeSignal" id="'+(LINE)+'" style="display: inline">\n<div class="btn btn-default signal_tab" style="display: inline; background-color: '+(COLOR_BCKG)+'; color: '+(COLOR_FONT)+'; border-color: black; min-width: 100px; z-index: 20;">\n<p class="glyphicon glyphicon-remove pull-right" style="margin-top: 1px; margin-left: 2px; cursor: pointer;"></p><div style="display: inline; float: left; margin-left: 5px; overflow: hidden; direction: rtl; width: 72px; text-align: left;">'+(SIGNAL)+'</div></div></div>')
					
					$('#signal_panel').append(LETTER); 						// Send 'tab' signal box.
					window.listeLine = listeLine.concat(LINE+";");			// Add current 'LINE' to 'listeLine'
				}

				if (!SeekListeLine) {										// SIGNAL not find in 'listeLine'
					//Line Drawing Routine
					//*********************************************************
					var tab_LINETOP = LIST_LINETOP.split(',');
					var tab_LINEBOT = LIST_LINEBOT.split(',');
					var tab_flash_BOT = LIST_flash_BOT.split(',');
					var tab_flash_TOP = LIST_flash_TOP.split(',');
					var tab_flash_SMT = LIST_flash_SMT.split(',');
					var tab_flash_SMB = LIST_flash_SMB.split(',');
					var tab_xvia_flash_BOT = LIST_flash_BOT.split(',');
					var tab_xvia_flash_TOP = LIST_flash_TOP.split(',');
					var tab_flash_CPT = LIST_flash_CPT.split(',');
					var tab_flash_CPB = LIST_flash_CPB.split(',');
					var tab_PAD_TOP = LIST_PAD_TOP.split(',');
					var tab_PAD_BOT = LIST_PAD_BOT.split(',');
					//*********************************************************

					//Reminder : pretrace=0=Yellow color
					switch (SIDE) {
						//####################################################################################################################################
						case "TOP":
							ChangeStyle(tab_LINETOP, "trace_hi", COLOR_TRACE_STROKE, pretrace, 1, 1);		//Set Stroke#1
							ChangeStyle(tab_LINEBOT, "trace_xray", COLOR_TRACE_STROKE, pretrace, 1, 1);		//Set Stroke#2
						
							//********************************************************************************************************************************
							if (pretrace == "1") { 															//--> Start to Trace, no pre-trace
								ChangeStyle(tab_PAD_TOP, "pads_hi", COLOR_TRACE_FILL, 1, 1, 1);				//Fill for PAD_TOP
								ChangeStyle(tab_PAD_BOT, "pads_xray", COLOR_TRACE_FILL, 1, 1, 1);				//Fill for PAD_BOT
								
								ChangeStyle(tab_flash_CPT, "pads_hi", COLOR_TRACE_FILL, 1, 1, 1);				//Fill for Cartdridge Port TOP (pad and circle)
								ChangeStyle(tab_flash_CPB, "pads_xray", COLOR_TRACE_FILL, 1, 1, 1);				//Fill for Cartdridge Port BOT (pad and circle)

								ChangeStyle(tab_flash_SMT, "pads_hi", COLOR_TRACE_FILL, 1, 1, 1);				//Fill for Flash TOP
								ChangeStyle(tab_flash_SMB, "pads_xray", COLOR_TRACE_FILL, 1, 1, 1);				//Fill for Flash BOT
							    
								CreateXrayDOT(tab_xvia_flash_BOT, "XRT", COLOR_TRACE_FILL);						//Fill for xvia_flash TOP
								CreateXrayDOT(tab_xvia_flash_TOP, "XRB", COLOR_TRACE_FILL);						//Fill for xvia_flash BOT
								
								CreateXrayLINE(tab_LINETOP, "XRT", COLOR_TRACE_STROKE, "trace_hi");				//Stroke for xray LINE TOP
								CreateXrayLINE(tab_LINEBOT, "XRB", COLOR_TRACE_STROKE, "trace_xray");				//Stroke for xray LINE BOT
							}
							//********************************************************************************************************************************
							break; 
						//####################################################################################################################################

						//####################################################################################################################################
						case "BOT":
							ChangeStyle(tab_LINETOP, "trace_xray", COLOR_TRACE_STROKE, pretrace, 1, 1);		//Set Stroke#1
							ChangeStyle(tab_LINEBOT, "trace_hi", COLOR_TRACE_STROKE, pretrace, 1, 1);			//Set Stroke#2
						
							//********************************************************************************************************************************
							if (pretrace == "1") { 															//--> Start to Trace, no pre-trace
								ChangeStyle(tab_PAD_TOP, "pads_xray", COLOR_TRACE_FILL, 1, 1, 1);				//Fill for PAD_TOP
								ChangeStyle(tab_PAD_BOT, "pads_hi", COLOR_TRACE_FILL, 1, 1, 1);					//Fill for PAD_BOT
								
								ChangeStyle(tab_flash_CPT, "pads_xray", COLOR_TRACE_FILL, 1, 1, 1);				//Fill for Cartdridge Port TOP (pad and circle)
								ChangeStyle(tab_flash_CPB, "pads_hi", COLOR_TRACE_FILL, 1, 1, 1);					//Fill for Cartdridge Port BOT (pad and circle)

								ChangeStyle(tab_flash_SMT, "pads_xray", COLOR_TRACE_FILL, 1, 1, 1);				//Fill for Flash TOP
								ChangeStyle(tab_flash_SMB, "pads_hi", COLOR_TRACE_FILL, 1, 1, 1);					//Fill for Flash BOT
							    
								CreateXrayDOT(tab_xvia_flash_BOT, "XRT", COLOR_TRACE_FILL);						//Fill for xvia_flash TOP
								CreateXrayDOT(tab_xvia_flash_TOP, "XRB", COLOR_TRACE_FILL);						//Fill for xvia_flash BOT
								
								CreateXrayLINE(tab_LINETOP, "XRT", COLOR_TRACE_STROKE, "trace_xray");				//Stroke for xray LINE TOP
								CreateXrayLINE(tab_LINEBOT, "XRB", COLOR_TRACE_STROKE, "trace_hi");				//Stroke for xray LINE BOT
							}
							break;
					}	// End switch
				}		// End 'if SeekListeLine'
			} else {
				console.error('No data found for DOT: ' + clickedot);
	}}
}}

//*******************************************************************************************
function ChangeStyle(traceArray, displayClass, colorTrace, pretrace, RemoveOrSet, LockPcb) {
try {
//'list all ID' 	classToSet		ColorTrace		(pretrace=0=Yellow color)		(RemoveOrSet=0=remove	RemoveOrSet=1=set)		(pcb_locked=0 or 1)

	for (var i = 0; i < traceArray.length; i++) {
		if(traceArray[i]) {
		//Specific case for 'PAD', aka : CONN, need return to 'pads' 
		if(traceArray[i].includes("_CONN")) { displayClass="pads"; }
			let s = document.getElementById(traceArray[i]);	
			if (s) {
						if(pretrace == "1" && RemoveOrSet == "1" ) { s.setAttribute("style", colorTrace); s.removeAttribute("pretrace"); }
						if(pretrace == "1" && RemoveOrSet == "1" && LockPcb =="1" ) { s.setAttribute("pcb-locked", "true"); }
					else {
						if (RemoveOrSet == "1" ) {	s.setAttribute("visibility", "visible"); s.setAttribute("pretrace", "pretrace"); 
													if (displayClass == "trace_hi" || displayClass == "trace_xray") { document.getElementById(traceArray[i]).classList.add(displayClass); }
													else { document.getElementById(traceArray[i]).classList = displayClass; }
													}
													
						if (RemoveOrSet == "0" ) {	s.removeAttribute("pcb-locked");s.removeAttribute("style");
													s.removeAttribute("visibility");
													document.getElementById(traceArray[i]).classList = displayClass;}

						}
							}
		else if (s == null && traceArray[i] != "LINE1" ){ console.log("ISSUE : %s is NULL", traceArray[i]) } 
		}
	}
	} catch (err) { Guru("Error in ChangeStyle function") }
}
//*******************************************************************************************
function CreateXrayDOT(traceArray, Layer_ID, colorTrace) {
	try {
	for (var i = 0; i < traceArray.length; i++) {
		if(traceArray[i]) {
				const Identify_clk = traceArray[i].slice(0, 10);
				let Flash_BoT_Seek = document.getElementById(traceArray[i]);
				if (Flash_BoT_Seek) {
					var Flash_BoT_Seek_String = Flash_BoT_Seek.outerHTML;
					const Flash_BoT_Seek_Replaced = Flash_BoT_Seek_String.replace("flash_", "xvia_flash_");
						
					if (Layer_ID == "XRT") { $('#layer_XRT').append(Flash_BoT_Seek_Replaced);}
					if (Layer_ID == "XRB") { $('#layer_XRB').append(Flash_BoT_Seek_Replaced);}
					
						//****************************************************
						window.nidxray = "xvia_" + traceArray[i];
						window.nxray = document.getElementById(nidxray);
						if (nxray) { nxray.setAttribute("style", colorTrace); nxray.setAttribute("class", "pads_xray"); }
						//****************************************************
					}	// End if flash BOT or TOP detected
}}
$("#layer_XRT").html($("#layer_XRT").html());	//Refresh to Add Svg element to DOM
$("#layer_XRB").html($("#layer_XRB").html());	//Refresh to Add Svg element to DOM
} catch (err) { Guru("Error in CreateXrayDOT function") }
}
//*******************************************************************************************
function CreateXrayLINE(traceArray, Layer_ID, colorTrace, classtoset) {
	try {
	for (var i = 0; i < traceArray.length; i++) {
		if(traceArray[i]) {
			let Flash_BoT_Seek = document.getElementById(traceArray[i]);
			if (Flash_BoT_Seek) {
					var Flash_BoT_Seek_String = Flash_BoT_Seek.outerHTML;
					const Flash_BoT_Seek_Replaced = Flash_BoT_Seek_String.replace('id="', 'id="xray_');
					if (Layer_ID == "XRT") { $('#layer_XRT').append(Flash_BoT_Seek_Replaced);}
					if (Layer_ID == "XRB") { $('#layer_XRB').append(Flash_BoT_Seek_Replaced);}
					
					window.nidxray = "xray_" + traceArray[i];
					window.nxray = document.getElementById(nidxray);
					
					if (nxray) { 
						nxray.setAttribute("style", colorTrace);
						nxray.setAttribute("class", classtoset); 
					}
}}}
$("#layer_XRT").html($("#layer_XRT").html());	//Refresh to Add Svg element to DOM
$("#layer_XRB").html($("#layer_XRB").html());	//Refresh to Add Svg element to DOM
} catch (err) { Guru("Error in CreateXrayDOT function") }
}
//*******************************************************************************************
function RemoveLine(traceArray) {
try {
for (var i = 0; i < traceArray.length; i++) {
		if(traceArray[i]) {
			const element0 = traceArray[i].replace("flash_", "xvia_flash_");
			const element = document.getElementById(element0);
			if (element) { element.remove(); }
		}
	}
} catch (err) { Guru("Error in RemoveLine function") }
}
//*******************************************************************************************
function RemoveLineXray(traceArray) {
try {
for (var i = 0; i < traceArray.length; i++) {
		if(traceArray[i]) {
			const element3 = document.getElementById("xray_"+traceArray[i]);
			if (element3) { element3.remove(); }
		}
	}
} catch (err) { Guru("Error in RemoveLineXray function") }
}
//*******************************************************************************************
function CloseOnglet(LINE, bgrColorGrab, DOT_CLICKed) {
	ReleaseColor(bgrColorGrab);
	window.GePcbRev = $(pcb_view).attr("pcbrev");
	
	if (!window.lineData || window.lineData.length === 0) {
		console.error('LINE data is not yet loaded');
		return;
	}
	
	// Search in local JSON data instead of AJAX
	const lineInfo = window.lineData.find(item => item._LINE === LINE);
	
	if (lineInfo) {
		//Recovering info from JSON
		const LIST_LINETOP = lineInfo.LINETOP || "";
		const LIST_LINEBOT = lineInfo.LINEBOT || "";
		const LIST_flash_BOT = lineInfo.flash_BOT || "";
		const LIST_flash_TOP = lineInfo.flash_TOP || "";
		const LIST_flash_SMT = lineInfo.flash_SMT || "";
		const LIST_flash_SMB = lineInfo.flash_SMB || "";
		const LIST_flash_CPT = lineInfo.CPT || "";					// specific exp. connector TOP
		const LIST_flash_CPB = lineInfo.CPB || "";					// specific exp. connector BOT
		const LIST_PAD_TOP = lineInfo.PAD_TOP || "";
		const LIST_PAD_BOT = lineInfo.PAD_BOT || "";
		//****************************************************************
		window.listeLine = listeLine.replace(LINE+";", '');
		
		const LIST_xvia_flash_BOT = LIST_flash_BOT;
		const LIST_xvia_flash_TOP = LIST_flash_TOP;

		//Original rendering routine on each concerned line
		//**********************************************************
		var tab_LINETOP = LIST_LINETOP.split(',');
		ChangeStyle(tab_LINETOP, "draw", 0, 1, 0);							// LINETOP
		//***********************************************************
		var tab_LINEBOT = LIST_LINEBOT.split(',');
		ChangeStyle(tab_LINEBOT, "draw", 0, 1, 0);							// LINEBOT
		//*********************************************************** 
		var tab_flash_BOT = LIST_flash_BOT.split(',');
		ChangeStyle(tab_flash_BOT, "draw", 0, 1, 0);						// flash_BOT
		//*********************************************************** 
		var tab_flash_TOP = LIST_flash_TOP.split(',');
		RemoveLine(tab_flash_TOP, "draw", 0, 1, 0);							// flash_TOP
		//*********************************************************** 
		var tab_xvia_flash_BOT = LIST_xvia_flash_BOT.split(',');
		RemoveLine(tab_xvia_flash_BOT, "draw", 0, 1, 0);					// xvia_flash_BOT (clone of LIST_flash_BOT)
		//*********************************************************** 
		var tab_xvia_flash_TOP = LIST_xvia_flash_TOP.split(',');
		ChangeStyle(tab_xvia_flash_TOP, "draw", 0, 1, 0);					// xvia_flash_TOP (clone of LIST_flash_TOP)
		//*********************************************************** 
		RemoveLineXray(tab_LINETOP);										// 'XRAY_' line TOP (clone of LIST_LINETOP + xray_)
		//*********************************************************** 
		RemoveLineXray(tab_LINEBOT);										// 'XRAY_' line BOT (clone of LIST_LINEBOT + xray_)
		//*********************************************************** 
		var tab_flash_CPT = LIST_flash_CPT.split(',');
		ChangeStyle(tab_flash_CPT, "pads", 0, 1, 0);						// specific exp. connector TOP
		//*********************************************************** 
		var tab_flash_CPB = LIST_flash_CPB.split(',');
		ChangeStyle(tab_flash_CPB, "pads", 0, 1, 0);						// specific exp. connector BOT
		//*********************************************************** 
		var tab_PAD_TOP = LIST_PAD_TOP.split(',');
		ChangeStyle(tab_PAD_TOP, "pads_click", 0, 1, 0);					// Pads TOP return to pads_click
		//*********************************************************** 
		var tab_PAD_BOT = LIST_PAD_BOT.split(',');
		ChangeStyle(tab_PAD_BOT, "pads_click", 0, 1, 0);					// Pads BOT return to pads_click
		//*********************************************************** 
		var tab_flash_SMT = LIST_flash_SMT.split(',');
		ChangeStyle(tab_flash_SMT, "pads", 0, 1, 0);
		//*********************************************************** 
		var tab_flash_SMB = LIST_flash_SMB.split(',');
		ChangeStyle(tab_flash_SMB, "pads", 0, 1, 0);
		//*********************************************************** 
	} else {
		console.error('No data found for LINE: ' + LINE);
	}
	
	const element = document.getElementById(LINE);
	if (element) { element.remove(); }
	
	const Tabelement = document.getElementById("listview_" + LINE);
	if (Tabelement != null) { Tabelement.remove(); }
}
//*******************************************************************************************
function GiveMeFreeColor() {
try {
FreeColor = ListCol.findIndex((object => { return object.token == '0'; })); 
} catch (err) { Guru("Error in GiveMeFreeColor function") }
};
//*******************************************************************************************
function TakeColor(color_hexa) {
try {
SeekColor = ListCol.findIndex((object => { return object.color == color_hexa; }));
if (SeekColor !== -1) { ListCol[SeekColor].token = '1' ; }
} catch (err) { Guru("Error in TakeColor function") }
};
//*******************************************************************************************
function ReleaseColor(color_hexa) {
try {
SeekColor = ListCol.findIndex((object => { return object.color == color_hexa; }));
if (SeekColor !== -1) { ListCol[SeekColor].token = '0' ; }
} catch (err) { Guru("Error in ReleaseColor function") }
};
//*******************************************************************************************
function SearchSignal() { 
	try {
		var searchSignal = document.getElementById("pcb-searchbox2").value;
		
		if(searchSignal) {
			let NAME = searchSignal.toUpperCase();
			window.GePcbRev = $(pcb_view).attr("pcbrev");
			
			if (!window.fullSetData || window.fullSetData.length === 0) {
				console.error('FULL_SET data is not yet loaded');
				return;
			}
			
			// Search in local JSON data instead of AJAX
			const results = window.fullSetData.filter(row => 
				(row._SIGNAL && row._SIGNAL.toUpperCase().includes(NAME)) || 
				(row._LINE && row._LINE.toUpperCase().includes(NAME))
			);
			
			if (results.length > 0) {
				// Build HTML table
				let htmlContent = '<div id="list_view" class="panel panel-info" style="border: 1px solid black; display: block; width: 400px; height: auto; top: 42px; left: 1331px;">';
				htmlContent += '<div class="table-responsive" style="max-height: 250px; width: 100%;">';
				htmlContent += '<table class="divClass table table-bordered table-hover" style="margin-bottom: 1px;">';
				htmlContent += '<thead><tr>';
				htmlContent += '<th>Layer</th>';
				htmlContent += '<th>Name/Type/Pin</th>';
				htmlContent += '<th>Part Value</th>';
				htmlContent += '<th>Signal</th>';
				htmlContent += '</tr></thead>';
				htmlContent += '<tbody>';
				
				results.forEach(row => {
					if (row._PARTVALUE !== "-") {
						htmlContent += '<tr class="table-row" data-id="' + row._FINGER + '" data-layer="' + row._LAYER + '" style="cursor: pointer;">';
						htmlContent += '<td>' + row._LAYER + '</td>';
						if (row._NAME !== "Via") {
							htmlContent += '<td>' + row._NAME + ' [ ' + row._PININFO + ' ]</td>';
							htmlContent += '<td>' + row._PARTVALUE + '</td>';
						} else {
							htmlContent += '<td>' + row._NAME + row._PARTVALUE + '</td><td></td>';
						}
						htmlContent += '<td>' + row._SIGNAL + '</td>';
						htmlContent += '</tr>';
					}
				});
				
				htmlContent += '</tbody></table></div></div></div></div></div>';
				
				$("#searchresult-div").css("visibility", "visible");
				$('#searchresult-div').html(htmlContent);
				
				//Change position of 'response tab_search_result'
				let tab_search_result = document.getElementById("searchresult-div");
				let box_search_left = document.getElementById("pcb-searchbox").getBoundingClientRect().left - 220;
				let box_search_top = document.getElementById("pcb-searchbox").getBoundingClientRect().top + 33;
				tab_search_result.setAttribute("style", "border: 0px solid black; display: block; width: 400px; height: auto; top: "+box_search_top+"px ; left: "+box_search_left+"px ;");
				$("#searchresult-div").show();
				
				//*******************************************************************************************************************
				// Handler to detect a click on a <TR> of the Search Result display DIV
				$(".divClass tr").off("click");	// Remove previous handlers
				$(".divClass tr").on("click", function() {
					// Retrieve the data-id of the concerned line.
					let dataId = $(this).attr("data-id");
					let layerId = $(this).attr("data-layer");
					if (dataId) {	
						GoToLayer(layerId);
						//Create an array of each row using the comma as a reference point.
						var tab = dataId.split(',');
						//Loop as long as the length of the array is not reached.
						for (var i = 0; i < tab.length; i++) { 
							document.getElementById(tab[i]).classList = "silk_blink"; 
						}
						//***************************************************************************************
						BlinkThis(tab[0]);		// set focus on first blinking element
						//***************************************************************************************
						$("#searchresult-div").hide(); // hide
					}		// End 'If dataId'
				}); 	// End 'Handler click'
				//*******************************************************************************************************************
			} else {
				$('#searchresult-div').html("");
				document.getElementById("searchresult-div").style.display = 'none';
			}
		} else { 
			$('#searchresult-div').html(""); 
			document.getElementById("searchresult-div").style.display = 'none'; 
		}
	} catch (err) { 
		Guru("Error in SearchSignal function");
	}
}
//*******************************************************************************************
function SearchComponent() {
	try {
		var searchName = document.getElementById("pcb-searchbox").value;
		
		if(searchName) {
			let NAME = searchName.toUpperCase();
			window.GePcbRev = $(pcb_view).attr("pcbrev");
			
			if (!window.componentData || window.componentData.length === 0) {
				console.error('COMPONENT data is not yet loaded');
				return;
			}
			
			// Search in local JSON data instead of AJAX
			const results = window.componentData.filter(row => 
				(row.ID && row.ID.toUpperCase().startsWith(NAME)) || 
				(row.PART_VALUE && row.PART_VALUE.toUpperCase().startsWith(NAME))
			);
			
			if (results.length > 0) {
				// Build HTML table
				let htmlContent = '<div id="list_view" class="panel panel-info" style="border: 1px solid black; display: block; width: 400px; height: auto; top: 42px; left: 1331px;">';
				htmlContent += '<div class="table-responsive" style="max-height: 250px; width: 100%;">';
				htmlContent += '<table class="divClass table table-bordered table-hover" style="margin-bottom: 1px;">';
				htmlContent += '<thead><tr bgcolor="#DDFFDD" title="click here to select all elements">';
				htmlContent += '<th>Layer</th>';
				htmlContent += '<th>Location</th>';
				htmlContent += '<th>Type</th>';
				htmlContent += '<th>Part / Value</th>';
				htmlContent += '</tr></thead>';
				htmlContent += '<tbody>';
				
				results.forEach(row => {
					if (row.PART_VALUE !== "-") {
						htmlContent += '<tr class="table-row" data-id="' + row.FINGER + '" data-layer="' + row.LAYER + '" style="cursor: pointer;">';
						htmlContent += '<td>' + row.LAYER + '</td>';
						htmlContent += '<td>' + row.ID + '</td>';
						htmlContent += '<td>' + row.COMPONENT + '</td>';
						htmlContent += '<td>' + row.PART_VALUE + '</td>';
						htmlContent += '</tr>';
					}
				});
				
				htmlContent += '</tbody></table></div></div></div></div></div>';
				
				$("#searchresult-div").css("visibility", "visible");
				$('#searchresult-div').html(htmlContent);
				
				//Change position of 'response tab_search_result'
				let tab_search_result = document.getElementById("searchresult-div");
				let box_search_left = document.getElementById("pcb-searchbox").getBoundingClientRect().left - 200;
				let box_search_top = document.getElementById("pcb-searchbox").getBoundingClientRect().top + 33;
				tab_search_result.setAttribute("style", "border: 0px solid black; display: block; width: 400px; height: auto; top: "+box_search_top+"px ; left: "+box_search_left+"px ;");
				$("#searchresult-div").show();
				
				//*******************************************************************************************************************
				// Handler to detect a click on a <TH> of the Search Result display DIV
				$(".divClass th").off("click");	// Remove previous handlers
				$(".divClass th").on("click", function() { 
					var table = document.getElementById("list_view");
					var cells = table.getElementsByTagName("tr");
					var status = "";
					for (var i = 0; i < cells.length; i++) { 
						statusNow = cells[i].getAttribute("data-id"); 
						if (statusNow) { status = status + "," + statusNow } 
					}
					BlinkAll(status);
				});
				
				// Handler to detect a click on a <TR> of the Search Result display DIV
				$(".divClass tr").off("click");	// Remove previous handlers
				$(".divClass tr").on("click", function() {
					// Retrieve the data-id of the concerned line.
					let dataId = $(this).attr("data-id");
					
					if (dataId) {	
						let layerId = $(this).attr("data-layer");
						GoToLayer(layerId);
						
						//Create an array of each row using the comma as a reference point.
						var tab = dataId.split(',');
						console.log("tab : %s", tab);
						//Loop as long as the length of the array is not reached.
						for (var i = 0; i < tab.length; i++) { 
							document.getElementById(tab[i]).classList = "silk_blink"; 
						}
						//***************************************************************************************
						BlinkThis(tab[0]);		// set focus on first blinking element
						//***************************************************************************************
						$("#searchresult-div").hide(); // hide
					}		// End 'If dataId'
				}); 	// End 'Handler click'
				//*******************************************************************************************************************
			} else {
				$('#searchresult-div').html("");
				document.getElementById("searchresult-div").style.display = 'none';
			}
		} else { 
			$('#searchresult-div').html(""); 
			document.getElementById("searchresult-div").style.display = 'none'; 
		}
	} catch (err) { 
		Guru("Error in SearchComponent function");
	}
}
//*******************************************************************************************
//*******************************************************************************************
function NoMore() {
try {
var NoMore_Text = '		<div class="modal fade in" id="messagebox" tabindex="-1" role="dialog" style="z-index: 10000; display: block; padding-right: 17px;">\n\
			<div class="modal-dialog" role="document" style="top:calc(50% - 200px); height: 200px; width: 400px;">\n\
				<div class="modal-content">\n\
					<div class="modal-header pcb-modal-header">\n\
						<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>\n\
						<h4 class="modal-title"><b>System message</b></h4>\n\
					</div>\n\
					<div class="modal-body">\n\
						<div id="pcb-messagebox_text" style="font-size: 12pt;"><b>Can\'t trace more than 16 signals.</b></div>\
					</div>\n\
					<div style="padding: 15px; text-align: center;">\n\
						<button onclick="ClosePopup()" type="button" class="btn btn-primary" style="width: 100px;" data-dismiss="modal">OK</button>\n\
					</div>\n\
				</div>\n\
			</div>\n\
		</div>'
$('#PoPup').html(NoMore_Text);
} catch (err) { Guru("Error in NoMore function") }
}
//*******************************************************************************************
function ClosePopup() {	messagebox.remove(); }
//*******************************************************************************************
function CleanAllPreTrace(){
try {	
//################################################################################################################################
clearTimeout(timer);
//All 'line' mark by 'pretrace' variable, aka : pre-trace

	$('#over').html("")
	const elements1 = document.querySelectorAll('[pretrace="pretrace"]');
	if(elements1.length != "0")	{
	for (var i = 0; i < elements1.length; i++) { 
	window.outme = elements1[i].id.concat('');
	//******************************************************************
	let s = document.getElementById(elements1[i].id);
	let s_ID1 = elements1[i].id.slice(5, 15).replace(/CONN./g, '');
	let OLDclassA = s.className.baseVal;
	
	switch (s_ID1) {
		case '_TOP_':
		case '_BOT_':
					// Specific connector expansion PAD detected.
					if (s) { document.getElementById(elements1[i].id).classList = "pads"; }
					else { console.log("+CleanAllPreTrace/selhover - WARNING : %s is NULL", elements1[i].id) };
					break;
		default:				// Other case. (dot 'normal')
					if (s) { s.removeAttribute("style");
							 s.removeAttribute("visibility");
							 s.removeAttribute("pretrace");
							 document.getElementById(elements1[i].id).classList.remove("trace_hi");
							 document.getElementById(elements1[i].id).classList.remove("trace_xray");
						}
					else { console.log("+CleanAllPreTrace/selhover - WARNING : %s is NULL", elements1[i].id) };
					break;
					}}
	}
//################################################################################################################################
//All ID taged with selhover, it's appear on 'click_TOP' dots only
//selhover it's a 'marker' to change and so see, the 'DOTS' overed.


	const elements2 = document.querySelectorAll('[class~="selhover"]');
	if(elements2.length != "0")	{
	for (var i = 0; i < elements2.length; i++) { 
	window.outme = elements2[i].id.concat('');
	let s = document.getElementById(elements2[i].id);
	//******************************************************************
	let s_ID2 = elements2[i].id.slice(5, 15).replace(/CONN./g, '');
	let OLDclassB = s.className.baseVal	
	
	switch (s_ID2) {
		case '_TOP_':
		case '_BOT_':
					// Specific connector expansion PAD detected.// Specific connector expansion PAD detected.
					if (s) { document.getElementById(elements2[i].id).classList = "pads"; }
					else { console.log("+CleanAllPreTrace/selhover - WARNING : %s is NULL", elements2[i].id) };
					break;
		default:				// Other case. (dot 'normal')
					if (s) { document.getElementById(elements2[i].id).classList = "pads_click"; }
					else { console.log("+CleanAllPreTrace/selhover - WARNING : %s is NULL", elements2[i].id) };
					break;
					}
					}}
	} catch (err) { Guru("Error in CleanAllPreTrace function") }
	}
//*******************************************************************************************
function ReverseTrace (classefrom, classto) {
try {
const reverse_raw = document.querySelectorAll('[class="'+classefrom+'"]');
	for (var i = 0; i < reverse_raw.length; i++) { 
	window.outme = reverse_raw[i].id.concat('');
	let s = document.getElementById(reverse_raw[i].id);
			if (s) {
			document.getElementById(reverse_raw[i].id).classList = classto;
			}
		}
} catch (err) { Guru("Error in ReverseTrace function") }
}
//*******************************************************************************************
function ListView(signallistview) {
	try {
		window.GePcbRev = $(pcb_view).attr("pcbrev");
		
		if (!window.fullSetData || window.fullSetData.length === 0) {
			console.error('FULL_SET data is not yet loaded');
			return;
		}
		
		// Search in local JSON data instead of AJAX
		const results = window.fullSetData.filter(row => row._LINE === signallistview);
		
		if (results.length > 0) {
			// Build HTML content
			let htmlContent = '<div id="listview_' + signallistview + '" style="position: absolute; width: 500px; height: auto; display: none">';
			htmlContent += '<div class="panel panel-info collapse" style="border: 1px solid black; display: block; border-top-left-radius: 0px; border-top-right-radius: 0px; height: auto; top: 0px; left: 0px;">';
			htmlContent += '<div>';
			htmlContent += '<div tab_id="' + signallistview + '" id="list_view_' + signallistview + '_content" role="tabpanel" class="panel-collapse collapse in" style="margin: 2px; width: calc(100% - 6px);">';
			htmlContent += '<div class="table-responsive" style="max-height: 250px; width: 494px;">';
			htmlContent += '<table class="table table-bordered table-hover" style="margin-bottom: 1px;">';
			htmlContent += '<thead>';
			htmlContent += '<tr>';
			htmlContent += '<th>Layer</th>';
			htmlContent += '<th>Location</th>';
			htmlContent += '<th>Part / Value</th>';
			htmlContent += '<th>Pin</th>';
			htmlContent += '</tr>';
			htmlContent += '</thead>';
			htmlContent += '<tbody>';
			
			results.forEach(row => {
				if (row._PARTVALUE !== "-") {
					htmlContent += '<tr class="clickable-row" style="cursor: pointer;">';
					htmlContent += '<td>' + row._LAYER + '</td>';
					htmlContent += '<td onclick="BlinkThis(\'' + row._FINGER + '\')">' + row._NAME + '</td>';
					htmlContent += '<td>' + row._PARTVALUE + '</td>';
					htmlContent += '<td>' + row._PININFO + '</td>';
					htmlContent += '</tr>';
				}
			});
			
			htmlContent += '</tbody></table></div></div>';
			htmlContent += '</div></div></div>';
			
			$('#listview').append(htmlContent);
		} else {
			console.warn('No data found for LINE: ' + signallistview);
		}
	} catch (err) { 
		Guru("Error in ListView function");
	}
}
//*******************************************************************************************
function ListView_display_or_hide (ID_LINE, vieworhide) {			//0 = hide		1 = display
	try {
	ListView_CleanAll();
	let tabs = document.getElementById("listview_"+ID_LINE);
	if (tabs != null) {
	let box_left = document.getElementById(ID_LINE).getBoundingClientRect().left;
	let box_top = document.getElementById(ID_LINE).getBoundingClientRect().top + 25; 
	
	if (vieworhide == 0 ) { tabs.setAttribute("style", "position: absolute; width: 500px; height: auto; display: none"); };
	if (vieworhide == 1 ) { tabs.setAttribute("style", "position: absolute; top: "+box_top.toFixed(2)+"px; left: "+box_left.toFixed(2)+"px; width: 500px; height: auto; display: block"); };
}
} catch (err) { Guru("Error in ListView_display_or_hide function") }
}
//*******************************************************************************************
function ListView_CleanAll() {
	try {
	var el = document.querySelector('#listview');
	var tabsAll = el.querySelectorAll(`[id^="listview_"]`);
	
	for (var i = 0; i < tabsAll.length; i++) {
	  tabsAll[i].setAttribute("style", "position: absolute; width: 400px; height: auto; display: none");
	}
} catch (err) { Guru("Error in ListView_CleanAll function") }
}
//*******************************************************************************************
function Guru(messsageGuru) {
	var GuruMe0 = document.getElementById("guru_modal"); GuruMe0.setAttribute("style", "visibility: visible; display: block") ;
	var GuruMe1 = document.getElementById("guru_outer"); GuruMe1.setAttribute("style", "visibility: visible; display: block") ;
	LetterGuru = '<div id="guru">'+"Software Failure. Press left mouse button to continue.<br>Guru Meditation #"+messsageGuru+'</div>';
	$("#guru_outer").html(LetterGuru);
}
//*******************************************************************************************
function GoToLayer(layerGoTo) {
	console.log("GoToLayer : ", layerGoTo);
	var pcbrev= $('#pcb_view').attr("pcbrev")

	try {
	Unblink();
	var GeXsizeFromSvg = $(pcb_view).attr("xx");
	var TransGo = document.getElementById("svg_drawbox");

	switch (layerGoTo) {
	case 'BASE':
	TransGo.setAttribute("transform", "scale(1,1.0)");
	break;
	
	case 'BOT':	
	var LayerTopMe = document.getElementById("layer_top"); var LayerBotMe = document.getElementById("layer_bot");
	LayerTopMe.setAttribute("visibility", "hidden") ; LayerBotMe.setAttribute("visibility", "visible") ;
			
	$( "#layer_CPT" ).prop( "disabled", true ); $( "#layer_CPB" ).prop( "disabled", false );
	var ButtonSide_top = document.getElementById("view-top-label"); document.getElementById(ButtonSide_top.classList = "btn btn-default btn"); 
	var ButtonSide_bot = document.getElementById("view-bot-label"); document.getElementById(ButtonSide_bot.classList = "btn btn-default btn active");
	//**************************************************************************************************************************************************************************************************	
	//**************************************************************************************************************************************************************************************************
	window.SIDE="BOT";
	var TransGo = document.getElementById("svg_drawbox");
	var ActualScaleFull= $('#svg_drawbox').attr("transform").replace('scale(', '').replace(')','');
	var ActualScale_XB = ActualScaleFull.split(',');
	var ActualScale_YB = ActualScale_XB[1].split(' ');
	const ActualScaleXB = ActualScale_XB[0].replace("-", "");
	const ActualScaleYB = ActualScale_YB[0].replace("-", "");

	var TransGo = document.getElementById("svg_drawbox");
	TransGo.setAttribute("transform", "scale(-"+ActualScaleXB+","+ActualScaleYB+") translate(-"+GeXsizeFromSvg+",0.0)");


	//*********************************************************************************************************************************
	if (L_COPPER == "0") { var LayerBotMe = document.getElementById("layer_bot"); var LayerTopMe = document.getElementById("layer_top"); 
				           //LayerBotMe.setAttribute("visibility", "hidden") ; LayerTopMe.setAttribute("visibility", "hidden") ;	<- Old method
				           
				           //NEW
				           console.log("Clean #1");
							//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
							var LayerTopMe_draw = LayerTopMe.querySelectorAll('[class*="draw"]:not([class*="draw2"]):not([class*="draw3"])');
							if ( LayerTopMe_draw.length != 0 ) { for (var i = 0; i < LayerTopMe_draw.length; i++) { LayerTopMe_draw[i].classList.add("svghidden"); }}
				           
 				           var LayerBotMe_draw = LayerBotMe.querySelectorAll('[class*="draw"]:not([class*="draw2"]):not([class*="draw3"])');
							if ( LayerBotMe_draw.length != 0 ) { for (var i = 0; i < LayerBotMe_draw.length; i++) { LayerBotMe_draw[i].classList.add("svghidden"); }}
				           //--------------------------------------------------------------------------------------------------------------------------------------------------------------------
				           				           
				           //*************************
				           var Layer_Already_Traced = document.querySelector('#svg_drawbox'); var tabLayer_Already_Traced = Layer_Already_Traced.querySelectorAll(`[class^="trace_hi"]`);
						   for (var i = 0; i < tabLayer_Already_Traced.length; i++) { tabLayer_Already_Traced[i].setAttribute("visibility", "hidden"); }
						   //*************************
				           var Layer_Already_xTraced = document.querySelector('#svg_drawbox'); var tabLayer_Already_xTraced = Layer_Already_xTraced.querySelectorAll(`[class^="trace_hi"]`);
						   for (var i = 0; i < tabLayer_Already_xTraced.length; i++) { tabLayer_Already_xTraced[i].setAttribute("visibility", "hidden"); }
						   //*************************
				            }
						   
	if (L_COPPER == "1") { var LayerTopMe = document.getElementById("layer_top"); var LayerBotMe = document.getElementById("layer_bot"); 
				           //LayerBotMe.setAttribute("visibility", "visible") ; LayerTopMe.setAttribute("visibility", "hidden") 	<- Old method
				           
				           //NEW
				           //console.log("Clean #2");
							//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
 				            var LayerTopMe_draw = LayerTopMe.querySelectorAll('[class*="draw"]:not([class*="draw2"]):not([class*="draw3"])');
							if ( LayerTopMe_draw.length != 0 ) { for (var i = 0; i < LayerTopMe_draw.length; i++) { LayerTopMe_draw[i].classList.add("svghidden"); }}
							
							var LayerBotMe_draw = LayerBotMe.querySelectorAll('[class*="draw"]:not([class*="draw2"]):not([class*="draw3"])');
							if ( LayerBotMe_draw.length != 0 ) { for (var i = 0; i < LayerBotMe_draw.length; i++) { LayerBotMe_draw[i].classList.remove("svghidden"); }}
				           //--------------------------------------------------------------------------------------------------------------------------------------------------------------------
				           
			           	   //*************************
				           var Layer_Already_Traced = document.querySelector('#svg_drawbox'); var tabLayer_Already_Traced = Layer_Already_Traced.querySelectorAll(`[class^="trace_hi"]`);
						   for (var i = 0; i < tabLayer_Already_Traced.length; i++) { tabLayer_Already_Traced[i].setAttribute("visibility", "visible"); }
						   //*************************
						   var Layer_Already_xTraced = document.querySelector('#svg_drawbox'); var tabLayer_Already_xTraced = Layer_Already_xTraced.querySelectorAll(`[class^="trace_hi"]`);
						   for (var i = 0; i < tabLayer_Already_xTraced.length; i++) { tabLayer_Already_xTraced[i].setAttribute("visibility", "visible"); }
						   //*************************
				           }
	//*********************************************************************************************************************************	
	if (L_MASK == "0" ) {
					//*****************************************************************************************************
					var SilkElement  = document.querySelectorAll("#layer_top .silk") ;
					for (var i = 0; i < SilkElement.length; i++) { SilkElement[i].setAttribute("visibility", "hidden"); }

					var SilkElement  = document.querySelectorAll("#layer_bot .silk") ;
					for (var i = 0; i < SilkElement.length; i++) { SilkElement[i].setAttribute("visibility", "hidden"); }}
					//*****************************************************************************************************
						
						
	if (L_MASK == "1" ) {
					//*****************************************************************************************************
					var SilkElement  = document.querySelectorAll("#layer_top .silk") ;
					for (var i = 0; i < SilkElement.length; i++) { SilkElement[i].setAttribute("visibility", "hidden"); }
						
					var SilkElement  = document.querySelectorAll("#layer_bot .silk") ;
					for (var i = 0; i < SilkElement.length; i++) { SilkElement[i].setAttribute("visibility", "visible"); }}
					//*****************************************************************************************************
					
	//*********************************************************************************************************************************
	var LayerXrTMe = document.getElementById("layer_XRT"); LayerXrTMe.setAttribute("visibility", "hidden") ; 
	var LayerXrBMe = document.getElementById("layer_XRB"); LayerXrBMe.setAttribute("visibility", "visible") ; 
	var LayerCpTTMe = document.getElementById("layer_CPT"); LayerCpTTMe.setAttribute("visibility", "hidden") ; 
	var LayerCpBBMe = document.getElementById("layer_CPB"); LayerCpBBMe.setAttribute("visibility", "visible") ; 
	var LayerClTTMe = document.getElementById("layer_CLT"); LayerClTTMe.setAttribute("visibility", "hidden") ; 
	var LayerClBBMe = document.getElementById("layer_CLB"); LayerClBBMe.setAttribute("visibility", "visible") ; 
	//Desactiver l'affichage des LAYER Interne quand on est sur le coté BOT
	//var LayerInner = document.getElementById("layer_INNER"); LayerInner.setAttribute("visibility", "hidden") ;

	//** Reverse All traces ******************
	ReverseTrace ("trace_xray", "trace_hi2");
	ReverseTrace ("trace_hi", "trace_xray");
	ReverseTrace ("trace_hi2", "trace_hi");
	
	ReverseTrace ("pads_xray", "pads_hi2");
	ReverseTrace ("pads_hi", "pads_xray");
	ReverseTrace ("pads_hi2", "pads_hi");

	var Elements33B = document.querySelector('#layer_CPB'); var tabsAllElements33B = Elements33B.querySelectorAll(`[id^="click_"]`);
	for (var i = 0; i < tabsAllElements33B.length; i++) { tabsAllElements33B[i].setAttribute("style", "pointer-events: visible; visibility: visible"); }
	var Elements33T = document.querySelector('#layer_CPT'); var tabsAllElements33T = Elements33T.querySelectorAll(`[id^="click_"]`);
	for (var i = 0; i < tabsAllElements33T.length; i++) { tabsAllElements33T[i].setAttribute("style", "pointer-events: none; visibility: hidden"); }
	//***************************************
	break;
	
	case 'TOP':	
	var LayerTopMe = document.getElementById("layer_top"); var LayerBotMe = document.getElementById("layer_bot");
	LayerTopMe.setAttribute("visibility", "visible") ; LayerBotMe.setAttribute("visibility", "hidden") ;
	
	$( "#layer_CPT" ).prop( "disabled", false ); $( "#layer_CPB" ).prop( "disabled", true );
	var ButtonSide_top = document.getElementById("view-top-label"); document.getElementById(ButtonSide_top.classList = "btn btn-default btn active"); 
	var ButtonSide_bot = document.getElementById("view-bot-label"); document.getElementById(ButtonSide_bot.classList = "btn btn-default btn"); 
	//**************************************************************************************************************************************************************************************************	
	//**************************************************************************************************************************************************************************************************
	window.SIDE="TOP";
	var TransGo = document.getElementById("svg_drawbox");
	var ActualScaleFull= $('#svg_drawbox').attr("transform").replace('scale(', '').replace(')','');

	var ActualScale_XT = ActualScaleFull.split(',');
	var ActualScale_YT = ActualScale_XT[1].split(' ');
	
	const ActualScaleXT = ActualScale_XT[0].replace("-", "");
	const ActualScaleYT = ActualScale_YT[0].replace("-", "");
	
	TransGo.setAttribute("transform", "scale("+ActualScaleXT+","+ActualScaleYT+")");


	//*********************************************************************************************************************************
	if (L_COPPER == "0") { var LayerTopMe = document.getElementById("layer_top"); var LayerBotMe = document.getElementById("layer_bot"); 
						   //LayerTopMe.setAttribute("visibility", "hidden") ; LayerBotMe.setAttribute("visibility", "hidden")		<- Old method
						    
						    //NEW
						    //console.log("Clean #3");
							//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
							var LayerTopMe_draw = LayerTopMe.querySelectorAll('[class*="draw"]:not([class*="draw2"]):not([class*="draw3"])');
							if ( LayerTopMe_draw.length != 0 ) { for (var i = 0; i < LayerTopMe_draw.length; i++) { LayerTopMe_draw[i].classList.add("svghidden"); }}
				            
						    var LayerBotMe_draw = LayerBotMe.querySelectorAll('[class*="draw"]:not([class*="draw2"]):not([class*="draw3"])');
							if ( LayerBotMe_draw.length != 0 ) { for (var i = 0; i < LayerBotMe_draw.length; i++) { LayerBotMe_draw[i].classList.add("svghidden"); }}
				            //--------------------------------------------------------------------------------------------------------------------------------------------------------------------
						   	   
						   //*************************
				           var Layer_Already_Traced = document.querySelector('#svg_drawbox'); var tabLayer_Already_Traced = Layer_Already_Traced.querySelectorAll(`[class^="trace_hi"]`);
						   for (var i = 0; i < tabLayer_Already_Traced.length; i++) { tabLayer_Already_Traced[i].setAttribute("visibility", "hidden"); }
						   //*************************
						   var Layer_Already_xTraced = document.querySelector('#svg_drawbox'); var tabLayer_Already_xTraced = Layer_Already_xTraced.querySelectorAll(`[class^="trace_hi"]`);
						   for (var i = 0; i < tabLayer_Already_xTraced.length; i++) { tabLayer_Already_xTraced[i].setAttribute("visibility", "hidden"); }
						   //*************************
						   }
						   
	if (L_COPPER == "1") { var LayerTopMe = document.getElementById("layer_top"); var LayerBotMe = document.getElementById("layer_bot"); 
							// LayerTopMe.setAttribute("visibility", "visible") ; LayerBotMe.setAttribute("visibility", "hidden") 		<- Old method
		                   	   
		                   	//NEW
		                   	//console.log("Clean #4");
							//--------------------------------------------------------------------------------------------------------------------------------------------------------------------
							var LayerTopMe_draw = LayerTopMe.querySelectorAll('[class*="draw"]:not([class*="draw2"]):not([class*="draw3"])');
							if ( LayerTopMe_draw.length != 0 ) { for (var i = 0; i < LayerTopMe_draw.length; i++) { LayerTopMe_draw[i].classList.remove("svghidden"); }}
				            
						    var LayerBotMe_draw = LayerBotMe.querySelectorAll('[class*="draw"]:not([class*="draw2"]):not([class*="draw3"])');
							if ( LayerBotMe_draw.length != 0 ) { for (var i = 0; i < LayerBotMe_draw.length; i++) { LayerBotMe_draw[i].classList.add("svghidden"); }}
				            //--------------------------------------------------------------------------------------------------------------------------------------------------------------------
		                   	   
						   //*************************
				           var Layer_Already_Traced = document.querySelector('#svg_drawbox'); var tabLayer_Already_Traced = Layer_Already_Traced.querySelectorAll(`[class^="trace_hi"]`);
						   for (var i = 0; i < tabLayer_Already_Traced.length; i++) { tabLayer_Already_Traced[i].setAttribute("visibility", "visible"); }
						   //*************************
						   var Layer_Already_xTraced = document.querySelector('#svg_drawbox'); var tabLayer_Already_xTraced = Layer_Already_xTraced.querySelectorAll(`[class^="trace_hi"]`);
						   for (var i = 0; i < tabLayer_Already_xTraced.length; i++) { tabLayer_Already_xTraced[i].setAttribute("visibility", "visible"); }
						   //*************************
		                   }
	//*********************************************************************************************************************************
	if (L_MASK == "0") {			// For 'Silk' now
					//*****************************************************************************************************
					var SilkElement  = document.querySelectorAll(".silk") ;
					for (var i = 0; i < SilkElement.length; i++) { SilkElement[i].setAttribute("visibility", "hidden"); }}
					//*****************************************************************************************************
						
	if (L_MASK == "1") {
					//*****************************************************************************************************
					var SilkElement  = document.querySelectorAll("#layer_top .silk") ;
					for (var i = 0; i < SilkElement.length; i++) { SilkElement[i].setAttribute("visibility", "visible"); }
						
					var SilkElement  = document.querySelectorAll("#layer_bot .silk") ;
					for (var i = 0; i < SilkElement.length; i++) { SilkElement[i].setAttribute("visibility", "hidden"); }}
					//*****************************************************************************************************
						
						
	//*********************************************************************************************************************************
	var LayerXrTMe = document.getElementById("layer_XRT"); LayerXrTMe.setAttribute("visibility", "visible") ; 
	var LayerXrBMe = document.getElementById("layer_XRB"); LayerXrBMe.setAttribute("visibility", "hidden") ; 
	var LayerCpTTMe = document.getElementById("layer_CPT"); LayerCpTTMe.setAttribute("visibility", "visible") ; 
	var LayerCpBBMe = document.getElementById("layer_CPB"); LayerCpBBMe.setAttribute("visibility", "visible") ; 
	var LayerClTTMe = document.getElementById("layer_CLT"); LayerClTTMe.setAttribute("visibility", "visible") ; 
	var LayerClBBMe = document.getElementById("layer_CLB"); LayerClBBMe.setAttribute("visibility", "hidden") ; 
	
	//** Reverse All traces ******************
	ReverseTrace ("trace_xray", "trace_hi2");
	ReverseTrace ("trace_hi", "trace_xray");
	ReverseTrace ("trace_hi2", "trace_hi");
	
	ReverseTrace ("pads_xray", "pads_hi2");
	ReverseTrace ("pads_hi", "pads_xray");
	ReverseTrace ("pads_hi2", "pads_hi");
	
	var Elements33B = document.querySelector('#layer_CPB'); var tabsAllElements33B = Elements33B.querySelectorAll(`[id^="click_"]`);
	for (var i = 0; i < tabsAllElements33B.length; i++) { tabsAllElements33B[i].setAttribute("style", "pointer-events: none; visibility: hidden"); }
	var Elements33T = document.querySelector('#layer_CPT'); var tabsAllElements33T = Elements33T.querySelectorAll(`[id^="click_"]`);
	for (var i = 0; i < tabsAllElements33T.length; i++) { tabsAllElements33T[i].setAttribute("style", "pointer-events: visible; visibility: visible"); }
	//***************************************
	break

	}	// End, switch
	RoTate();
} catch (err) { Guru("Error in GoToLayer function") }
}		// End function
//**************************************************************************************************************************************************************************************************	
//**************************************************************************************************************************************************************************************************
function Unblink() {
try {
const elements1 = document.querySelectorAll('[class="silk_blink"]');
for (var i = 0; i < elements1.length; i++) { let s = document.getElementById(elements1[i].id); if (s) { document.getElementById(elements1[i].id).classList = "silk"; }}		// Remove blinking
	} catch (err) { Guru("Error in Unblink function") }
}		// End function
//**************************************************************************************************************************************************************************************************
//**************************************************************************************************************************************************************************************************
function BlinkThis(elementFocus) {
try {
var tab_elementFocus = elementFocus.split(',');

for (var i = 0; i < tab_elementFocus.length; i++) {
	if(tab_elementFocus[i]) {
		//Set classe to blink, each array.
		document.getElementById(tab_elementFocus[i]).classList= "silk_blink";
		
		// And focus to the First element
		document.getElementById(tab_elementFocus[0]).scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
}}
	} catch (err) { Guru("Error in Unblink function") }
}	// End function
//**************************************************************************************************************************************************************************************************
//**************************************************************************************************************************************************************************************************
function BlinkAll(elementFocus) {
try {
var tab_elementFocus = elementFocus.split(',');

for (var i = 0; i < tab_elementFocus.length; i++) {
	if(tab_elementFocus[i] ) {
		//Set classe to blink, each array.
		if ( document.getElementById(tab_elementFocus[i]) ) { document.getElementById(tab_elementFocus[i]).classList= "silk_blink"; }
}}
} catch (err) { Guru("Error in BlinkAll function") }
}	// End function
//**************************************************************************************************************************************************************************************************
//**************************************************************************************************************************************************************************************************
function Settings() {
try {
//Retreive color already defined
//******************************
var col0 = ListCol[0].color; var col1 = ListCol[1].color;
var col2 = ListCol[2].color; var col3 = ListCol[3].color;
var col4 = ListCol[4].color; var col5 = ListCol[5].color;
var col6 = ListCol[6].color; var col7 = ListCol[7].color;
var col8 = ListCol[8].color; var col9 = ListCol[9].color;
var col10 = ListCol[10].color; var col11 = ListCol[11].color;
var col12 = ListCol[12].color; var col13 = ListCol[13].color;
var col14 = ListCol[14].color; var col15 = ListCol[15].color;


//Display new window and fade base page
document.getElementById("pcb-prefs-window").style = 'display: block; padding-right: 17px;'; 
document.getElementById("pcb-prefs-window").classList = "modal fade in";
$('body').append('<div id="fadebot" class="modal-backdrop fade in"></div>');

//Create the html tag and push it
LetterSetting = '<table class="center" border=0><tr>\
<td><toolcool-color-picker color="'+col0+'" id="color-picker-0"></toolcool-color-picker></td>\
<td><toolcool-color-picker color="'+col1+'" id="color-picker-1"></toolcool-color-picker></td>\
<td><toolcool-color-picker color="'+col2+'" id="color-picker-2"></toolcool-color-picker></td>\
<td><toolcool-color-picker color="'+col3+'" id="color-picker-3"></toolcool-color-picker></td>\
<td><toolcool-color-picker color="'+col4+'" id="color-picker-4"></toolcool-color-picker></td>\
<td><toolcool-color-picker color="'+col5+'" id="color-picker-5"></toolcool-color-picker></td>\
<td><toolcool-color-picker color="'+col6+'" id="color-picker-6"></toolcool-color-picker></td>\
<td><toolcool-color-picker color="'+col7+'" id="color-picker-7"></toolcool-color-picker></td>\
</tr><tr>\
<td><toolcool-color-picker color="'+col8+'" id="color-picker-8"></toolcool-color-picker></td>\
<td><toolcool-color-picker color="'+col9+'" id="color-picker-9"></toolcool-color-picker></td>\
<td><toolcool-color-picker color="'+col10+'" id="color-picker-10"></toolcool-color-picker></td>\
<td><toolcool-color-picker color="'+col11+'" id="color-picker-11"></toolcool-color-picker></td>\
<td><toolcool-color-picker color="'+col12+'" id="color-picker-12"></toolcool-color-picker></td>\
<td><toolcool-color-picker color="'+col13+'" id="color-picker-13"></toolcool-color-picker></td>\
<td><toolcool-color-picker color="'+col14+'" id="color-picker-14"></toolcool-color-picker></td>\
<td><toolcool-color-picker color="'+col15+'" id="color-picker-15"></toolcool-color-picker></td>\
</tr></table>';

$("#Setting").html(LetterSetting);

//Catch Default button
$("#SettingDefault").on("click", function() { 
ListCol[0].color = '#ACD9E5';ListCol[1].color = '#800000';
ListCol[2].color = '#FF80FF';ListCol[3].color = '#827E17';
ListCol[4].color = '#00137E';ListCol[5].color = '#7E087E';
ListCol[6].color = '#018180';ListCol[7].color = '#C0C0C0';
ListCol[8].color = '#808080';ListCol[9].color = '#FF0000';
ListCol[10].color = '#38FE39';ListCol[11].color = '#FFFB38';
ListCol[12].color = '#0031FB';ListCol[13].color = '#FB1CFA';
ListCol[14].color = '#06FFFF';ListCol[15].color = '#F96B1E';

document.getElementById("pcb-prefs-window").style = 'display: none;';
document.getElementById("pcb-prefs-window").classList = "modal fade";
$("#fadebot").remove();
})


//Catch Close button
$("#SettingClose").on("click", function() { 
	
	//Get RGB value and set it
	const colorPicker0 = document.getElementById('color-picker-0').hex; const colorPicker1 = document.getElementById('color-picker-1').hex;
	const colorPicker2 = document.getElementById('color-picker-2').hex; const colorPicker3 = document.getElementById('color-picker-3').hex;
	const colorPicker4 = document.getElementById('color-picker-4').hex; const colorPicker5 = document.getElementById('color-picker-5').hex;
	const colorPicker6 = document.getElementById('color-picker-6').hex; const colorPicker7 = document.getElementById('color-picker-7').hex;
	const colorPicker8 = document.getElementById('color-picker-8').hex; const colorPicker9 = document.getElementById('color-picker-9').hex;
	const colorPicker10 = document.getElementById('color-picker-10').hex; const colorPicker11 = document.getElementById('color-picker-11').hex;
	const colorPicker12 = document.getElementById('color-picker-12').hex; const colorPicker13 = document.getElementById('color-picker-13').hex;
	const colorPicker14 = document.getElementById('color-picker-14').hex; const colorPicker15 = document.getElementById('color-picker-15').hex;
	ListCol[0].color = colorPicker0; ListCol[1].color = colorPicker1;
	ListCol[2].color = colorPicker2; ListCol[3].color = colorPicker3;
	ListCol[4].color = colorPicker4; ListCol[5].color = colorPicker5;
	ListCol[6].color = colorPicker6; ListCol[7].color = colorPicker7;
	ListCol[8].color = colorPicker8; ListCol[9].color = colorPicker9;
	ListCol[10].color = colorPicker10; ListCol[11].color = colorPicker11;
	ListCol[12].color = colorPicker12; ListCol[13].color = colorPicker13;
	ListCol[14].color = colorPicker14; ListCol[15].color = colorPicker15;
	
	document.getElementById("pcb-prefs-window").style = 'display: none;';
	document.getElementById("pcb-prefs-window").classList = "modal fade";
	$("#fadebot").remove();
	})
//End Catch
	} catch (err) { Guru("Error in Settings function") }
}
//**************************************************************************************************************************************************************************************************
//**************************************************************************************************************************************************************************************************
