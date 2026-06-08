'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { authClient } from '@/lib/auth-client';
import {
  Mic,
  PenTool,
  Eye,
  Image as ImageIcon,
  Check,
  Zap,
  Globe,
  Lock,
  ArrowRight,
  Send,
  Gamepad2,
  Sparkles,
  Play,
} from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [prompt, setPrompt] = useState('');
  const [creating, setCreating] = useState(false);
  const [activePlayGame, setActivePlayGame] = useState<{ title: string; code: string } | null>(null);

  const handlePromptSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    if (!session?.user) {
      router.push(`/account/signin?callbackUrl=/dashboard`);
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: prompt.slice(0, 60), prompt }),
      });
      if (!res.ok) throw new Error('Failed to create game');
      const { game } = (await res.json()) as { game: { id: string } };
      router.push(`/game/${game.id}?prompt=${encodeURIComponent(prompt)}`);
    } catch (err) {
      console.error(err);
      setCreating(false);
    }
  };

  const examplePrompts = [
    '🕹️ Flappy bird clone',
    '🐍 Snake game with power-ups',
    '🧱 Breakout with neon theme',
    '🚀 Space shooter arcade',
  ];

  const demoGames = [
    {
      title: 'Emerald Serpent',
      genre: 'Classic Grid',
      description: 'A polished, grid-based retro snake game utilizing terracotta and charcoal canvas rendering.',
      icon: <Gamepad2 className="w-6 h-6 text-[#C25E43]" />,
      code: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Snake</title><style>body { margin: 0; background: #FBF9F6; color: #191919; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; } #gameCanvas { background: #191919; border: 4px solid #E5E0D8; border-radius: 8px; } #score { font-size: 20px; font-weight: bold; margin-bottom: 10px; color: #191919; } .hint { font-size: 12px; color: #6E6D6A; margin-top: 10px; } #gameOver { display: none; position: absolute; text-align: center; background: rgba(251, 249, 246, 0.95); border: 1px solid #E5E0D8; padding: 20px; border-radius: 8px; } button { background: #191919; color: #FBF9F6; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px; }</style></head><body><div id="score">Score: 0</div><canvas id="gameCanvas" width="400" height="400"></canvas><div class="hint">Use Arrow keys or WASD to move</div><div id="gameOver"><h2 style="margin: 0 0 10px 0; font-family: Georgia, serif;">Game Over</h2><p id="finalScore"></p><button onclick="resetGame()">Play Again</button></div><script>const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d'); const scoreEl = document.getElementById('score'); const gameOverEl = document.getElementById('gameOver'); const finalScoreEl = document.getElementById('finalScore'); const grid = 20; let count = 0; let score = 0; let running = true; let snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 4 }; let apple = { x: 320, y: 320 }; function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min)) + min; } function resetGame() { snake.x = 160; snake.y = 160; snake.cells = []; snake.maxCells = 4; snake.dx = grid; snake.dy = 0; score = 0; scoreEl.innerText = "Score: " + score; gameOverEl.style.display = 'none'; getRandomApple(); running = true; } function getRandomApple() { apple.x = getRandomInt(0, 20) * grid; apple.y = getRandomInt(0, 20) * grid; } function loop() { if (!running) return; requestAnimationFrame(loop); if (++count < 6) { return; } count = 0; ctx.clearRect(0,0,canvas.width,canvas.height); snake.x += snake.dx; snake.y += snake.dy; if (snake.x < 0) snake.x = canvas.width - grid; else if (snake.x >= canvas.width) snake.x = 0; if (snake.y < 0) snake.y = canvas.height - grid; else if (snake.y >= canvas.height) snake.y = 0; snake.cells.unshift({x: snake.x, y: snake.y}); if (snake.cells.length > snake.maxCells) { snake.cells.pop(); } ctx.fillStyle = '#C25E43'; ctx.fillRect(apple.x, apple.y, grid-1, grid-1); ctx.fillStyle = '#8E9E8C'; snake.cells.forEach(function(cell, index) { ctx.fillRect(cell.x, cell.y, grid-1, grid-1); if (cell.x === apple.x && cell.y === apple.y) { snake.maxCells++; score += 10; scoreEl.innerText = "Score: " + score; getRandomApple(); } for (let i = index + 1; i < snake.cells.length; i++) { if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) { running = false; finalScoreEl.innerText = "Final Score: " + score; gameOverEl.style.display = 'block'; } } }); } document.addEventListener('keydown', function(e) { if (e.which === 37 && snake.dx === 0) { snake.dx = -grid; snake.dy = 0; } else if (e.which === 38 && snake.dy === 0) { snake.dy = -grid; snake.dx = 0; } else if (e.which === 39 && snake.dx === 0) { snake.dx = grid; snake.dy = 0; } else if (e.which === 40 && snake.dy === 0) { snake.dy = grid; snake.dx = 0; } }); requestAnimationFrame(loop);</script></body></html>`
    },
    {
      title: 'Skyward Flutter',
      genre: 'Avoidance Arcade',
      description: 'A physics-based jump and dodge retro flappy game. Guide the terracotta bird through gaps.',
      icon: <Sparkles className="w-6 h-6 text-[#C25E43]" />,
      code: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Flappy Bird</title><style>body { margin: 0; background: #FBF9F6; color: #191919; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; } #gameCanvas { background: #F5F2EC; border: 4px solid #E5E0D8; border-radius: 8px; } #score { font-size: 20px; font-weight: bold; margin-bottom: 10px; } .hint { font-size: 12px; color: #6E6D6A; margin-top: 10px; } #gameOver { display: none; position: absolute; text-align: center; background: rgba(251, 249, 246, 0.95); border: 1px solid #E5E0D8; padding: 20px; border-radius: 8px; } button { background: #191919; color: #FBF9F6; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px; }</style></head><body><div id="score">Score: 0</div><canvas id="gameCanvas" width="320" height="480"></canvas><div class="hint">Press Space or Click to Jump</div><div id="gameOver"><h2 style="margin: 0 0 10px 0; font-family: Georgia, serif;">Game Over</h2><p id="finalScore"></p><button onclick="resetGame()">Play Again</button></div><script>const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d'); const scoreEl = document.getElementById('score'); const gameOverEl = document.getElementById('gameOver'); const finalScoreEl = document.getElementById('finalScore'); let score = 0; let running = true; let bird = { x: 50, y: 150, velocity: 0, gravity: 0.25, jump: -5.0, radius: 12 }; let pipes = []; let pipeWidth = 50; let pipeGap = 120; let pipeSpeed = 2; let frameCount = 0; function resetGame() { bird.y = 150; bird.velocity = 0; pipes = []; score = 0; scoreEl.innerText = "Score: " + score; gameOverEl.style.display = 'none'; frameCount = 0; running = true; } function spawnPipe() { let minHeight = 50; let maxHeight = canvas.height - pipeGap - minHeight; let height = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight; pipes.push({ x: canvas.width, top: height, bottom: canvas.height - height - pipeGap, passed: false }); } function jump() { if (!running) return; bird.velocity = bird.jump; } document.addEventListener('keydown', function(e) { if (e.code === 'Space') { e.preventDefault(); jump(); } }); canvas.addEventListener('mousedown', function(e) { e.preventDefault(); jump(); }); function loop() { if (!running) return; requestAnimationFrame(loop); ctx.clearRect(0, 0, canvas.width, canvas.height); bird.velocity += bird.gravity; bird.y += bird.velocity; ctx.fillStyle = '#C25E43'; ctx.beginPath(); ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2); ctx.fill(); if (bird.y + bird.radius >= canvas.height || bird.y - bird.radius <= 0) { endGame(); } if (frameCount % 100 === 0) { spawnPipe(); } frameCount++; ctx.fillStyle = '#191919'; for (let i = pipes.length - 1; i >= 0; i--) { let p = pipes[i]; p.x -= pipeSpeed; ctx.fillRect(p.x, 0, pipeWidth, p.top); ctx.fillRect(p.x, canvas.height - p.bottom, pipeWidth, p.bottom); if ( bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + pipeWidth && (bird.y - bird.radius < p.top || bird.y + bird.radius > canvas.height - p.bottom) ) { endGame(); } if (!p.passed && p.x + pipeWidth < bird.x) { p.passed = true; score++; scoreEl.innerText = "Score: " + score; } if (p.x + pipeWidth < 0) { pipes.splice(i, 1); } } } function endGame() { running = false; finalScoreEl.innerText = "Final Score: " + score; gameOverEl.style.display = 'block'; } spawnPipe(); requestAnimationFrame(loop);</script></body></html>`
    },
    {
      title: 'Grid Breaker',
      genre: 'Brick Breaker',
      description: 'A minimalist breakout clone. Move your mouse or touch the screen to guide the slider paddle.',
      icon: <Gamepad2 className="w-6 h-6 text-[#C25E43]" />,
      code: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Breakout</title><style>body { margin: 0; background: #FBF9F6; color: #191919; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; } #gameCanvas { background: #191919; border: 4px solid #E5E0D8; border-radius: 8px; } #score { font-size: 20px; font-weight: bold; margin-bottom: 10px; } .hint { font-size: 12px; color: #6E6D6A; margin-top: 10px; } #gameOver { display: none; position: absolute; text-align: center; background: rgba(251, 249, 246, 0.95); border: 1px solid #E5E0D8; padding: 20px; border-radius: 8px; } button { background: #191919; color: #FBF9F6; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px; }</style></head><body><div id="score">Score: 0</div><canvas id="gameCanvas" width="400" height="400"></canvas><div class="hint">Move mouse to slide paddle</div><div id="gameOver"><h2 style="margin: 0 0 10px 0; font-family: Georgia, serif;">Game Over</h2><p id="finalScore"></p><button onclick="resetGame()">Play Again</button></div><script>const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d'); const scoreEl = document.getElementById('score'); const gameOverEl = document.getElementById('gameOver'); const finalScoreEl = document.getElementById('finalScore'); let score = 0; let running = true; let ball = { x: 200, y: 280, dx: 3, dy: -3, radius: 8 }; let paddle = { x: 160, y: 370, width: 80, height: 12 }; let brickRows = 4; let brickCols = 6; let brickWidth = 55; let brickHeight = 15; let brickPadding = 6; let brickOffsetTop = 40; let brickOffsetLeft = 20; let bricks = []; function initBricks() { bricks = []; for (let r = 0; r < brickRows; r++) { bricks[r] = []; for (let c = 0; c < brickCols; c++) { bricks[r][c] = { x: 0, y: 0, status: 1 }; } } } function resetGame() { ball.x = 200; ball.y = 280; ball.dx = 3; ball.dy = -3; paddle.x = 160; score = 0; scoreEl.innerText = "Score: " + score; gameOverEl.style.display = 'none'; initBricks(); running = true; } canvas.addEventListener('mousemove', function(e) { let rect = canvas.getBoundingClientRect(); let rootX = e.clientX - rect.left; paddle.x = rootX - paddle.width / 2; if (paddle.x < 0) paddle.x = 0; if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width; }); function collisionDetection() { for (let r = 0; r < brickRows; r++) { for (let c = 0; c < brickCols; c++) { let b = bricks[r][c]; if (b.status === 1) { if ( ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight ) { ball.dy = -ball.dy; b.status = 0; score += 10; scoreEl.innerText = "Score: " + score; if (checkWin()) { endGame(true); } } } } } } function checkWin() { for (let r = 0; r < brickRows; r++) { for (let c = 0; c < brickCols; c++) { if (bricks[r][c].status === 1) return false; } } return true; } function loop() { if (!running) return; requestAnimationFrame(loop); ctx.clearRect(0, 0, canvas.width, canvas.height); for (let r = 0; r < brickRows; r++) { for (let c = 0; c < brickCols; c++) { if (bricks[r][c].status === 1) { let bx = c * (brickWidth + brickPadding) + brickOffsetLeft; let by = r * (brickHeight + brickPadding) + brickOffsetTop; bricks[r][c].x = bx; bricks[r][c].y = by; ctx.fillStyle = r === 0 ? '#C25E43' : r === 1 ? '#D97706' : r === 2 ? '#8E9E8C' : '#6E6D6A'; ctx.fillRect(bx, by, brickWidth, brickHeight); } } } ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); ctx.fillStyle = '#FBF9F6'; ctx.fill(); ctx.closePath(); ctx.fillStyle = '#C25E43'; ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height); collisionDetection(); if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) { ball.dx = -ball.dx; } if (ball.y + ball.dy < ball.radius) { ball.dy = -ball.dy; } else if (ball.y + ball.dy > canvas.height - ball.radius) { if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) { ball.dy = -ball.dy; } else { endGame(false); } } ball.x += ball.dx; ball.y += ball.dy; } function endGame(win) { running = false; finalScoreEl.innerText = win ? "You Win! Score: " + score : "Final Score: " + score; gameOverEl.style.display = 'block'; } initBricks(); requestAnimationFrame(loop);</script></body></html>`
    },
    {
      title: 'Cosmic Defender',
      genre: 'Space Shooter',
      description: 'Defend your spaceship from invading slate rocks. Shoot laser beams using space or click.',
      icon: <Sparkles className="w-6 h-6 text-[#C25E43]" />,
      code: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Cosmic Defender</title><style>body { margin: 0; background: #FBF9F6; color: #191919; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; } #gameCanvas { background: #111; border: 4px solid #E5E0D8; border-radius: 8px; } #score { font-size: 20px; font-weight: bold; margin-bottom: 10px; } .hint { font-size: 12px; color: #6E6D6A; margin-top: 10px; } #gameOver { display: none; position: absolute; text-align: center; background: rgba(251, 249, 246, 0.95); border: 1px solid #E5E0D8; padding: 20px; border-radius: 8px; } button { background: #191919; color: #FBF9F6; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px; }</style></head><body><div id="score">Score: 0</div><canvas id="gameCanvas" width="360" height="450"></canvas><div class="hint">Move mouse to guide ship, Click to Shoot</div><div id="gameOver"><h2 style="margin: 0 0 10px 0; font-family: Georgia, serif;">Game Over</h2><p id="finalScore"></p><button onclick="resetGame()">Play Again</button></div><script>const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d'); const scoreEl = document.getElementById('score'); const gameOverEl = document.getElementById('gameOver'); const finalScoreEl = document.getElementById('finalScore'); let score = 0; let running = true; let player = { x: 165, y: 400, width: 30, height: 20 }; let bullets = []; let enemies = []; let particles = []; let enemySpeed = 1.5; let spawnTimer = 0; function resetGame() { bullets = []; enemies = []; particles = []; player.x = 165; score = 0; scoreEl.innerText = "Score: " + score; gameOverEl.style.display = 'none'; enemySpeed = 1.5; spawnTimer = 0; running = true; } canvas.addEventListener('mousemove', function(e) { let rect = canvas.getBoundingClientRect(); let rootX = e.clientX - rect.left; player.x = rootX - player.width / 2; if (player.x < 0) player.x = 0; if (player.x + player.width > canvas.width) player.x = canvas.width - player.width; }); canvas.addEventListener('mousedown', function(e) { e.preventDefault(); if (!running) return; bullets.push({ x: player.x + player.width / 2 - 2, y: player.y - 6, width: 4, height: 10, speed: 6 }); }); document.addEventListener('keydown', function(e) { if (e.code === 'Space') { e.preventDefault(); if (!running) return; bullets.push({ x: player.x + player.width / 2 - 2, y: player.y - 6, width: 4, height: 10, speed: 6 }); } }); function spawnEnemy() { enemies.push({ x: Math.random() * (canvas.width - 25), y: -30, width: 25, height: 20, speed: enemySpeed }); } function createExplosion(x, y) { for (let i = 0; i < 8; i++) { particles.push({ x: x, y: y, dx: (Math.random() - 0.5) * 4, dy: (Math.random() - 0.5) * 4, life: 25, color: '#C25E43' }); } } function loop() { if (!running) return; requestAnimationFrame(loop); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#C25E43'; ctx.fillRect(player.x, player.y, player.width, player.height); ctx.fillStyle = '#FBF9F6'; for (let i = bullets.length - 1; i >= 0; i--) { let b = bullets[i]; b.y -= b.speed; ctx.fillRect(b.x, b.y, b.width, b.height); if (b.y < 0) bullets.splice(i, 1); } if (spawnTimer++ % 60 === 0) { spawnEnemy(); } ctx.fillStyle = '#8E9E8C'; for (let i = enemies.length - 1; i >= 0; i--) { let en = enemies[i]; en.y += en.speed; ctx.fillRect(en.x, en.y, en.width, en.height); if ( en.x < player.x + player.width && en.x + en.width > player.x && en.y < player.y + player.height && en.y + en.height > player.y ) { endGame(); } for (let j = bullets.length - 1; j >= 0; j--) { let b = bullets[j]; if ( b.x < en.x + en.width && b.x + b.width > en.x && b.y < en.y + en.height && b.y + b.height > en.y ) { createExplosion(en.x + en.width/2, en.y + en.height/2); enemies.splice(i, 1); bullets.splice(j, 1); score += 10; scoreEl.innerText = "Score: " + score; if (score % 100 === 0) enemySpeed += 0.2; break; } } if (en.y > canvas.height) { endGame(); } } for (let i = particles.length - 1; i >= 0; i--) { let p = particles[i]; p.x += p.dx; p.y += p.dy; p.life--; ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, 3, 3); if (p.life <= 0) particles.splice(i, 1); } } function endGame() { running = false; finalScoreEl.innerText = "Final Score: " + score; gameOverEl.style.display = 'block'; } requestAnimationFrame(loop);</script></body></html>`
    },
    {
      title: 'Classic Pong',
      genre: 'Retro Sports',
      description: 'The definitive table tennis arcade game. Defeat the CPU by sliding your paddle vertically.',
      icon: <Gamepad2 className="w-6 h-6 text-[#C25E43]" />,
      code: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Classic Pong</title><style>body { margin: 0; background: #FBF9F6; color: #191919; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; } #gameCanvas { background: #191919; border: 4px solid #E5E0D8; border-radius: 8px; } #score { font-size: 20px; font-weight: bold; margin-bottom: 10px; } .hint { font-size: 12px; color: #6E6D6A; margin-top: 10px; } #gameOver { display: none; position: absolute; text-align: center; background: rgba(251, 249, 246, 0.95); border: 1px solid #E5E0D8; padding: 20px; border-radius: 8px; } button { background: #191919; color: #FBF9F6; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px; }</style></head><body><div id="score">Player: 0 | CPU: 0</div><canvas id="gameCanvas" width="450" height="300"></canvas><div class="hint">Move mouse to guide paddle</div><div id="gameOver"><h2 style="margin: 0 0 10px 0; font-family: Georgia, serif;">Game Over</h2><p id="finalScore"></p><button onclick="resetGame()">Play Again</button></div><script>const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d'); const scoreEl = document.getElementById('score'); const gameOverEl = document.getElementById('gameOver'); const finalScoreEl = document.getElementById('finalScore'); let playerScore = 0; let cpuScore = 0; let running = true; let ball = { x: 225, y: 150, dx: 3, dy: 3, radius: 6 }; let player = { x: 10, y: 110, width: 10, height: 80 }; let cpu = { x: 430, y: 110, width: 10, height: 80 }; function resetGame() { ball.x = 225; ball.y = 150; ball.dx = Math.random() > 0.5 ? 3 : -3; ball.dy = (Math.random() - 0.5) * 4; playerScore = 0; cpuScore = 0; scoreEl.innerText = "Player: " + playerScore + " | CPU: " + cpuScore; gameOverEl.style.display = 'none'; running = true; } canvas.addEventListener('mousemove', function(e) { let rect = canvas.getBoundingClientRect(); let rootY = e.clientY - rect.top; player.y = rootY - player.height / 2; if (player.y < 0) player.y = 0; if (player.y + player.height > canvas.height) player.y = canvas.height - player.height; }); function loop() { if (!running) return; requestAnimationFrame(loop); ctx.clearRect(0,0,canvas.width,canvas.height); ball.x += ball.dx; ball.y += ball.dy; if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) { ball.dy = -ball.dy; } if (cpu.y + cpu.height/2 < ball.y - 10) { cpu.y += 3.2; } else if (cpu.y + cpu.height/2 > ball.y + 10) { cpu.y -= 3.2; } if (cpu.y < 0) cpu.y = 0; if (cpu.y + cpu.height > canvas.height) cpu.y = canvas.height - cpu.height; if (ball.x - ball.radius < player.x + player.width && ball.y > player.y && ball.y < player.y + player.height) { ball.dx = -ball.dx; ball.x = player.x + player.width + ball.radius; } else if (ball.x + ball.radius > cpu.x && ball.y > cpu.y && ball.y < cpu.y + cpu.height) { ball.dx = -ball.dx; ball.x = cpu.x - ball.radius; } if (ball.x < 0) { cpuScore++; scoreEl.innerText = "Player: " + playerScore + " | CPU: " + cpuScore; checkScores(); ball.x = 225; ball.y = 150; ball.dx = 3; } else if (ball.x > canvas.width) { playerScore++; scoreEl.innerText = "Player: " + playerScore + " | CPU: " + cpuScore; checkScores(); ball.x = 225; ball.y = 150; ball.dx = -3; } ctx.fillStyle = '#C25E43'; ctx.fillRect(player.x, player.y, player.width, player.height); ctx.fillStyle = '#8E9E8C'; ctx.fillRect(cpu.x, cpu.y, cpu.width, cpu.height); ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2); ctx.fillStyle = '#FBF9F6'; ctx.fill(); ctx.closePath(); } function checkScores() { if (playerScore >= 5 || cpuScore >= 5) { running = false; finalScoreEl.innerText = playerScore >= 5 ? "You Won! Score: " + playerScore : "CPU Won! Score: " + cpuScore; gameOverEl.style.display = 'block'; } } requestAnimationFrame(loop);</script></body></html>`
    },
    {
      title: 'Brick Puzzle',
      genre: 'Grid Puzzle',
      description: 'Classic block puzzle arcade. Rotate and snap blocks to clear full horizontal lines.',
      icon: <Sparkles className="w-6 h-6 text-[#C25E43]" />,
      code: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Tetris</title><style>body { margin: 0; background: #FBF9F6; color: #191919; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; } #gameCanvas { background: #191919; border: 4px solid #E5E0D8; border-radius: 8px; } #score { font-size: 20px; font-weight: bold; margin-bottom: 10px; } .hint { font-size: 12px; color: #6E6D6A; margin-top: 10px; } #gameOver { display: none; position: absolute; text-align: center; background: rgba(251, 249, 246, 0.95); border: 1px solid #E5E0D8; padding: 20px; border-radius: 8px; } button { background: #191919; color: #FBF9F6; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px; }</style></head><body><div id="score">Score: 0</div><canvas id="gameCanvas" width="240" height="400"></canvas><div class="hint">Use Arrow keys: Left/Right to move, Up to rotate</div><div id="gameOver"><h2 style="margin: 0 0 10px 0; font-family: Georgia, serif;">Game Over</h2><p id="finalScore"></p><button onclick="resetGame()">Play Again</button></div><script>const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d'); const scoreEl = document.getElementById('score'); const gameOverEl = document.getElementById('gameOver'); const finalScoreEl = document.getElementById('finalScore'); const grid = 20; const cols = 12; const rows = 20; let score = 0; let running = true; let board = []; for(let r=0; r<rows; r++) { board[r] = Array(cols).fill(0); } const colors = [null, '#C25E43', '#D97706', '#8E9E8C', '#6E6D6A', '#C25E43', '#D97706', '#8E9E8C']; const shapes = [ [], [[1,1,1,1]], [[1,1,1],[0,1,0]], [[1,1,0],[0,1,1]], [[0,1,1],[1,1,0]], [[1,1,1],[1,0,0]], [[1,1,1],[0,0,1]], [[1,1],[1,1]] ]; let piece = { matrix: [], x: 0, y: 0 }; function resetGame() { score = 0; scoreEl.innerText = "Score: " + score; for(let r=0; r<rows; r++) board[r].fill(0); gameOverEl.style.display = 'none'; spawnPiece(); running = true; } function spawnPiece() { const id = Math.floor(Math.random() * 7) + 1; piece.matrix = shapes[id]; piece.x = Math.floor((cols - piece.matrix[0].length)/2); piece.y = 0; if (collide()) { running = false; finalScoreEl.innerText = "Final Score: " + score; gameOverEl.style.display = 'block'; } } function collide() { for(let r=0; r<piece.matrix.length; r++) { for(let c=0; c<piece.matrix[r].length; c++) { if (piece.matrix[r][c]) { let nextX = piece.x + c; let nextY = piece.y + r; if (nextX < 0 || nextX >= cols || nextY >= rows || (nextY >= 0 && board[nextY][nextX])) return true; } } } return false; } function merge() { for(let r=0; r<piece.matrix.length; r++) { for(let c=0; c<piece.matrix[r].length; c++) { if (piece.matrix[r][c]) { board[piece.y + r][piece.x + c] = piece.matrix[r][c]; } } } } function rotate() { const n = piece.matrix.length; const m = piece.matrix[0].length; let nextMatrix = Array(m).fill().map(() => Array(n).fill(0)); for(let r=0; r<n; r++) { for(let c=0; c<m; c++) { nextMatrix[c][n - 1 - r] = piece.matrix[r][c]; } } const oldMatrix = piece.matrix; piece.matrix = nextMatrix; if (collide()) piece.matrix = oldMatrix; } function drop() { piece.y++; if (collide()) { piece.y--; merge(); clearLines(); spawnPiece(); } } function clearLines() { for(let r=rows-1; r>=0; r--) { if (board[r].every(v => v > 0)) { board.splice(r, 1); board.unshift(Array(cols).fill(0)); score += 100; scoreEl.innerText = "Score: " + score; r++; } } } let dropCounter = 0; function loop(time = 0) { if (!running) return; requestAnimationFrame(loop); dropCounter++; if (dropCounter >= 30) { drop(); dropCounter = 0; } ctx.clearRect(0,0,canvas.width,canvas.height); for(let r=0; r<rows; r++) { for(let c=0; c<cols; c++) { if (board[r][c]) { ctx.fillStyle = colors[board[r][c]]; ctx.fillRect(c*grid, r*grid, grid-1, grid-1); } } } for(let r=0; r<piece.matrix.length; r++) { for(let c=0; c<piece.matrix[r].length; c++) { if (piece.matrix[r][c]) { ctx.fillStyle = '#C25E43'; ctx.fillRect((piece.x + c)*grid, (piece.y + r)*grid, grid-1, grid-1); } } } } document.addEventListener('keydown', function(e) { if (!running) return; if (e.code === 'ArrowLeft') { piece.x--; if (collide()) piece.x++; } else if (e.code === 'ArrowRight') { piece.x++; if (collide()) piece.x--; } else if (e.code === 'ArrowDown') { drop(); } else if (e.code === 'ArrowUp') { rotate(); } }); spawnPiece(); requestAnimationFrame(loop);</script></body></html>`
    },
    {
      title: 'Pixel Runner',
      genre: 'Infinite Runner',
      description: 'Run, jump, and dodge incoming spikes in this pixel-perfect side-scrolling platformer.',
      icon: <Gamepad2 className="w-6 h-6 text-[#C25E43]" />,
      code: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Pixel Runner</title><style>body { margin: 0; background: #FBF9F6; color: #191919; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; } #gameCanvas { background: #F5F2EC; border: 4px solid #E5E0D8; border-radius: 8px; } #score { font-size: 20px; font-weight: bold; margin-bottom: 10px; } .hint { font-size: 12px; color: #6E6D6A; margin-top: 10px; } #gameOver { display: none; position: absolute; text-align: center; background: rgba(251, 249, 246, 0.95); border: 1px solid #E5E0D8; padding: 20px; border-radius: 8px; } button { background: #191919; color: #FBF9F6; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px; }</style></head><body><div id="score">Score: 0</div><canvas id="gameCanvas" width="480" height="270"></canvas><div class="hint">Press Space or Up Arrow or Click to Jump</div><div id="gameOver"><h2 style="margin: 0 0 10px 0; font-family: Georgia, serif;">Game Over</h2><p id="finalScore"></p><button onclick="resetGame()">Play Again</button></div><script>const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d'); const scoreEl = document.getElementById('score'); const gameOverEl = document.getElementById('gameOver'); const finalScoreEl = document.getElementById('finalScore'); let score = 0; let running = true; let groundY = 220; let player = { x: 50, y: groundY - 30, width: 20, height: 30, vy: 0, gravity: 0.6, jumpForce: -10, grounded: true }; let obstacles = []; let spawnRate = 90; let frameCount = 0; let gameSpeed = 4; function resetGame() { score = 0; scoreEl.innerText = "Score: " + score; player.y = groundY - player.height; player.vy = 0; player.grounded = true; obstacles = []; gameSpeed = 4; frameCount = 0; gameOverEl.style.display = 'none'; running = true; } function jump() { if (player.grounded && running) { player.vy = player.jumpForce; player.grounded = false; } } document.addEventListener('keydown', function(e) { if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); } }); canvas.addEventListener('mousedown', function(e) { e.preventDefault(); jump(); }); function spawnObstacle() { let height = Math.random() * 30 + 15; obstacles.push({ x: canvas.width, y: groundY - height, width: 15, height: height }); } function loop() { if (!running) return; requestAnimationFrame(loop); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.strokeStyle = '#E5E0D8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(canvas.width, groundY); ctx.stroke(); player.vy += player.gravity; player.y += player.vy; if (player.y + player.height >= groundY) { player.y = groundY - player.height; player.vy = 0; player.grounded = true; } ctx.fillStyle = '#C25E43'; ctx.fillRect(player.x, player.y, player.width, player.height); if (frameCount++ % spawnRate === 0) { spawnObstacle(); spawnRate = Math.max(50, 90 - Math.floor(score / 50) * 5); } ctx.fillStyle = '#191919'; for (let i = obstacles.length - 1; i >= 0; i--) { let obs = obstacles[i]; obs.x -= gameSpeed; ctx.fillRect(obs.x, obs.y, obs.width, obs.height); if ( player.x < obs.x + obs.width && player.x + player.width > obs.x && player.y < obs.y + obs.height && player.y + player.height > obs.y ) { endGame(); } if (obs.x + obs.width < 0) { obstacles.splice(i, 1); score += 10; scoreEl.innerText = "Score: " + score; if (score % 100 === 0) { gameSpeed += 0.5; } } } } function endGame() { running = false; finalScoreEl.innerText = "Final Score: " + score; gameOverEl.style.display = 'block'; } requestAnimationFrame(loop);</script></body></html>`
    }
  ];

  const pricing = [
    {
      name: 'Sandbox',
      price: '$0',
      description: 'Test mechanics and compile retro creations.',
      features: ['15 build runs / mo', 'Full browser testing', 'Shareable game URLs'],
      button: 'Start Building',
      highlight: false,
    },
    {
      name: 'Developer',
      price: '$29',
      description: 'For creators, developers, and power builders.',
      features: ['Unlimited game builds', 'Custom logic injections', 'Download source HTML', 'Dedicated engine queue'],
      button: 'Upgrade to Dev',
      highlight: true,
    },
    {
      name: 'Studio',
      price: 'Custom',
      description: 'For classrooms, studios, and custom deployments.',
      features: ['Custom asset uploads', 'LTI educational hooks', 'Shared team folders', 'SLA support lines'],
      button: 'Contact Sales',
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#191919] selection:bg-[#C25E43]/20 font-sans">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="bg-[#F5F2EC] text-[#6E6D6A] border-[#E5E0D8] hover:bg-[#E6E1DA] mb-6 py-1.5 px-4 rounded-full font-medium text-xs shadow-none">
              Build games with AI — no code needed
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-6xl md:text-8xl font-serif font-black tracking-tight mb-8 text-[#191919]"
          >
            Khel <span className="italic text-[#C25E43]">AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-xl md:text-2xl text-[#6E6D6A] font-serif max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Describe your game. Watch it come to life. Share it with the world.
          </motion.p>

          {/* Chat Input */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <form onSubmit={(e) => void handlePromptSubmit(e)}>
              <div className="flex flex-col rounded-2xl border border-[#E5E0D8] bg-white p-4 focus-within:border-[#C25E43] focus-within:ring-1 focus-within:ring-[#C25E43]/20 transition-all shadow-sm">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your game concept in detail... (e.g. a retro brick breaker with speed powerups, neon colors, and explosive particle effects)"
                  rows={3}
                  disabled={creating}
                  className="w-full bg-transparent text-[#191919] placeholder-[#A09E9B] outline-none text-sm leading-relaxed resize-none min-h-[72px] text-left"
                />
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#E5E0D8]/40">
                  <div className="flex items-center gap-1.5 text-xs text-[#6E6D6A]">
                    <Sparkles size={13} className="text-[#C25E43]" />
                    <span className="font-serif italic">AI game compiler engine active</span>
                  </div>
                  <button
                    type="submit"
                    disabled={creating || !prompt.trim()}
                    className="w-10 h-10 rounded-full bg-[#191919] text-[#FBF9F6] flex items-center justify-center hover:bg-[#C25E43] hover:text-white disabled:bg-[#E5E0D8] disabled:text-[#A09E9B] transition-colors cursor-pointer"
                  >
                    {creating ? (
                      <Sparkles size={16} className="animate-spin" />
                    ) : (
                      <Send size={15} fill="currentColor" className="ml-[1px]" />
                    )}
                  </button>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Example prompts */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-2 mb-10"
          >
            {examplePrompts.map((ex) => (
              <button
                key={ex}
                onClick={() => setPrompt(ex.replace(/^[^\s]+\s/, ''))}
                className="rounded-lg border border-[#E5E0D8] bg-[#F5F2EC]/40 px-3.5 py-1.5 text-xs text-[#6E6D6A] hover:text-[#191919] hover:bg-[#F5F2EC] hover:border-neutral-300 transition-all"
              >
                {ex}
              </button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              size="lg"
              onClick={() => router.push('/dashboard')}
              className="w-full sm:w-auto bg-[#191919] text-[#FBF9F6] hover:bg-[#2E2E2D] rounded-lg px-8 py-5 text-base font-semibold shadow-sm transition-colors"
            >
              Go to Dashboard
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto border border-[#E5E0D8] bg-white text-[#191919] hover:bg-[#F5F2EC] rounded-lg px-8 py-5 text-base font-semibold transition-colors"
            >
              View Examples
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Runtimes and Engines Section */}
      <section className="py-12 border-y border-[#E5E0D8] bg-[#F5F2EC]/25">
        <div className="container mx-auto px-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] font-mono text-[#6E6D6A] mb-8">
            SUPPORTED DESKTOP & MOBILE RUNTIMES
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 items-center max-w-4xl mx-auto text-xs font-mono font-bold text-[#6E6D6A]">
            <div className="py-3 border border-[#E5E0D8]/60 rounded bg-white select-none">HTML5 Canvas</div>
            <div className="py-3 border border-[#E5E0D8]/60 rounded bg-white select-none">WebGL Core</div>
            <div className="py-3 border border-[#E5E0D8]/60 rounded bg-white select-none">Web Audio API</div>
            <div className="py-3 border border-[#E5E0D8]/60 rounded bg-white select-none">ESLint Rules</div>
            <div className="py-3 border border-[#E5E0D8]/60 rounded bg-white select-none">JSON State</div>
            <div className="py-3 border border-[#E5E0D8]/60 rounded bg-white select-none">Vite HMR</div>
          </div>
        </div>
      </section>

      {/* Showcase Grid of Demo Games */}
      <section id="features" className="py-24 md:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="bg-[#F5F2EC] text-[#6E6D6A] border-[#E5E0D8] hover:bg-[#E6E1DA] mb-4 py-1 px-3.5 rounded-full font-medium text-xs shadow-none">
              Instant Sandbox Arena
            </Badge>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-[#191919] mb-4">Playable AI Creations</h2>
            <p className="text-[#6E6D6A] text-sm md:text-base leading-relaxed">
              Test pre-built demo games generated entirely through Khel AI. Tap Quick Play to launch the interactive sandbox immediately.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {demoGames.map((game, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <Card className="bg-white border border-[#E5E0D8] hover:border-neutral-400 transition-all duration-300 h-full group relative overflow-hidden rounded-xl shadow-none">
                  <CardContent className="p-8 relative z-10 flex flex-col h-full justify-between">
                    <div>
                      <div className="w-12 h-12 bg-[#F5F2EC] rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#E6E1DA] transition-colors">
                        {game.icon}
                      </div>
                      <Badge className="bg-[#F5F2EC]/60 text-[#C25E43] hover:bg-[#F5F2EC] border-[#E5E0D8] mb-3 py-0.5 px-2.5 rounded font-medium text-[10px] uppercase tracking-wider shadow-none">
                        {game.genre}
                      </Badge>
                      <h3 className="text-lg font-serif font-bold mb-3 text-[#191919]">{game.title}</h3>
                      <p className="text-[#6E6D6A] text-xs leading-relaxed mb-6">
                        {game.description}
                      </p>
                    </div>
                    <button
                      onClick={() => setActivePlayGame({ title: game.title, code: game.code })}
                      className="w-full py-2.5 px-4 rounded-lg bg-[#191919] text-[#FBF9F6] text-xs font-semibold hover:bg-[#2E2E2D] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Play size={11} fill="currentColor" /> Quick Play
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Callout Section */}
      <section className="py-20 bg-white border-b border-[#E5E0D8]">
        <div className="container mx-auto px-4">
          <div className="relative rounded-xl bg-[#F5F2EC]/45 border border-[#E5E0D8] p-8 md:p-16 text-center max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-[#191919] tracking-tight">
              The direct path from <br /> concept to code.
            </h2>
            <p className="text-[#6E6D6A] text-sm md:text-base max-w-xl mx-auto mb-8 font-serif leading-relaxed">
              Khel AI compiles natural language specifications into isolated, standards-compliant HTML5 games instantly. Playable in the browser, shareable on the web, embeddable anywhere.
            </p>
            <div className="flex flex-col items-center gap-6">
              <Button
                size="lg"
                onClick={() => router.push('/dashboard')}
                className="bg-[#191919] text-[#FBF9F6] hover:bg-[#2E2E2D] rounded-lg px-8 py-4 text-sm font-semibold transition-colors cursor-pointer"
              >
                Start building today
              </Button>
              <div className="flex items-center gap-6 text-[#6E6D6A] font-semibold uppercase tracking-[0.15em] text-[10px] font-mono">
                <span>Secure Sandboxing</span>
                <span className="w-1.5 h-1.5 bg-[#C25E43] rounded-full" />
                <span>Instant Previews</span>
                <span className="w-1.5 h-1.5 bg-[#C25E43] rounded-full" />
                <span>Zero Config</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 md:py-32 bg-[#FBF9F6] border-b border-[#E5E0D8]">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-4 text-[#191919]">Clear Pricing Structures</h2>
            <p className="text-[#6E6D6A] text-sm leading-relaxed max-w-md mx-auto">
              Choose the environment that matches your scope. All memberships include standard web hosting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {pricing.map((plan, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="h-full"
              >
                <Card
                  className={`h-full border-[#E5E0D8] bg-white ${plan.highlight ? 'border-[#C25E43]' : ''} overflow-hidden relative rounded-xl shadow-none`}
                >
                  <CardContent className="p-8 flex flex-col h-full justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-serif font-bold text-[#191919]">{plan.name}</h3>
                        {plan.highlight && (
                          <Badge className="bg-[#C25E43]/10 text-[#C25E43] hover:bg-[#C25E43]/10 border-0 rounded py-0.5 px-2 text-[9px] uppercase tracking-wider font-mono">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-baseline gap-1 mb-4">
                        <span className="text-3xl font-bold text-[#191919] font-serif">{plan.price}</span>
                        {plan.price !== 'Custom' && <span className="text-[#6E6D6A] text-xs">/mo</span>}
                      </div>
                      <p className="text-[#6E6D6A] text-xs mb-6 leading-relaxed">{plan.description}</p>

                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature, fIdx) => (
                          <li key={fIdx} className="flex items-center gap-2.5 text-xs text-[#2E2E2D]">
                            <Check className="w-3.5 h-3.5 text-[#C25E43] flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button
                      onClick={() => router.push('/account/signin')}
                      className={`w-full rounded-lg py-3 text-xs font-semibold transition-colors cursor-pointer ${
                        plan.highlight
                          ? 'bg-[#191919] text-[#FBF9F6] hover:bg-[#2E2E2D]'
                          : 'bg-[#F5F2EC] text-[#191919] hover:bg-[#E6E1DA]'
                      }`}
                    >
                      {plan.button}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom Stats */}
      <section className="py-20 border-t border-[#E5E0D8] bg-[#F5F2EC]/20 text-[#191919]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-4xl mx-auto">
            <div>
              <div className="text-3xl font-serif font-black mb-1 text-[#191919] tracking-tight">15s</div>
              <div className="text-[#6E6D6A] text-[10px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 font-semibold">
                <Zap size={12} className="text-[#C25E43]" /> Build Time
              </div>
            </div>
            <div>
              <div className="text-3xl font-serif font-black mb-1 text-[#191919] tracking-tight">99.4%</div>
              <div className="text-[#6E6D6A] text-[10px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 font-semibold">
                <Check size={12} className="text-[#C25E43]" /> Compile Rate
              </div>
            </div>
            <div>
              <div className="text-3xl font-serif font-black mb-1 text-[#191919] tracking-tight">50M+</div>
              <div className="text-[#6E6D6A] text-[10px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 font-semibold">
                <Gamepad2 size={12} className="text-[#C25E43]" /> Game Frames
              </div>
            </div>
            <div>
              <div className="text-3xl font-serif font-black mb-1 text-[#191919] tracking-tight">0</div>
              <div className="text-[#6E6D6A] text-[10px] font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 font-semibold">
                <Lock size={12} className="text-[#C25E43]" /> Setup Needed
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Play Game Modal */}
      {activePlayGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-2xl bg-[#FBF9F6] border border-[#E5E0D8] rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E0D8] bg-[#F5F2EC]/40">
              <div className="flex items-center gap-2">
                <Gamepad2 className="text-[#C25E43] w-5 h-5" />
                <h3 className="font-serif font-bold text-[#191919] text-lg">{activePlayGame.title}</h3>
              </div>
              <button
                onClick={() => setActivePlayGame(null)}
                className="text-[#6E6D6A] hover:text-[#191919] border border-[#E5E0D8] bg-white rounded-lg px-3 py-1.5 text-xs font-semibold shadow-sm cursor-pointer"
              >
                Close
              </button>
            </div>
            <div className="flex-1 bg-white relative min-h-[480px]">
              <iframe
                srcDoc={activePlayGame.code}
                className="w-full h-full min-h-[480px] border-0"
                sandbox="allow-scripts allow-same-origin"
                title={activePlayGame.title}
              />
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
