package com.donelabs.sisecevirmecefb.dataaccess;

import java.util.ArrayList;

public class Game {

	private int id;
	private String name;
	private long lastUpdateTime;
	private String state;
	private int ownerId;
	private int capacity;
	private int playerCount;
	private ArrayList<Integer> playerList;
	private double rotationAngle;
	private double velocity;
	private int rotaterId;
	private int pointedId;
	private String type;
	private String action;
	private String answer;
	
	public Game(int id){
		this.id = id;
		playerList = new ArrayList<Integer>();
	}

	public Game(int id, String name, int ownerId){
		this.id = id;
		this.name = name;
		this.ownerId = ownerId;
		playerList = new ArrayList<Integer>();
	}

	public long getLastUpdateTime() {
		return lastUpdateTime;
	}

	public void setLastUpdateTime(long lastUpdateTime) {
		this.lastUpdateTime = lastUpdateTime;
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

	public int getOwnerId() {
		return ownerId;
	}

	public void setOwnerId(int ownerId) {
		this.ownerId = ownerId;
	}

	public int getCapacity() {
		return capacity;
	}

	public void setCapacity(int capacity) {
		this.capacity = capacity;
	}

	public ArrayList<Integer> getPlayerList() {
		return playerList;
	}
	
	//since player list is kept at database as comma separated string, it needs to be converted
	public void setPlayerList(String playerListStr) {
		if(playerListStr == null){
			return;
		}
		this.playerList.clear();
		
		String[] playerListStrArr = playerListStr.split(",");
		for(String s: playerListStrArr){
			this.playerList.add(Integer.parseInt(s));
		}
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

	public int getRotaterId() {
		return rotaterId;
	}

	public void setRotaterId(int rotaterId) {
		this.rotaterId = rotaterId;
	}

	public int getPointedId() {
		return pointedId;
	}

	public void setPointedId(int pointedId) {
		this.pointedId = pointedId;
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
}
