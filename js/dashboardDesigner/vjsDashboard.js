// Code based on Gene Arnold's Dashboard Example
// https://github.com/GeneArnold/Dashboard-Example-using-Jaspersoft-Visualize.js-API



// Each tab has a unique number, running sequentially from 0 onward
var tabNum = 0;

function addTab() {
	$("#dashboard-container").append("<div id='tabs-" + tabNum + "' class='dashboard'></div>");
	$("#addTab").parent().before("<li class=\"tab\"><a href=\"#tabs-" + tabNum + "\">New Tab</a></li>");
	
	++tabNum;
				   
	$("#tabs").tabs("refresh");
	$("#tabs").tabs({ active: -2 });
          
	$newDashboard = $("#tabs-" + (tabNum - 1));
    $newDashboard.droppable();

	return $newDashboard.get();
}

function calcDashboardContainerHeight() {
	$("#dashboard-container")
		.height(
			$("#tabs").outerHeight()
			- $("#gallery").outerHeight()
			- $("#tabs-header").outerHeight());
}


// As Visualize.js's render method needs an id as a parameter we're creating here
// a variable that will be used and then incremented whenever a report is added.
var reportNum = 0;

// Using this function we are adding buttons to the screen to add and remove reports to the dashboard.
// Custom attributes are used to hold information about the status of the report's display and URI
// inside of JRS.
function listRepository(results) {
    $.each(results, function(index) {
        $("#gallery").append("<button class='addReportBtn' report-uri='"
								+ this.uri + "' report-title='" + this.label
								+ "' id='btn_" + index + "'>" + reportNameTrim(this.label)
								+ "</button>");

		calcDashboardContainerHeight();
    });
}

// Report name trim helper
function reportNameTrim(name) {
    if (name.length > 20) {
        var x = name.substring(0, 17) + '...';
        return x;
    } else {
        return name;
    }
}

function getCurrentDashboard() {
	return $(".dashboard[aria-hidden='false']");
}

function setReportHeight($reportContainer) {
	var $reportHeader = $reportContainer.children(".report-header");
	var $reportInputs = $reportContainer.children(".report-inputs");
	var $report = $reportContainer.children(".report");
	$report.height($reportContainer.outerHeight() - $reportHeader.outerHeight()
					- $reportInputs.outerHeight());

	// Fire window resize event to cause reports to be re-rendered without
	// calling JRS
	var evt = document.createEvent('UIEvents');
	evt.initUIEvent('resize', true, false, window, 0);
	window.dispatchEvent(evt);
}

function buildControl(control, $container) {
	function buildOptions(options) {
		var template = "<option>{value}</option>";
		return options.reduce(function (memo, option) {
			return memo + template.replace("{value}", option.value);
		}, "")
	}
    
	$container.append("<tr><td><label>" + control.label + "</td>"
		+ "<td><select param-id=" + control.id + " multiple='true'><option></option>"
		+ buildOptions(control.state.options) + "</select></td></tr>");
}

