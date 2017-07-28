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
var font;
var availablespaces;

function displaypnames(){
  fill(255);
  rect(gsz[0] + boardoffsets[0], 3*(gsz[0]-2*boardoffsets[1])/4 + 2*boardoffsets[1], 3*(gsz[0]-2*boardoffsets[1])/4, height - 3*(gsz[0]-2*boardoffsets[1])/4 - 3*boardoffsets[1]);
  for (var i = 0; i < players.length; i++) {
    var name = players[i].name;
    var symbol = players[i].symbol;

    var texthig = 5*(height - 3*(gsz[0]-2*boardoffsets[1])/4 - 3*boardoffsets[1])/16;

    fill(0);
    textAlign(LEFT, TOP);
    textSize(texthig);
    textFont(font);
    // image(symbol, gsz[0] + boardoffsets[0] + (i%1)*3*(gsz[0]-2*boardoffsets[1])/8, );
    image(symbol,
          gsz[0] + boardoffsets[0] + (i%2)*3*(gsz[0]-2*boardoffsets[1])/8,
          3*(gsz[0]-2*boardoffsets[1])/4 + (int(i/2) + 1)*(height - 3*(gsz[0]-2*boardoffsets[1])/4 - 3*boardoffsets[1])/2,
          texthig,
          texthig);
    text(players[i].name.slice(0, 8),
         gsz[0] + boardoffsets[0] + (i%2)*3*(gsz[0]-2*boardoffsets[1])/8 + texthig,
         3*(gsz[0]-2*boardoffsets[1])/4 + (int(i/2) + 1)*(height - 3*(gsz[0]-2*boardoffsets[1])/4 - 3*boardoffsets[1])/2 - texthig/10);
    // text(players[i].name.slice(0, 8), texthig + gsz[0] + boardoffsets[0] + (i%2)*3*(gsz[0]-2*boardoffsets[1])/8, 3*(width - gsz[0])/4 + (int(i/2) + 1)*(height - 3*(gsz[0]-2*boardoffsets[1])/4 - 3*boardoffsets[1])/2);
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
    this.digit = int(random(5));
    // this.digit = 0;
    this.spincount--;
    if(this.spincount <= 0){
      if(this.digit == 0){
        this.movetype = "Move";
        mode = "MOVE";
        searchspaces();
      }else if(this.digit == 2){
        this.movetype = "Build";
        mode = "MOVE";
        searchbuild();
      }else{
        this.movetype = "Type " + str(this.digit);
        mode = "SPIN";
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

    image(randintsprites[this.digit], gsz[0] + boardoffsets[0], boardoffsets[1], 3*(gsz[0]-2*boardoffsets[1])/4, 3*(gsz[0]-2*boardoffsets[1])/4);
    fill(0, 0);
    rect(gsz[0] + boardoffsets[0], boardoffsets[1], 3*(gsz[0]-2*boardoffsets[1])/4, 3*(gsz[0]-2*boardoffsets[1])/4);
  }
}

function searchbuild(){
  availablespaces = [];
  // Search Left
  if(players[turn].x > 0){
    if (!searchwalls([players[turn].x - 1, players[turn].y])) {
      availablespaces.push([players[turn].x - 1, players[turn].y]);
    }
  }
  // Search Right
  if(players[turn].x < boardsize[0] - 1){
    if (!searchwalls([players[turn].x + 1, players[turn].y])) {
      availablespaces.push([players[turn].x + 1, players[turn].y]);
    }
  }
  // Search Top
  if(players[turn].y > 0){
    if (!searchwalls([players[turn].x, players[turn].y - 1])) {
      availablespaces.push([players[turn].x, players[turn].y - 1]);
    }
  }
  // Search Bottom
  if(players[turn].y < boardsize[1] - 1){
    if (!searchwalls([players[turn].x, players[turn].y + 1])) {
      availablespaces.push([players[turn].x, players[turn].y + 1]);
    }
  }
}

function searchwalls(arr){
  for (var k = 0; k < walls.length; k++) {
    if(walls[k][0] == arr[0] && walls[k][1] == arr[1]){
      return true;
    }
  }
  return false;
}

function searchavaspaces(arr){
  for (var i = 0; i < availablespaces.length; i++) {
    if (arr[0] == availablespaces[i][0] && arr[1] == availablespaces[i][1]) {
      return true;
    }
  }
  return false;
}

function searchspaces(){
  availablespaces = [];
  availablespaces.push([players[turn].x, players[turn].y]);
  var spaceswithrepeats = [];
  for (var i = 0; i < 2; i++) {
    var newspaces = []
    // console.log("Loop" + i);
    for (var j = 0; j < availablespaces.length; j++) {

      // Search Left
      if(availablespaces[j][0] > 0){
        if (!searchwalls([availablespaces[j][0] - 1, availablespaces[j][1]])) {
          newspaces.push([availablespaces[j][0] - 1, availablespaces[j][1]]);
        }
      }
      // Search Right
      if(availablespaces[j][0] < boardsize[0] - 1){
        if (!searchwalls([availablespaces[j][0] + 1, availablespaces[j][1]])) {
          newspaces.push([availablespaces[j][0] + 1, availablespaces[j][1]]);
        }
      }
      // Search Top
      if(availablespaces[j][1] > 0){
        if (!searchwalls([availablespaces[j][0], availablespaces[j][1] - 1])) {
          newspaces.push([availablespaces[j][0], availablespaces[j][1] - 1]);
        }
      }
      // Search Bottom
      if(availablespaces[j][1] < boardsize[1] - 1){
        if (!searchwalls([availablespaces[j][0], availablespaces[j][1] + 1])) {
          newspaces.push([availablespaces[j][0], availablespaces[j][1] + 1]);
        }
      }

      // Search Top Left
      if(availablespaces[j][0] > 0 && availablespaces[j][1] > 0){
        if(!(searchwalls([availablespaces[j][0] - 1, availablespaces[j][1]]) && searchwalls([availablespaces[j][0], availablespaces[j][1] - 1]))){
          if (!searchwalls([availablespaces[j][0] - 1, availablespaces[j][1] - 1])) {
            newspaces.push([availablespaces[j][0] - 1, availablespaces[j][1] - 1]);
          }
        }
      }

      // Search Top Right
      if(availablespaces[j][0] < boardsize[0] - 1 && availablespaces[j][1] > 0){
        if(!(searchwalls([availablespaces[j][0] + 1, availablespaces[j][1]]) && searchwalls([availablespaces[j][0], availablespaces[j][1] - 1]))){
          if (!searchwalls([availablespaces[j][0] + 1, availablespaces[j][1] - 1])) {
            newspaces.push([availablespaces[j][0] + 1, availablespaces[j][1] - 1]);
          }
        }
      }

      // Search Bottom Right
      if(availablespaces[j][0] < boardsize[0] - 1 && availablespaces[j][1] < boardsize[1] - 1){
        if(!(searchwalls([availablespaces[j][0] + 1, availablespaces[j][1]]) && searchwalls([availablespaces[j][0], availablespaces[j][1] + 1]))){
          if (!searchwalls([availablespaces[j][0] + 1, availablespaces[j][1] + 1])) {
            newspaces.push([availablespaces[j][0] + 1, availablespaces[j][1] + 1]);
          }
        }
      }

      // Search Bottom Left
      if(availablespaces[j][0] > 0 && availablespaces[j][1] < boardsize[1] - 1){
        if(!(searchwalls([availablespaces[j][0] - 1, availablespaces[j][1]]) && searchwalls([availablespaces[j][0], availablespaces[j][1] + 1]))){
          if (!searchwalls([availablespaces[j][0] - 1, availablespaces[j][1] + 1])) {
            newspaces.push([availablespaces[j][0] - 1, availablespaces[j][1] + 1]);
          }
        }
      }

    }
    spaceswithrepeats.push(newspaces);
    availablespaces = newspaces;
  }
  availablespaces = [];
  availablespaces.push([players[turn].x, players[turn].y]);
  for (var i = 0; i < spaceswithrepeats.length; i++) {
    for (var j = 0; j < spaceswithrepeats[i].length; j++) {
      if (!searchavaspaces(spaceswithrepeats[i][j])) {
        availablespaces.push(spaceswithrepeats[i][j]);
      }
    }
  }
  // console.log("Available", availablespaces);
}

function preload(){
  wallsprites = [];
  playersymbols = [];
  randintsprites = [];
  font = loadFont("data/Font/Brush.ttf");
  currentborder = loadImage("data/CurrentPlayer/HighlightPlayer.png");
  boardbackground = loadImage("data/Background/Background.png");
  for(var i = 1; i < 6; i++){
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

}

function setup(){
  // frameRate(2);
  // createCanvas(800, 600);
  createCanvas(document.body.clientHeight*2, document.body.clientHeight);
  // fullScreen();

  gsz = [height, height];
  do{
    var wid = int(prompt("Enter the board width, more than or equal to 5"));
  }while(!(wid >= 5));
  hig = wid;

  boardsize = [wid, hig];
  boardoffsets = [width/48, height/27];
  const PLAYERPRESET = [[0, 0], [wid - 1  , 0], [0, hig - 1], [wid - 1, hig - 1]];
  // const WALLPRESET = [[1,0], [0,1], [wid - 2, 0], [0, hig - 2], [1, hig - 1], [wid - 1, 1], [wid - 1, hig - 2], [wid - 2, hig - 1]];
  const WALLPRESET = [[int(wid/2), 0], [int(wid/2), hig - 1], [0, int(hig/2)], [wid - 1, int(hig/2)], [int(wid/2), int(hig/2)]];

  players = [];

  for(var i = 0; i < 4; i++){
    inp = prompt("Enter the name of the next player (Leave blank if all players are done)");
    if(inp == ""){
      break;
    }else{
      players.push(new player(inp,playersymbols[i] , PLAYERPRESET[i][0], PLAYERPRESET[i][1]));
    }
  }
  availablespaces = [];
  turn = 0;
  randint = new randomiser();
  mode = "SPIN";
  walls = WALLPRESET;
  boarddims = [(gsz[0] - boardoffsets[0])/boardsize[0], (gsz[1] - 2*boardoffsets[1])/boardsize[1]];
}

function draw(){
  background("#373737");

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
      fill(0, 80);
      rect((players[i].x)*boarddims[0] + boardoffsets[0], (players[i].y)*boarddims[1] + boardoffsets[1], boarddims[0], boarddims[1]);
      image(currentborder, (players[i].x)*boarddims[0] + boardoffsets[0], (players[i].y)*boarddims[1] + boardoffsets[1], boarddims[0], boarddims[1]);
    }
    fill(0);
    image(players[i].symbol, (players[i].x)*boarddims[0] + boardoffsets[0], (players[i].y)*boarddims[1] + boardoffsets[1], boarddims[0], boarddims[1]);
  }
  // console.log(availablespaces);
  for (var i = 0; i < availablespaces.length; i++) {
    fill(0, 64*(sin(frameCount/15)+1));
    // console.log(availablespaces[i]);
    rect((availablespaces[i][0])*boarddims[0] + boardoffsets[0], (availablespaces[i][1])*boarddims[1] + boardoffsets[1], boarddims[0], boarddims[1]);
  }

  if(mode == "SPIN" && frameCount%3 == 0){
    randint.random();
  }
  displaypnames();
  randint.show();
}

function gettile(){
  for (var i = 0; i < boardsize[0]; i++) {
    for (var j = 0; j < boardsize[1]; j++) {
      if(mouseX > i*boarddims[0] + boardoffsets[0] && mouseX < (i+1)*boarddims[0] + boardoffsets[0] && mouseY > j*boarddims[1] + boardoffsets[1] && mouseY < (j+1)*boarddims[1] + boardoffsets[1]){
        return [i, j];
      }
    }
  }
  return -1;
}


function mousePressed(){
  if(mode == "MOVE"){
    if(randint.digit == 0){
      var tile = gettile();
      console.log(tile);
      for (var i = 0; i < players.length; i++) {
        if(tile[0] == players[i].x && tile[1] == players[i].y && turn != i){
          tile = -1;
          break;
        }
      }
      if(tile != -1+ boardoffsets[1] && abs(players[turn].x - tile[0]) <= 2 && abs(players[turn].y - tile[1]) <= 2){
        if(searchavaspaces(tile)){
          players[turn].x = tile[0];
          players[turn].y = tile[1];
          proceed();
        }
      }
    }
    if(randint.digit == 2){
      var tile = gettile();
      for (var i = 0; i < players.length; i++) {
        if(tile[0] == players[i].x && tile[1] == players[i].y && turn != i){
          tile = -1;
          break;
        }
      }
      if(searchavaspaces(tile)){
        walls.push(tile);
        proceed();
      }
      if(availablespaces.length <= 0 &&  tile[0] == players[turn].x && tile[1] == players[turn].y){
        proceed();
      }
    }
  }
}
