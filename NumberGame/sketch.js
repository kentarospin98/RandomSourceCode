var walls;
var players;
var boardsize;
var gsz;
var mode;
var turn;
var randint;
var wallsprites;
var playersymbols;
var boardoffsets;
var boarddims;
var currentborder;
var boardbackground;
var randintsprites;

function displaypnames(){
  fill(255);
  rect(height + boardoffsets[0], 3*(width - gsz[0])/4 + 2*boardoffsets[1], 3*(width - gsz[0])/4, height - 3*(width - gsz[0])/4 - 3*boardoffsets[1]);
  for (var i = 0; i < players.length; i++) {
    var name = players[i].name;
    var symbol = players[i].symbol;

    var texthig = 5*(height - 3*(width - gsz[0])/4 - 3*boardoffsets[1])/16;

    fill(0);
    textAlign(LEFT, TOP);
    textSize(texthig);
    image(symbol, gsz[0] + boardoffsets[0] + (i%2)*3*(width - gsz[0])/8, 3*(width - gsz[0])/4 + (int(i/2) + 1)*(height - 3*(width - gsz[0])/4 - 3*boardoffsets[1])/2, texthig, texthig);
    text(players[i].name.slice(0, 8), texthig + gsz[0] + boardoffsets[0] + (i%2)*3*(width - gsz[0])/8, 3*(width - gsz[0])/4 + (int(i/2) + 1)*(height - 3*(width - gsz[0])/4 - 3*boardoffsets[1])/2);
  }
}

function proceed(){
  turn = (turn + 1)%players.length;
  mode = "SPIN"
}

function player(name, symbol, x, y){
  this.name = name;
  this.symbol = symbol;
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
    // fill(255);
    // textSize(boarddims[0]*2);
    // textAlign(CENTER, TOP);
    // text(this.digit, (gsz[1] + width)/2, 0);
    // text(this.movetype, (gsz[1] + width)/2, boarddims[0]*2);

    image(randintsprites[this.digit], gsz[0] + boardoffsets[0], boardoffsets[1], 3*(width - gsz[0])/4, 3*(width - gsz[0])/4);
    fill(0, 0);
    rect(gsz[0] + boardoffsets[0], boardoffsets[1], 3*(width - gsz[0])/4, 3*(width - gsz[0])/4);
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
  hig = wid;

  wallsprites = [];
  playersymbols = [];
  randintsprites = [];
  currentborder = loadImage("data/CurrentPlayer/HighlightPlayer.png");
  boardbackground = loadImage("data/Background/Background.png");
  for(var i = 1; i < 5; i++){
    var image = loadImage("data/RanInt/RanInt" + str(i) + ".png");
    randintsprites.push(image);
  }
  for (var i = 1; i < 6; i++) {
    // try{
      var image = loadImage("data/Walls/Wall" + str(i) + ".png");
      // console.log(image);
      wallsprites.push(image);
    // }catch(err){
    //   wallsprites[i] = -1;
    // }
  }
  for (var i = 0; i < 4; i++) {
    // try{
      var image = loadImage("data/Players/Player" + str(i) + ".png");
      // console.log(image);
      playersymbols.push(image);
    // }catch(err){
    //   wallsprites[i] = -1;
    // }
  }

  boardsize = [wid, hig];
  boardoffsets = [width/48, height/27];
  const PLAYERPRESET = [[0, 0], [wid - 1  , 0], [0, hig - 1], [wid - 1, hig - 1], [int(wid/2), 0], [int(wid/2), hig - 1], [0, int(hig/2)], [wid - 1, int(hig/2)]];
  const WALLPRESET = [[1,0], [0,1], [wid - 2, 0], [0, hig - 2], [1, hig - 1], [wid - 1, 1], [wid - 1, hig - 2], [wid - 2, hig - 1]];

  players = [];

  for(var i = 0; i < 4; i++){
    inp = prompt("Enter the name of the next player (Leave blank if all players are done)");
    if(inp == ""){
      break;
    }else{
      players.push(new player(inp,playersymbols[i] , PLAYERPRESET[i][0], PLAYERPRESET[i][1]));
    }
  }
  turn = 0;
  randint = new randomiser();
  mode = "SPIN";
  walls = WALLPRESET;
  boarddims = [(gsz[0] - boardoffsets[0])/boardsize[0], (gsz[1] - 2*boardoffsets[1])/boardsize[1]];
}

function draw(){
  background(128);

  fill(0, 255);
  image(boardbackground, boardoffsets[0], boardoffsets[1], boarddims[0]*boardsize[0], boarddims[1]*boardsize[1]);

  fill(0, 0);
  strokeWeight(4);
  for(var i = 0; i < boardsize[0]; i++){
    for(var j = 0; j < boardsize[1]; j++){
      rect(i*boarddims[0] + boardoffsets[0], j*boarddims[1] + boardoffsets[1], boarddims[0], boarddims[1]);
    }
  }
  fill(128);
  for(var i = 0; i < walls.length; i ++){
    var n = int((frameCount/5)%wallsprites.length);
    if(wallsprites[n] == -1){
      rect(walls[i][0]*boarddims[0] + boardoffsets[0], walls[i][1]*boarddims[1] + boardoffsets[1], boarddims[0], boarddims[1]);
    } else {
      image(wallsprites[n], walls[i][0]*boarddims[0] + boardoffsets[0], walls[i][1]*boarddims[1] + boardoffsets[1], boarddims[0], boarddims[1]);
    }
  }
  for(var i = 0; i < players.length; i++){
    fill(0);
    textAlign(LEFT, TOP);
    textSize(boarddims[1]);
    if(turn == i){
      // fill(255, 0, 0, 128);
      // rect((players[i].x)*boarddims[0] + boardoffsets[0], (players[i].y+0)*boarddims[1] + boardoffsets[1], boarddims[0], boarddims[1]);
      image(currentborder, (players[i].x)*boarddims[0] + boardoffsets[0], (players[i].y+0)*boarddims[1] + boardoffsets[1], boarddims[0], boarddims[1]);
    }
    fill(0);
    image(players[i].symbol, (players[i].x)*boarddims[0] + boardoffsets[0], (players[i].y+0)*boarddims[1] + boardoffsets[1], boarddims[0], boarddims[1]);
  }

  if(mode == "SPIN" && frameCount%2 == 0){
    if(randint.random()){
      mode = "MOVE"
    }
  }
  displaypnames();
  randint.show();
}

function mousePressed(){
  if(mode == "MOVE"){
    if(randint.digit == 0){
      var tile = -1;
      for (var i = 0; i < boardsize[0]; i++) {
        for (var j = 0; j < boardsize[1]; j++) {
          if(mouseX > i*boarddims[0] + boardoffsets[0] && mouseX < (i+1)*boarddims[0] + boardoffsets[0] && mouseY > j*boarddims[1] + boardoffsets[1] && mouseY < (j+1)*boarddims[1] + boardoffsets[1]){
            tile = [i, j];
            break;
          }
        }
      }+ boardoffsets[1]
      for (var i = 0; i < players.length; i++) {
        if(tile[0] == players[i].x && tile[1] == players[i].y && turn != i){
          tile = -1;
          break;
        }
      }
      if(tile != -1+ boardoffsets[1] && abs(players[turn].x - tile[0]) <= 2 && abs(players[turn].y - tile[1]) <= 2){
        players[turn].x = tile[0];
        players[turn].y = tile[1];
        proceed();
      }
    }
  }
}
