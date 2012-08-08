package com.donelabs.sisecevirmecefb.dataaccess;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.sql.*;

 
 

public class DataAccess {
	
	public static final String DATA_SOURCE_NAME = "java:ds/sise_cevirmece_fb";
	public static final String QUERY_GET_GAME_OBJECT = "SELECT * FROM active_games WHERE id=?";
	public static final String QUERY_GET_GAME_LIST = "SELECT id, name, capacity, player_list FROM active_games LIMIT ?";
	private boolean isTest = true;
	
	public DataAccess() {

	}
	
	public DataAccess(boolean isTest) {
		this.isTest = isTest;
	}
	
	public DataAccess(Boolean isTest) {
		if(isTest)
		{}
		
		else
		{}
	}
	
	
	
	public Connection getConnection() throws InstantiationException,
	IllegalAccessException, ClassNotFoundException, SQLException, NamingException
	  {

if (isTest) {
	Class.forName("com.mysql.jdbc.Driver").newInstance();
	Connection conn =DriverManager.getConnection("jdbc:mysql://localhost:3306/sise_cevirmece_fb","root", "123456");
	return conn;
} else {

	Context context = new InitialContext();
	DataSource dataSource = (DataSource) context.lookup(DATA_SOURCE_NAME);
	return dataSource.getConnection();

}

}
	

	public Game getGameObject(int gameId) throws ServletException, InstantiationException, IllegalAccessException, NamingException {

		Game serverSideGame = new Game(gameId);

		Connection con = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
	 

		try {
		
			con =  getConnection();
			stmt = con.prepareStatement(QUERY_GET_GAME_OBJECT);
			stmt.setInt(1, gameId);
			rs = stmt.executeQuery();

			if(rs.next()){
				serverSideGame.setName(rs.getString("name"));
				serverSideGame.setState(rs.getString("state"));
				serverSideGame.setOwnerId(rs.getInt("owner_id"));
				serverSideGame.setCapacity(rs.getInt("capacity"));
				serverSideGame.setPlayerList(rs.getString("player_list"));
				serverSideGame.setLastUpdateTime(rs.getInt("last_update_time"));
				serverSideGame.setRotationAngle(rs.getDouble("rotation_angle"));
				serverSideGame.setVelocity(rs.getDouble("velocity"));
				serverSideGame.setRotaterId(rs.getInt("rotater_player_id"));
				serverSideGame.setPointedId(rs.getInt("pointed_player_id"));
				serverSideGame.setType(rs.getString("game_type"));
				serverSideGame.setType(rs.getString("action_question"));
				serverSideGame.setType(rs.getString("answer"));
			}


		}

		catch (SQLException e) {

			throw new ServletException("Servlet couldnt display the records", e);

		} catch (ClassNotFoundException e) {
			throw new ServletException("JDBC Driver not found", e);
		}

		finally {

			try {
				if (rs != null) {
					rs.close();
					rs = null;
				}

				if (stmt != null) {
					stmt.close();
					stmt = null;
				}

				if (con != null) {
					con.close();
					con = null;
				}

			}

			catch (Exception e) {
				e.printStackTrace();
			}

		}
		return serverSideGame;

	}

	public ArrayList<Game> getGameList(int count) throws ServletException, InstantiationException, IllegalAccessException, NamingException{
		
		ArrayList<Game> gameList = new ArrayList<Game>();

		Connection con = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		if(count == 0){
			count = 10;
		}
	 

		try {
			
			con =  getConnection();
			stmt = con.prepareStatement(QUERY_GET_GAME_LIST);
			stmt.setInt(1, count);
			rs = stmt.executeQuery();

			while(rs.next()){
				Game nextGame = new Game(rs.getInt("id"));
				
				nextGame.setName(rs.getString("name"));
				nextGame.setCapacity(rs.getInt("capacity"));
				
				int playerCount;
				String playerListStr = rs.getString("player_list");
				
				if(playerListStr == null){
					playerCount = 0;
				}else{
					String[] playerListStrArr = playerListStr.split(",");
					playerCount = playerListStrArr.length;
				
				}
				
				nextGame.setPlayerCount(playerCount);				
				gameList.add(nextGame);
			}


		}

		catch (SQLException e) {

			throw new ServletException("Servlet couldnt display the records", e);

		} catch (ClassNotFoundException e) {
			throw new ServletException("JDBC Driver not found", e);
		}

		finally {

			try {
				if (rs != null) {
					rs.close();
					rs = null;
				}

				if (stmt != null) {
					stmt.close();
					stmt = null;
				}

				if (con != null) {
					con.close();
					con = null;
				}

			}

			catch (Exception e) {
				e.printStackTrace();
			}

		}
		return gameList;

	}
}