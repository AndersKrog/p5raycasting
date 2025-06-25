const TILE_SIZE = 64;
const MAP_NUM_ROWS = 11;
const MAP_NUM_COLS = 15;

const WINDOW_WIDTH = MAP_NUM_COLS * TILE_SIZE;
const WINDOW_HEIGHT = MAP_NUM_ROWS * TILE_SIZE;

const FOV_ANGLE = 60 * (Math.PI/180);
const WALL_STRIP_WIDTH = 1;
const NUM_RAYS = WINDOW_WIDTH/WALL_STRIP_WIDTH;

const MINIMAP_SCALE_FACTOR = 0.25;

class Map {
    constructor() {
        this.grid = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
            [1, 2, 2, 2, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
    }
	hasWallAt(x,y){
		if (x < 0 || x > WINDOW_WIDTH || y < 0 || y > WINDOW_HEIGHT){
			return true;
		}
		var mapGridIndexX = Math.floor(x/TILE_SIZE);
		var mapGridIndexY = Math.floor(y/TILE_SIZE);
		
		return this.grid[mapGridIndexY][mapGridIndexX];
	}
    render() {
        for (var i = 0; i < MAP_NUM_ROWS; i++) {
            for (var j = 0; j < MAP_NUM_COLS; j++) {
                var tileX = j * TILE_SIZE; 
                var tileY = i * TILE_SIZE;
				
				
                var tileColor;
				
				if (this.grid[i][j] !=0){
					if (this.grid[i][j] == 1)
						tileColor = "#222";
					if (this.grid[i][j] == 2)
						tileColor = "#2f2";
				} else{
					tileColor = "#fff";
				}
				
				// = this.grid[i][j] == 1 ? "#222" : "#fff";
                //stroke("#222");
                fill(tileColor);
                rect(
				MINIMAP_SCALE_FACTOR*tileX,
				MINIMAP_SCALE_FACTOR*tileY,
				MINIMAP_SCALE_FACTOR* TILE_SIZE,
				MINIMAP_SCALE_FACTOR* TILE_SIZE);
            }
        }
    }
}

class Player{
	constructor(){
		this.x = WINDOW_WIDTH/2;
		this.y = WINDOW_HEIGHT/2;
		this.radius = 4;
		this.turnDirection = 0;	//-1:left, 1:right
		this.walkDirection = 0;	//-1:backwards, 1:forwards
		this.rotationAngle = Math.PI /2;
		this.moveSpeed = 4.0;
		this.rotationSpeed = 3 * (Math.PI/180);	//degrees per frame
	}
	update(){
		this.rotationAngle += this.turnDirection*this.rotationSpeed;
		
		var moveStep = this.walkDirection*this.moveSpeed;
		
		
		var newX = this.x + Math.cos(this.rotationAngle) * moveStep
		var newY = this.y + Math.sin(this.rotationAngle) * moveStep;
		
		if (grid.hasWallAt(newX,newY) == 0 ){	
			this.x = newX;
			this.y = newY;
		}
		
	}
	render(){
		noStroke();
		fill("red");
		circle(
		MINIMAP_SCALE_FACTOR*this.x,
		MINIMAP_SCALE_FACTOR*this.y,
		MINIMAP_SCALE_FACTOR*this.radius);
		//stroke("red");
		//line(this.x,this.y,this.x + Math.cos(this.rotationAngle)*30,this.y + Math.sin(this.rotationAngle)*30)
	}
}

class Ray{
	constructor(rayAngle){
		this.rayAngle = normalizeAngle(rayAngle);
		this.wallHitX = 0;
		this.wallHitY = 0;
		this.distance = 0;
		this.wasHitVertical = false;
		this.wallHitTile = 0;
		this.isRayFacingDown = this.rayAngle > 0 && this.rayAngle < Math.PI;
		this.isRayFacingUp = !this.isRayFacingDown;
		
		this.isRayFacingRight = this.rayAngle < 0.5*Math.PI || this.rayAngle > 1.5 * Math.PI;
		this.isRayFacingLeft = !this.isRayFacingRight;
	}
	cast(){
		var xintercept, yintercept;
		var xstep, ystep;
		//Horizontal Ray-grid intersection
		var foundHorzWallHit = false;
		var horzWallHitX = 0;
		var horzWallHitY = 0;
		//find the y-coordinate of the closest horizontal grid intersection
		yintercept = Math.floor(player.y/TILE_SIZE)*TILE_SIZE;
		yintercept += this.isRayFacingDown ? TILE_SIZE: 0;
	
		//find the x-coordinate of the closest horizontal grid intersection
		xintercept = player.x + (yintercept-player.y)/Math.tan(this.rayAngle)
	
		// calculate the increment xstep and ystep
		ystep = TILE_SIZE;
		ystep *= this.isRayFacingUp ? -1 :1 ;
		xstep = TILE_SIZE / Math.tan(this.rayAngle);
		xstep *= (this.isRayFacingLeft && xstep > 0) ? -1: 1;
		xstep *= (this.isRayFacingRight && xstep < 0) ? -1: 1;
	
		var nextHorzTouchX = xintercept;
		var nextHorzTouchY = yintercept;

		var horzWallHitTile;
		
		// increment xstep and ystep till we find a wall
		// ulogisk while loop
		//while (nextHorzTouchX >= 0 && nextHorzTouchX <= WINDOW_WIDTH && nextHorzTouchY >= 0 && nextHorzTouchY <= WINDOW_HEIGHT){
		while (!foundHorzWallHit){
			horzWallHitTile = grid.hasWallAt(nextHorzTouchX,nextHorzTouchY - (this.isRayFacingUp ? 1 : 0)); 
			if (horzWallHitTile != 0){
				foundHorzWallHit = true;
				horzWallHitX = nextHorzTouchX;
				horzWallHitY = nextHorzTouchY;
			
				//break;
			}else {
				nextHorzTouchX += xstep;
				nextHorzTouchY += ystep;
			}
		}
	
		//Vertical Ray-grid intersection
		var foundVertWallHit = false;
		var vertWallHitX = 0;
		var vertWallHitY = 0;
		
		var vertWallHitTile;
		
		//find the x-coordinate of the closest vertical grid intersection
		xintercept = Math.floor(player.x/TILE_SIZE)*TILE_SIZE;
		xintercept += this.isRayFacingRight ? TILE_SIZE: 0;
	
		//find the y-coordinate of the closest vertical grid intersection
		yintercept = player.y + (xintercept-player.x)*Math.tan(this.rayAngle)
	
		// calculate the increment xstep and ystep
		xstep = TILE_SIZE;
		xstep *= this.isRayFacingLeft ? -1 :1;
		
		ystep = TILE_SIZE * Math.tan(this.rayAngle);
		ystep *= (this.isRayFacingUp && ystep > 0) ? -1: 1;
		ystep *= (this.isRayFacingDown && ystep < 0) ? -1: 1;
	
		var nextVertTouchX = xintercept;
		var nextVertTouchY = yintercept;
	
		// increment xstep and ystep till we find a wall
		// ulogisk while loop
		//while (nextVertTouchX >= 0 && nextVertTouchX <= WINDOW_WIDTH && nextVertTouchY >= 0 && nextVertTouchY <= WINDOW_HEIGHT){
		while (!foundVertWallHit){
			vertWallHitTile = grid.hasWallAt(nextVertTouchX - (this.isRayFacingLeft ? 1 : 0),nextVertTouchY)
			if (vertWallHitTile != 0){
				foundVertWallHit = true;
				vertWallHitX = nextVertTouchX;
				vertWallHitY = nextVertTouchY;	
				//break;
			} else {
				nextVertTouchX += xstep;
				nextVertTouchY += ystep;
			}
		}
	
		// calculate both distances and choose the shortest
		
		/*
		var horzHitDistance = (foundHorzWallHit) 
			? distanceBetweenPoints(player.x,player.y, horzWallHitX, horzWallHitY)
			: Number.MAX_VALUE;
		var vertHitDistance = (foundVertWallHit)
			? distanceBetweenPoints(player.x,player.y, vertWallHitX, vertWallHitY)
			: Number.MAX_VALUE-1;
		*/
		
		// kan være ovenstående kan fange fejl, men ellers burde dette være nok
		var horzHitDistance = distanceBetweenPoints(player.x,player.y, horzWallHitX, horzWallHitY);
		var vertHitDistance = distanceBetweenPoints(player.x,player.y, vertWallHitX, vertWallHitY);
		
		if (vertHitDistance < horzHitDistance){
			this.wallHitX = vertWallHitX;
			this.wallHitY = vertWallHitY;
			this.distance = vertHitDistance;
			this.wallHitTile = vertWallHitTile;
			this.wasHitVertical = true;
		} else {
			this.wallHitX = horzWallHitX;
			this.wallHitY = horzWallHitY;
			this.distance = horzHitDistance;
			this.wallHitTile = horzWallHitTile;
			this.wasHitVertical = false;	
		}
	}
	render(){
		stroke("rgba(255,0,0,1.0)");
		line(
		MINIMAP_SCALE_FACTOR*player.x,
		MINIMAP_SCALE_FACTOR*player.y,
		MINIMAP_SCALE_FACTOR*this.wallHitX,
		MINIMAP_SCALE_FACTOR*this.wallHitY);
	}
}

var grid = new Map();
var player = new Player();
var rays = [];

function keyPressed(){
	if (keyCode == UP_ARROW){
	player.walkDirection = 1;	
	} else if (keyCode == DOWN_ARROW){
	player.walkDirection = -1;	
	} else if (keyCode == RIGHT_ARROW){
	player.turnDirection = 1;
	} else if (keyCode == LEFT_ARROW){
	player.turnDirection = -1;
	}
}
function keyReleased(){
	if (keyCode == UP_ARROW){
	player.walkDirection = 0;	
	} else if (keyCode == DOWN_ARROW){
	player.walkDirection = 0;	
	} else if (keyCode == RIGHT_ARROW){
	player.turnDirection = 0;
	} else if (keyCode == LEFT_ARROW){
	player.turnDirection = 0;
	}
}

function castAllRays(){
	// start first ray by substracting half of the FOV_ANGLE
	var rayAngle = player.rotationAngle - (0.5 * FOV_ANGLE);
	
	//tømmer array
	rays = [];
	
	// loop all columns casting the rays
	for (var col = 0; col < NUM_RAYS; col++){
		var ray = new Ray(rayAngle);
		ray.cast();
		rays.push(ray);
		rayAngle += FOV_ANGLE / NUM_RAYS;
	}	
}

function render3DProjectedWalls(){
	// loop every ray in the array of rays
	for (var i = 0; i < NUM_RAYS;i++){
		var ray = rays[i];
		
		// correct fisheye : vandrette afstand
		var correctRayDistance = ray.distance * Math.cos(ray.rayAngle-player.rotationAngle);
		
		//calculate distance to projection plane
		var distanceProjectionPlane = (WINDOW_WIDTH/2)/Math.tan(FOV_ANGLE/2);
		// projected wall height
		var wallStripHeight = (TILE_SIZE/ correctRayDistance)*distanceProjectionPlane;
		

        var tileColor = "#000";

		var shade = Math.floor((ray.wasHitVertical ? 105 : 50)*50/correctRayDistance*2);
		
		if (ray.wallHitTile == 1)
			tileColor = "rgba("+shade+","+shade+","+(30+shade)+",1.0)";
		if (ray.wallHitTile == 2)
			tileColor = "rgba("+shade+","+(30+shade)+","+shade+",1.0)";
		

		
		// fill("rgba("+shade+","+shade+","+(50+shade)+",1.0)");
		fill(tileColor);
		noStroke();
		rect(i*WALL_STRIP_WIDTH,(WINDOW_HEIGHT/2)-(wallStripHeight/2),WALL_STRIP_WIDTH,wallStripHeight);
	}
}

function normalizeAngle(angle) {
	angle = angle % (2* Math.PI);
	if (angle < 0) {
		angle += (2 * Math.PI);
	}
	return angle;
}

function distanceBetweenPoints(x1,y1,x2,y2){
	return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
}

function setup() {
    createCanvas(WINDOW_WIDTH, WINDOW_HEIGHT);
}

function update() {
	player.update();
	castAllRays();
}

function draw() {
    update();

	//clearscreen
	//sky
	fill("rgba(125,125,125,1.0)");
	noStroke();
	rect(0,0,WINDOW_WIDTH,WINDOW_HEIGHT/2);
	// floor
	fill("rgba(125,0,0,1.0)");
	rect(0,WINDOW_HEIGHT/2,WINDOW_WIDTH,WINDOW_HEIGHT);

	render3DProjectedWalls();

    grid.render();
	for (ray of rays){
		ray.render();
	}
	player.render();
}