function createReportToolbar() {
	function toggleReportInputs($reportContainer) {
		$reportContainer.css("height", "auto");
		var $reportInputs = $reportContainer.find(".report-inputs");
		if ($reportInputs.css("height").length > 0) {
			$reportInputs.css("height", $reportInputs.height());
		}
		$reportInputs.slideToggle();
	}

    var $inputControls =$("<div class='inputControls'>Y</div>")
		.click(function() {
			var $reportContainer = $(this).closest(".report-container");
			var $reportHeader = $reportContainer.children(".report-header");
			var $report = $reportContainer.children(".report");

			if ($reportContainer.find(".report-inputs").length > 0) {
				toggleReportInputs($reportContainer);
			} else {
				var $setButton = $("<button>Set</button>")
					.click(function() {
						var params = new Object();

						$("select").each(function(index, select) {
							var $paramValue = $(select).val();
							if ($paramValue !== null) {
								params[$(select).attr("param-id")] = $(select).val();
							}
						});

						$report.data("jsreport").params(params).run();
					});
				
				$reportContainer.css("height", "auto");
				var $loading = $("<div class='report-inputs'></div>")
					.append("<span class='loading'>Loading...</span>")
					.insertAfter($reportHeader)
					.hide()
					.slideDown();

				var $reportInputs = $("<div class='report-inputs'></div>")
					.append("<table></table>")
					.append($setButton);

				JRSClient.inputControls({
					resource: $report.attr("report-uri"),
					success: function (controls) {
						$loading
							.slideUp(function() {
								$loading.remove();
								$reportInputs
									.insertAfter($reportHeader)
									.hide();

								toggleReportInputs($reportContainer);
							});

						$.each(controls, function(index, control) {
							buildControl(control, $reportInputs.find("table"));
						});

						$reportInputs.find("select")
							.chosen({
								width: ($reportHeader.width() * 0.8) + "px"
							})
							.on("change", function() {
								$reportContainer.css("height", "auto");
								$reportInputs.css("height", "auto");

								/* Because of the Set button that is floated. */
								$reportInputs.css("padding-bottom", "5ex");
							});

						toggleReportInputs($reportContainer);
					},
					error: function (err) {
						console.log(err);
					}
				});
			}
		});


	var $minimize = $("<div class='minimize'>_</div>")
		.click(function() {
			var $reportContainer = $(this).closest(".report-container");
			var $reportHeader = $reportContainer.children(".report-header");
			var $report = $reportContainer.children(".report");

			if ($reportContainer.height() > $reportHeader.outerHeight() + 50) {
				$reportContainer
					.animate({
						height: "-=" + $report.outerHeight()
					});
			} else {
				$reportContainer
					.animate({
						height: "+=" + $report.outerHeight()
					});
			}
		});

	var $maximize = $("<div class='maximize'>&#9633;</div>")
		.click(function() {
			var $reportContainer = $(this).closest(".report-container");

			if (!$reportContainer.hasClass("maximized")) {
				$reportContainer.addClass("maximized");
			
				$reportContainer.data({
					origLeft: $reportContainer.css("left"),
					origTop: $reportContainer.css("top"),
					origWidth: $reportContainer.css("width"),
					origHeight: $reportContainer.css("height")
				});

				$reportContainer.css({
					position: "relative",
					left: 0,
					top: 0,
					width: "100%",
					height: "100%"
				});
			} else {
				$reportContainer.removeClass("maximized");

				$reportContainer.css({
					position: "absolute",
					left: $reportContainer.data("origLeft"),
					top: $reportContainer.data("origTop"),
					width: $reportContainer.data("origWidth"),
					height: $reportContainer.data("origHeight")
				});
			}
			
			setReportHeight($reportContainer);
		});

	var $close = $("<div class='close'>X</div>")
		.click(function() {
			$(this).closest(".report-container").remove();
		});

	return $("<div class='toolbar'></div>")
		.append($inputControls, $minimize, $maximize, $close);
}

function addReport(reportURI, reportTitle, start_x, start_y, size_x, size_y, reportParams) {
	var $reportContainer = $("<div></div>")
		.css({
			position:"absolute",
			left: start_x,
			top: start_y,
			width: size_x,
			height: size_y
		})
		.addClass("report-container")
		.draggable({
			containment: "parent"
		})
		.resizable({
			stop: function() {
                setReportHeight($(this));
			}
		})
		.appendTo(getCurrentDashboard());

	var $reportHeader = $("<div></div>")
		.addClass("report-header")
		.append(createReportToolbar())
		.append("<span class='report-title'>" + reportTitle + "</span>")
		.appendTo($reportContainer);

	var $report = $("<div></div>")
		.addClass("report")
		.attr({
			id: "report-" + reportNum++,
			"report-uri": reportURI
		})
		.appendTo($reportContainer);

	setReportHeight($reportContainer);
    
	if (reportParams === undefined) {
		reportParams = new Object();
	}

    var report = JRSClient.report(
        {
            resource: reportURI,
			params: reportParams,
            container: "#" + $report.attr("id"),
            events:
                {
                    reportCompleted: function(status) {}
                },
            error:
                function(err) {
                     console.log(err.message);
                }
        }
    );
    
    $report.data("jsreport", report);
}

