window.listeLine="";

//Set based value
window.SIDE="TOP";
window.L_COPPER=1;
window.L_MASK=1;
window.L_SILK=1;
window.L_DRILL=1;
window.L_HOLES=1;
window.L_INNER=1;
window.xMousePos="0";
window.yMousePos="0";
	
//Colors lits declaration.
const ListCol = [
{idd: '1', color: '#ACD9E5', font: '#000000', token: '0'},
{idd: '2',color: '#800000', font: '#FFFFFF', token: '0'},
{idd: '3',color: '#FF80FF', font: '#000000', token: '0'},
{idd: '4',color: '#827E17', font: '#FFFFFF', token: '0'},
{idd: '5',color: '#00137E', font: '#FFFFFF', token: '0'},
{idd: '6',color: '#7E087E', font: '#FFFFFF', token: '0'},
{idd: '7',color: '#018180', font: '#FFFFFF', token: '0'},
{idd: '8',color: '#C0C0C0', font: '#000000', token: '0'},
{idd: '9',color: '#808080', font: '#FFFFFF', token: '0'},
{idd: '10',color: '#FF0000', font: '#FFFFFF', token: '0'},
{idd: '11',color: '#38FE39', font: '#000000', token: '0'},
{idd: '12',color: '#FFFB38', font: '#000000', token: '0'},
{idd: '13',color: '#0031FB', font: '#FFFFFF', token: '0'},
{idd: '14',color: '#FB1CFA', font: '#FFFFFF', token: '0'},
{idd: '15',color: '#06FFFF', font: '#000000', token: '0'},
{idd: '16',color: '#F96B1E', font: '#FFFFFF', token: '0'} ];
//*******************************************************************************************************************************************
function include(file) { 
var script = document.createElement('script');
script.src = file;
script.type = 'text/javascript';
script.defer = true;
document.getElementsByTagName('head').item(0).appendChild(script); }
//*******************************************************************************************************************************************
function LoadPCB_rev(file) { 

//$('#loaderDiv').html(" Please allow some time for PCB to finish Loading ! "); $('#pcb_div').html("");
	
	$.ajax({
		type: 'post',
		url: 'backend/downloadPCB.php', data: { comm:'loadpcb', PCBREV:file, },
		success: function (response)
			{
			let PCB_BOARD_NAME = file.replace(/_/g, ' ');	
			$("#board-name").html(PCB_BOARD_NAME);
			$('#pcb_div').html(response);
			include("bootstrap/js/ready.js");
			var BarProgress = document.getElementById("pcb-info-modal");
			BarProgress.setAttribute("style", "display: block; padding-right: 17px;") ;
			document.getElementById("pcb-info-modal").classList = "modal fade in";
			}
})}
//*******************************************************************************************************************************************