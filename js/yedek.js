//yedek html form

	<div id="gameType-form" title="Gercek mi, Cesaret mi?">
		<p>Oyun tipini seciniz.</p>
	</div>
	<div id="cesaret-form" title="Cesaret!">
		<p>Ne yapmasini istersiniz?</p>
		<textarea name="cesaret-input" autofocus="autofocus" ></textarea>
	</div>
	<div id="truth-form" title="Gercek!">
		<p>Neyi ogrenmek istersiniz?</p>
		<textarea name="truth-input" autofocus="autofocus" ></textarea>
	</div>

//yedek js'ler

	function displayMainMenu(){
		var buttonText1 = "Ceviren ol"; 
		mainMenuButton(centerX-260, centerY-75, 250, 150, 10, true, false, "main", buttonText1);
		
		var buttonText2 = "Digerleri ol";
		mainMenuButton(centerX+10, centerY-75, 250, 150, 10, true, false, "main", buttonText2);

	}
	
	function mainMenuButton(x, y, width, height, radius, fill, stroke, grad, text){
		if( grad === "main"){
			grad = ctx.createLinearGradient(x, y, x+width, y+height);
			grad.addColorStop(0, "grey");
			grad.addColorStop(1, "black");
		}
		if (typeof grad != "undefined" ) {
			ctx.fillStyle=grad;
		}
		roundRect(x, y, width, height, radius, fill, stroke);
		ctx.fillStyle = "grey";
		ctx.font="24pt Arial";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(text, x+width/2, y+height/2);
	}

	$( "#gameType-form" ).dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"Gercek": function() {
				startGameGercek();
				(this).dialog("close");
			},
			"Cesaret": function() {
				startGameCesaret();
				(this).dialog("close");
			}
		},
	});
	$( "#gercek-form" ).dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"Gonder": function() {
			}
		},
	});
	
	$( "#cesaret-form" ).dialog({
		autoOpen: false,
		height: 300,
		width: 350,
		modal: true,
		buttons: {
			"Gonder": function() {
			}
		},
	});

	$( "#gercek-button" ).click(function() {
			$( "#gercek-form" ).dialog( "open" );
		});

function startGameDialogs(){
		playerId = pointingPlayer;
		if(playerId === pointingPlayer){
			$( "#gameType-form" ).dialog( "open" );
		}
		else if(playerId === playingPlayer){
			followGame("gameTypeSelection");
		}
		else{
			followGame("gameTypeSelection");
		}
	}
	
	
	function startGameGercek(){
		$( "#gercek-form" ).dialog( "open" );
	}
	
	function startGameCesaret(){
		$( "#cesaret-form" ).dialog( "open" );
	}
	
	function followGame(state){
		var followDialog = $(document.createElement('div'));
		var title;
		var html;
		switch (state){
			case "gameTypeSelection":
				title = "Gercek mi, Cesaret mi?";
				html = "<p>Oyun secimini bekliyoruz...</p>";
				break;
			case "gercekSelected":
				title = "Gercek!";
				html = "<p>Gercegi secti! Simdi soruyu bekliyoruz...</p>";
				break;
			case "cesaretSelected":
				title = "Cesaret!";
				html = "<p>Cesareti secti! Simdi isteneni bekliyoruz...</p>";
				break;
		}
		followDialog.title(title);
		followDialog.html(html);
		