//virtual, basic facebook integration class
//this is not the real integration. 
//the functions of this object are representations of what information is needed from Facebook Javascript SDK
function FbObj(){
	// var graphUrl = 'http://graph.facebook.com/';

	this.userList = {
		"1183491185": {"name": "Berhan", surname: "\u015eenyazar", friends: ["550410621", "618458068", "713738903", "514703963"]}, 
		"550410621": {"name": "Caner Erdi", surname: "Y\u0131ld\u0131r\u0131m", friends: ["1183491185","1203471777","713738903"]},
		"618458068": {"name": "Mehmet Can", surname: "Ya\u015far", friends: ["1183491185", "696622849", "514703963"]}, 
		"696622849": {"name": "Yener", surname: "Albo\u011fa", friends: ["618458068", "713738903", "1203471777"]},
		"713738903": {"name": "Ahmet", surname: "Erdem", friends: ["1183491185", "550410621", "696622849", "514703963", "1203471777"]},
		"514703963": {"name": "Alper", surname: "\u00c7etiner", friends: ["1183491185", "618458068", "713738903"]},
		"1203471777": {"name": "Fahrettin \u015eamil", surname: "Uysal", friends: ["550410621", "696622849", "713738903"]}
	};

	this.auth = function(id){
		// if(this.userList[id] === undefined){
		// 	this.userList[id] = {};
		// }
		// console.log('id ' + id);
		// var user = {};

		// 	FB.api('/'+id, function(response){
		// 		this.userList[id].name = response.name;
		// 		this.userList[id].picture = response.picture;
		// 		console.log("picture: " +response.picture);
		// 	});
		player = new Player(id);
		return true;
	}

	this.getName = function(id){
		if(this.userList[id].name === undefined){
			this.auth(id);
		}
		return this.userList[id].name;
	}

	// this.getSurname = function(id){
	// 	if(this.userList[id].name === undefined){
	// 		this.auth(id);
	// 	}
	// 	return this.userList[id].surname;
	// }

	// this.getGender = function(id){
	// 	if(this.userList[id].name === undefined){
	// 		this.auth(id);
	// 	}
	// 	return this.userList[id].gender;
	// }

	this.getProfilePicture = function(id){
		if(this.userList[id].picture === undefined){
			this.userList[id].picture = 'http://graph.facebook.com/'+id+'/picture';
		}
		return this.userList[id].picture;
	}

	this.getFriends = function(id){
		return this.userList[id].friends;
	}
}
