const canvas = document.querySelector('#gamePage')
const c = canvas.getContext('2d')
const gravity = .25;
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
}
//creates player
const player = new Player()

let y = 20;
function animate(){
    window.requestAnimationFrame(animate)
    //create canvas and refreshes to the browser refresh rate.
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()

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
    console.log(event)
    if(event.key === 'd'){
        keys.d.pressed = true
    }
    console.log(keys.d.pressed)
    if(event.key === 'a'){
        keys.a.pressed = true
    }
    if(event.key === 'w'){
        //only jumps whilst not falling
        if(player.velocity.y === 0){
        player.velocity.y = -5
        }
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
