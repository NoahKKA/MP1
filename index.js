const canvas = document.querySelector('#gamePage')
const c = canvas.getContext('2d')
const gravity = .02;
//create gravity

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

        if(this.velocity.y + this.height + this.position.y < canvas.height){
            this.velocity.y + gravity
        } else {
            this.velocity.y = 0
        }
    }
}

const player = new Player()

let y = 20;
function animate(){
    window.requestAnimationFrame(animate)
    //create canvas
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    //create player
}
animate()
