/*
 * ========================================================================
 * pageSpecific.js : v0.1.1
 * 
 * ========================================================================
 * Copyright 2014
 * Author: Gianluca Natali (https://github.com/gianlucanatali)
 *
 * Unless you have purchased a commercial license agreement from Jaspersoft Inc., the following license terms apply:
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the 
 * GNU Affero General Public License as published by the Free Software Foundation, either version 3 
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; 
 * without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public 
 * License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License 
 * along with this program. If not, see http://www.gnu.org/licenses/.
 * ======================================================================== 
 */
 
function initializePage(windowObj,initializeFunction){	
	$(windowObj).load(function(){
		visualize(function(v){
			//'v' it's a client to JRS instance under the config set by visualize.config();
			JRSClient = v;	
			initializeFunction();		
		});
	}); 
}
 
 /** @class */
 function IndexPageJS(){
	var uri_a = '/public/Samples/Reports/02._Sales_Mix_by_Demographic_Report';
	var uri_b = '/public/Samples/Reports/01._Geographic_Results_by_Segment_Report';
	var report_one;
	var report_two;
	 
 
	this.init = function(windowObj){	
		initializePage(windowObj, initialize); 	
	}
	
	// Used an init function because was not able to use the deferred method above...
	function initialize() {

		// Initialize the 2 divs with the predefined reports
		report_one = renderReport(uri_a, "#report1", JRSClient);
		report_two = renderReport(uri_b, "#report2", JRSClient);

		// Populate the repository list
		JRSClient.resourcesSearch({
			// server: serverUrl,
			folderUri:"/public/Samples/Reports",
			recursive:false,
			success:listRepository,
			error:function (err) {
				alert(err);
			}
		});
	}
	// Repo Lister
    function listRepository(results) {

        $.each(results, function() {
                    $('#reportsList').append('<tr><td>' + this.label + ' - (' + this.resourceType + ')' + '</td><td>' + this.creationDate
                            + '</td>'
                            + '<td>'
                            + '<button id="buttong"  onclick="renderReport(\'' + this.uri + '\', \'#report1\', JRSClient )" >RUN in One</button>&nbsp;&nbsp;'
                            + '<button id="buttong"  onclick="renderReport(\'' + this.uri + '\', \'#report2\', JRSClient )" >RUN in Two</button>'
                            + '</td></tr>');
        });
    }
	
}
 
 function ContextPageJS(windowObj){
	var myReport;
	var myReportIC;
	var currentPageIndex = 1;
	var maxPageIndex = 0;

	this.init = function(windowObj){	
		initializePage(windowObj, initialize); 	
	}
	
	/*
	* Re run the Report with a changed Input Parameter
	*
	* @param {string} inputControlId - ID of the input parameter to be changed
	* @param {Object} paramValue - new value to be passed
	 */
	this.passControls = function(inputControlId, paramValue) {
		var parameters = {};

		parameters[inputControlId] = [ paramValue ];
		console.log(parameters);
		currentPageIndex = 1;
		myReport.params(parameters).run();
	}

	function initialize() {
		var reportUri = '/public/Samples/Reports/ProfitDetailReport';

		myReport = renderReport(reportUri, '#report1', JRSClient);

		myReport.events({
			changeTotalPages: function(totalPages) {
				console.log("Total Pages: " + totalPages);
				maxPageIndex = totalPages;
				$('#total').html(maxPageIndex);
				$('#previousPage').hide();
			}
		});

		var ic = JRSClient.inputControls({
				resource: reportUri,
				success: function(data) {
					renderStandardIC(data);
					myReportIC = data; // Store this just in case :)
				}
		});

		/*
		 Wire the Report to the Rendered IC
		 */
		$('#btn').click(function() {
			// Iterate trough the IC's in the Div
			var parameters = {};
			$('#inputOptions').children().each(function(idx, itm) {
				/*
				console.log($(itm).attr('id'));
				console.log($(itm).val());
				*/
				parameters[$(itm).attr('id')] = $(itm).val();
			});
			// console.log(parameters);
			myReport.params(parameters).run(); // Re run the report with the new params
		});


		/*
		 Setup page navigation buttons
		 */
		$("#previousPage").click(function() {
			$('#nextPage').show();

			myReport
					.pages(--currentPageIndex)
					.run()
					.fail(function(err) { alert(err); });
			$('#current').html(currentPageIndex);
			if (currentPageIndex <= 1)  {
				$('#previousPage').hide();
			} else {
				$('#previousPage').show();
			}
		});

		$("#nextPage").click(function() {
			$('#previousPage').show();
			myReport
					.pages(++currentPageIndex)
					.run()
					.fail(function(err) { alert(err); });
			$('#current').html(currentPageIndex);
			if (currentPageIndex == maxPageIndex)  {
				$('#nextPage').hide();
			} else {
				$('#nextPage').show();
			}
		});
	}	
 }
		
