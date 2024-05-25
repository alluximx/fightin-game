class Sprite {
    constructor({
        position,
        imageSrc,
        scale = 1,
        framesMax = 1,
        framesHold = 6,
        offset = { x: 0, y: 0 }
    }) {
        this.position = position
        this.width = 625
        this.height = 165
        this.image = new Image()
        this.image.src = imageSrc
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesHold = framesHold // Increase this value to slow down the animation
        this.framesElapsed = 0
        this.offset = offset
    }

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        )
    }

    animateFrames() {
        this.framesElapsed++

            if (this.framesElapsed % this.framesHold === 0) {
                if (this.framesCurrent < this.framesMax - 1) {
                    this.framesCurrent++
                } else {
                    this.framesCurrent = 0
                }
            }
    }

    update() {
        this.draw()
        this.animateFrames()
    }
}

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1.5,
        framesMax = 1,
        blockTimer = 30, // Duration in frames (adjust as needed)
        blockDuration = 15, // Duration in frames (adjust as needed)
        offset = { x: 0, y: 0 },
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined }
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })
        this.blockDuration = blockDuration;
        this.blockTimer = blockTimer;
        this.velocity = velocity
        this.width = 625
        this.height = 165
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 6
        this.sprites = sprites
        this.dead = false

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image()
            sprites[sprite].image.src = sprites[sprite].imageSrc
        }
    }

    update() {
        this.draw()
        if (!this.dead) this.animateFrames()

        // attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        // draw the attack box
        c.fillRect(
            this.attackBox.position.x,
            this.attackBox.position.y,
            this.attackBox.width,
            this.attackBox.height
        )

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        // Decrement the block timer
        if (this.isBlocking) {
            this.blockTimer--;
            if (this.blockTimer <= 0) {
                this.isBlocking = false;
            }
        }

        // gravity function
        if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
            this.velocity.y = 0
            this.position.y = 330
        } else this.velocity.y += gravity
    }

    attack() {
        this.switchSprite('attack1')
        this.isAttacking = true
    }

    attack2() {
        this.switchSprite('attack2')
        this.isAttacking = true
    }

    block() {
        this.switchSprite('block')
        this.blockTimer = this.blockDuration;
        this.isBlocking = true
    }

    takeHit() {
        if (this === enemy) {
            this.health -= 5; // Enemy's getting git do -3 damage
        } else {
            this.health -= 4; // Player's getting hits do -2 damage
        }

        if (this.health <= 0) {
            this.switchSprite('death');
        } else {
            this.switchSprite('takeHit');
        }
    }

    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1)
                if (this.health <= 0) {
                    this.dead = true
                } else 
                {   
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
            return
        }

        // Check if the current animation is the block animation and the block duration is active
        if (
            this.image === this.sprites.block.image &&
            this.blockTimer > 0
        ) {
            return; // Don't switch to other animations if blocking
        }


        // overriding all other animations with the attack animation
        if (
            this.image === this.sprites.attack1.image &&
            this.framesCurrent < this.sprites.attack1.framesMax - 1
        )
            return

        // overriding all other animations with the attack animation
        if (
            this.image === this.sprites.attack2.image &&
            this.framesCurrent < this.sprites.attack2.framesMax - 1
        )
            return

        // override when fighter gets hit
        if (
            this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax - 1
        )
            return

        switch (sprite) {

            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'attack2':
                if (this.image !== this.sprites.attack2.image) {
                    this.image = this.sprites.attack2.image
                    this.framesMax = this.sprites.attack2.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'block':
                if (this.image !== this.sprites.block.image) {
                    this.image = this.sprites.block.image
                    this.framesMax = this.sprites.block.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image
                    this.framesMax = this.sprites.takeHit.framesMax
                    this.framesCurrent = 0
                }
                break

            case 'death':
                console.log(this.health)
                if (this.image !== this.sprites.death.image && this.health <= 0) {
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                }
                break
        }
    }
}