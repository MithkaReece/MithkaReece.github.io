let auto = true;
let play = true;
let scale = 20;
let snake
let direction
let vel = 4;
let slider
let food

let highest = 0;

function setup() {
  createCanvas(50*scale, 40*scale);
  direction = createVector(1,0);
  snake = new Snake(25*scale, 25*scale);  
  food = new Food();
}

function draw() {
  
  if(play){
    snake.live();   
  }
  background(0);
  snake.show();
  food.show();

}

function colour(R,G,B){
  this.r = R
  this.g = G
  this.b = B
}



function Snake(startX, startY){
  this.body = [];
  this.colours = [];
  this.body.push(createVector(startX,startY));
  this.colours.push(new colour(random(255),random(255),random(255)));
  this.pos = this.body[0];
  this.size = scale;
  this.interval = this.size;
  this.length = 1;
  this.addingCount = 0;

  
  this.live = function(){
    this.move();
    this.dead();
    this.eaten();
  }
  
  this.show = function(){
    strokeWeight(0);
     for (i = 0; i < this.body.length; i+=floor(this.interval/vel)){
       let j = i/floor(this.interval/vel)
       let r = this.colours[j].r;
       let g = this.colours[j].g;
       let b = this.colours[j].b;
       fill(r,g,b,255);
       rect(this.body[i].x,this.body[i].y,this.size-1,this.size-1);
     }
    fill(255,255,255,80);
    textAlign(CENTER);
    textSize(scale*20);
    text(this.length,width/2,height*0.6);
    
    fill(255,255,255,80);
    textAlign(CENTER);
    textSize(scale*10);
    if(highest != 0){
      text(highest,width*0.05,height*0.2);
    }
  }
  
  this.move = function(){
    if(auto){
      //direction = this.weirdmove(); Optimal grid like
      //direction = this.calcmove(); Fastest route
    }
    //Calc new position
    let changeV = createVector(direction.x*vel,direction.y*vel);
    let oldHead = createVector(this.body[0].x,this.body[0].y);
    this.pos = oldHead.add(changeV);
    
      
    
    this.body.unshift(this.pos);  
    if (this.addingCount > 0){
       this.addingCount--;
    } else {
      this.body.pop();
    }
  }
  
  this.weirdmove = function(){
   if(this.pos.y > scale-1 && this.pos.y < width-scale){
     if(this.pos.x == scale){
       return createVector(direction.y,-direction.x); 
     }else if(this.pos.x == width-scale){
      return createVector(-direction.y,direction.x);
     }else if(this.pos.x > 2*scale && this.pos.x < width-scale){
       return direction; 
     }     
   }else{
    if(this.pos.x == width-scale){
      return createVector(-direction.y,direction.x);
    }else if(this.pos.x == 0){
      return createVector(-direction.y,direction.x);
    }
   }
    
    return direction;
  }
  
  this.calcmove = function(){ 
    let moves = [];
    let a = direction.x;
    let b = direction.y;
    moves.push(createVector(a,b));
    moves.push(createVector(-b,a));
    moves.push(createVector(b,-a));

    let highest = 0;
    let index = 0;
    for(let i=0; i<moves.length;i++){
      let result = this.isdead(moves[i].x,moves[i].y);      
      if(result > highest){     
        highest = result;
        index = i;
      }
    }
    return moves[index];
    
  }
  
  this.isdead = function(ina,inb){
    let a = this.pos.x+ina;
    let b = this.pos.y+inb;
    //Avoid walls
    if (a+this.size > width || a < 0 || b+this.size > height || b < 0){
      return 0;
    }  
    //Avoid tail
    for (i = 2*floor(this.interval/vel); i < this.body.length; i+= floor(this.interval/vel)){
      let x = this.body[i].x
      let y = this.body[i].y
      
    if(a + this.size> x && a < x + this.size && b + this.size > y && b < y + this.size){
      return 0;
    }
      
    }
    let x = food.pos.x - this.pos.x;
    let y = food.pos.y - this.pos.y;
    let vector = createVector(x,y);
    vector.setMag(1);   
    vector.sub(createVector(ina,inb));
    let result = 1/vector.mag()+1;
    return result;
  }
  
  this.dead = function(){
    //Hit walls
    if (this.pos.x+this.size > width || this.pos.x < 0 || this.pos.y+this.size > height || this.pos.y < 0){
      this.reset();
    }  
    
    for (i = 2*floor(this.interval/vel); i < this.body.length; i+= floor(this.interval/vel)){
      let x = this.body[i].x
      let y = this.body[i].y
      
    if(this.pos.x + this.size> x && this.pos.x < x + this.size && this.pos.y + this.size > y && this.pos.y < y + this.size){
      this.reset();
    }
      
    }
  }  
  
  this.reset = function(){
    //console.log("SCORE " + this.length);
    if (this.length > highest){
      highest = this.length; 
    }
    console.log(highest);
    //play=false;
    if(play){
    this.body = [];
    this.body.push(createVector(startX,startY));
    this.pos = this.body[0];
    this.length = 1;
    food.reset();
    this.colours[0] = new colour(random(255),random(255),random(255));
    }
  }
  
  this.eaten = function(){

      if(this.pos.x + this.size > food.pos.x 
         && this.pos.x < food.pos.x + food.size
         && this.pos.y + this.size > food.pos.y
         && this.pos.y < food.pos.y + food.size){
        food.reset();
        this.addingCount = this.interval/vel;
        this.length++;
        if(Math.floor(random(6)) == 0){
          this.colours.push(new colour(random(255),random(255),random(255)));
        }else{
          this.colours.push(this.colours[this.colours.length-1]); 
          
        }
        
      } 
      

  }
   
}

function Food(){
  this.reset = function(){
    let ranX = scale*Math.floor(random(width/scale))
    let ranY = scale*Math.floor(random(height/scale))
  	this.pos = createVector(ranX,ranY);  
  }
  
  this.size = scale-1;
  this.pos = createVector(scale*Math.floor(random(width/scale)),scale*Math.floor(random(height/scale)));    
  this.reset();
  this.show = function(){
    fill(100,150,0);
    rect(this.pos.x,this.pos.y,this.size,this.size);   
  }
  
  
}

function keyPressed(){
  if (keyCode == 87){
    if(direction.y !== 1){
    	direction = createVector(0,-1);
    }
  }else if(keyCode == 65){
    if(direction.x !== 1){
    	direction = createVector(-1,0); 
    }
  }else if(keyCode == 83){
    if(direction.y !== -1){
    	direction = createVector(0,1); 
    }
  }else if(keyCode == 68){
    if(direction.x !== -1){
    	direction = createVector(1,0); 
    }
  }
}