function rectangularCollision({ rectangle1, rectangle2 }) {
    // Adjust rectangle1's attackBox position based on its current position and offset
    const r1AttackBox = {
        x: rectangle1.attackBox.position.x,
        y: rectangle1.attackBox.position.y,
        width: rectangle1.attackBox.width,
        height: rectangle1.attackBox.height
    };

    // Rectangle2's boundaries
    const r2 = {
        x: rectangle2.position.x,
        y: rectangle2.position.y,
        width: rectangle2.width,
        height: rectangle2.height
    };

    // Collision detection logic
    return (
        r1AttackBox.x + r1AttackBox.width >= r2.x &&
        r1AttackBox.x <= r2.x + r2.width &&
        r1AttackBox.y + r1AttackBox.height >= r2.y &&
        r1AttackBox.y <= r2.y + r2.height
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