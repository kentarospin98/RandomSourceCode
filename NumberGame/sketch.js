var walls;
var players;
var boardsize;
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
var pushedplayer;
var sounds;
var pushimage;
var brokenwallsimage;
var brokenwall;
var pushstarter;
var curreentscreen;
var phase;
var endgamecurtaintime;
var endscreenimages;
var dead;

function displaypnames(){
  fill(255);
  rect(height + boardoffsets[0], 3*(height-2*boardoffsets[1])/4 + 2*boardoffsets[1], 3*(height-2*boardoffsets[1])/4, height - 3*(height-2*boardoffsets[1])/4 - 3*boardoffsets[1]);
  for (var i = 0; i < players.length; i++) {
    var name = players[i].name.slice(0, 6) + "  ";
    var symbol = players[i].symbol;

    for (var j = 0; j < players[i].life; j++) {
      name = name + "!"
    }

    var texthig = 5*(height - 3*(height-2*boardoffsets[1])/4 - 3*boardoffsets[1])/16;

    fill(0);
    textAlign(LEFT, TOP);
    textSize(texthig);
    textFont(font);
    // image(symbol, height + boardoffsets[0] + (i%1)*3*(height-2*boardoffsets[1])/8, );
    image(symbol,
          height + boardoffsets[0] + (i%2)*3*(height-2*boardoffsets[1])/8,
          3*(height-2*boardoffsets[1])/4 + (int(i/2) + 1)*(height - 3*(height-2*boardoffsets[1])/4 - 3*boardoffsets[1])/2,
          texthig,
          texthig);
    text(name,
         height + boardoffsets[0] + (i%2)*3*(height-2*boardoffsets[1])/8 + texthig,
         3*(height-2*boardoffsets[1])/4 + (int(i/2) + 1)*(height - 3*(height-2*boardoffsets[1])/4 - 3*boardoffsets[1])/2 - texthig/10);
    // text(players[i].name.slice(0, 8), texthig + height + boardoffsets[0] + (i%2)*3*(height-2*boardoffsets[1])/8, 3*(width - height)/4 + (int(i/2) + 1)*(height - 3*(height-2*boardoffsets[1])/4 - 3*boardoffsets[1])/2);
  }
}

function proceed(){
  turn = (turn + 1)%players.length;
  mode = "SPIN"
}

function hit(player, sendback=true){
  player.life--;
  if(player.life == 0){
    for (var i = 0; i < players.length; i++) {
      if (players[i].name == player.name) {
        dead.push(player);
        players.splice(i, 1);
        sounds[2].play();
        break;
      }
    }
  }
  if (sendback){
    player.x = player.spawn[0];
    player.y = player.spawn[1];
  }
  if (players.length <= 1) {
    curreentscreen = "ENDGAME";
  }
}

function player(name, symbol, x, y){
  this.name = name;
  this.symbol = symbol;
  this.life = 3;
  this.x = x;
  this.y = y;
  this.spawn = [x, y]
};

function randomiser(){
  this.digit = int(random(5));
  this.spincount = 6;

  this.random = function(){
    this.digit = int(random(5));
            // console.log(this.digit);
    // this.digit = 0;
    this.spincount--;
    if(this.spincount <= 0){
              // console.log(this.digit, "Done");
      if(this.digit == 0){
        mode = "MOVE";
        searchspaces();
        this.spincount = 6;
      }else if (this.digit == 1) {
        mode = "MOVE";
        searchshoot();
        this.spincount = 6;
      }else if(this.digit == 2){
        mode = "MOVE";
        searchbuildbreak();
        this.spincount = 6;
      }else if(this.digit == 3){
        mode = "MOVE";
        searchbuildbreak(false);
        this.spincount = 6;
      }else if(this.digit == 4){
        mode = "MOVE"
        searchspaces(1);
      }else{
        mode = "SPIN";
        this.spincount = 6;
      }
      if(searchwalls([players[turn].x, players[turn].y])){
        availablespaces = [[players[turn].x, players[turn].y]];
      }
      return true;
    }
  }

  this.show = function(){
    // fill(255);
    // textSize(boarddims[0]*2);
    // textAlign(CENTER, TOP);
    // text(this.digit, (height + width)/2, 0);
    // text(this.movetype, (height + width)/2, boarddims[0]*2);
    if(mode == "PUSH"){
      image(pushimage, height   + boardoffsets[0], boardoffsets[1], 3*(height-2*boardoffsets[1])/4, 3*(height-2*boardoffsets[1])/4);
    }else{
      image(randintsprites[this.digit], height   + boardoffsets[0], boardoffsets[1], 3*(height-2*boardoffsets[1])/4, 3*(height-2*boardoffsets[1])/4);
    }
    fill(0, 0);
    rect(height + boardoffsets[0], boardoffsets[1], 3*(height-2*boardoffsets[1])/4, 3*(height-2*boardoffsets[1])/4);
  }
}

