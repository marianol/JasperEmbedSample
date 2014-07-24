JasperEmbedSample
=================

Embedded Demo using visualize.js

Code: https://github.com/marianol/JasperEmbedSample

Author(s): [See list of Contributors](https://github.com/marianol/JasperEmbedSample/graphs/contributors)

Version: 1.2

##Requirements
- JasperReports Server 5.6
- A web server

##Installation

###Install the Sample
The sample contains a collection of HTML pages that needs to be tun form a WebServer. Each sample shows different aspects of the Visualize.js funtionality.
It is designed to be used with the samples that come with JasperServer 5.6.
The dashboard sample uses some extra reports which you can find in /JasperServerResources/dahsboard_reports.zip

- Unzip the distribution into your web server's web root
- Import /JapserServerResources/dahsboard_reports.zip to your JasperServer instance. [Check this link if you do not know how.](http://community.jaspersoft.com/documentation/jasperreports-server-administration-guide-beta/import-and-export-through-web-ui#import-export_2353750880_1044705)
- Go to http://<your-server>/JasperEmbedSample/ us the "Extra Samples" menu at the top to navigate trough the samples
- Enjoy!!!

###Installing the Dashboard Saver Servlet (Optional)
In the sample there is a dashboard builder that has the functionality to save a dashboard layout. To do this uses a java servlet running in Tomcat.
You can use the sample with out this servlet but you will not be able to save the dashboard layout.
- Configure your database connection in JasperServerResources/dashboardsaver/WEB-INF/web.xml
- Copy the folder of JasperServerResources/dashboardsaver into your Tomcat /webapps folder

##More Information and Resources
- http://community.jaspersoft.com/project/visualizejs
- http://community.jaspersoft.com/documentation/v56/jasperreports-server-programming-guide
- http://community.jaspersoft.com/documentation


LICENSE AND COPYRIGHT NOTIFICATION
==================================

 Copyright (C) 2005 - 2012 Jaspersoft Corporation - All rights reserved.

 Unless you have purchased a commercial license agreement from Jaspersoft,
 the following license terms apply:

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU Affero General Public License as
 published by the Free Software Foundation, either version 3 of the
 License, or (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 GNU Affero  General Public License for more details.

 You should have received a copy of the GNU Affero General Public  License
 along with this program. If not, see <http://www.gnu.org/licenses/>.
