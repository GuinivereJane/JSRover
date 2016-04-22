

function Rover(x, y, facing) {
  this.x = x;
  this.y = y;
  this.facing = facing;;
  this._north = 1;
  this._east = 2;
  this._south = 3;
  this._west = 4;
}

Rover.prototype.lookBeforeYouLeap = function() {
  switch (this.facing) {
    case this._north:
      return [this.x,this.y+1];
    case this._east:
      return [this.x+1,this.y];
    case this._south:
      return [this.x,this.y-1];
    case this._west:
      return [this.x-1,this.y];
      break;
  }
};
Rover.prototype.move = function () {
  switch (this.facing) {
    case this._north:
      this.y++;
      break;
    case this._east:
      this.x++;
      break;
    case this._south:
      this.y--;
      break;
    case this._west:
      this.x--;
    break;
  }
};

Rover.prototype.turn = function (direction) {
  switch (direction) {
    case 'R':
      this.facing === 4 ? this.facing = 1 : this.facing++;
      break;
    case 'L':
      this.facing === 1 ? this.facing = 4 : this.facing--;
    break;
  }
};

Rover.prototype.statusReport = function () {
  var facingOutput;
  switch (this.facing) {
    case this._north:
      facingOutput = 'N';
      break;
    case this._east:
      facingOutput = 'E';
      break;
    case this._south:
      facingOutput = 'S';
      break;
    case this._west:
      facingOutput = 'N';
      break;
  }
  console.log(this.x + ' '  + this.y + ' ' + facingOutput);
};

function Plateau(x, y, rovers){
  this.x = x;
  this.y = y;
  this.rovers =[];
}

Plateau.prototype.addRover = function (rover) {
  this.rovers.push(rover);
};

Plateau.prototype.isThereARover = function (coordArray) {
  var coordX = coordArray[0];
  var coordY = coordArray[1];
  for (x=0;x < this.rovers.length;x++){
    var xCordinateMatch = this.rovers[x].x === coordX;
    var yCordinateMatch = this.rovers[x].y === coordY;
    if (xCordinateMatch && yCordinateMatch) {
      return true;
    }
  }
  return false;
};

Plateau.prototype.isCoordOffPlateau = function (coordArray) {
  var coordX = coordArray[0];
  var coordY = coordArray[1];
  function outsideMinimumBounds(){
    if (coordX < 0 || coordY < 0){return true;}
    return false;
  }
  function outsideMaximumBounds(x,y){
    if (coordX > x || coordY > y){return true;}
    return false;
  }
  if (outsideMinimumBounds() || outsideMaximumBounds(this.x,this.x)){
    return true;
  }
  return false;
};

function MissionControl(initialRoverStates, instructionSets, plateau){
  initialRoverStates = {};
  instructionSets = [];
  plateau = new Plateau();
}


MissionControl.prototype.intro = function () {
  console.log("Welcome to mission control, you will now set up your plateau and your rovers");
  console.log("Today we will be deploying rovers to preset cordinates on a premade pateau");
  console.log("with premade move commands.  The instruction sets are");
  console.log('plateau size: 5 5');
  console.log('first rover :1 2 N');
  console.log('first move orders: LMLMLMLMM ');
  console.log('second rover: 3 3 E  ');
  console.log('second move orders: MMRMMRMRRM');
};

MissionControl.prototype.buildThePlateau = function (x,y) {
  this.plateau = new Plateau(5,5);
};

MissionControl.prototype.createRover = function (x, y, facing) {
  this.plateau.addRover(new Rover(x,y,facing));
};

MissionControl.prototype.sendInstructions = function (instructionSets) {
  for (var roverIndex = 0; roverIndex < this.plateau.rovers.length; roverIndex++){
    var currentInstruction = instructionSets[roverIndex].split('');
    for (var instructionIndex = 0; instructionIndex < currentInstruction.length; instructionIndex++){
      switch (currentInstruction[instructionIndex]) {
        case 'L':
        case 'R':
          this.plateau.rovers[roverIndex].turn(currentInstruction[instructionIndex]);
          break;
        case 'M':
          var nextMove = this.plateau.rovers[roverIndex].lookBeforeYouLeap();
          if (this.plateau.isCoordOffPlateau(nextMove)){break;}
          if (this.plateau.isThereARover(nextMove)){break;}
          this.plateau.rovers[roverIndex].move();
          break;
      }
    }
  }
};

MissionControl.prototype.go = function () {
  this.intro();
  this.buildThePlateau(5,5);

  this.createRover(1,2,1);
  this.createRover(3,3,2);
  var instructionSets = ['LMLMLMLMM','MMRMMRMRRM'];
  this.sendInstructions(instructionSets);
  this.plateau.rovers[0].statusReport();
  this.plateau.rovers[1].statusReport();

};
