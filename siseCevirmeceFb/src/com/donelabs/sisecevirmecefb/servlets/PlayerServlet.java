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
 * Servlet implementation class PlayerServlet
 */
@WebServlet("/PlayerServlet")
public class PlayerServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final String actionIdParameter = "action";
	private static final String playerIdParameter = "playerId";
	private static final String playerNameParameter = "name";
	private static final String playerSurnameParameter = "surname";
	private static final String playerGenderParameter = "gender";
	private static final String inviterIdParameter = "inviterId";
	private static final String invitedIdParameter = "invitedId";
	private static final String gameIdParameter = "gameId";
 
    public PlayerServlet() {
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
					getPlayer(request, response);
					break;
				case 1:
					addPlayer(request, response);
					break;
				case 2:
					getInvitations(request, response);
					break;
				case 3:
					invitePlayer(request, response);
					break;
			}		  
	 }
	
	protected void getPlayer(HttpServletRequest request, HttpServletResponse response) 
			 throws IOException, ServletException{
		 
		  	response.setContentType("text/html; charset=utf-8");
			response.setCharacterEncoding("UTF-8");
			PrintWriter out = response.getWriter();
			
			String playerIdStr = request.getParameter(playerIdParameter);
			int playerId = Integer.parseInt(playerIdStr);

			try {

				DataAccess dataAccess = new DataAccess();

				out.println(JSonManager.getPlayerObjectAsJSon(dataAccess.getPlayer(playerId)));

			} catch (InstantiationException e) {
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				e.printStackTrace();
			} catch (NamingException e) {
				e.printStackTrace();
			}
	 }
	
	protected void addPlayer(HttpServletRequest request, HttpServletResponse response) 
			 throws IOException, ServletException{
		
		response.setContentType("text/html; charset=utf-8");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		
		String playerIdStr = request.getParameter(playerIdParameter);
		String playerName = request.getParameter(playerNameParameter);
		String playerSurname = request.getParameter(playerSurnameParameter);
		String playerGender = request.getParameter(playerGenderParameter);
		
		boolean isRequestValid = true;
		int playerId = 0;
		
		if(playerIdStr == null || playerIdStr == ""){
			isRequestValid = false;
		}else{
			playerId = Integer.parseInt(playerIdStr);
		}
			
		if(playerId == 0 || playerName == null || playerName == "" || playerSurname == null || playerSurname == ""){
			isRequestValid = false;
		}else if(playerGender == null){
			playerGender = "";
		}
		
		if(playerGender.equalsIgnoreCase("male") || playerGender.equals("m")){
			playerGender = "M";
		}else if(playerGender.equalsIgnoreCase("female") || playerGender.equals("f")){
			playerGender = "F";
		}
		
		if(isRequestValid){
			try {
				
				DataAccess dataAccess = new DataAccess();
	
				out.println(JSonManager.getPlayerObjectAsJSon(dataAccess.addPlayer(playerId, playerName , playerSurname, playerGender)));
	
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
		
		String playerIdStr = request.getParameter(invitedIdParameter);
		String gameIdStr = request.getParameter(gameIdParameter);
		int playerId = Integer.parseInt(playerIdStr);
		int gameId = Integer.parseInt(gameIdStr);

		try {

			DataAccess dataAccess = new DataAccess();
			
			if(gameId > 0){
				out.println(JSonManager.getInvitationAsJSon(dataAccess.getInvitations(playerId, gameId)));
			}else{
				out.println(JSonManager.getInvitationListAsJSon(dataAccess.getInvitations(playerId)));
			}
		

		} catch (InstantiationException e) {
			e.printStackTrace();
		} catch (IllegalAccessException e) {
			e.printStackTrace();
		} catch (NamingException e) {
			e.printStackTrace();
		}
 
	}
	
	protected void invitePlayer(HttpServletRequest request, HttpServletResponse response) 
			 throws IOException, ServletException{
		
		response.setContentType("text/html; charset=utf-8");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		
		String inviterIdStr = request.getParameter(inviterIdParameter);
		String invitedIdStr = request.getParameter(invitedIdParameter);
		String gameIdStr = request.getParameter(gameIdParameter);
		
		boolean isRequestValid = true;
		int inviterId = 0;
		int invitedId = 0;
		int gameId = 0;
		
		if(inviterIdStr == null || inviterIdStr == ""){
			isRequestValid = false;
		}else{
			inviterId = Integer.parseInt(inviterIdStr);
		}
		
		if(invitedIdStr == null || invitedIdStr == ""){
			isRequestValid = false;
		}else{
			invitedId = Integer.parseInt(invitedIdStr);
		}
		
		if(gameIdStr == null || gameIdStr == ""){
			isRequestValid = false;
		}else{
			gameId = Integer.parseInt(gameIdStr);
		}
			
			

		
		if(isRequestValid){
			try {
				
				DataAccess dataAccess = new DataAccess();
	
				out.println(JSonManager.getInvitationAsJSon(dataAccess.addInvitation(inviterId, invitedId , gameId)));
	
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
	
	


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
