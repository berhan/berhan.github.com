package com.donelabs.sisecevirmecefb.classes;

public class Invitation {
	private int id;
	private int inviterId;
	private int invitedId;
	private int gameId;
	
	public Invitation(int id){
		this.id = id;
	}

	public Invitation(int id, int inviterId, int invitedId, int gameId) {
		super();
		this.id = id;
		this.inviterId = inviterId;
		this.invitedId = invitedId;
		this.gameId = gameId;
	}

	public int getInviterId() {
		return inviterId;
	}

	public void setInviterId(int inviterId) {
		this.inviterId = inviterId;
	}

	public int getInvitedId() {
		return invitedId;
	}

	public void setInvitedId(int invitedId) {
		this.invitedId = invitedId;
	}

	public int getGameId() {
		return gameId;
	}

	public void setGameId(int gameId) {
		this.gameId = gameId;
	}
	
}
