//player object class
function Player(me){
	this.id = me; //me for facebook integration, for now it looks silly
	// this.id = me.id;
	// this.name = me.name;
	// //this.surname = fb.getSurname(id);
	// this.gender = me.gender;
	this.picture = 'http://graph.facebook.com/'+this.id+'/picture/';

	this.getId = function(){
		return this.id;
	}

	this.getName = function(){
		return this.name;
	}

	this.getSurname = function(){
		return this.surname;
	}

	this.getGender = function(){
		return this.gender;
	}


	this.getProfilePicture = function(){
		return this.picture;
	}

	this.change = function(playersArr){
		$('body').append('<select id="changePlayer"></select>');
		$('#changePlayer').append('<option value="choose" >Choose</option>');
		for(var ply in playersArr){
			if(playersArr[ply] !== this.id){
				$('#changePlayer').append('<option value='+playersArr[ply]+' >'+fb.getName(playersArr[ply])+'</option>');
			}
		}
		$('#changePlayer').change( function(){
			var newPlayer = $('#changePlayer option').filter(":selected").val();
			if(newPlayer !== "choose"){
				player = new Player(newPlayer);
				//consol.log(this.id);
				updateView();
			}
		})
	}
}