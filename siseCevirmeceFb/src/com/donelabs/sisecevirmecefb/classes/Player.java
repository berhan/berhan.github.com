package com.donelabs.sisecevirmecefb.classes;

public class Player {
	private int id;
	private String name;
	private String surname;
	private String gender;
	private String lastThreeSelection;
	private int gameId;
	
	public Player(int id){
		this.id = id;
	}
	
	public Player(int id, String name, String surname, String gender,
			String lastThreeSelection, int gameId) {		
		this.id = id;
		this.name = name;
		this.surname = surname;
		this.gender = gender;
		this.lastThreeSelection = lastThreeSelection;
		this.gameId = gameId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getSurname() {
		return surname;
	}

	public void setSurname(String surname) {
		this.surname = surname;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getLastThreeSelection() {
		return lastThreeSelection;
	}

	public void setLastThreeSelection(String lastThreeSelection) {
		this.lastThreeSelection = lastThreeSelection;
	}

	public int getGameId() {
		return gameId;
	}

	public void setGameId(int gameId) {
		this.gameId = gameId;
	}

	public int getId() {
		return id;
	}
	
}
