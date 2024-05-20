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

var playerNumber = 0;
 
var Player = function(id){
    
	var self = {
		x:((Math.random()*700)+250),
		y:((Math.random()*470)+50),
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
        active: true,
        name: "Dull",

        travelRate: 1.5,
        knockback: 1.4,

        xtravel: 1,
        ytravel: 1
	}

	self.updatePosition = function(){
        if(self.active){
            if(self.pressingRight)
                self.maxSpdX += self.travelRate*self.xtravel;
            if(self.pressingLeft)
                self.maxSpdX -= self.travelRate*self.xtravel;
            if(self.pressingUp)
                self.maxSpdY -= self.travelRate*self.ytravel;
            if(self.pressingDown)
                self.maxSpdY += self.travelRate*self.ytravel;
        }

        self.maxSpdX*=self.friction;
        self.maxSpdY*=self.friction;
            
        self.x += self.maxSpdX;
        self.y += self.maxSpdY;

        

        if(self.x<=230 || self.x>=950 || self.y<=40 || self.y>=550)
        {
            self.active = false;
        }

	}
    self.collision = function(block)
    {
        self.maxSpdX += self.knockback*((self.x)-(block.x))*Math.random();
        self.maxSpdY += self.knockback*((self.y)-(block.y))*Math.random();
    }
	return self;
}

var io = require('socket.io')(serv,{});
io.sockets.on('connection', function(socket){
	socket.id = Math.random();
	SOCKET_LIST[socket.id] = socket;
    


	var player = Player(socket.id);

	PLAYER_LIST[socket.id] = player;
    
    var username = "Player "+parseInt(Math.random()*20);
    PLAYER_LIST[socket.id].name = username;

	socket.on('disconnect',function(){
		delete SOCKET_LIST[socket.id];
		delete PLAYER_LIST[socket.id];
	});

    socket.on('sendMsgToServer',function(data){
        console.log("server has recieved the submitted message");
		for(var i in SOCKET_LIST) {
            console.log("sent the message back to everyones HTML");
            SOCKET_LIST[i].emit('addToChat', username + ': ' + data);
        }
	});
    
    socket.on('sendUserToServer',function(data){
        console.log("server has recieved the submitted username");
		username = data;
        PLAYER_LIST[socket.id].name = username;
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
            blue:player.blue,
            name:player.name
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

setInterval(function(){

    //reset to defaults
    for(var i in PLAYER_LIST)
    {
        PLAYER_LIST[i].friction = 0.9;
        PLAYER_LIST[i].travelRate = 1.5;
        PLAYER_LIST[i].knockback = 1.4;

        PLAYER_LIST[i].xtravel = 1;
        PLAYER_LIST[i].ytravel = 1;
    }

    var eventNumber = parseInt(Math.random()*5);

    if(eventNumber === 0){
        //SLIP event, everyone has zero friction now, for some time
        for(var i in PLAYER_LIST){
            PLAYER_LIST[i].friction = 1;

            var socket = SOCKET_LIST[i];
            socket.emit('event', eventNumber);
        }
    }
    if(eventNumber === 1){
        //SPEED event, everyone travel time has been increased by a grand amount
        for(var i in PLAYER_LIST){
            PLAYER_LIST[i].travelRate = 4;

            var socket = SOCKET_LIST[i];
            socket.emit('event', eventNumber);
        }
    }
    if(eventNumber === 2){
        //KNOCKBACK event, everyones knockback velocity has increased
        for(var i in PLAYER_LIST){
            PLAYER_LIST[i].knockback = 3.3;

            var socket = SOCKET_LIST[i];
            socket.emit('event', eventNumber);
        }
    }
    if(eventNumber === 3){
        //BLIGHT event, your control over the player has been disordered!
                
        for(var i in PLAYER_LIST){
            PLAYER_LIST[i].friction = 0.95;
            PLAYER_LIST[i].xtravel = 2 - Math.random()*4;
            PLAYER_LIST[i].ytravel = 2 - Math.random()*4;
            PLAYER_LIST[i].knockback = 0.8;

            var socket = SOCKET_LIST[i];
            socket.emit('event', eventNumber);
        }
    }

    if(eventNumber === 4){
        //FRENZY event, everyones stats are to be randomized!!!
        for(var i in PLAYER_LIST){
            PLAYER_LIST[i].friction = 0.9+Math.random()*0.2;
            PLAYER_LIST[i].travelRate = 0+Math.random()*5;
            PLAYER_LIST[i].knockback = 0.5+Math.random()*4;

            var socket = SOCKET_LIST[i];
            socket.emit('event', eventNumber);
        }
    }
    


},20000)

