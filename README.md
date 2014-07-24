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
It is designed to be used with the samples that come with JapserServer 5.6.
The dashboard sample uses some extra reports which you can find in /JapserServerResources/dahsboard_reports.zip

- Unzip the distribution into your web server's web root
- Import /JapserServerResources/dahsboard_reports.zip to your JasperServer instance. [Check this link if you do not know how.](http://community.jaspersoft.com/documentation/jasperreports-server-administration-guide-beta/import-and-export-through-web-ui#import-export_2353750880_1044705)
- Go to http://<your-server>/JasperEmbedSample/ us the "Extra Samples" menu at the top to navigate trough the samples
- Enjoy!!!

###Installing the Dashboard Saver Servlet (Optional)
In the sample there is a dashboard builder that has the functionality to save a dashboard layout. To do this uses a java servlet running in Tomcat.
You can use the sample with out this servlet but you will not be able to save the dashboard layout.
- Configure your database connection in dashboardsaver/WEB-INF/web.xml
- Copy the contents of JasperEmbedSample/dashboardsaver into your Tomcat /webapps folder


##More Information and Resources
- http://community.jaspersoft.com/project/visualizejs
- http://community.jaspersoft.com/documentation/v56/jasperreports-server-programming-guide
- http://community.jaspersoft.com/documentation

