//const canvas = document.querySelector('canvas')
const canvas = document.createElement('canvas');
let gameEnded = false;
let gameInit = true;

gsap.ticker.fps(60); // Set target frame rate to 60 FPS


let gameInfoElement = null;


const playNowButton = document.querySelector('.play-now'); // Adjust if the class name for the button is different
const gameReset = () => {

    console.log(gameInit, gameEnded, player.health, enemy.health)

    if (!gameInit && (!gameEnded && player.health > 0 && enemy.health > 0)) {
        // Game is still in progress, do not reset
        console.log("Game is still in progress, do not reset")
        return;
    }

    const playNowDiv = document.querySelector('.play-now'); // This is the container where the game will be displayed
    const gameInfo = document.querySelector('.gameInfo');

    // Store a reference to the gameInfo element
    if (!gameInfoElement) {
        gameInfoElement = gameInfo.cloneNode(true);
    }

    playNowDiv.innerHTML = ''; // Clear existing content

    // Show the game info (health bars and timer)
    gameInfoElement.style.display = 'inline-block'; // Or "block", depending on your layout
    playNowDiv.appendChild(gameInfoElement); // Add the gameInfo element back to the div
    playNowDiv.appendChild(canvas); // Add the canvas to the div

    // Call any initialization functions for your game here, if necessary
    // For example, if you need to initialize the game or restart it, do it here
    canvas.width = 1024; // Set canvas width
    canvas.height = 576; // Set canvas height

    // Reset player and enemy health
    player.health = 100;
    enemy.health = 100;
    document.querySelector('#playerHealth').style.width = '100%';
    document.querySelector('#enemyHealth').style.width = '100%';
    document.querySelector('#displayText').style.display = 'none';

    // Reset player and enemy state
    player.dead = false;
    enemy.dead = false;
    player.isAttacking = false;
    enemy.isAttacking = false;
    player.isBlocking = false;
    enemy.isBlocking = false;
    player.framesCurrent = 0;
    enemy.framesCurrent = 0;

    // Reset player and enemy sprites to their idle state
    player.switchSprite('run');
    enemy.switchSprite('run');

    // Reset player and enemy positions
    player.position = { x: canvas.width / 4, y: 0 };
    enemy.position = { x: 400, y: 100 };

    animate(); // Start the game animation or any initialization function
};

playNowButton.addEventListener('click', gameReset);

const c = canvas.getContext('2d')
const startSound = new Audio('./static/audio/boxing_ring.wav');
const hitSounds = [
    new Audio('./static/audio/1.ogg'),
    new Audio('./static/audio/10.ogg'),
    new Audio('./static/audio/11.ogg')
];

const playAgainImage = new Image();
playAgainImage.src = './static/img/play-again.png';

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
            imageSrc: './static/img/zerto/Uppercut.png',
            framesMax: 6
        },
        attack2: {
            imageSrc: './static/img/zerto/Attack2.png',
            framesMax: 4
        },
        block: {
            imageSrc: './static/img/zerto/Block.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './static/img/zerto/Take Hit - white silhouette.png',
            framesMax: 4
        },
        death: {
            imageSrc: './static/img/zerto/Death.png',
            framesMax: 6
        },
        uppercut: {
            imageSrc: './static/img/zerto/Uppercut.png',
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
        attack2: {
            imageSrc: './static/img/kenji/Attack2.png',
            framesMax: 4
        },
        block: {
            imageSrc: './static/img/kenji/Block.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './static/img/kenji/Take Hit.png',
            framesMax: 4
        },
        death: {
            imageSrc: './static/img/kenji/Death.png',
            framesMax: 6
        },
        uppercut: {
            imageSrc: './static/img/kenji/Uppercut.png',
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
    gameInit = false
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

    if (keys.a.pressed && player.lastKey === 'ArrowLeft') {
        player.velocity.x = -5
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'ArrowRight') {
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
        enemy.takeHit();
        player.isAttacking = false;
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        });
    }


    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false
    }

    if (player.isBlocking && player.framesCurrent === 4) {
        player.isBlocking = false
    }

    // this is where our player gets hit
    if (
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking &&
        enemy.framesCurrent == 0 &&
        enemy.framesCurrent <= 2 &&
        !player.isBlocking // Check if player is not blocking
    ) {
        playHitSound();
        player.takeHit();
        enemy.isAttacking = false;
        gsap.to('#playerHealth', { width: player.health + '%' });
    }

    if (enemy.isBlocking && enemy.framesCurrent === 2) {
        enemy.isBlocking = false
    }

    // if player misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
    }

    // end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        if (!gameEnded) {
            gameEnded = true
            determineWinner({ player, enemy, timerId })
        }
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
            case 'ArrowRight':
                keys.d.pressed = true;
                player.lastKey = 'ArrowRight';
                break;
            case 'ArrowLeft':
                keys.a.pressed = true;
                player.lastKey = 'ArrowLeft';
                break;
            case 'ArrowUp':
                player.velocity.y = -20;
                break;
            case 'A':
                player.attack();
                break;
            case 'a':
                player.attack();
                break;
            case 'S':
                player.attack2();
                break;
            case 's':
                player.attack2();
                break;
            case ' ':
                player.block();
                break;
        }
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowRight':
            keys.d.pressed = false
            break
        case 'ArrowLeft':
            keys.a.pressed = false
            break
    }
})


function enemyAI() {
    if (!enemy.dead) {
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

        // Attack and block logic
        if (!enemy.isAttacking && Math.random() < 0.05) {
            const randomAction = Math.random();
            if (randomAction < 0.6) {
                enemy.attack();
            } else if (randomAction < 0.8) {
                // Slight chance to block
                enemy.block();
            }
        }


        // Ensure enemy doesn't fall through the ground
        if (enemy.position.y + enemy.height + enemy.velocity.y >= canvas.height - 96) {
            enemy.velocity.y = 0;
        }
    }
}