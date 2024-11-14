// Configurações do jogo
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

let playerWidth = 50;
let playerHeight = 30;
let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height - playerHeight - 10;
let playerSpeed = 5;

let bullets = [];
let enemies = [];
let enemySpeed = 2;
let score = 0;
let gameOver = false;

// Propriedades dos tiros
const bulletWidth = 5;
const bulletHeight = 10;
const bulletSpeed = 5;

// Variáveis para controle do disparo contínuo
let autoFire = false;  // Controle do disparo automático
let autoFireInterval;   // Intervalo do disparo contínuo

// Função para desenhar o jogador
function drawPlayer() {
    ctx.fillStyle = "lightblue";
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);
}

// Função para desenhar os tiros
function drawBullets() {
    ctx.fillStyle = "red";
    for (let i = 0; i < bullets.length; i++) {
        ctx.fillRect(bullets[i].x, bullets[i].y, bulletWidth, bulletHeight);
    }
}

// Função para desenhar os inimigos
function drawEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        ctx.fillStyle = "green";
        ctx.fillRect(enemies[i].x, enemies[i].y, 40, 30);
    }
}

// Função para movimentar o jogador
function movePlayer() {
    if (keys["ArrowLeft"] && playerX > 0) {
        playerX -= playerSpeed;
    }
    if (keys["ArrowRight"] && playerX + playerWidth < canvas.width) {
        playerX += playerSpeed;
    }
}

// Função para movimentar os tiros
function moveBullets() {
    for (let i = 0; i < bullets.length; i++) {
        bullets[i].y -= bulletSpeed;

        // Verificar se o tiro saiu da tela
        if (bullets[i].y < 0) {
            bullets.splice(i, 1);
            i--;
        }
    }
}

// Função para criar inimigos aleatoriamente
function createEnemy() {
    if (Math.random() < 0.02) {  // Chance de gerar um inimigo
        let randomX = Math.random() * (canvas.width - 40); // Posição aleatória no eixo X
        enemies.push({ x: randomX, y: 0, speed: Math.random() * 2 + 1 }); // Velocidade aleatória
    }
}

// Função para movimentar os inimigos
function moveEnemies() {
    for (let i = 0; i < enemies.length; i++) {
        enemies[i].y += enemies[i].speed; // Os inimigos se movem para baixo
    }
}

// Função para detectar colisões
function detectCollisions() {
    // Verificar colisão entre tiros e inimigos
    for (let i = 0; i < bullets.length; i++) {
        for (let j = 0; j < enemies.length; j++) {
            if (
                bullets[i].x < enemies[j].x + 40 &&
                bullets[i].x + bulletWidth > enemies[j].x &&
                bullets[i].y < enemies[j].y + 30 &&
                bullets[i].y + bulletHeight > enemies[j].y
            ) {
                // Remover inimigo e tiro
                enemies.splice(j, 1);
                bullets.splice(i, 1);
                score++;
                i--;
                break;
            }
        }
    }

    // Verificar se algum inimigo alcançou o jogador
    for (let i = 0; i < enemies.length; i++) {
        if (enemies[i].y + 30 > playerY) {
            gameOver = true;
            break;
        }
    }
}

// Função para desenhar o placar
function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);
}

// Função para desenhar o estado de game over
function drawGameOver() {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("GAME OVER", canvas.width / 2 - 90, canvas.height / 2);
    ctx.fillText("Pressione R para reiniciar", canvas.width / 2 - 150, canvas.height / 2 + 40);
}

// Função para atualizar o jogo
function update() {
    if (gameOver) {
        drawGameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpar a tela
    drawPlayer();
    drawBullets();
    drawEnemies();
    drawScore();

    movePlayer();
    moveBullets();
    moveEnemies();
    createEnemy(); // Chama a função para gerar inimigos aleatórios
    detectCollisions();

    requestAnimationFrame(update);
}

// Função de controle de teclas
let keys = {};

document.addEventListener("keydown", (e) => {
    keys[e.key] = true;
    if (e.key === " ") {
        fireBullet(); // Disparar um tiro
    }
    if (e.key === "k" || e.key === "K") {
        toggleAutoFire();  // Alternar o disparo automático
    }
});

document.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

// Função para disparar tiros
function fireBullet() {
    bullets.push({ x: playerX + playerWidth / 2 - bulletWidth / 2, y: playerY });
}

// Função para alternar o disparo automático
function toggleAutoFire() {
    if (autoFire) {
        // Se o modo automático está ativado, desative
        clearInterval(autoFireInterval);
        autoFire = false;
        console.log("Modo contínuo de disparo desativado");
    } else {
        // Se o modo automático não está ativado, ative
        autoFireInterval = setInterval(fireBullet, 100); // Dispara a cada 100ms (10 tiros por segundo)
        autoFire = true;
        console.log("Modo contínuo de disparo ativado");
    }
}

// Reiniciar o jogo
document.addEventListener("keydown", (event) => {
    if (event.key === "r" && gameOver) {
        playerX = canvas.width / 2 - playerWidth / 2;
        playerY = canvas.height - playerHeight - 10;
        bullets = [];
        score = 0;
        gameOver = false;
        enemies = [];
        update();
    }
});

// Iniciar o jogo
update();
