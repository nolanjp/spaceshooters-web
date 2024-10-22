window.onload = function () {
    const canvas = document.querySelector("canvas");
    const c = canvas.getContext("2d");
    canvas.width = 600; 
    canvas.height = 400; 
  
    const player = {
        x: canvas.width / 2 - 32,
        y: canvas.height - 70,
        width: 64,
        height: 64,
        speed: 8,
        img: new Image(),
        draw() {
            c.drawImage(this.img, this.x, this.y, this.width, this.height);
        }
    };
    player.img.src = "images/heroShip.png"; 
  
    const enemyImg = new Image();
    enemyImg.src = "images/enemy.png";
  
    const healthkitImg = new Image();
    healthkitImg.src = "images/healthkit.png"; 
  
    let bullets = [], enemies = [], healthkits = [], score = 0, health = 100, gameStarted = false;
    let enemySpawnInterval, healthkitSpawnInterval;
  
    function startGame() {
        gameStarted = true;
        score = 0;
        health = 100;
        bullets = [];
        enemies = [];
        healthkits = [];
        document.getElementById('start-button').style.display = 'none'; 
        animate();
        startSpawning();
    }
  
    function startSpawning() {
        clearInterval(enemySpawnInterval);
        clearInterval(healthkitSpawnInterval);
  
        enemySpawnInterval = setInterval(() => {
            if (gameStarted) {
                enemies.push({
                    x: Math.random() * (canvas.width - 32),
                    y: -32,
                    speed: Math.random() * 1 + 1,
                    img: enemyImg
                });
            }
        }, 800);
  
        healthkitSpawnInterval = setInterval(() => {
            if (gameStarted) {
                healthkits.push({
                    x: Math.random() * (canvas.width - 32),
                    y: -32,
                    img: healthkitImg
                });
            }
        }, 15000);
    }
  
    function animate() {
        if (!gameStarted) return;
        c.clearRect(0, 0, canvas.width, canvas.height);
        player.draw();
        drawText(`Health: ${health}`, 10, 20);
        drawText(`Score: ${score}`, canvas.width - 100, 20);
  
        updateBullets();
        updateEnemies();
        updateHealthkits();
  
        checkCollisions();
        requestAnimationFrame(animate);
    }
  
    function drawText(text, x, y) {
        c.fillStyle = 'white';
        c.font = "20px Arial";
        c.fillText(text, x, y);
    }
  
    function updateBullets() {
        bullets = bullets.filter(bullet => {
            bullet.y -= 4;
            c.fillStyle = "white";
            c.fillRect(bullet.x, bullet.y, 6, 8);
            return bullet.y > 0;
        });
    }
  
    function updateEnemies() {
        enemies = enemies.filter(enemy => {
            enemy.y += enemy.speed;
            c.drawImage(enemy.img, enemy.x, enemy.y, 32, 32); 
            if (enemy.y > canvas.height) {
                health -= 10;
                return false;
            }
            return true;
        });
        if (health <= 0) gameOver();
    }
  
    function updateHealthkits() {
        healthkits = healthkits.filter(kit => {
            kit.y += 1.5;
            c.drawImage(kit.img, kit.x, kit.y, 32, 32);
            return kit.y <= canvas.height;
        });
    }
  
    function checkCollisions() {
        bullets = bullets.filter(bullet => {
            let bulletHit = false;
            enemies = enemies.filter(enemy => {
                if (!bulletHit && isCollision(bullet, enemy, 6, 8, 32, 32)) {
                    score += 10;
                    bulletHit = true;
                    return false;
                }
                return true;
            });
            return !bulletHit;
        });
  
        healthkits = healthkits.filter(kit => {
            if (isCollision(kit, player, 32, 32, player.width, player.height)) {
                health = Math.min(health + 20, 100);
                return false;
            }
            return true;
        });
    }
  
    function isCollision(obj1, obj2, w1, h1, w2, h2) {
        return obj1.x < obj2.x + w2 && obj1.x + w1 > obj2.x && obj1.y < obj2.y + h2 && obj1.y + h1 > obj2.y;
    }
  
    function gameOver() {
        gameStarted = false;
        const alertBox = document.createElement('div');
        alertBox.classList.add('alert-box');
        alertBox.innerHTML = `
          <p>Game Over! Your score was ${score}</p>
          <button id="restart-btn">Restart Game</button>
        `;
        document.body.appendChild(alertBox);
  
        document.getElementById('restart-btn').addEventListener('click', () => {
            document.body.removeChild(alertBox);
            resetGame();
        });
    }
  
    function resetGame() {
        enemies = [];
        bullets = [];
        healthkits = [];
        document.getElementById('start-button').style.display = 'block'; 
    }
  
    const keys = {};
    document.addEventListener("keydown", event => {
        keys[event.code] = true;
        if (event.code === "Space" && gameStarted) bullets.push({ x: player.x + player.width / 2 - 3, y: player.y });
    });
  
    document.addEventListener("keyup", event => {
        keys[event.code] = false; 
    });
  
    function updatePlayerMovement() {
        if (keys["ArrowLeft"]) player.x = Math.max(player.x - player.speed, 0);
        if (keys["ArrowRight"]) player.x = Math.min(player.x + player.speed, canvas.width - player.width);
    }
  
    function gameLoop() {
        updatePlayerMovement();
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
  
    document.getElementById('start-button').addEventListener('click', startGame);
  };  































