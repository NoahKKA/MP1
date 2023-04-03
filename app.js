let start = false;
const canvas = document.querySelector('#gamePage')
const c = canvas.getContext('2d')
let backgroundImg = new Image()
canvas.width = backgroundImg.width
canvas.height = backgroundImg.height
function createGame(){
    canvas.width = backgroundImg.width
    canvas.height = backgroundImg.height
    // c.drawImage( 0, 0, canvas.width, canvas.height)
    // canvas.style.backgroundImage = `url(${backgroundImgUrl})`
    // canvas.style.backgroundSize = 'contain'
}
backgroundImg.src = './assets/background.png'
const playerImg = new Image()
const jumpPlayerImg = new Image()
const fallPlayerImg = new Image()
const gravity = .2625;
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
let movePlatform = 1.5
let x = 5;
let highScore = 0;

const scores = [0]

//making player Class
class Player {
    constructor(){
        this.position = {
            x: backgroundImg.width/2 - 45,
            y: backgroundImg.height - 75,
        }
        this.velocity = {
            x: 0,
            y: 1,
        }
        this.height = 75
        this.width = 90
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
        if (this.position.y + this.height > backgroundImg.height) {
            this.position.y = backgroundImg.height - this.height;
            this.velocity.y = 0;
            this.canJump = true; // reset when player falls to the ground
        }
        // check for jump
        if (isJumping && this.canJump) { // only allow jump if the player can jump
            this.velocity.y = -12;
            isJumping = false;
            this.canJump = false; // set to false after jumping
        }
        //makes it so player cannot leave thru sides
        if(this.position.x < 0){
            this.position.x = 0
        }
        if(this.position.x + this.width > backgroundImg.width){
            this.position.x = backgroundImg.width - this.width
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


class SolidPlatform{
    constructor(newPlatBottom){
        this.bottom = newPlatBottom
        this.left = getRandomNumber(150,1080)
        this.hasLandedOnPlatform = hasLandedOnPlatform
        this.onPlatform = false;
        this.width = 150;
        this.height = 12;
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
                    player1.position.y = this.bottom - (player1.height - movePlatform);
                    isJumping = false;
                    player1.canJump = true; // set to true when player lands on platform
                    this.onPlatform = true
                    
                } else if (player1.velocity.y > 0 && player1.position.y + player1.height <= this.bottom + this.height) {
                    player1.velocity.y = 0;
                    player1.position.y = this.bottom - (player1.height - movePlatform);
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
                this.bottom = -20
            }

            //check if platform moved off canvas
            if(this.bottom > backgroundImg.height){
                //remove platform from array
                platforms.splice(platforms.indexOf(this), 1)

                //create new platform at the top of canvas
                let newPlatBottom = -10;
                let lastPlatform = platforms[platforms.length - 1]
                if(lastPlatform){
                    newPlatBottom = lastPlatform.bottom - 120
                }
                let newPlatform = new SolidPlatform(newPlatBottom)
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
            if(player1.position.y == 0){
                player1.playerImage = playerImg
            }
            if(player1.velocity.y == 0){
                player1.playerImage = fallPlayerImg
            }
            if(player1.velocity.y !== 0){
                player1.playerImage = jumpPlayerImg
            }
        }

    }

//creates SolidPlatform
function solidPlatform(){
    let startPlat = 120
    for(let i = 7; i > 0; i--){
        let platGap = 120
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


function gameOver(){
    if(firstJump && 
    (player1.position.y + player1.height == backgroundImg.height) &&
    (platforms[0].bottom !== 840 && platforms[0].bottom !== 841.50)){
        isGameOver = true;
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
            movePlatform = 1.5
            player1.position = {
                x: backgroundImg.width/2 - 45,
                y: backgroundImg.height - 75,
            }
            player1.velocity = {
              x: 0,
              y: 1,
            }
            player1.canJump = true;
            document.querySelector('#score').style.visibility = 'hidden'
            document.querySelector('#high-score').style.visibility = 'hidden'
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
            canvas.style.backgroundImage = "url('./assets/background.png')"
            startBtn.style.visibility = 'hidden'
            gameTitle.style.visibility = 'hidden'
        }
    })
}
startGame()

function scoreArr(){
    setInterval(() => {
        if(isGameOver){
            if(!scores.includes(score)){
                scores.push(score)
            }
        }
    }, 500);
}
scoreArr()


function showScore(){
    let scoreText = document.querySelector('#score')
    let highScoreText = document.querySelector('#high-score')
    if(isGameOver){
        highScoreText.style.visibility = 'visible'
        scoreText.style.visibility = 'visible'
        
        scoreText.innerHTML = "SCORE " + score
        highScoreText.innerHTML = "HIGHSCORE " + getHighScore(scores)
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
            player1.velocity.x = 5.25;
        }
        if (keys.a.pressed) {
            player1.velocity.x = -5.25;
        }
    }
    animate()
}
