function rectangularCollision({ rectangle1, rectangle2 }) {
    const proximityThreshold = 200; // Increased from 100 to 200, adjust as needed

    // Calculate the center points of both rectangles
    const r1Center = {
        x: rectangle1.position.x + rectangle1.width / 2,
        y: rectangle1.position.y + rectangle1.height / 2
    };
    const r2Center = {
        x: rectangle2.position.x + rectangle2.width / 2,
        y: rectangle2.position.y + rectangle2.height / 2
    };

    // Calculate the distance between the centers
    const distance = Math.sqrt(
        Math.pow(r1Center.x - r2Center.x, 2) + 
        Math.pow(r1Center.y - r2Center.y, 2)
    );

    // Check if the distance is within the proximity threshold
    if (distance > proximityThreshold) {
        return false;
    }

    // If within proximity, perform a more lenient collision check
    return (
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        Math.abs(rectangle1.position.y - rectangle2.position.y) < 100 // Vertical proximity check
    );
}

function drawAttackBox(entity) {
    if (entity.isAttacking) {
        c.fillStyle = 'rgba(255, 0, 0, 0.5)'; // Semi-transparent red
        const attackBox = {
            x: entity.position.x + entity.attackBox.offset.x,
            y: entity.position.y + entity.attackBox.offset.y,
            width: entity.attackBox.width,
            height: entity.attackBox.height
        };

    }
}

function determineWinner({ player, enemy, timerId }) {
    if (!gameEnded) {
        clearTimeout(timerId);
        document.querySelector('#displayText').style.display = 'flex';
        if (player.health === enemy.health) {
            document.querySelector('#displayText').innerHTML = 'Tie';
        } else if (player.health > enemy.health) {
            document.querySelector('#displayText').innerHTML = 'Zerto Player Wins';
        } else if (player.health < enemy.health) {
            document.querySelector('#displayText').innerHTML = 'Player 2 Wins';
        }
        gameEnded = true;
        setTimeout(showPlayAgainImage, 5000);
    }
}

function showPlayAgainImage() {
    const playNowDiv = document.querySelector('.play-now');
    playNowDiv.innerHTML = ''; // Clear the canvas and game info

    const playAgainImageElement = document.createElement('img');
    playAgainImageElement.src = playAgainImage.src;
    playAgainImageElement.classList.add('play-again-btn'); // Add a class to the image element
    playNowDiv.appendChild(playAgainImageElement);

    // Attach a click event listener to the image element
    const playAgainBtn = document.querySelector('.play-again-btn');
    playAgainBtn.addEventListener('click', gameReset);

}

let timer = 60
let timerId

function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    if (timer === 0) {
        determineWinner({ player, enemy, timerId })
    }
}