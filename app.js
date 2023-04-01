let start = false;
const canvas = document.querySelector('#gamePage')
const c = canvas.getContext('2d')
// let backgroundImg = new Image()
function createGame(){
    // c.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height)
}
// backgroundImg.src = './assets/background.png'
const playerImg = new Image()
const jumpPlayerImg = new Image()
const fallPlayerImg = new Image()
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
let gameTitle = document.querySelector('#gameTitle')
let movePlatform = .375
let x = 5;

const scores = []



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
        this.height = 25
        this.width = 30
        this.canJump = true;
        this.isImageLoaded = false;
        this.playerImage = playerImg
    }

    draw() {
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, 25, this.height)
        // y++
        if(this.isImageLoaded){
            c.drawImage(this.playerImage, this.position.x, this.position.y, this.width, this.height)
        }
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
        if(this.position.x + this.width > canvas.width){
            this.position.x = canvas.width - this.width
        }
        //stops the player from jumping outside the canvas
        if(this.position.y < -15){
            this.velocity.y = gravity
            this.position.y = -10;
        }
        // playerSprites()
    }    
}

//creating Player
const player1 = new Player()

playerImg.onload = function(){
    player1.isImageLoaded = true;
}
playerImg.src = "./assets/Blueplayer.png"

jumpPlayerImg.onload = function(){
    player1.isImageLoaded = true;
}
jumpPlayerImg.src = "./assets/JumpBluePlayer.png"

fallPlayerImg.onload = function(){
    player1.isImageLoaded = true;
}
fallPlayerImg.src = "./assets/SquishBluePlayer.png"

function playerSprites(){
    for(let i = 0; i < platforms.length; i++){
        if(platforms[i].onPlatform){
            player1.playerImage = fallPlayerImg
        }
    }
    if(player1.isJumping){
        player1.playerImage = jumpPlayerImg
    }
    else{
        player1.playerImage = playerImg
    }
}




class SolidPlatform{
    constructor(newPlatBottom){
        this.bottom = newPlatBottom
        this.left = getRandomNumber(50,225)
        this.hasLandedOnPlatform = hasLandedOnPlatform
        this.onPlatform = false;
        this.width = 43;
        this.height = 4;
    }


        draw(){
            c.fillStyle = 'black'
            c.fillRect(this.left, this.bottom, this.width, this.height)
        }

        checkCollisions(){
            if (
                player1.position.y + player1.height >= this.bottom &&
                player1.position.y + player1.height <= this.bottom + this.height &&
                player1.position.x + player1.width >= this.left &&
                player1.position.x <= this.left + this.width
            ) {
                if (isJumping) {
                    player1.velocity.y = 0;
                    player1.position.y = this.bottom - player1.height;
                    isJumping = false;
                    player1.canJump = true; // set to true when player lands on platform
                    this.onPlatform = true
                    
                } else if (player1.velocity.y > 0 && player1.position.y + player1.height <= this.bottom + this.height) {
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
                    newPlatBottom = lastPlatform.bottom - 35
                }
                let newPlatform = new SolidPlatform(newPlatBottom)
                console.log(newPlatform)
                platforms.push(newPlatform)
            }
            if(!this.hasLandedOnPlatform && this.onPlatform){
                score++
                this.hasLandedOnPlatform = true
            }
            if(score === x){
                movePlatform += 0.0625
                x+=5
            }
            player1.playerImage = playerImg
            if(this.onPlatform){
                player1.playerImage = fallPlayerImg
            } else if(player1.velocity !== 0 ){
                player1.playerImage = jumpPlayerImg
            } else {
                player1.playerImage = playerImg
            }
        }

    }

//creates SolidPlatform
function solidPlatform(){
    let startPlat = 150
    for(let i = 0; i < 7; i++){
        let platGap = 35
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
            x = 5;
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
            document.querySelector('#score').style.visibility = 'hidden'
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
            gameTitle.style.visibility = 'hidden'
        }
        if(start && !isGameOver){
        }
    })
}
startGame()

setInterval(() => {
    console.log(movePlatform)
    console.log("player y + height " + player1.position.y + player1.height)
    console.log("player x " + player1.position.x)
}, 500);

setInterval(() => {
    console.log(score)
}, 1000);

function showScore(){
    let scoreText = document.querySelector('#score')
    if(isGameOver){
        scoreText.style.visibility = 'visible'
        scoreText.innerHTML = "SCORE " + score
    }
}

function getHighScore(scoreArr){
    if(gameOver){
    let highestScoreNum = scoreArr.reduce(function(a,b) {
        return Math.max(a, b)
    })
    return highestScoreNum
    }
    if(scoreText.style.visibility === 'visible'){

    }
}


function main(){
    function animate(){
        window.requestAnimationFrame(animate)
        
        createGame()
        movment()
        gameOver()
        player1.update()
        showScore()
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
