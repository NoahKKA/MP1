const canvas = document.querySelector('#gamePage')
const c = canvas.getContext('2d')
const gravity = .125;
const keys = {
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
}
const platforms = []


class SolidPlatform {
    constructor(change) {
        this.y = change
        this.width = getRandomNumber(15, 25);
        this.height = 2.5;
        this.x = getRandomNumber(50, 150);
        this.collisions = false
    }

    drawPlatform() {
            c.fillStyle = 'black';
            c.fillRect(this.x, this.y, this.width, this.height);
    }

    updatePlatform() {
        this.drawPlatform()
        checkCollisions(player, this);
    }
}

//made it into a class just incase I want to add more players.
class Player {
    constructor(){
        this.position = {
            x: 0,
            y: 0,
        }
        this.velocity = {
            x: 0,
            y: 1,
        }
        this.height = 20
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, 25, this.height)
        y++
    }

    update() {
        this.draw()
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        //creates gravity
        if(this.velocity.y + this.height + this.position.y < canvas.height){
            this.velocity.y += gravity
        } else {
            this.velocity.y = 0
        }
    }

    jump(){
        setInterval(() => {
            if (player.position.y + player.height >= canvas.height) {
              player.velocity.y = -4;
            }
          }, 500);
    }
}


//creates player
const player = new Player()

function createPlatforms (){
    let platformHeight = 120
    for(let i = 0; i < 4; i++){
        let solidPlatform = new SolidPlatform(platformHeight)
        platforms.push(solidPlatform)
        platformHeight -= 30
    }
    if(player.position.y < 0){
        platforms.shift()
    }
}
createPlatforms()


//checks for collisions
function checkCollisions(player, platform){
    let bottomPlayer = player.position.y + player.height
    let topPlatform = platform.y 
    
    if(bottomPlayer >= topPlatform && player.position.y < topPlatform && player.position.x + 25 >= platform.x &&  player.position.x <= platform.x + platform.width) {
         platform.collisions = true
         player.position.y = topPlatform - player.height
        }
     else {
        platform.collisions = false
    }
}


function eachPlatform (){
    platforms.forEach(function(plat) {
        checkCollisions(player, plat)
        console.log(platform.collisions)
    })
}

let y = 20;
function animate(){
    window.requestAnimationFrame(animate)
    //create canvas and refreshes to the browser refresh rate.
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    for(let i = 0; i < platforms.length; i++){
        platforms[i].updatePlatform(player)
    }

    player.jump()

    //makes player stop when keys are not pressed down
    player.velocity.x = 0
    if(keys.d.pressed) {
        player.velocity.x = 1
    }
    if(keys.a.pressed){
        player.velocity.x = -1
    }
}
animate()

//listens as to which key is pressed
window.addEventListener('keydown', (event) => {
    if(event.key === 'd'){
        keys.d.pressed = true;
    }
    if(event.key === 'a'){
        keys.a.pressed = true
    }
})
//listens to what key is depressed
window.addEventListener('keyup', (event) => {
    if(event.key === 'd'){
        keys.d.pressed = false
    }
    if(event.key === 'a'){
        keys.a.pressed = false
    }
})


function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
