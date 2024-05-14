
 function Player(x,y)
 {
     this.x = x;
     this.y = y;

     this.xspeed = 0;
     this.yspeed = 0;
    
     this.friction  = .75; 

     this.maxSpeed = 8;




     this.size = 20;
     this.alive = true;

     this.xspeed = 0;
     this.yspeed = 0;

     this.red = parseInt(Math.random()*255);
     this.green = parseInt(Math.random()*255);
     this.blue = parseInt(Math.random()*255);



    


    this.step = function(){

             if(!leftKey && !rightKey || leftKey && rightKey )
             {
                 this.xspeed *= this.friction;
             } else if (rightKey){
                 this.xspeed += 1;
             } else if (leftKey){
                 this.xspeed -= 1;
             }
            
             if(!downKey && !upKey || downKey && upKey )
             {
                 this.yspeed *= this.friction;
             } else if (downKey){
                 this.yspeed += 1;
             } else if (upKey){
                 this.yspeed -= 1;
             }



             const magnitude = Math.sqrt(this.xspeed*this.xspeed + this.yspeed*this.yspeed);
             if(magnitude > this.maxSpeed)
             {
                 const scaleF = this.maxSpeed/magnitude;
                 this.xspeed *= scaleF;
                 this.yspeed *= scaleF;
             } 

             
             if(this.x<=(canvas.width/2)-370 || this.x>=(canvas.width/2)+350 || this.y<=(canvas.height/2)-270 || this.y>=(canvas.height/2)+250)
             {
                this.active = false;
             }
         
     if (this.alive)
             {
                 this.x += this.xspeed;
                 this.y += this.yspeed;
             }
     
 }
 this.draw = function(){
    ctx.fillStyle = "black";
    ctx.fillRect(this.x,this.y,this.size,this.size)
    ctx.fillStyle = "rgba("+this.red+", "+this.green+", "+this.blue+", 1)";    
    ctx.fillRect(this.x+1.3,this.y+1.3,this.size-2.6,this.size-2.6)
}   
 }