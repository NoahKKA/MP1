let start = true;
const canvas = document.querySelector('#gamePage')
const c = canvas.getContext('2d')
function createGame(){
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)
}
const gravity = .125;
let platforms = []
let y = 20;
const keys = {
    d: {
        pressed:false,
    },
    a: {
        pressed:false,
    },
}
let isJumping = false;
let isGameOver = false;
let newPlatBottom = 0;







//making player Class
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
        this.canJump = true;
    }

    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, 25, this.height)
        y++
    }

    update() {
        this.draw()
        // apply gravity
        this.velocity.y += gravity;
        this.position.y += this.velocity.y;
        this.position.x += this.velocity.x;
        // check for collision with bottom of canvas
        if (this.position.y + this.height > canvas.height) {
            this.position.y = canvas.height - this.height;
            this.velocity.y = 0;
            this.canJump = true; // reset when player falls to the ground
            isGameOver = true;
        }
        // check for jump
        if (isJumping && this.canJump) { // only allow jump if the player can jump
            this.velocity.y = -4;
            isJumping = false;
            this.canJump = false; // set to false after jumping
        }
        //makes it so player cannot leave thru sides
        if(this.position.x < 0){
            this.position.x = 0
        }
        if(this.position.x + 25 > canvas.width){
            this.position.x = canvas.width - 25
        }
    }    
}

//creating Player
const player1 = new Player()

class SolidPlatform{
    constructor(newPlatBottom){
        this.bottom = newPlatBottom
        this.left = getRandomNumber(75,200)
    }


        draw(){
            c.fillStyle = 'black'
            c.fillRect(this.left, this.bottom, 35, 4)
        }

        checkCollisions(){
            if (
                player1.position.y + player1.height >= this.bottom &&
                player1.position.y + player1.height <= this.bottom + 4 &&
                player1.position.x + 25 >= this.left &&
                player1.position.x <= this.left + 35
            ) {
                if (isJumping) {
                    player1.velocity.y = 0;
                    player1.position.y = this.bottom - player1.height;
                    isJumping = false;
                    player1.canJump = true; // set to true when player lands on platform
                } else if (player1.velocity.y > 0 && player1.position.y + player1.height <= this.bottom + 4) {
                    player1.velocity.y = 0;
                    player1.position.y = this.bottom - player1.height;
                    player1.canJump = true; // set to true when player lands on platform
                }
            }
        }

        update(){
            this.draw()
            this.checkCollisions()
            this.bottom += .25
        }

    }

//creates SolidPlatform
function solidPlatform(){
    let startPlat = 5
    for(let i = 0; i < 5; i++){
        let platGap = 30
        let newPlatBottom = startPlat + i * platGap

        let newPlatform = new SolidPlatform(newPlatBottom)
        platforms.push(newPlatform)
    }
}
solidPlatform()
console.log(platforms)



//player left and right movement and jump.
function movment(){
    
    //listens as to which key is pressed
    window.addEventListener('keydown', (event) => {
        if(event.key === 'd'){
            keys.d.pressed = true;
        }
        if(event.key === 'a'){
            keys.a.pressed = true
        }
        if(event.key === ' '){
            isJumping = true;
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
}




//get random number min - max
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


//canvas creation
function main(){
    window.requestAnimationFrame(main)
    createGame()
    movment()
    player1.update()

    //draws platforms
    
    platforms.forEach(function(plat){
        plat.update()
    })
    // player left and right movement
    player1.velocity.x = 0;
    if (keys.d.pressed) {
        player1.velocity.x = 1.5;
    }
    if (keys.a.pressed) {
        player1.velocity.x = -1.5;
    }
}
console.log(canvas.getBoundingClientRect())
main();