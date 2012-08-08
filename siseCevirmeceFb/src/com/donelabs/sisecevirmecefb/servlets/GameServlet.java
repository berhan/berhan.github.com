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
	private static final String gameIdParameter = "gameId";
	private static final String actionIdParameter = "action";
	private static final String countIdParameter = "count";
	
	
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


	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

}
