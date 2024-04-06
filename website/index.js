//const canvas = document.querySelector('canvas')
const canvas = document.createElement('canvas');


const playNowButton = document.querySelector('.play-now-2'); // Adjust if the class name for the button is different
playNowButton.addEventListener('click', function() {
    const playNowDiv = document.querySelector('.play-now'); // This is the container where the game will be displayed
    const gameInfo = document.querySelector('.gameInfo');

    playNowDiv.innerHTML = ''; // Clear existing content

    // Show the game info (health bars and timer)
    gameInfo.style.display = 'inline-block'; // Or "block", depending on your layout

    playNowDiv.appendChild(gameInfo); // Add the canvas to the div

    playNowDiv.appendChild(canvas); // Add the canvas to the div

    // Call any initialization functions for your game here, if necessary
    // For example, if you need to initialize the game or restart it, do it here
    canvas.width = 1024; // Set canvas width
    canvas.height = 576; // Set canvas height


    animate(); // Start the game animation or any initialization function
});

const c = canvas.getContext('2d')
const startSound = new Audio('./static/audio/boxing_ring.wav');
const hitSounds = [
    new Audio('./static/audio/1.ogg'),
    new Audio('./static/audio/10.ogg'),
    new Audio('./static/audio/11.ogg')
];
let currentHitSoundIndex = 0;

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

function playHitSound() {
    hitSounds[currentHitSoundIndex].play();
    currentHitSoundIndex = (currentHitSoundIndex + 1) % hitSounds.length;
}

const gravity = 0.7

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './static/img/background.png'
})

const shop = new Sprite({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: './static/img/shop.png',
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: canvas.width / 4, // Adjust this value to move the player closer to the center horizontally
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    imageSrc: './static/img/zerto/Idle.png',
    framesMax: 4,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './static/img/zerto/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './static/img/zerto/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './static/img/zerto/Fall.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './static/img/zerto/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './static/img/zerto/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './static/img/zerto/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './static/img/zerto/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 130,
            y: 100
        },
        width: 100,
        height: 100
    }
})

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: 'blue',
    imageSrc: './static/img/kenji/Idle.png',
    framesMax: 12,
    scale: 1,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './static/img/kenji/Idle.png',
            framesMax: 4,
        },
        run: {
            imageSrc: './static/img/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './static/img/kenji/Fall.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './static/img/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './static/img/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './static/img/kenji/Take Hit.png',
            framesMax: 4
        },
        death: {
            imageSrc: './static/img/kenji/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: -90,
            y: 100
        },
        width: 100,
        height: 100
    }
})


const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer()

function animate() {
    startSound.play();
    enemyAI();
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    c.fillStyle = 'rgba(255, 255, 255, 0)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0
    drawAttackBox(player)
    drawAttackBox(enemy)

    // player movement

    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5
        player.switchSprite('run')
    } else {
        player.switchSprite('run')
    }

    // jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }



    // detect for collision & enemy gets hit
    if (
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking &&
        player.framesCurrent === 2
    ) {
        playHitSound();

        enemy.takeHit()
        player.isAttacking = false

        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    // this is where our player gets hit
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking &&
        enemy.framesCurrent == 0 && // Adjust this value based on the start frame of the attack
        enemy.framesCurrent <= 2 // Adjust this value based on the end frame of the attack
    ) {
        playHitSound();
        player.takeHit();
        enemy.isAttacking = false;
        gsap.to('#playerHealth', { width: player.health + '%' });
    }

    // if player misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId })
    }
}

// animate()


window.addEventListener('keydown', function(event) {
    // Check if the key pressed is the spacebar
    if (event.code === 'Space') {
        // Prevent the default action (scrolling) from happening
        event.preventDefault();
    }

    // Add any additional game-related functionality for the spacebar here
    // For example, making the player character jump
});

window.addEventListener('keydown', (event) => {
    if (!player.dead) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break
            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break
            case 'w':
                player.velocity.y = -20
                break
            case ' ':
                player.attack()
                break
        }
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
    }


})


function enemyAI() {
    const screenCenterX = canvas.width / 2;
    const enemyDistanceFromCenter = enemy.position.x - screenCenterX;
    const moveDirection = Math.random() < 0.5 ? -1 : 1; // Randomly choose a direction for minor movements

    // Basic left and right movement logic with slight randomness
    if (enemyDistanceFromCenter < -50 || Math.random() < 0.1) {
        enemy.velocity.x = 3 * moveDirection; // Move in random direction when too left or occasionally
        enemy.switchSprite('run');
    } else if (enemyDistanceFromCenter > 50 || Math.random() < 0.1) {
        enemy.velocity.x = -3 * moveDirection; // Move in random direction when too right or occasionally
        enemy.switchSprite('run');
    } else {
        // Introduce a slight chance to move in the opposite direction even when in the center
        if (Math.random() < 0.05) {
            enemy.velocity.x = 2 * moveDirection;
            enemy.switchSprite('run');
        } else {
            enemy.velocity.x = 0;
            enemy.switchSprite('idle');
        }
    }

    // Occasionally jump
    if (Math.random() < 0.02 && enemy.position.y >= canvas.height - 96 - enemy.height) { // Check if on ground
        enemy.velocity.y = -15; // Trigger jump
    }

    // Attack logic remains the same
    if (!enemy.isAttacking && Math.random() < 0.05) {
        const randomAction = Math.random();
        if (randomAction < 0.6) {
            enemy.attack();
        }
    }

    // Ensure enemy doesn't fall through the ground
    if (enemy.position.y + enemy.height + enemy.velocity.y >= canvas.height - 96) {
        enemy.velocity.y = 0;
    }
}