function searchshoot(){
  availablespaces = [];
  tile = [players[turn].x, players[turn].y]
  while (true) {
    // console.log(tile);
    if (tile[0] < boardsize[0] - 1) {
      if(!searchwalls([tile[0] + 1, tile[1]])){
        if (searchplayers([tile[0] + 1, tile[1]])) {
          availablespaces.push([tile[0] + 1, tile[1]])
          break;
        }else {
          tile = [tile[0] + 1, tile[1]];
          // console.log(tile);
          continue;
        }
      }else {
        break;
      }
    }else {
      break;
    }
  }

  tile = [players[turn].x, players[turn].y]
  while (true) {
    // console.log(tile);
    if (tile[0] > 0) {
      if(!searchwalls([tile[0] - 1, tile[1]])){
        if (searchplayers([tile[0] - 1, tile[1]])) {
          availablespaces.push([tile[0] - 1, tile[1]])
          break;
        }else {
          tile = [tile[0] - 1, tile[1]];
          // console.log(tile);
          continue;
        }
      }else {
        break;
      }
    }else {
      break;
    }
  }

  tile = [players[turn].x, players[turn].y]
  while (true) {
    // console.log(tile);
    if (tile[1] < boardsize[1] - 1) {
      if(!searchwalls([tile[0], tile[1] + 1])){
        if (searchplayers([tile[0], tile[1] + 1])) {
          availablespaces.push([tile[0], tile[1] + 1])
          break;
        }else {
          tile = [tile[0], tile[1] + 1];
          // console.log(tile);
          continue;
        }
      }else {
        break;
      }
    }else {
      break;
    }
  }

  tile = [players[turn].x, players[turn].y]
  while (true) {
    // console.log(tile);
    if (tile[1] > 0) {
      if(!searchwalls([tile[0], tile[1] - 1])){
        if (searchplayers([tile[0], tile[1] - 1])) {
          availablespaces.push([tile[0], tile[1] - 1])
          break;
        }else {
          tile = [tile[0], tile[1] - 1];
          // (tile);
          continue;
        }
      }else {
        break;
      }
    }else {
      break;
    }
  }

  tile = [players[turn].x, players[turn].y]
  while (true) {
        (tile);
    if (tile[1] > 0 && tile[0] > 0) {
      if(!searchwalls([tile[0] - 1, tile[1] - 1])){
        if (!(searchwalls([tile[0], tile[1] - 1]) && searchwalls([tile[0] - 1, tile[1]]))) {
          if (searchplayers([tile[0] - 1 , tile[1] - 1])) {
            availablespaces.push([tile[0] - 1, tile[1] - 1])
            break;
          }else {
            tile = [tile[0] - 1, tile[1] - 1];
            // console.log(tile);
            continue;
          }
        }else {
          break;
        }
      }else {
        break
      }
    }else {
      break;
    }
  }

  tile = [players[turn].x, players[turn].y]
  while (true) {
    // console.log(tile);
    if (tile[1] > 0 && tile[0] < boardsize[0] - 1) {
      if(!searchwalls([tile[0] + 1, tile[1] - 1])){
                // console.log("Shoot test", !(searchwalls([tile[0] - 1, tile[1]]) && searchwalls([tile[0], tile[1] + 1])));
        if (!(searchwalls([tile[0], tile[1] - 1]) && searchwalls([tile[0] + 1, tile[1]]))) {
          if (searchplayers([tile[0] + 1 , tile[1] - 1])) {
            // console.log(tile, "In");
            availablespaces.push([tile[0] + 1, tile[1] - 1])
            break;
          }else {
            tile = [tile[0] + 1, tile[1] - 1];
            // console.log(tile, "Out");
            continue;
          }
        }else {
          break;
        }
      }else {
        break;
      }
    }else {
      break;
    }
  }

  tile = [players[turn].x, players[turn].y]
  while (true) {
    // console.log(tile);
    if (tile[1] < boardsize[1] - 1 && tile[0] > 0) {
      if(!searchwalls([tile[0] - 1, tile[1] + 1])){
        if (!(searchwalls([tile[0] - 1, tile[1]]) && searchwalls([tile[0], tile[1] + 1]))) {
          if (searchplayers([tile[0] - 1 , tile[1] + 1])) {
            availablespaces.push([tile[0] - 1, tile[1] + 1])
            break;
          }else {
            tile = [tile[0] - 1, tile[1] + 1];
            // console.log(tile);
            continue;
          }
        }else {
          break;
        }
      }else {
        break;
      }
    }else {
      break;
    }
  }

  tile = [players[turn].x, players[turn].y]
  while (true) {
    if (tile[1] < boardsize[1] - 1 && tile[0] < boardsize[0] - 1) {
      if(!searchwalls([tile[0] + 1, tile[1] + 1])){
        if (!(searchwalls([tile[0] + 1, tile[1]]) && searchwalls([tile[0], tile[1] + 1]))) {
          if (searchplayers([tile[0] + 1 , tile[1] + 1])) {
            availablespaces.push([tile[0] + 1, tile[1] + 1])
            break;
          }else {
            tile = [tile[0] + 1, tile[1] + 1];
            continue;
          }
        }else {
          break;
        }
      }else {
        break;
      }
    }else {
      break;
    }
  }
}

