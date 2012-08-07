//player object class
function Player(id){
	this.id = id; 
	this.name;
	this.surname;
	this.gender;
	this.picture = 'http://graph.facebook.com/'+this.id+'/picture/';
	this.lastThreeGame = []; //an array to keep last 3 game type. 0 for Truth, 1 for Dare
	this.friends; 

	this.change = function(playersArr){ //function to change playing player and simulate gameplay
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