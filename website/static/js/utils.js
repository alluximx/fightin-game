function rectangularCollision({ rectangle1, rectangle2 }) {
    // Adjust rectangle1's attackBox position based on its current position and offset
    const r1AttackBox = {
        x: rectangle1.position.x,
        y: rectangle1.position.y,
        width: rectangle1.attackBox.width,
        height: rectangle1.attackBox.height
    };

    // Rectangle2's boundaries
    const r2 = {
        x: rectangle2.position.x + rectangle2.attackBox.offset.x,
        y: rectangle2.position.y + rectangle2.attackBox.offset.y,
        width: rectangle2.width / 4,
        height: rectangle2.height
    };

    // c.fillRect(r1AttackBox.x, r1AttackBox.y, r1AttackBox.width, r1AttackBox.height);
    // c.fillRect(r2.x, r2.y, r2.width, r2.height);
    // c.fill
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
    clearTimeout(timerId)
    document.querySelector('#displayText').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie'
    } else if (player.health > enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
    } else if (player.health < enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
    }
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