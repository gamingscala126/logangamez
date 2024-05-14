var upKey
var rightKey
var downKey
var leftKey

var resetcount = 0;

var gameLoop //may not need

// window.onload = function ()
// {
//     canvas = document.getElementById("background")
//     canvas.width = window.innerWidth
//     canvas.height = window.innerHeight
//     ctx = canvas.getContext("2d")
//     player = new Player(
//         canvas.width/2-20,canvas.height/2-20
//     )

//     setupInputs()

    

//     gameLoop = setInterval(step, 1000/30)
// }

// function step() {
//     player.step()
//     resetcount++;

    
//     ctx.clearRect(0, 0, canvas.width, canvas.height)
    
//     draw()


// }

function draw(){
    ctx.fillStyle = 'white'
    ctx.fillRect((canvas.width/2)-350, (canvas.height/2)-250, 700, 500)
    player.draw()
}

function setupInputs() {
    document.addEventListener("keydown", function (event) {
        if (event.key === "w" || event.key === "ArrowUp") {
            upKey = true
        } else if (event.key === "a" || event.key === "ArrowLeft") {
            leftKey = true
        } else if (event.key === "s" || event.key === "ArrowDown") {
            downKey = true
        } else if (event.key === "d" || event.key === "ArrowRight") {
            rightKey = true
        }
        if (event.key === "Enter") {
            enterKey = false
            player.setActive(true)
        }
        if (event.key === "r") {
            location.reload();
        }
    })

    document.addEventListener("keyup", function (event) {
        if (event.key === "w" || event.key === "ArrowUp") {
            upKey = false
        } else if (event.key === "a" || event.key === "ArrowLeft") {
            leftKey = false
        } else if (event.key === "s" || event.key === "ArrowDown") {
            downKey = false
        } else if (event.key === "d" || event.key === "ArrowRight") {
            rightKey = false
        }
    })
}

//launch the event listener


