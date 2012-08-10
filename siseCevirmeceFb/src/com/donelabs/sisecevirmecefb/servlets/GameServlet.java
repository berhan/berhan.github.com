package com.donelabs.sisecevirmecefb.servlets;

import java.io.IOException;
import java.io.PrintWriter;

import javax.naming.NamingException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.donelabs.sisecevirmecefb.dataaccess.DataAccess;
import com.donelabs.sisecevirmecefb.dataaccess.JSonManager;



/**
 * Servlet implementation class GameServlet
 */
@WebServlet("/GameServlet")
public class GameServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final String actionIdParameter = "action";
	private static final String gameIdParameter = "gameId";
	private static final String countIdParameter = "count";
	private static final String capacityParameter = "capacity";
	private static final String gameNameParameter = "name";
	private static final String ownerIdParameter = "owner";
	private static final String playerIdParameter = "playerId";
	private static final String attributeParameter = "attr";
	private static final String newValueParameter = "value";
	private static final int CAPACITY_LIMIT = 8;
	
	
    public GameServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		process(request, response);
	}
	
	 protected void process(HttpServletRequest request, HttpServletResponse response) 
			  throws IOException, ServletException{

			String actionIdStr = request.getParameter(actionIdParameter);
			int actionId = Integer.parseInt(actionIdStr);
			
			switch (actionId) {
				case 0:
					getGameList(request, response);
					break;
				case 1:
					getGameObject(request, response);
					break;
				case 2:
					createGame(request, response);
					break;
				case 3:
					addPlayer(request, response);
					break;
				case 4:
					getInvitations(request, response);
					break;
				case 5:
					updateAttribute(request, response);
					break;
			}		  
	  }
	 

	protected void getGameObject(HttpServletRequest request, HttpServletResponse response) 
			 throws IOException, ServletException{
		 
		  	response.setContentType("text/html; charset=utf-8");
			response.setCharacterEncoding("UTF-8");
			PrintWriter out = response.getWriter();
			
			String gameIdStr = request.getParameter(gameIdParameter);
			int gameId = Integer.parseInt(gameIdStr);

			try {

				DataAccess dataAccess = new DataAccess();

				out.println(JSonManager.getGameObjectAsJSon(dataAccess.getGameObject(gameId)));

			} catch (InstantiationException e) {
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			} catch (NamingException e) {
				e.printStackTrace();
			}
	 }
	 
	 
	 protected void getGameList(HttpServletRequest request, HttpServletResponse response) 
			 throws IOException, ServletException{
		 
		 	response.setContentType("text/html; charset=utf-8");
			response.setCharacterEncoding("UTF-8");
			PrintWriter out = response.getWriter();
			
			String countStr = request.getParameter(countIdParameter);
			int count;
			if(countStr == null || countStr ==""){
				count = 0;
			}else{
				count = Integer.parseInt(countStr);
			}
		

			try {

				DataAccess dataAccess = new DataAccess();

				out.println(JSonManager.getGameListAsJSon(dataAccess.getGameList(count)));

			} catch (InstantiationException e) {
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			} catch (NamingException e) {
				e.printStackTrace();
			}
	
		 
	 }
	 
	 protected void createGame(HttpServletRequest request, HttpServletResponse response) 
			 throws IOException, ServletException{
		 
			response.setContentType("text/html; charset=utf-8");
			response.setCharacterEncoding("UTF-8");
			PrintWriter out = response.getWriter();
			
			String capacityStr = request.getParameter(capacityParameter);
			String gameName = request.getParameter(gameNameParameter);
			String ownerIdStr = request.getParameter(ownerIdParameter);
			
			
			boolean isRequestValid = true;
			int capacity = 0;
			int ownerId = 0;
			
			if(capacityStr == null || capacityStr == "")
				isRequestValid = false;
			else{
				capacity = Integer.parseInt(capacityStr);
			}
			
			if(gameName == null || gameName == ""){
				isRequestValid = false;
			}
			
			if(ownerIdStr == null || ownerIdStr == ""){
				isRequestValid = false;
			}else{
				ownerId = Integer.parseInt(ownerIdStr);
			}
			
			if(capacity <= 0 || capacity > CAPACITY_LIMIT){
				capacity = CAPACITY_LIMIT;
			}
			
			if(isRequestValid){
				try {
					
					DataAccess dataAccess = new DataAccess();
		
					out.println(JSonManager.getGameObjectAsJSon(dataAccess.createGame(gameName, capacity, ownerId)));
		
				} catch (InstantiationException e) {
					e.printStackTrace();
				} catch (IllegalAccessException e) {
					e.printStackTrace();
				} catch (NamingException e) {
					e.printStackTrace();
				}
				
			}else{
				out.println("invalid-request");
			}
	
		
	 }
	 
	 //adds player to game
	 private void addPlayer(HttpServletRequest request,	HttpServletResponse response) 
			 throws IOException, ServletException {
		 
		 	response.setContentType("text/html; charset=utf-8");
			response.setCharacterEncoding("UTF-8");
			PrintWriter out = response.getWriter();
			
			String playerIdStr = request.getParameter(playerIdParameter);
			String gameIdStr = request.getParameter(gameIdParameter);
			
			boolean isRequestValid = true;
			int playerId = 0;
			int gameId = 0;
			
			if(playerIdStr == null || playerIdStr == "")
				isRequestValid = false;
			else{
				playerId= Integer.parseInt(playerIdStr);
			}
			
			if(gameIdStr == null || gameIdStr == ""){
				isRequestValid = false;
			}else{
				gameId= Integer.parseInt(gameIdStr);
			}
			
			if(isRequestValid){
				try {
					
					DataAccess dataAccess = new DataAccess();
		
					out.println(JSonManager.getPlayerObjectAsJSon(dataAccess.addPlayerToGame(playerId, gameId)));
		
				} catch (InstantiationException e) {
					e.printStackTrace();
				} catch (IllegalAccessException e) {
					e.printStackTrace();
				} catch (NamingException e) {
					e.printStackTrace();
				}
				
			}else{
				out.println("invalid-request");
			}
	
			
	}
	 
	//changes selected attribute of a game in the database
	 private void updateAttribute(HttpServletRequest request,	HttpServletResponse response) 
			 throws IOException, ServletException {
		 
		 	
		 	response.setContentType("text/html; charset=utf-8");
			response.setCharacterEncoding("UTF-8");
			PrintWriter out = response.getWriter();
			
			String attributeStr = request.getParameter(attributeParameter);
			String valueStr = request.getParameter(newValueParameter);
			String gameIdStr = request.getParameter(gameIdParameter);
			
			boolean isRequestValid = true;
			int gameId = 0;
			
			if(gameIdStr == null || gameIdStr == ""){
				isRequestValid = false;
			}else{
				gameId= Integer.parseInt(gameIdStr);
			}
			
				
			if(isRequestValid){
				try {
					
					DataAccess dataAccess = new DataAccess();
		
					out.println(JSonManager.getBooleanAsJSon(dataAccess.updateAttribute(attributeStr, gameId, valueStr)));
		
				} catch (InstantiationException e) {
					e.printStackTrace();
				} catch (IllegalAccessException e) {
					e.printStackTrace();
				} catch (NamingException e) {
					e.printStackTrace();
				}
				
			}else{
				out.println("invalid-request");
			}
	
			
	}
	 
	 protected void getInvitations(HttpServletRequest request, HttpServletResponse response) 
			 throws IOException, ServletException{
		
		response.setContentType("text/html; charset=utf-8");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		
		String gameIdStr = request.getParameter(gameIdParameter);
		int gameId = Integer.parseInt(gameIdStr);

		try {

			DataAccess dataAccess = new DataAccess();
			
			if(gameId > 0)
				out.println(JSonManager.getInvitationListAsJSon(dataAccess.getInvitationsOfGame(gameId)));
	
		

		} catch (InstantiationException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (NamingException e) {
			e.printStackTrace();
		}
 
	}


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