function searchbuildbreak(build=true){
  availablespaces = [];
  // Search Left
  if(players[turn].x > 0){
    if (searchwalls([players[turn].x - 1, players[turn].y]) ? !build : build) {
      availablespaces.push([players[turn].x - 1, players[turn].y]);
    }
  }
  // Search Right
  if(players[turn].x < boardsize[0] - 1){
    if (searchwalls([players[turn].x + 1, players[turn].y])? !build : build) {
      availablespaces.push([players[turn].x + 1, players[turn].y]);
    }
  }
  // Search Top
  if(players[turn].y > 0){
    if (searchwalls([players[turn].x, players[turn].y - 1])? !build : build) {
      availablespaces.push([players[turn].x, players[turn].y - 1]);
    }
  }
  // Search Bottom
  if(players[turn].y < boardsize[1] - 1){
    if (searchwalls([players[turn].x, players[turn].y + 1])? !build : build) {
      availablespaces.push([players[turn].x, players[turn].y + 1]);
    }
  }

  // Search Top Left
  if(players[turn].x > 0 && players[turn].y > 0){
    if(!(searchwalls([players[turn].x - 1, players[turn].y]) && searchwalls([players[turn].x, players[turn].y - 1]))){
      if (searchwalls([players[turn].x - 1, players[turn].y - 1]) ? !build : build) {
        availablespaces.push([players[turn].x - 1, players[turn].y - 1]);
      }
    }
  }

  // Search Top Right
  if(players[turn].x < boardsize[0] - 1 && players[turn].y > 0){
    if(!(searchwalls([players[turn].x + 1, players[turn].y]) && searchwalls([players[turn].x, players[turn].y - 1]))){
      if (searchwalls([players[turn].x + 1, players[turn].y - 1]) ? !build : build) {
        availablespaces.push([players[turn].x + 1, players[turn].y - 1]);
      }
    }
  }

  // Search Bottom Right
  if(players[turn].x < boardsize[0] - 1 && players[turn].y < boardsize[1] - 1){
    if(!(searchwalls([players[turn].x + 1, players[turn].y]) && searchwalls([players[turn].x, players[turn].y + 1]))){
      if (searchwalls([players[turn].x + 1, players[turn].y + 1]) ? !build : build) {
        availablespaces.push([players[turn].x + 1, players[turn].y + 1]);
      }
    }
  }

  // Search Bottom Left
  if(players[turn].x > 0 && players[turn].y < boardsize[1] - 1){
    if(!(searchwalls([players[turn].x - 1, players[turn].y]) && searchwalls([players[turn].x, players[turn].y + 1]))){
      if (searchwalls([players[turn].x - 1, players[turn].y + 1]) ? !build : build) {
        availablespaces.push([players[turn].x - 1, players[turn].y + 1]);
      }
    }
  }

  var newavaspaces = []
  for (var i = 0; i < availablespaces.length; i++) {
    if (build ? !searchplayers(availablespaces[i]) : true) {
      newavaspaces.push(availablespaces[i]);
    }
  }
  availablespaces = newavaspaces;
}

