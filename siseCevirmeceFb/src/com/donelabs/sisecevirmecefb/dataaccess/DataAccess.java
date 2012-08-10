package com.donelabs.sisecevirmecefb.dataaccess;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.sql.*;

import com.donelabs.sisecevirmecefb.classes.Game;
import com.donelabs.sisecevirmecefb.classes.Invitation;
import com.donelabs.sisecevirmecefb.classes.Player;

 
 

public class DataAccess {
	
	public static final String DATA_SOURCE_NAME = "java:ds/sise_cevirmece_fb";
	public static final String UPDATE_GAME = "UPDATE active_games SET lastUpdate=? WHERE id=?";
	public static final String QUERY_GET_GAME_OBJECT = "SELECT * FROM active_games WHERE id=?";
	public static final String QUERY_GET_PLAYER_OBJECT = "SELECT * FROM players WHERE id=?";
	public static final String QUERY_GET_GAME_LIST = "SELECT id, name, capacity, player_list FROM active_games LIMIT ?";
	public static final String INSERT_NEW_GAME = "INSERT INTO active_games (name, capacity, players, owner) VALUES (?,?,?,?)";
	public static final String INSERT_NEW_PLAYER = "INSERT INTO players (id, name, surname, gender) VALUES (?,?,?,?)";
	public static final String QUERY_GET_INVITATION = "SELECT * FROM invitations WHERE invitedId=?";
	public static final String QUERY_GET_INVITATION_OF_GAME = "SELECT * FROM invitations WHERE gameId=?";
	public static final String INSERT_NEW_INVITATION = "INSERT INTO invitations (invitedId, inviterId, gameId) VALUES (?,?,?)";
	public static final String ADD_NEW_PLAYER_TO_GAME = "UPDATE active_games SET players=CONCAT(players, ?), playerCount=playerCount+1 WHERE id=? AND playerCount < capacity";
	public static final String ADD_GAME_TO_PLAYER_OBJECT = "UPDATE players SET gameId=? WHERE id=?";
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
	public boolean updateGame(int gameId) throws ServletException, InstantiationException, IllegalAccessException, NamingException {
		
		boolean answer = false;
		Connection con = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;	 

		try {
			
			con =  getConnection();
			stmt = con.prepareStatement(UPDATE_GAME);
			stmt.setLong(1, System.currentTimeMillis());
			stmt.setInt(2, gameId);
			
			int updateResult = stmt.executeUpdate();
			if(updateResult > 0){
				answer = true;
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
		return answer;

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
				serverSideGame.setOwner(rs.getInt("owner"));
				serverSideGame.setCapacity(rs.getInt("capacity"));
				serverSideGame.setPlayers(rs.getString("players"));
				serverSideGame.setLastUpdate(rs.getLong("lastUpdate"));
				serverSideGame.setPlayerCount(rs.getInt("playerCount"));
				serverSideGame.setRotationAngle(rs.getDouble("rotationAngle"));
				serverSideGame.setVelocity(rs.getDouble("velocity"));
				serverSideGame.setRotater(rs.getInt("rotator"));
				serverSideGame.setPointed(rs.getInt("pointed"));
				serverSideGame.setType(rs.getString("type"));
				serverSideGame.setType(rs.getString("action"));
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

	public Game createGame(String gameName, int capacity, int ownerId) throws ServletException, InstantiationException, IllegalAccessException, NamingException {
		Game game = null;

		Connection con = null;
		PreparedStatement stmt1 = null;
		PreparedStatement stmt2 = null;
		ResultSet rs = null;	 

		try {
			
			con =  getConnection();
			stmt1 = con.prepareStatement(INSERT_NEW_GAME, Statement.RETURN_GENERATED_KEYS);
			stmt1.setString(1, gameName);
			stmt1.setInt(2, capacity);
			stmt1.setString(3, ""+ownerId);
			stmt1.setInt(4, ownerId);
			
			int updateResult = stmt1.executeUpdate();
			if(updateResult > 0){
				rs = stmt1.getGeneratedKeys();

				if(rs.next()){
					game = new Game(rs.getInt(1));
					
					game.setName(gameName);
					game.setCapacity(capacity);
					game.setOwner(ownerId);
				}
			}
			
			stmt2 = con.prepareStatement(ADD_GAME_TO_PLAYER_OBJECT);
			stmt2.setInt(1, game.getId());
			stmt2.setInt(2, ownerId);
			stmt2.executeUpdate();
			
			updateGame(game.getId());
	


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

				if (stmt1 != null) {
					stmt1.close();
					stmt1 = null;
				}
				
				if (stmt2 != null) {
					stmt2.close();
					stmt2 = null;
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
		return game;

	}

	public Player getPlayer(int playerId) throws ServletException, InstantiationException, IllegalAccessException, NamingException{
		Player serverSidePlayer = new Player(playerId);

		Connection con = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
	 

		try {
		
			con =  getConnection();
			stmt = con.prepareStatement(QUERY_GET_PLAYER_OBJECT);
			stmt.setInt(1, playerId);
			rs = stmt.executeQuery();

			if(rs.next()){
				serverSidePlayer.setName(rs.getString("name"));
				serverSidePlayer.setSurname(rs.getString("surname"));
				serverSidePlayer.setGender(rs.getString("gender"));
				serverSidePlayer.setLastThreeSelection(rs.getString("lastThreeSelection"));
				serverSidePlayer.setGameId(rs.getInt("gameId"));
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
		return serverSidePlayer;

	}
	
	public ArrayList<Invitation> getInvitationsOfGame(int gameId) throws ServletException, InstantiationException, IllegalAccessException, NamingException{
		ArrayList<Invitation> invitationList = new ArrayList<Invitation>();

		Connection con = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
	 

		try {
		
			con =  getConnection();
			stmt = con.prepareStatement(QUERY_GET_INVITATION_OF_GAME);
			stmt.setInt(1, gameId);
			rs = stmt.executeQuery();

			while(rs.next()){
				Invitation invitation = new Invitation(rs.getInt("id"));
				invitation.setInvitedId(rs.getInt("invitedId"));
				invitation.setInvitedId(rs.getInt("inviterId"));
				invitation.setGameId(rs.getInt("gameId"));
				invitationList.add(invitation);
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
		return invitationList;

	}
	
	public ArrayList<Invitation> getInvitations(int invitedId) throws ServletException, InstantiationException, IllegalAccessException, NamingException{
		ArrayList<Invitation> invitationList = new ArrayList<Invitation>();

		Connection con = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
	 

		try {
		
			con =  getConnection();
			stmt = con.prepareStatement(QUERY_GET_INVITATION);
			stmt.setInt(1, invitedId);
			rs = stmt.executeQuery();

			while(rs.next()){
				Invitation invitation = new Invitation(rs.getInt("id"));
				invitation.setInvitedId(rs.getInt("invitedId"));
				invitation.setInvitedId(rs.getInt("inviterId"));
				invitation.setGameId(rs.getInt("gameId"));
				invitationList.add(invitation);
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
		return invitationList;

	}
	

	public Invitation getInvitations(int invitedId, int gameId) 
			 throws ServletException, InstantiationException, IllegalAccessException, NamingException{
		
		ArrayList<Invitation> invitationList = getInvitations(invitedId);
		for (Invitation inv : invitationList){
			if(inv.getGameId() == gameId)
				return inv;
				
		}
		return null;
	}
	
	public Invitation addInvitation(int inviterId, int invitedId, int gameId) 
			throws ServletException, InstantiationException, IllegalAccessException, NamingException{
		Invitation invitation = getInvitations(invitedId, gameId);
		
		if(invitation != null){
			return invitation;
		}


		Connection con = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		try {
			
			con =  getConnection();
			stmt = con.prepareStatement(INSERT_NEW_INVITATION, Statement.RETURN_GENERATED_KEYS);
			stmt.setInt(1, invitedId);
			stmt.setInt(2, inviterId);
			stmt.setInt(3, gameId);
			int updateResult = stmt.executeUpdate();
			
			if(updateResult > 0){
				rs = stmt.getGeneratedKeys();
				if(rs.next()){
					invitation = new Invitation(rs.getInt(1), inviterId, invitedId, gameId);
				}
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
		return invitation;

	}


	public Player addPlayer(int playerId, String playerName, String playerSurname, String playerGender)  
			throws ServletException, InstantiationException, IllegalAccessException, NamingException {
		
		Player player = getPlayer(playerId);
		if(player.getName() != null || player.getName() != ""){
			return player;
		}

		Connection con = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		try {
			
			con =  getConnection();
			stmt = con.prepareStatement(INSERT_NEW_PLAYER, Statement.RETURN_GENERATED_KEYS);
			stmt.setInt(1, playerId);
			stmt.setString(2, playerName);
			stmt.setString(3, playerSurname);
			stmt.setString(4, playerGender);
			int updateResult = stmt.executeUpdate();
			if(updateResult > 0){
				player = new Player(playerId);
				player.setName(playerName);
				player.setSurname(playerSurname);
				player.setGender(playerGender);
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
		return player;

	}

	public Player addPlayerToGame(int playerId, int gameId) 
			throws ServletException, InstantiationException, IllegalAccessException, NamingException {
		
		Game game = getGameObject(gameId);
		
		if(game.getPlayerCount() >= game.getCapacity()){
			return null;
		}
		
		Player player = null;

		Connection con = null;
		PreparedStatement stmt1 = null;
		PreparedStatement stmt2 = null;
		ResultSet rs = null;
		
		try {
			
			con =  getConnection();
			stmt1 = con.prepareStatement(ADD_NEW_PLAYER_TO_GAME);
			stmt1.setString(1, ","+playerId);
			stmt1.setInt(2, gameId);
			stmt1.executeUpdate();
			
			stmt2 = con.prepareStatement(ADD_GAME_TO_PLAYER_OBJECT, Statement.RETURN_GENERATED_KEYS);
			stmt2.setInt(1, gameId);
			stmt2.setInt(2, playerId);
			int updateResult2 = stmt2.executeUpdate();
			
			if(updateResult2 > 0){
				player = new Player(playerId);
				player.setGameId(gameId);
			}
			
			updateGame(game.getId());
			
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

				if (stmt1 != null) {
					stmt1.close();
					stmt1 = null;
				}
				
				if (stmt2 != null) {
					stmt2.close();
					stmt2 = null;
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
		return player;

	}

	public boolean updateAttribute(String attributeStr, int gameId, String valueStr) 
			throws ServletException, InstantiationException, IllegalAccessException, NamingException {
		
		final String UPDATE_STATE = "UPDATE active_games SET state=? WHERE id=?";
	 	final String UPDATE_VELOCITY = "UPDATE active_games SET velocity=? WHERE id=?";
	 	final String UPDATE_ANGLE = "UPDATE active_games SET rotationAngle=? WHERE id=?";
	 	final String UPDATE_ROTATOR = "UPDATE active_games SET rotator=? WHERE id=?";
	 	final String UPDATE_POINTED = "UPDATE active_games SET pointed=? WHERE id=?";
	 	final String UPDATE_TYPE = "UPDATE active_games SET type=? WHERE id=?";
	 	final String UPDATE_ACTION ="UPDATE active_games SET action=? WHERE id=?";
	 	final String UPDATE_ANSWER ="UPDATE active_games SET answer=? WHERE id=?";
	 	
		String choosenQuery;
		int attributeType = 0; //integer values -- 1 for Strings
		
		if(attributeStr.equals("state")){
			choosenQuery = UPDATE_STATE;
			attributeType = 1;
		}else if(attributeStr.equals("velocity")){
			choosenQuery = UPDATE_VELOCITY;
		}else if(attributeStr.equals("rotationAngle")){
			choosenQuery = UPDATE_ANGLE;
		}else if(attributeStr.equals("rotator")){
			choosenQuery = UPDATE_ROTATOR;
		}else if(attributeStr.equals("pointed")){
			choosenQuery = UPDATE_POINTED;
		}else if(attributeStr.equals("type")){
			choosenQuery = UPDATE_TYPE;
			attributeType = 1;
		}else if(attributeStr.equals("action")){
			choosenQuery = UPDATE_ACTION;
			attributeType = 1;
		}else if(attributeStr.equals("answer")){
			choosenQuery = UPDATE_ANSWER;
			attributeType = 1;
		}else
			return false;

		Connection con = null;
		PreparedStatement stmt = null;
		ResultSet rs = null;
		
		try {
			
			con =  getConnection();
			stmt = con.prepareStatement(choosenQuery);
			if(attributeType == 1){
				stmt.setString(1, valueStr);
			}else{
				stmt.setInt(1, Integer.parseInt(valueStr));
			}
			stmt.setInt(2, gameId);
			
			int updateResult = stmt.executeUpdate();
			
			if(updateResult > 0){
				updateGame(gameId);
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
		return true;

	}

}