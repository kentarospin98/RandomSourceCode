var walls;
var players;
var boardsize;
var gsz;
var mode;
var turn;
var randint;

function proceed(){
  turn = (turn + 1)%players.length;
  mode = "SPIN"
}

function player(name, x, y){
  this.name = name;
  this.x = x;
  this.y = y;
};

function randomiser(){
  this.digit = int(random(5));
  this.spincount = 40;
  this.movetype = "Type 0"

  this.random = function(){
    // this.digit = int(random(5));
    this.digit = 0;
    this.spincount--;
    if(this.spincount <= 0){
      if(this.digit == 0){
        this.movetype = "Move";
      }else{
        this.movetype = "Type " + str(this.digit);
      }
      return true;
    }
  }

  this.show = function(){
    fill(255);
    textSize(gsz[0]/boardsize[0]*2);
    textAlign(CENTER, TOP);
    text(this.digit, (gsz[1] + width)/2, 0);
    text(this.movetype, (gsz[1] + width)/2, gsz[0]/boardsize[0]*2);
  }
}

function setup(){
  // createCanvas(800, 600);
  createCanvas(document.body.clientWidth, document.body.clientHeight);
  // fullScreen();

  gsz = [height, height];
  do{
    var wid = int(prompt("Enter the board width, more than or equal to 5"));
  }while(!(wid >= 5));
  do{
    var hig = int(prompt("Enter the board height, more than or equal to 5"));
  }while(!(hig >= 5));

  boardsize = [wid, hig];
  const PLAYERPRESET = [[0, 0], [wid - 1  , 0], [0, hig - 1], [wid - 1, hig - 1], [int(wid/2), 0], [int(wid/2), hig - 1], [0, int(hig/2)], [wid - 1, int(hig/2)]];
  const WALLPRESET = [[1,0], [0,1], [wid - 2, 0], [0, hig - 2], [1, hig - 1], [wid - 1, 1], [wid - 1, hig - 2], [wid - 2, hig - 1]];

  players = [];

  for(var i = 0; i < 8; i++){
    inp = prompt("Enter the name of the next player (Leave blank if all players are done)");
    if(inp == ""){
      break;
    }else{
      players.push(new player(inp, PLAYERPRESET[i][0], PLAYERPRESET[i][1]));
    }
  }
  turn = 0;
  randint = new randomiser();
  mode = "SPIN";
  walls = WALLPRESET;
}

function draw(){
  background(128);
  fill(255);
  strokeWeight(4);
  for(var i = 0; i < boardsize[0]; i++){
    for(var j = 0; j < boardsize[1]; j++){
      rect(i*gsz[0]/boardsize[0], j*gsz[1]/boardsize[1], gsz[0]/boardsize[0], gsz[1]/boardsize[1]);
    }
  }
  fill(128);
  for(var i = 0; i < walls.length; i ++){
    rect(walls[i][0]*gsz[0]/boardsize[0], walls[i][1]*gsz[1]/boardsize[1], gsz[0]/boardsize[0], gsz[1]/boardsize[1]);
  }
  for(var i = 0; i < players.length; i++){
    fill(0);
    textAlign(LEFT, TOP);
    textSize(gsz[1]/boardsize[1]);
    if(turn == i){
      fill(255, 0, 0, 128);
      rect((players[i].x)*gsz[0]/boardsize[0], (players[i].y+0)*gsz[1]/boardsize[1], gsz[0]/boardsize[0], gsz[1]/boardsize[1]);
    }
    fill(0);
    text(players[i].name, (players[i].x)*gsz[0]/boardsize[0], (players[i].y+0)*gsz[1]/boardsize[1], gsz[0]/boardsize[0], gsz[1]/boardsize[1]);
  }

  if(mode == "SPIN" && frameCount%2 == 0){
    if(randint.random()){
      mode = "MOVE"
    }
  }

  randint.show();
}

function mousePressed(){
  if(mode == "MOVE"){
    if(randint.digit == 0){
      var tile = -1;
      for (var i = 0; i < boardsize[0]; i++) {
        for (var j = 0; j < boardsize[1]; j++) {
          if(mouseX > i*gsz[0]/boardsize[0] && mouseX < (i+1)*gsz[0]/boardsize[0] && mouseY > j*gsz[1]/boardsize[1] && mouseY < (j+1)*gsz[1]/boardsize[1]){
            tile = [i, j];
            break;
          }
        }
      }
      for (var i = 0; i < players.length; i++) {
        if(tile[0] == players[i].x && tile[1] == players[i].y && turn != i){
          tile = -1;
          break;
        }
      }
      if(tile != -1 && abs(players[turn].x - tile[0]) <= 2 && abs(players[turn].y - tile[1]) <= 2){
        players[turn].x = tile[0];
        players[turn].y = tile[1];
        proceed();
      }
    }
  }
}