// Create a JSON structure that holds all the tabs, reports and their locations and sizes
// and sends it to be saved
function saveArrangement() {
	var json = new Object();
    json.tabs = new Array();

	// Build JSON
	$(".dashboard").each(function() {
        var tab = new Object();
		tab.reports = new Array();

		$.each($(this).children(".report-container"), function(index, reportContainer) {
            var report = new Object();
			
			report.uri = $(reportContainer).children(".report").data("jsreport").resource();
			report.params = $(reportContainer).children(".report").data("jsreport").params();
			report.title = $(reportContainer).children(".report-header").children(".report-title").text();
			report.start_x = $(reportContainer).css("left");
			report.start_y = $(reportContainer).css("top");
			report.size_x = $(reportContainer).css("width");
			report.size_y = $(reportContainer).css("height");

			tab.reports.push(report);
        });

		json.tabs.push(tab);
	});

	// Send to server
	$.post(config.dashBoardDesigner.dashboardSaver, 
			{ username: $("#username input").val(), json: JSON.stringify(json) });
}

function restoreArrangement() {
	$.getJSON(config.dashBoardDesigner.dashboardSaver,
				{ username: $("#username input").val() },
				function(data) {
					$(".tab, .dashboard, .ui-dialog").remove();

					$.each(data.tabs, function(index, tab) {
						var uiTab = addTab();

						$.each(tab.reports, function(index, report) {
							addReport(report.uri, report.title, report.start_x, report.start_y,
									  report.size_x, report.size_y, report.params);
						});
					});
				}
			);
}

function setupTabsAndButtons() {
	var tabs = $("#tabs").tabs({
		beforeActivate: function(event, ui) {
			if (ui.newTab.context.id === "addTab") {
				event.preventDefault();
				addTab();
			}
		}
	});
  
	// Default first tab
	addTab();

	$("#tabs").height(config.dashBoardDesigner.defaultApplicationHeight);
	calcDashboardContainerHeight();

	$("#tabs").resizable({
		resize: function() {
			calcDashboardContainerHeight();
		}
	});

	$("#save").click(saveArrangement);
	$("#restore").click(restoreArrangement);
}

jQuery.fn.extend({
	isInsideOf: function(elem) {
		if (this.length > 0) {
			if (this.offset().left > elem.offset().left
				&& this.offset().left + this.outerWidth() < elem.offset().left + elem.outerWidth()
				&& this.offset().top > elem.offset().top
				&& this.offset().top + this.outerHeight() < elem.offset().top + elem.outerHeight()
			) {
				return true;
			} else {
				return false;
			}
		}
	}
});

function setupDragAndDrop() {
	// Drag and drop according to http://stackoverflow.com/a/14445678/235203
	var click = false;
	var top = null;
	var left = null;

	$(document).bind('mousemove', function (e) {
		if (click == true) {
			$('#drag').css({
				left: e.pageX,
				top: e.pageY
			});
		}
	});
	    
	$('html').click(function() {
		if ($("#drag").isInsideOf(getCurrentDashboard())) {
			click = false;

			getCurrentDashboard().removeClass("ui-state-highlight");

			addReport($("#drag").attr("report-uri"), $("#drag").attr("report-title"),
						$("#drag").offset().left - $("#tabs").offset().left,
						$("#drag").offset().top - $("#tabs").offset().top,
						config.dashBoardDesigner.defaultReportWidth, config.dashBoardDesigner.defaultReportHeight);

			$("#drag").remove();
		}
	});

	$("#gallery").on("mousedown", ".addReportBtn", function(e) {
		var $newReportContainer = $("<div id='drag'></div>")
			.css({
				width: config.dashBoardDesigner.defaultReportWidth,
				height: config.dashBoardDesigner.defaultReportHeight, 
				position: "fixed",
				left: e.pageX,
				top: e.pageY
			})
			.addClass("report-container")
			.draggable({
				revert: "invalid"
			})
			.attr({
				"report-uri": $(e.target).attr("report-uri"),
				"report-title": $(e.target).attr("report-title")
			})
			.appendTo($("html"));

		left: e.pageX;
		top = e.pageY;

		click = true;

		getCurrentDashboard().addClass("ui-state-highlight");
	});
}

function DashboardDesignerPageJS(){

	this.init = function(windowObj){	
		initializePage(windowObj, initialize); 	
	}
	
	// Get a list of all reports the logged in user can access and display them
	function initialize() {
		JRSClient.resourcesSearch(
			{
				server: config.jrsUrl,
				folderUri: config.dashBoardDesigner.folderUri,
				recursive: config.dashBoardDesigner.recursive,
				success: listRepository,
				types: ["reportUnit"],
				error:
					function (err) {
						alert(err);
					}
			}
		);
	}

}


$(document).ready(function() {
	setupTabsAndButtons();
	setupDragAndDrop();
});
