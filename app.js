let start = false;
const canvas = document.querySelector('#gamePage')
const c = canvas.getContext('2d')
let backgroundImg = new Image()
function createGame(){
    let pattern = c.createPattern(backgroundImg, 'repeat')
    c.fillStyle = pattern
    c.fillRect(0, 0, canvas.width, canvas.height)
}
backgroundImg.src = './assets/backgroundimg.webp'
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
let score = 0;
let hasLandedOnPlatform = false;
let firstJump = false;
let startBtn = document.querySelector("#start")
let movePlatform = .375
let x = 5;



//making player Class
class Player {
    constructor(){
        this.position = {
            x: canvas.width/2 - 12.5,
            y: canvas.height - 20,
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
        //stops the player from jumping outside the canvas
        if(this.position.y < -20){
            this.velocity.y = gravity
            this.position.y = -10;
        }
    }    
}

//creating Player
const player1 = new Player()

class SolidPlatform{
    constructor(newPlatBottom){
        this.bottom = newPlatBottom
        this.left = getRandomNumber(75,200)
        this.hasLandedOnPlatform = hasLandedOnPlatform
        this.onPlatform = false;
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
                    this.onPlatform = true
                    
                } else if (player1.velocity.y > 0 && player1.position.y + player1.height <= this.bottom + 4) {
                    player1.velocity.y = 0;
                    player1.position.y = this.bottom - player1.height;
                    player1.canJump = true; // set to true when player lands on platform
                    this.onPlatform = true;
                }
            }
        }

        update(){
            this.draw()
            this.checkCollisions()
            if(firstJump){
                this.bottom += movePlatform
            }
            if(isGameOver){
                this.bottom = -10
            }

            //check if platform moved off canvas
            if(this.bottom > canvas.height){
                //remove platform from array
                platforms.splice(platforms.indexOf(this), 1)

                //create new platform at the top of canvas
                let newPlatBottom = 0;
                let lastPlatform = platforms[platforms.length - 1]
                if(lastPlatform){
                    newPlatBottom = lastPlatform.bottom - 30
                }
                let newPlatform = new SolidPlatform(newPlatBottom)
                platforms.push(newPlatform)
            }
            if(!this.hasLandedOnPlatform && this.onPlatform){
                console.log('im on platform')
                score++
                this.hasLandedOnPlatform = true
                console.log(hasLandedOnPlatform)
            }
        }

    }

//creates SolidPlatform
function solidPlatform(){
    let startPlat = 150
    for(let i = 0; i < 7; i++){
        let platGap = 30
        let newPlatBottom = startPlat + i * platGap

        let newPlatform = new SolidPlatform(newPlatBottom)
        platforms.push(newPlatform)
    }
}
solidPlatform()


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
            firstJump = true;
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


function increaseMovePlatform(){
    setInterval(() => {
        if(score === x){
        movePlatform += 0.0625
        x+=5
        console.log(movePlatform)
    }
    }, 1000);
}

function gameOver(){
    if(firstJump && 
    (player1.position.y + player1.height == canvas.height) &&
    (platforms[0].bottom !== 150)){
        isGameOver = true
        start = false
        firstJump = false;
    }
    if(isGameOver){
        //starts game again and resets everything
        let playAgainBtn = document.querySelector('#playAgain')
        playAgainBtn.style.visibility = "visible"
        playAgainBtn.addEventListener('click', () => {
            isGameOver = false;
            score = 0;
            platforms = [];
            start = true;
            solidPlatform();
            movePlatform = 0.375
            player1.position = {
              x: canvas.width/2 - 12.5,
              y: canvas.height - 20,
            }
            player1.velocity = {
              x: 0,
              y: 1,
            }
            player1.canJump = true;
            
            playAgainBtn.style.visibility = "hidden"
        })
    }
}

//makes it so game only starts when button is pressed
function startGame(){
    startBtn.addEventListener('click', () =>{
        if(!start){
            start = true
            main()
            startBtn.style.visibility = 'hidden'
        }
        if(start && !isGameOver){
            increaseMovePlatform()
        }
    })
}
startGame()

setInterval(() => {
    console.log(score)
}, 1000);

function main(){
    function animate(){
        window.requestAnimationFrame(animate)
        
        createGame()
        movment()
        gameOver()
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
    animate()
}
