package com.donelabs.sisecevirmecefb.dataaccess;

import java.util.ArrayList;

import com.donelabs.sisecevirmecefb.classes.Game;
import com.donelabs.sisecevirmecefb.classes.Invitation;
import com.donelabs.sisecevirmecefb.classes.Player;
import com.google.gson.Gson;

public class JSonManager {

	static Gson gson = new Gson();

	public static String getGameObjectAsJSon(Game game) {
		if(game == null){
			return "{}";
		}
		String gameJSon = gson.toJson(game);

		return gameJSon;
		
	}

	public static String getGameListAsJSon(ArrayList<Game> gameList) {
		String gameListJSon = gson.toJson(gameList);
		
		return gameListJSon;
	}

	public static String getPlayerObjectAsJSon(Player player) {
		if(player == null){
			return"{}";
		}
		
		String playerJSon = gson.toJson(player);
		
		return playerJSon;
	}

	public static String getInvitationListAsJSon(
			ArrayList<Invitation> invitations) {
		
		String InviteListJSon = gson.toJson(invitations);
		
		return InviteListJSon;
	}

	public static String getInvitationAsJSon(Invitation invitation) {
		if(invitation == null){
			return"{}";
		}
		
		String invitationJSon = gson.toJson(invitation);
		
		return invitationJSon;
	}

	public static String getBooleanAsJSon(boolean updateAttribute) {
		
		return gson.toJson(updateAttribute);
	}
}
