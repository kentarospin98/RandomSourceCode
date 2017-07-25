var walls;
var players;
var boardsize;
var mode;
var turn;

function player(name, x, y){
  this.name = name;
  this.x = x;
  this.y = y;
};

function setup(){
  // createCanvas(800, 600);
  createCanvas(document.body.clientWidth, document.body.clientHeight);
  // fullScreen();
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
  mode = "SPIN";
  walls = WALLPRESET;
}

function draw(){
  background(128);
  fill(255);
  strokeWeight(4);
  for(var i = 0; i < boardsize[0]; i++){
    for(var j = 0; j < boardsize[1]; j++){
      rect(i*width/boardsize[0], j*height/boardsize[1], width/boardsize[0], height/boardsize[1]);
    }
  }
  fill(128);
  for(var i = 0; i < walls.length; i ++){
    rect(walls[i][0]*width/boardsize[0], walls[i][1]*height/boardsize[1], width/boardsize[0], height/boardsize[1]);
  }
  for(var i = 0; i < players.length; i++){
    fill(0);
    textAlign(LEFT, TOP);
    textSize(height/boardsize[1]);
    if(turn == i){
      fill(255, 0, 0, 128);
      rect((players[i].x)*width/boardsize[0], (players[i].y+0)*height/boardsize[1], width/boardsize[0], height/boardsize[1]);
    }
    fill(0);
    text(players[i].name, (players[i].x)*width/boardsize[0], (players[i].y+0)*height/boardsize[1], width/boardsize[0], height/boardsize[1]);
  }
}
