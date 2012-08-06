//virtual, basic facebook integration class
function FbObj(){
	// var graphUrl = 'http://graph.facebook.com/';

	this.userList = {
		"1183491185": {"name": "Berhan \u015eenyazar", friends: ["550410621", "558707356", "618458068", "696622849", "567978009"]}, 
		"550410621": {"name": "Caner Erdi Y\u0131ld\u0131r\u0131m", friends: ["1183491185", "567978009", "713738903", "100002514703963"]},
		"558707356": {"name": "Nezihe Pehlivan", friends: ["567978009", "612239488", "713738903", "100002514703963"]},
		"567978009": {"name": "Elif \u00d6nder", friends: ["550410621", "558707356", "618458068", "696622849"]},
		"612239488": {"name": "Gizem \u00d6zdemir", friends: ["1183491185", "558707356", "1203471777"]},
		"618458068": {"name": "Mehmet Can Ya\u015far", friends: ["1183491185", "567978009", "1203471777"]}, 
		"696622849": {"name": "Yener Albo\u011fa", friends: ["1183491185", "567978009", "713738903","1203471777"]},
		"713738903": {"name": "Ahmet Erdem", friends: ["550410621", "558707356", "696622849", "100002514703963"]},
		"100002514703963": {"name": "Alper \u00c7etiner", friends: ["550410621", "558707356", "713738903"]},
		"1203471777": {"name": "Fahrettin \u015eamil Uysal", friends: ["1183491185", "612239488", "618458068", "696622849"]}
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
