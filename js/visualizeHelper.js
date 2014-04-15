/*
 * ========================================================================
 * visualizeHelper.js : v0.1.0
 * 
 * ========================================================================
 * Copyright 2014
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

// Initialize Visualize.js config and JRSClient object placeholder
/*
 Visualize.js Common config
 Full Example:
 myConfig = {
     auth: {
         name: "jasperadmin",
         password: "jasperadmin",
         organization:"organization_1",
         locale: "en",
         timezone: "Europe/Helsinki"
     }
 }
 */
jrsConfig =  {
    auth: {
        name: "jasperadmin",
        password: "jasperadmin",
        organization: "organization_1"
    }
};

var JRSClient; // Will be storing my JRS Client object here :)


// Pass config to Visualize
visualize.config(jrsConfig);

// Create and render report to specific container
/**
 * Create and run report component with provided properties
 * @param {string} uri   - report properties
 * @param {string} container - div name to render the report
 * @param {Object} v - a visualize.js Jasper Client object (JrsClient)
 * @returns {Report} report - instance of Report generated
 */
function renderReport(uri, container, v) {
    return v.report({
        resource: uri,
        container: container,
        error: function(err) {
            alert(err.message);
        }
    });

}

// Not sure if I'm still using this one
function setOverlay(divID) {
    $(divID).html( '<div id="overlay" class="fill"><div id="ajax-icon" class="fill"><i class="icon-spinner icon-spin icon-3x"></i><p>Loading...</p></div>');
}
