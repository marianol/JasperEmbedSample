package com.jaspersoft.vjsdashboard;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;                                                                                   
import javax.servlet.http.HttpServletResponse;

public class DashboardSaver extends HttpServlet{

	private static final long serialVersionUID = -1952835428283006514L;
	
	private Connection connection = null;
	
	private String dbTableName = null;
	
	@Override
	public void init(ServletConfig servletConfig) throws ServletException {	
		String jdbcDriver = servletConfig.getInitParameter("jdbcDriver");
		String jdbcUrl = servletConfig.getInitParameter("jdbcUrl");
		String dbUsername = servletConfig.getInitParameter("dbUsername");
		String dbPassword = servletConfig.getInitParameter("dbPassword");
		dbTableName = servletConfig.getInitParameter("dbTableName");
		
		try {
			System.out.println(jdbcDriver);
            Class.forName(jdbcDriver);
        } catch (ClassNotFoundException e) {
            e.printStackTrace();
        }

        try {
			connection = DriverManager.getConnection(jdbcUrl, dbUsername, dbPassword);
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// To allow access from localhost
		response.addHeader("Access-Control-Allow-Origin", "*");
		
		String username = request.getParameter("username");
		String json = request.getParameter("json");
		
		try {
			createTableIfNotExists();
			
			PreparedStatement deleteSt = connection.prepareStatement("DELETE FROM " + dbTableName + " WHERE username = ?");
			deleteSt.setString(1, username);
			deleteSt.executeUpdate();
		
			PreparedStatement insertSt = connection.prepareStatement("INSERT INTO " + dbTableName + " (username, json) VALUES (?, ?)");
			insertSt.setString(1, username);
			insertSt.setString(2, json);
			insertSt.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	private void createTableIfNotExists() throws SQLException {
		DatabaseMetaData metaData = connection.getMetaData();
		ResultSet rs = metaData.getTables(null, null, dbTableName, null);
		
		boolean noRows = !rs.first();
		if (noRows) {
			String createTableSql = "CREATE TABLE " + dbTableName + " (username varchar(20), json text)";
			Statement statement = connection.createStatement();
			statement.execute(createTableSql);
		}
	}

	@Override
	public void doGet(HttpServletRequest request, HttpServletResponse response)
    throws IOException{
		// To allow access from localhost
		response.addHeader("Access-Control-Allow-Origin", "*");
		
        PrintWriter out = response.getWriter();

        try {
	        PreparedStatement selectSt = connection.prepareStatement("SELECT json FROM " + dbTableName + " WHERE username = ?");
			selectSt.setString(1, request.getParameter("username"));
			ResultSet rs = selectSt.executeQuery();
			
			rs.next();
			out.write(rs.getString(1));
        } catch (SQLException e) {
			e.printStackTrace();
		}
    }
}