function searchplayers(arr, except=-1, getplayer=false){
  for (var k = 0; k < players.length; k++) {
    var player = players[k];
    if(player.x == arr[0] && player.y == arr[1] && !(except == k)){
      if (getplayer == true) {
        return player;
      }else{
        return true;
      }
    }
  }
  return false;
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

function searchspaces(steps=2, player=players[turn], allowwalls=false){
  availablespaces = [];
  availablespaces.push([player.x, player.y]);
  var spaceswithrepeats = [];
  for (var i = 0; i < steps; i++) {
    var newspaces = []
    // console.log("Loop" + i);
    for (var j = 0; j < availablespaces.length; j++) {

      // Search Left
      if(availablespaces[j][0] > 0){
        if (!searchwalls([availablespaces[j][0] - 1, availablespaces[j][1]]) || allowwalls) {
          newspaces.push([availablespaces[j][0] - 1, availablespaces[j][1]]);
        }
      }
      // Search Right
      if(availablespaces[j][0] < boardsize[0] - 1){
        if (!searchwalls([availablespaces[j][0] + 1, availablespaces[j][1]]) || allowwalls) {
          newspaces.push([availablespaces[j][0] + 1, availablespaces[j][1]]);
        }
      }
      // Search Top
      if(availablespaces[j][1] > 0){
        if (!searchwalls([availablespaces[j][0], availablespaces[j][1] - 1]) || allowwalls) {
          newspaces.push([availablespaces[j][0], availablespaces[j][1] - 1]);
        }
      }
      // Search Bottom
      if(availablespaces[j][1] < boardsize[1] - 1){
        if (!searchwalls([availablespaces[j][0], availablespaces[j][1] + 1]) || allowwalls) {
          newspaces.push([availablespaces[j][0], availablespaces[j][1] + 1]);
        }
      }

      // Search Top Left
      if(availablespaces[j][0] > 0 && availablespaces[j][1] > 0){
        if(!(searchwalls([availablespaces[j][0] - 1, availablespaces[j][1]]) && searchwalls([availablespaces[j][0], availablespaces[j][1] - 1]))){
          if (!searchwalls([availablespaces[j][0] - 1, availablespaces[j][1] - 1]) || allowwalls) {
            newspaces.push([availablespaces[j][0] - 1, availablespaces[j][1] - 1]);
          }
        }
      }

      // Search Top Right
      if(availablespaces[j][0] < boardsize[0] - 1 && availablespaces[j][1] > 0){
        if(!(searchwalls([availablespaces[j][0] + 1, availablespaces[j][1]]) && searchwalls([availablespaces[j][0], availablespaces[j][1] - 1]))){
          if (!searchwalls([availablespaces[j][0] + 1, availablespaces[j][1] - 1]) || allowwalls) {
            newspaces.push([availablespaces[j][0] + 1, availablespaces[j][1] - 1]);
          }
        }
      }

      // Search Bottom Right
      if(availablespaces[j][0] < boardsize[0] - 1 && availablespaces[j][1] < boardsize[1] - 1){
        if(!(searchwalls([availablespaces[j][0] + 1, availablespaces[j][1]]) && searchwalls([availablespaces[j][0], availablespaces[j][1] + 1]))){
          if (!searchwalls([availablespaces[j][0] + 1, availablespaces[j][1] + 1]) || allowwalls) {
            newspaces.push([availablespaces[j][0] + 1, availablespaces[j][1] + 1]);
          }
        }
      }

      // Search Bottom Left
      if(availablespaces[j][0] > 0 && availablespaces[j][1] < boardsize[1] - 1){
        if(!(searchwalls([availablespaces[j][0] - 1, availablespaces[j][1]]) && searchwalls([availablespaces[j][0], availablespaces[j][1] + 1]))){
          if (!searchwalls([availablespaces[j][0] - 1, availablespaces[j][1] + 1]) || allowwalls) {
            newspaces.push([availablespaces[j][0] - 1, availablespaces[j][1] + 1]);
          }
        }
      }

    }
    spaceswithrepeats.push(newspaces);
    availablespaces = newspaces;
  }
  availablespaces = [];
  availablespaces.push([player.x, player.y]);
  for (var i = 0; i < spaceswithrepeats.length; i++) {
    for (var j = 0; j < spaceswithrepeats[i].length; j++) {
      if (!searchavaspaces(spaceswithrepeats[i][j])) {
        if (!(pushstarter.x == spaceswithrepeats[i][j][0] && pushstarter.y == spaceswithrepeats[i][j][1])) {
          availablespaces.push(spaceswithrepeats[i][j]);
        }
      }
    }
  }
  // console.log("Available", availablespaces);
}

function preload(){
  wallsprites = [];
  playersymbols = [];
  randintsprites = [];
  sounds = [];
  brokenwallsimage = [];
  endscreenimages = [];
  pushimage = loadImage("data/Push/PushTextBox.png");
  font = loadFont("data/Font/Brush.ttf");
  currentborder = loadImage("data/CurrentPlayer/HighlightPlayer.png");
  boardbackground = loadImage("data/Background/Background.png");
  /**
  0- Break
  1- Build
  2- Die
  3- Jump
  4- Move
  5- Shoot
  6- Celebration
  **/
  for (var i = 0; i < 7; i++) {
    sounds.push(loadSound("data/Sounds/Sound" + str(i) + ".flac"));
  }
  for (var i = 1; i < 5; i++) {
    brokenwallsimage.push(loadImage("data/Walls/BrokenWall" + i + ".png"));
  }
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
  for (var i = 0; i < 4; i++) {
    endscreenimages.push(loadImage("data/Endscreen/Place" + str(i) + ".png"));
  }
}

function setup(){
  // frameRate(2);
  // createCanvas(800, 600);
  createCanvas(document.body.clientHeight*2, document.body.clientHeight, P2D);
  // fullScreen();

  // gsz = [height, height];
  const DIFFICULTY = [[5],[7],[9],[11]]
  var inp;
  do{
    inp = int(prompt("Select a Board Size Setting. Enter The number\n1 for Tiny\n2 for Medium\n3 for Huge\n4 for Insane"));
  }while(!(inp > 0 && inp < 5));
  hig = wid = DIFFICULTY[inp - 1];

  boardsize = [wid, hig];
  boardoffsets = [width/48, height/27];
  const PLAYERPRESET = [[0, 0], [wid - 1  , 0], [0, hig - 1], [wid - 1, hig - 1]];
  // const WALLPRESET = [[1,0], [0,1], [wid - 2, 0], [0, hig - 2], [1, hig - 1], [wid - 1, 1], [wid - 1, hig - 2], [wid - 2, hig - 1]];
  const WALLPRESET = [[int(wid/2), 0], [int(wid/2), hig - 1], [0, int(hig/2)], [wid - 1, int(hig/2)], [int(wid/2), int(hig/2)]];

  players = [];
  dead = [];

  for(var i = 0; i < 4; i++){
    do{
      inp = prompt("Enter the name of player " + str(i + 1) + " (Leave blank if all players are done, Player names cannot be repeated)");
    }while(searchname(inp));
    if(inp == ""){
      break;
    }else{
      players.push(new player(inp,playersymbols[i] , PLAYERPRESET[i][0], PLAYERPRESET[i][1]));
    }
  }
  availablespaces = [];
  pushstarter = -1;
  turn = 0;
  randint = new randomiser();
  mode = "SPIN";
  walls = WALLPRESET;
  brokenwall = -1;
  boarddims = [(height - boardoffsets[0])/boardsize[0], (height - 2*boardoffsets[1])/boardsize[1]];
  curreentscreen = "GAME";
  phase = 0;
  endgamecurtaintime = 0;
}

function searchname(inp){
  for (var i = 0; i < players.length; i++) {
    if (players[i].name == inp) {
      return true;
    }
  }
  return false;
}

function draw(){
  if (curreentscreen == "GAME") {
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
    if(brokenwall != -1 && brokenwall[1] + 10 >= frameCount){
      image(brokenwallsimage[int(random(brokenwallsimage.length))], brokenwall[0][0]*boarddims[0] + boardoffsets[0], brokenwall[0][1]*boarddims[1] + boardoffsets[1], boarddims[0], boarddims[1]);
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
      if(players[i] != pushedplayer){
        image(players[i].symbol, (players[i].x)*boarddims[0] + boardoffsets[0], (players[i].y)*boarddims[1] + boardoffsets[1], boarddims[0], boarddims[1]);
      }
    }
    // console.log(availablespaces);
    if(mode == "MOVE" || mode == "PUSH"){
      for (var i = 0; i < availablespaces.length; i++) {
        fill(0, 64*(sin(frameCount/15)+1));
        // console.log(availablespaces[i]);
        rect((availablespaces[i][0])*boarddims[0] + boardoffsets[0], (availablespaces[i][1])*boarddims[1] + boardoffsets[1], boarddims[0], boarddims[1]);
      }
    }
    if(mode == "SPIN" && frameCount%5 == 0){
      randint.random();
    }
    displaypnames();
    randint.show();
  }
  else if (curreentscreen == "ENDGAME") {
    if (phase == 0) {
      strokeWeight(0);
      fill(color("#DDDDDD"));
      rect(0, 0, width/2 * endgamecurtaintime/30, height);
      rect(width - width/2 * endgamecurtaintime/30, 0, width/2 * endgamecurtaintime/30, height);
      endgamecurtaintime++;
      if (endgamecurtaintime >= 30) {
        sounds[6].play();
        phase = 1;
      }
    }else if (phase == 1) {
      background("#DDDDDD");
      imageMode(CENTER);
      // for (var i = 0; i < endscreenimages.length; i++) {
      //   image(endscreenimages[i], width/2, height/2, height/2, height/2);
      // }
      image(endscreenimages[0], width/2, height/2, height/2, height/2);
      image(endscreenimages[1], width/2, height/2, height/2, height/2);
      image(players[0].symbol, width/2, height*7/20, height/18, height/18)
      if (dead.length >= 1) {
        image(endscreenimages[2], width/2, height/2, height/2, height/2);
        image(dead[dead.length - 1].symbol, width/2 - height*7/64, height*17/40, height/18, height/18)
        if (dead.length >= 2) {
          image(endscreenimages[3], width/2, height/2, height/2, height/2);
          image(dead[dead.length - 2].symbol, width/2 + height*7/64, height*17/40, height/18, height/18)
        }
      }
      fill(0);
      textSize(height/6);
      textAlign(CENTER);
      text(players[0].name, width/2, 0);
      text("is the Winner!", width/2, height/7);
    }
  }
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
  var tile = gettile();
  if (curreentscreen == "GAME") {
    if(mode == "MOVE"){
      if(!searchwalls([players[turn].x, players[turn].y])){
        if(randint.digit == 0 || randint.digit == 4){
          var onplayer = false;
          for (var i = 0; i < players.length; i++) {
            if(tile[0] == players[i].x && tile[1] == players[i].y && turn != i && !searchwalls([players[i].x, players[i].y])){
              pushedplayer = pushstarter = players[i];
              onplayer = true;
              break;
            }
          }
          if(tile != -1){
            if(searchavaspaces(tile)){
              if (onplayer) {
                searchspaces(1, pushedplayer, true);
                players[turn].x = tile[0];
                players[turn].y = tile[1];
                mode = "PUSH";
                sounds[4].play();
              }else{
                players[turn].x = tile[0];
                players[turn].y = tile[1];
                sounds[4].play();
                proceed();
              }
            }
          }
        }
        if(randint.digit == 1){
          if (searchavaspaces(tile)) {
            for (var i = 0; i < players.length; i++) {
              if (players[i].x == tile[0] && players[i].y == tile[1]) {
                if (players[i].life > 1) {
                  sounds[5].play();
                }
                hit(players[i]);
                proceed();
                break;
              }
            }
          }
          if (availablespaces.length == 0 && tile[0] == players[turn].x && tile[1] == players[turn].y) {
            proceed();
          }
        }
        if(randint.digit == 2){
          if(searchavaspaces(tile)){
            walls.push(tile);
            sounds[1].play();
            proceed();
          }
          if(availablespaces.length == 0 &&  tile[0] == players[turn].x && tile[1] == players[turn].y){
            proceed();
          }
        }
        if(randint.digit == 3){
          searchbuildbreak(false);
          if(searchavaspaces(tile)){
            for (var i = 0; i < walls.length; i++) {
              if(walls[i][0] == tile[0] && walls[i][1] == tile[1]){
                brokenwall = [walls[i], frameCount];
                player = searchplayers(walls[i], void 0 , returnplayer=true);
                if (player != false && random(1) < 0.75) {
                  hit(player, sendback=false);
                }
                walls.splice(i, 1);
              }
            }
            sounds[0].play();
            proceed();
          }
          if(availablespaces.length == 0 &&  tile[0] == players[turn].x && tile[1] == players[turn].y){
            proceed();
          }
        }
      }else if(randint.digit == 3){
        if(searchwalls([players[turn].x, players[turn].y])){
          availablespaces = [[players[turn].x, players[turn].y]];
        }
        if(searchavaspaces(tile)){
          for (var i = 0; i < walls.length; i++) {
            if(walls[i][0] == tile[0] && walls[i][1] == tile[1]){
              brokenwall = [walls[i], frameCount];
              player = searchplayers(walls[i], void 0, returnplayer=true);
              if (player != false && random(1) < 0.75) {
                hit(player, sendback=false);
              }
              walls.splice(i, 1);
            }
          }
          sounds[0].play();
          proceed();
        }
        if(availablespaces.length == 0 &&  tile[0] == players[turn].x && tile[1] == players[turn].y){
          proceed();
        }
      }
      else if(tile[0] == players[turn].x && tile[1] == players[turn].y){
        proceed();
      }
    }else if(mode == "PUSH"){
      if(tile != -1){
        var newpushedplayer;
        for (var i = 0; i < players.length; i++) {
          if(tile[0] == players[i].x && tile[1] == players[i].y && turn != i){
            newpushedplayer = players[i];
            onplayer = true;
            break;
          }
        }
        if(searchavaspaces(tile)){
          if (onplayer) {
            searchspaces(1, newpushedplayer, true);
            pushedplayer.x = tile[0];
            pushedplayer.y = tile[1];
            if (searchwalls(tile)) {
              if (random(1) < 0.25) {
                hit(pushedplayer, sendback=false);
              }
            }
            // players.push(pushedplayer);
            pushedplayer = newpushedplayer;
            mode = "PUSH";
          }else{
            if (searchwalls(tile)) {
              if (random(1) < 0.25) {
                 hit(pushedplayer, sendback=false);
              }
            }
            pushedplayer.x = tile[0];
            pushedplayer.y = tile[1];
            // players.push(pushedplayer);
            pushedplayer = pushstarter = -1;
            proceed();
          }
        }
      }
    }
  }
}
