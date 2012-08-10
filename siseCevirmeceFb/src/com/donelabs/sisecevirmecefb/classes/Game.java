package com.donelabs.sisecevirmecefb.classes;

import java.util.ArrayList;

public class Game {

	private int id;
	private String name;
	private long lastUpdate;
	private String state;
	private int owner;
	private int capacity;
	private int playerCount;
	private ArrayList<Integer> players;
	private double rotationAngle;
	private double velocity;
	private int rotator;
	private int pointed;
	private String type;
	private String action;
	private String answer;
	
	public Game(int id){
		this.id = id;
		players = new ArrayList<Integer>();
	}

	public Game(int id, String name, int ownerId){
		this.id = id;
		this.name = name;
		this.setOwner(ownerId);
		players = new ArrayList<Integer>();
	}



	public int getId() {
		return id;
	}

	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public int getCapacity() {
		return capacity;
	}

	public void setCapacity(int capacity) {
		this.capacity = capacity;
	}


	//since player list is kept at database as comma separated string, it needs to be converted
	public void setPlayers(String playersStr) {
		if(playersStr == null){
			return;
		}
		this.players.clear();
		
		String[] playerListStrArr = playersStr.split(",");
		for(String s: playerListStrArr){
			this.players.add(Integer.parseInt(s));
		}
	}

	public ArrayList<Integer> getPlayers() {
		return players;
	}

	public double getRotationAngle() {
		return rotationAngle;
	}

	public void setRotationAngle(double rotationAngle) {
		this.rotationAngle = rotationAngle;
	}

	public double getVelocity() {
		return velocity;
	}

	public void setVelocity(double velocity) {
		this.velocity = velocity;
	}

	public int getRotater() {
		return rotator;
	}

	public void setRotater(int rotater) {
		this.rotator = rotater;
	}

	public int getPointed() {
		return pointed;
	}

	public void setPointed(int pointed) {
		this.pointed = pointed;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getAction() {
		return action;
	}

	public void setAction(String action) {
		this.action = action;
	}

	public String getAnswer() {
		return answer;
	}

	public void setAnswer(String answer) {
		this.answer = answer;
	}

	public int getPlayerCount() {
		return playerCount;
	}

	public void setPlayerCount(int playerCount) {
		this.playerCount = playerCount;
	}

	public long getLastUpdate() {
		return lastUpdate;
	}

	public void setLastUpdate(long lastUpdate) {
		this.lastUpdate = lastUpdate;
	}

	public int getOwner() {
		return owner;
	}

	public void setOwner(int owner) {
		this.owner = owner;
	}
}
