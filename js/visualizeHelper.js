/*
 * ========================================================================
 * visualizeHelper.js : v0.0.2
 * 
 * ========================================================================
 * Copyright 2013 
 * Author: Mariano Luna (https://github.com/marianol)
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

// Initialize Repor and Report objects
var jsRepository;
var jsReportUnit;

function setOverlay(divID) {
    $(divID).html( '<div id="overlay" class="fill"><div id="ajax-icon" class="fill"><i class="icon-spinner icon-spin icon-3x"></i><p>Loading...</p></div>');
}

function runReport(reportURI, targetDiv)
    {

      //alert(inputVal);
      $('#overlay').show();
      //$('#container')
      var theReport = {
                uri : reportURI ,
                container : document.getElementById(targetDiv),
                onReportFinished: function(status) {
                    $('#overlay').hide();
                    if ( typeof ReportFinishedCallback == 'function' ) {
                        ReportFinishedCallback(status);
                    }
                    theReport.gotoPage(0);
                }
            };
       var mReport = jsReportUnit.open(theReport);
       return mReport;
    };


function RepoList(path) 
    {
        jsRepository.ls({type: 'reportUnit', limit: 100}).then(
            function(data) {
                $.each(data, function() {
                    $('#reportsList').append('<tr><td>' + this.label + '</td><td>' + this.creationDate 
                        + '</td>' 
                        + '<td>'
                        + '<button id="buttong"  onclick="runReport(\'' + this.uri + '\', \'report1\')" >RUN in One</button>&nbsp;&nbsp;' 
                        + '<button id="buttong"  onclick="runReport(\'' + this.uri + '\', \'report2\')" >RUN in Two</button>' 
                        + '</td></tr>');   
                });
            });
       
        /*
        + ' - ' + this.uri 
        Response Sample:
        creationDate: "2013-10-29 12:20:10"
        description: "Sample HTML5 multi-axis column chart from Domain showing Sales, Units, and Sales/Square Feet by Country and Store Type with various filters"
        label: "01. Geographic Results by Segment Report"
        permissionMask: 1
        resourceType: "reportUnit"
        updateDate: "2013-08-21 22:42:28"
        uri: "/public/Samples/Reports/1._Geographic_Results_by_Segment_Report"
        version: 0
        */
     
    }