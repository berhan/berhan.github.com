package com.donelabs.sisecevirmecefb.dataaccess;

import java.util.ArrayList;

import com.google.gson.Gson;

public class JSonManager {

	static Gson gson = new Gson();

	public static String getGameObjectAsJSon(Game game) {

		String gameJSon = gson.toJson(game);

		return gameJSon;
		
	}

	public static String getGameListAsJSon(ArrayList<Game> gameList) {
		String gameListJSon = gson.toJson(gameList);
		
		return gameListJSon;
	}
}