function ReportInteractionPageJS(windowObj){
	var myReport;
	var reportUri = '/public/Samples/Reports/20.3_SalesPerCityReport';
	
	this.init = function (windowObj) {
        initializePage(windowObj, initialize);
        google.maps.event.addDomListener(windowObj, "load", initializeMap);

    };

	function initialize(){	
		myReport = renderReport(reportUri, '#report1', JRSClient);

		myReport.events({
			changeTotalPages: function(totalPages) {
				console.log("Total Pages: " + totalPages);
				$('#progressbar').hide();
			}
		});
		
		
		$('#progressbar').show();
	}
	
	// This map will be uses to drive the Input controls of the report in #report1

	function initializeMap(){
	var myDiv = $('#map')[0];
		var locations = [
			['Alameda',37.765278, -122.240556,5],
			['Los Angeles',34.052222, -118.242778,4],
			['San Diego',32.715278, -117.156389,3],
			['San Francisco',37.775000, -122.418333,2],
			['Beverly Hills',34.073611, -118.399444,1]
		];

		var map = new google.maps.Map(myDiv, {
			zoom: 4,
			center: new google.maps.LatLng(34.052222, -118.242778),
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		var infowindow = new google.maps.InfoWindow();

		var marker, i;

		for (i = 0; i < locations.length; i++) {
			marker = new google.maps.Marker({
				position: new google.maps.LatLng(locations[i][1], locations[i][2]),
				map: map
			});

			google.maps.event.addListener(marker, 'click', (function(marker, i) {
				return function() {
					var pickedLocation = locations[i][0];
					infowindow.setContent(pickedLocation);
					$('#progressbar').show();
					// Trigger the report with the new IC value
					myReport.params({ "store_city_1": [ pickedLocation ] }).run();
					infowindow.open(map, marker);
				}
			})(marker, i));
		}
	
	}
}
	
function ReportPopUpJS(){
	var dialogCounter = 0;
	var myReport;
	var myLinkedReport;
	var masterURI = '/public/Samples/Reports/AccountList';
	
	this.init = function(windowObj){	
		initializePage(windowObj, initialize); 	
	}
	
	function initialize(){	
		/*
		@todo It will be nice to bind the link catcher after the report exec or pass extra parameters to the helper class are using in the other samples.
		*/
		myReport = JRSClient.report( {
			resource: masterURI,
			container: "#accountList",
			defaultJiveUi: { enabled: true },
			linkOptions: {
				events: {
					"click"  : function(evt, link){
						// console.log(evt.target); // prints dom elem which triggered the event
						// console.log(link); // print link's data passed
						renderSlaveReport(link);
					}
				}
			},
			success: printComponentsNames,
			error: handleError
		});

	}
	
	function creatDaynamicDiv(divName,parentDiv) {
		$("<div/>", { id: divName }).appendTo(parentDiv);
    }

	// Code rendering the Drill-Down Report coming form the Hyperlink Event
	function renderSlaveReport(hyperlinkObject){
		dialogCounter = dialogCounter + 1;
		dialogDivName = "dialog"+dialogCounter;
		dialogDiv = "#"+dialogDivName;
		reportDivName = "report"+dialogCounter;
		reportDiv = "#"+reportDivName;

		var report_Title = hyperlinkObject.parameters.reportTitle;

		creatDaynamicDiv(dialogDivName,"#dialogContainer");
		creatDaynamicDiv(reportDivName,dialogDiv);
		
		//Setting up jquery dialog box and loading it into window
		$(dialogDiv).dialog({
			height: "auto",
			width: "450px",
			minWidth: 300,
			title: report_Title,
			position: { my: "center+500", at: "top+200", of: "#accountList" } ,
			autoOpen: true,
			show: {
				effect: "blind",
				duration: 10
				  },
			hide: {
				effect: "clip",
				duration: 1000
		  }
		});

		// Extracting the Report Parameters from the Hyperlink object
		var myLinkedReportSettings = {
			resource: hyperlinkObject.parameters._report,
			container: reportDiv,
			events: {
				reportCompleted: function(status, error) {
					console.log('Report Completed: ' + status);
				}
			},
			params: { parStoreId : [ hyperlinkObject.parameters.parStoreId ] },
			error: function(err) {
				alert(err.message);
			}
		};
		/*
		console.log('Report Object: ' );
		console.log( myLinkedReportSettings );
		*/
		myLinkedReport =  JRSClient.report(myLinkedReportSettings);

	};

	//Profit Slider
	$(function() {
		$( "#slider-range" ).slider({
		orientation: "horizontal",
		range: true,
		min: 0,
		max: 55000,
		values: [ 0, 55000 ],
		slide: function( event, ui ) {
			$( "#profit" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
		},
		change: function( event, ui ) {
			console.log("Slider Change");
			filterProfit();
		}
		});
		$( "#profit" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
			" - $" + $( "#slider-range" ).slider( "values", 1 ) );
	});
	
	function filterProfit() {
		var lowValue = Number($( "#slider-range" ).slider( "values", 0 ));
		var highValue = Number($( "#slider-range" ).slider( "values", 1 ));
		console.log("Profit Filter - from: " + lowValue + " to: " + highValue + " ");

		if (lowValue == 0 && highValue == 55000) {
			myReport.updateComponent("Profit", {
				filter: {
					
				}, detailsRowFormat : {pattern: {
					negativeFormat: "(-###0)",
					precision: 2,
					currency: "USD"
				} } }).fail(handleError);
		} else {
			myReport.updateComponent("Profit", {
				filter: {
					operator: "between",
					value: [ lowValue , highValue ]
				}, detailsRowFormat : {pattern: {
					negativeFormat: "(-###0)",
					precision: 2,
					currency: "USD"
				} } }).fail(handleError);
		}
	}


    this.filterStores = function () {
		var filterValue = Number($("#filterStore").val());
		console.log(filterValue);
		if (filterValue == 0) {
			myReport.updateComponent("store_sales", { 
				filter: {
					
				}, detailsRowFormat : {pattern: {
					negativeFormat: "(-###0)",
					precision: 2,
					currency: "USD"
				} } }).fail(handleError);
		} else {
			myReport.updateComponent("store_sales", { 
				filter: {
					operator: "greater_or_equal",
					value: filterValue
				}, detailsRowFormat : {pattern: {
					negativeFormat: "(-###0)",
					precision: 2,
					currency: "USD"
				} } }).fail(handleError);
		}
		
	}

	function printComponentsNames(data){
		data.components.forEach(function(c){
			console.log("Component Name: " + c.name, " - Component Label: "+ c.label);
		});
	}

	//show error
	function handleError(err){
		alert(err.message);
	}
}

function ReportInteraction2PageJS() {

	var masterReport;
	var slaveReport;
    var defState = 'CA';
    var defSalesTotal =  159167.84;
    var fullStateName = "";


	this.init = function(windowObj) {
		initializePage(windowObj, initialize);

	}
		
	function initialize() {
		var master = '/public/Samples/Reports/States';
		var slave = '/public/Samples/Reports/Cities';

		masterReport = JRSClient.report({
            resource: master,
            container: '#states',
            linkOptions: {
                events: {
                    "click"  : function(evt, link){
                        updateState(link.parameters.store_state, link.parameters.total_sales);
                        /*
                         link Object looks like this for a reference Hyperlink:
                         Object {
                         href: "javascript:updateState('CA')"
                         id: "561719435"
                         reference: "javascript:updateState('CA')"
                         selector: "._jrHyperLink.Reference"
                         type: "Reference"
                         typeValue: "Reference"
                         }
                         And like this for a Report Execution with Parameters:
                         Object {
                         id: "2021149141"
                         parameters: Object {
                             _report: "/public/Samples/VisualizeJS/Cities"
                             store_state: "CA"
                             total_sales: "159167.8400"
                         }
                         selector: "._jrHyperLink.ReportExecution"
                         type: "ReportExecution"
                         typeValue: "Custom"
                         }
                         */
                        console.log(link);
                    }
                }
            },
            error: function(err) {
                console.log(err.message);
            }
        });
		slaveReport = JRSClient.report({
            resource: slave,
            container: '#cities',
            params: {
                state: [ defState ]
            },
            events: {
             reportCompleted: function(status, error) {
                 if (status === "ready") {
                     /*
                     Nothing to see here... but the report has finished.
                      */
                 } else if (status === "failed") {
                    error && alert(error);
                 }
                 }
             },
            error: function(err) {
                alert(err.message);
            }
        });

        // Setup my app UI with the initial defaults.
        switch (defState) {
            case 'CA':
                fullStateName = 'California';
                break;
            case 'WA':
                fullStateName = 'Washington';
                break;
            case 'OR':
                fullStateName = 'Oregon';
                break;
            default:
                fullStateName = 'N/A';
        }
        $('#StateName').html(fullStateName);
        $('#StateName1').html(defState);
        $('#StateNameTitle').html(fullStateName);
        $('#StateSales').html('$ ' + Number(defSalesTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
	}

	// Update Slave report with the passed State Parameter
	function updateState(stateName, stateTotal) {
		var parameters = {};
		var fullstatename = '';
		parameters['state'] = [ stateName ];
		slaveReport.params(parameters).run();
		switch (stateName) {
				case 'CA':
					fullstatename = 'California';
					break;
				case 'WA':
					fullstatename = 'Washington';
					break;
				case 'OR':
					fullstatename = 'Oregon';
					break;
				default:
					fullstatename = 'N/A';
		}
		$('#StateName').html(fullstatename);
		$('#StateName1').html(stateName);
		$('#StateNameTitle').html(fullstatename);
		$('#StateSales').html('$ ' + Number(stateTotal).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));

	};

}

function DashboardPageJS(){
	var colIndex = 0;
	
	this.init = function(windowObj){	
		initializePage(windowObj, initialize); 	
	}
	
	//Wrapping and creating the portal. Setting a few parameters around how it will look
	$(function(){
		$('#pp').portal({
			border:false,
			fit:false
		});
	});	
	
	this.filterReport = function(id){
		//alert('Filters Coming Soon!');
		//Get list of all input controls
		var data = {};
		$.each($('#inputControls > :input'),function(index,value){

			switch($('#'+value.id).attr("type")){
				case "singleSelect":
					data[value.id] = $('#'+value.id).combobox('getValues');
					break;
				case "multiSelect":
					data[value.id] = $('#'+value.id).combobox('getValues');
					break;
				case "singleValueText":
					var v = [];
					v.push($('#'+value.id).val());
					data[value.id] = v;
					break;
				case "singleValueNumber":
					var v = [];
					v.push($('#'+value.id).numberbox('getValue'));
					data[value.id] = v;
					break;
			}
		})

		$.each(reportsList,
			function(index,value){
				if(value.container() == ("#report_"+id)){
						value
						.params(data)
						.run();
				}
			}
		);	
	}

	//Getting a list of all the reports the logged in user can access then run a function to display them 
	function initialize(){
		JRSClient.resourcesSearch({
				// server: serverUrl,
				folderUri:"/public/Dashboard_Reports",
				recursive:false,
				success:listRepository,
				types: ["reportUnit"],
				error:function (err) {
					alert(err);
				}
			});		
		
	}

	//Using this function we are adding buttons to the screen to add and remove reports to the dashboard
	//Custom attributes are used to hold information about the status of the report's display and URI inside of JRS
	function listRepository(results) {
		$.each(results, function(index) {
			$("#cp").append("<button status='off' reportURI='"+this.uri+"' onclick=jsHelper.addReport(btnId='btn_"+index+"') title='"+this.label+"' id='btn_"+index+"'>"+reportNameTrim(this.label)+"</button>");
		});
	}

	//Report name trim helper
	function reportNameTrim(name) {
		if (name.length > 20) {
			var x = name.substring(0, 17) + '...';
			return x;
		}else{
			return name;
		}
	}

	//Adding report to the dashboard	
	this.addReport= function(btnId){

		var panelCnt = $('#pp').portal('getPanels');

		var reportStatus = $("#"+btnId).attr('status');

		var reportURI = $("#"+btnId).attr('reportURI');

		var reportName = $("#"+btnId).attr('title');

		if (reportStatus == 'off'){

			if (panelCnt.length == 0){
				colIndex=0
			} else if (colIndex > 2){
				colIndex=0
			};

			var p = $('<div />').appendTo('body');

			p.attr('id', 'pannel_'+btnId);

			p.panel({
				title:reportName,
				content:'<div id="report_'+btnId+'" style="padding:5px;">Loading your report...</div>',
				height:440,
				closable:false,
				collapsible:true,
				noheader:false,
				tools:[{
					iconCls:'icon-pdf',
					handler:function(){exportReport(btnId);}
				},{
					iconCls:'icon-reload',
					handler:function(){refreshReport(btnId);}
				},{
					iconCls:'icon-filter',
					handler:function(){
						$('#inputControls').html('');
						$('#sendButtonBox').hide();
						$('#dlg').attr('reportId',btnId);
						$('#dlg').dialog('open');
						var ic = JRSClient.inputControls({
									resource: reportURI,
									success: function(controls) {
										controls.forEach(buildControl);
									}
								});
					}
				}]
			});

			$('#pp').portal('add', {
				panel:p,
				columnIndex:colIndex
			});

			colIndex = colIndex + 1;

			renderReport(reportURI,'#report_'+btnId,JRSClient);

			$("#"+btnId).attr('status','on');

			$("#"+btnId).css( "background-color", "darkgrey" );

		}else{

			removeReport(btnId);
			
		}
	}

	function buildControl(control) {
		switch(control.type) {
			case "singleValueNumber":
				$("<div class='panel-title' style='padding-bottom:5px;padding-top:5px'/>")
					.html(control.label)
					.appendTo("#inputControls");

				$("<input value='' />")
					.attr("id", control.id)
					.attr("name", "")
					.attr("type", "singleValueNumber")
					.appendTo("#inputControls");

				$('#'+control.id).numberbox({
					min:0
                });

				$('#sendButtonBox').show();
				break;
			case "multiSelectCheckbox":
				$("<div class='panel-title' style='padding-bottom:5px;padding-top:5px'/>")
					.html(control.label)
					.appendTo("#inputControls");

				$("<input value='' />")
					.attr("id", control.id)
					.attr("name", "")
					.attr("type", "multiSelect")
					.appendTo("#inputControls"); 

				$('#'+control.id).combobox({
					data:control.state.options,
					valueField:'value',
					textField:'label',
					multiple:true,
					onLoadSuccess:function(){
						$('#sendButtonBox').show();
					}
                });
				break;
			case "singleSelect":
				$("<div class='panel-title' style='padding-bottom:5px;padding-top:5px'/>")
					.html(control.label)
					.appendTo("#inputControls");

				$("<input value='' />")
					.attr("id", control.id)
					.attr("name", "")
					.attr("type", "singleSelect")
					.appendTo("#inputControls"); 

				$('#'+control.id).combobox({
					data:control.state.options,
					valueField:'value',
					textField:'label',
					multiple:false,
					onLoadSuccess:function(){
						$('#sendButtonBox').show();
					}
                });
				break;
			case "multiSelect":
				$("<div class='panel-title' style='padding-bottom:5px;padding-top:5px'/>")
					.html(control.label)
					.appendTo("#inputControls");

				$("<input value='' />")
					.attr("id", control.id)
					.attr("name", "")
					.attr("type", "multiSelect")
					.appendTo("#inputControls"); 

				$('#'+control.id).combobox({
					data:control.state.options,
					valueField:'value',
					textField:'label',
					multiple:true,
					onLoadSuccess:function(){
						$('#sendButtonBox').show();
					}
                });
				break;
			case "singleValueText":
				$("<div class='panel-title' style='padding-bottom:5px;padding-top:5px'/>")
					.html(control.label)
					.appendTo("#inputControls");

				$("<input value='' />")
					.attr("id", control.id)
					.attr("name", "")
					.attr("type", "singleValueText")
					.appendTo("#inputControls"); 
				$('#sendButtonBox').show();
				break;
			default:
				
		}
	}

	

	function refreshReport(id){
		$.each(reportsList,
			function(index,value){
				if(value.container() == ("#report_"+id)){
						value.refresh();
				}
			}
		);		
	}

	function exportReport(id){
		$.each(reportsList,
			function(index,value){
				if(value.container() == ("#report_"+id)){
					value
					.export({
						outputFormat: "pdf"
					})
					.done(function (link) {
						window.open(link.href); // open new window to download report
					})
					.fail(function (err) {
						alert(err.message);
					});
				}
			}
		);		
	}



	//Used to remove report panels from the dashboard
	function removeReport(id){

		reportsList = jQuery.grep(reportsList, function( report, i ) {
		  return ( report.container() !== ("#report_"+id) );
		});

		$('#pp').portal('remove',$('#pannel_'+id));

		$("#"+btnId).attr('status','off');

		$("#"+btnId).css( "background-color", "buttonface" );

		colIndex = 0;

		$('#dlg').dialog('close');
	}

	var reportsList = new Array();
	//When a pannel is added to the dashboard this function is called to use visualize.js to create the report within that pannel
	function renderReport(uri,container,v) {
		var report = new v.report({
		resource: uri,
		container: container,
		events: {
			reportCompleted: function(status) {
			}
		},
		error: function(err) {
				alert(err.message);
			}
		});
		reportsList.push(report);
	}
	
}
