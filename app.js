var express = require('express');
var app = express();
var serv = require('http').Server(app);

 
app.get('/',function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});
app.use('/client',express.static(__dirname + '/client'));
 
serv.listen(2000);
console.log("Server started.");
 
var SOCKET_LIST = [];
var PLAYER_LIST = []; 
 
var Player = function(id){
    
	var self = {
		x:((Math.random()*200)+300),
		y:((Math.random()*200)+300),
        red: ""+(parseInt(Math.random()*255)),
        green: ""+(parseInt(Math.random()*255)),
        blue: ""+(parseInt(Math.random()*255)),
		id:id,
		pressingRight:false,
		pressingLeft:false,
		pressingUp:false,
		pressingDown:false,	
        friction: 0.9,
		maxSpdX: 0,
        maxSpdY: 0,
        active: true
	}

	self.updatePosition = function(){
        if(self.active){
            if(self.pressingRight)
                self.maxSpdX += 1.5;
            if(self.pressingLeft)
                self.maxSpdX -= 1.5;
            if(self.pressingUp)
                self.maxSpdY -= 1.5;
            if(self.pressingDown)
                self.maxSpdY += 1.5;
        }

        self.maxSpdX*=self.friction;
        self.maxSpdY*=self.friction;
            
        self.x += self.maxSpdX;
        self.y += self.maxSpdY;

        

        if(self.x<=230 || self.x>=950 || self.y<=50 || self.y>=550)
        {
                self.active = false;
        }

	}
    self.collision = function(block)
    {
        self.maxSpdX += ((self.x)-(block.x))*Math.random();
        self.maxSpdY += ((self.y)-(block.y))*Math.random();
    }
	return self;
}
 
var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;
 

	var player = Player(socket.id);
	PLAYER_LIST[socket.id] = player;

 
	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
	});

    socket.on('sentMsgToServer',function(data){
		var playerName = (""+socket.id).slice(2,7);
		for(var i in SOCKET_LIST) {
            SOCKET_LIST[i].emit('addToChat', playerName + ': ' + data);
        }
	});
 
	socket.on('keyPress',function(data){
		if(data.inputId === 'left')
			player.pressingLeft = data.state;
		else if(data.inputId === 'right')
			player.pressingRight = data.state;
		else if(data.inputId === 'up')
			player.pressingUp = data.state;
		else if(data.inputId === 'down')
			player.pressingDown = data.state;
	});
 
 
});



setInterval(function(){
	var pack = [];
	for(var i in PLAYER_LIST){
		var player = PLAYER_LIST[i];
		player.updatePosition();
		pack.push({
			x:player.x,
			y:player.y,
            red:player.red,
            green:player.green,
            blue:player.blue
		});		
	}
	for(var i in SOCKET_LIST){
		var socket = SOCKET_LIST[i];
		socket.emit('newPositions',pack);
	}

    for(var i in PLAYER_LIST)
    {
        var player1 = PLAYER_LIST[i];

        for(var d in PLAYER_LIST)
        {
            //Checks if the blocks are colliding
            var player2 = PLAYER_LIST[d];
            //var lug = (Math.abs((player1.x) - (player2.x)) <= 20) && !(player1 === player2);

            //console.log(lug);

            if( ((Math.abs((player1.x) - (player2.x)) <= 20) &&
                (Math.abs((player1.y) - (player2.y)) <= 20))
                && !(player1 === player2))
                {
                    PLAYER_LIST[i].collision(PLAYER_LIST[d]);
                    PLAYER_LIST[d].collision(PLAYER_LIST[i]); 
                }
        }
    }
},1000/25);

