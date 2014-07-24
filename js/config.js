var config = {

	// URL of the JRS
	jrsUrl: "http://localhost:8080/jasperserver-pro",

	// JRS login username
	jrsUsername: "jasperadmin",

	// JRS login password
	jrsPassword: "jasperadmin",

	// JRS login organization
	jrsOrganization: "organization_1",
	
	dashBoardDesigner : {

		// The folder on JRS that will be searched for reports to add.
		folderUri: "/public/Dashboard_Reports", 

		// Indicates whether JRS should be searched for reports only
		// in the given folder (see option folderUri above) or also
		// in all sub-folders.
		recursive: false,

		// URL of the Dashboardsaver servlet
		dashboardSaver: "dashboard.do",

		// Initial height of the application, in px
		defaultApplicationHeight: 800,

		// Initial width of reports when added to a dashboard, in px
		defaultReportWidth: 400,

		// Initial height of reports when added to a dashboard, in px
		defaultReportHeight: 300
	}
}

