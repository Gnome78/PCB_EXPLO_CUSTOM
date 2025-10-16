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

function LoadHTMLData(file) {
    $('#pcb_div').empty();

    $.ajax({
        type: 'GET',
        url: 'data/' + file + '/DATA_SVG.html',
        dataType: 'text',
        success: function (htmlContent) {
            let PCB_BOARD_NAME = file.replace(/_/g, ' ');
            $("#board-name").text(PCB_BOARD_NAME);
            htmlContent = htmlContent
                .replace(/\\\//g, '/')
                .replace(/&(?!(?:amp|lt|gt|quot|apos);)/g, '&amp;');
            $('#pcb_div').html(htmlContent);

            var BarProgress = document.getElementById("pcb-info-modal");
            BarProgress.style.display = "block";
            document.getElementById("pcb-info-modal").className = "modal fade in";
            include("bootstrap/js/ready.js");
			var BarProgress = document.getElementById("pcb-info-modal");
			BarProgress.setAttribute("style", "display: block; padding-right: 17px;") ;
			document.getElementById("pcb-info-modal").classList = "modal fade in";
        },
        error: function () {
            $('#pcb_div').html("<p>An error occurred while loading the HTML file.<br>Has CORS (Cross-origin resource sharing) been disabled ?</p>");
        }
    });
    
//****************************************************************************************************************
// PRE-Load FULL_SET DataBase
window.fullSetData = [];
    	fetch(`data/${file}/FULL_SET.json`)
            .then(response => {
            if (!response.ok) {
                throw new Error('Error Loading FULL_SET.json');
            }
            return response.json();
        })
        .then(data => {
		    window.fullSetData = data;
            console.log('DATABASE : FULL_SET.json Fully Loaded');
        })
        .catch(error => {
            console.error('Error:', error);
        });
//****************************************************************************************************************
// PRE-Load LINE DataBase
window.lineData = [];
fetch(`data/${file}/LINE.json`)
	.then(response => {
		if (!response.ok) {
			throw new Error('Error Loading LINE.json');
		}
		return response.json();
	})
	.then(data => {
		window.lineData = data;
		console.log('DATABASE : LINE.json Fully Loaded');
	})
	.catch(error => {
		console.error('Error:', error);
	});

//****************************************************************************************************************
// PRE-Load COMPONENT DataBase
window.componentData = [];
fetch(`data/${file}/COMPONENT.json`)
	.then(response => {
		if (!response.ok) {
			throw new Error('Error Loading COMPONENT.json');
		}
		return response.json();
	})
	.then(data => {
		window.componentData = data;
		console.log('DATABASE : COMPONENT.json Fully Loaded');
	})
	.catch(error => {
		console.error('Error:', error);
	});
//****************************************************************************************************************
}