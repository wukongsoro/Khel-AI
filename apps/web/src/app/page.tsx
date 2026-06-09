'use client';

import { useState, useEffect } from 'react';
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
  Paperclip,
  ArrowUp,
  Heart,
  MessageSquare,
  Search,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function LandingPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [prompt, setPrompt] = useState('');
  const [creating, setCreating] = useState(false);
  const [activePlayGame, setActivePlayGame] = useState<{ title: string; code: string } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Brainrot', 'Dopamine', 'Idle', 'Sports', 'Think'];

  // Local Like States
  const [likedGames, setLikedGames] = useState<Record<string, boolean>>({});
  const toggleLike = (title: string) => {
    setLikedGames((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  // Viewport detection
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [activeInteractionIndex, setActiveInteractionIndex] = useState<number | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [restartKey, setRestartKey] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setRestartKey(0);
  }, [activeMobileIndex]);

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
      coverImage: '/covers/emerald_serpent.png',
      category: 'Idle',
      author: { name: 'jordanbailey', date: '27 May' },
      stats: { views: '2.7k', likes: 18, comments: 4 },
      code: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Snake</title><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><style>body { margin: 0; background: #FBF9F6; color: #191919; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; touch-action: none; } #gameCanvas { background: #191919; border: 4px solid #E5E0D8; border-radius: 8px; max-width: 90vw; max-height: 50vh; aspect-ratio: 1; } #score { font-size: 20px; font-weight: bold; margin-bottom: 10px; color: #191919; } .hint { font-size: 12px; color: #6E6D6A; margin-top: 10px; } #gameOver { display: none; position: absolute; text-align: center; background: rgba(251, 249, 246, 0.95); border: 1px solid #E5E0D8; padding: 20px; border-radius: 8px; z-index: 10; } button { background: #191919; color: #FBF9F6; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px; } #mobileControls { display: none; flex-direction: column; align-items: center; margin-top: 15px; gap: 5px; width: 100%; } .control-row { display: flex; gap: 10px; } .btn { width: 45px; height: 45px; background: #E5E0D8; color: #191919; border: 2px solid #6E6D6A; border-radius: 50%; font-weight: bold; font-size: 16px; display: flex; align-items: center; justify-content: center; user-select: none; touch-action: manipulation; } .btn:active { background: #C25E43; color: white; }</style></head><body><div id="score">Score: 0</div><canvas id="gameCanvas" width="400" height="400"></canvas><div class="hint" id="hintText">Use Arrow keys or WASD to move</div><div id="mobileControls"><div class="control-row"><div class="btn" id="btnUp">▲</div></div><div class="control-row"><div class="btn" id="btnLeft">◀</div><div class="btn" id="btnDown">▼</div><div class="btn" id="btnRight">▶</div></div></div><div id="gameOver"><h2 style="margin: 0 0 10px 0; font-family: Georgia, serif;">Game Over</h2><p id="finalScore"></p><button onclick="resetGame()">Play Again</button></div><script>const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d'); const scoreEl = document.getElementById('score'); const gameOverEl = document.getElementById('gameOver'); const finalScoreEl = document.getElementById('finalScore'); const grid = 20; let count = 0; let score = 0; let running = true; let snake = { x: 160, y: 160, dx: grid, dy: 0, cells: [], maxCells: 4 }; let apple = { x: 320, y: 320 }; function getRandomInt(min, max) { return Math.floor(Math.random() * (max - min)) + min; } function resetGame() { snake.x = 160; snake.y = 160; snake.cells = []; snake.maxCells = 4; snake.dx = grid; snake.dy = 0; score = 0; scoreEl.innerText = "Score: " + score; gameOverEl.style.display = 'none'; getRandomApple(); running = true; } function getRandomApple() { apple.x = getRandomInt(0, 20) * grid; apple.y = getRandomInt(0, 20) * grid; } function loop() { if (!running) return; requestAnimationFrame(loop); if (++count < 6) { return; } count = 0; ctx.clearRect(0,0,canvas.width,canvas.height); snake.x += snake.dx; snake.y += snake.dy; if (snake.x < 0) snake.x = canvas.width - grid; else if (snake.x >= canvas.width) snake.x = 0; if (snake.y < 0) snake.y = canvas.height - grid; else if (snake.y >= canvas.height) snake.y = 0; snake.cells.unshift({x: snake.x, y: snake.y}); if (snake.cells.length > snake.maxCells) { snake.cells.pop(); } ctx.fillStyle = '#C25E43'; ctx.fillRect(apple.x, apple.y, grid-1, grid-1); ctx.fillStyle = '#8E9E8C'; snake.cells.forEach(function(cell, index) { ctx.fillRect(cell.x, cell.y, grid-1, grid-1); if (cell.x === apple.x && cell.y === apple.y) { snake.maxCells++; score += 10; scoreEl.innerText = "Score: " + score; getRandomApple(); } for (let i = index + 1; i < snake.cells.length; i++) { if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) { running = false; finalScoreEl.innerText = "Final Score: " + score; gameOverEl.style.display = 'block'; } } }); } document.addEventListener('keydown', function(e) { if (e.which === 37 && snake.dx === 0) { snake.dx = -grid; snake.dy = 0; } else if (e.which === 38 && snake.dy === 0) { snake.dy = -grid; snake.dx = 0; } else if (e.which === 39 && snake.dx === 0) { snake.dx = grid; snake.dy = 0; } else if (e.which === 40 && snake.dy === 0) { snake.dy = grid; snake.dx = 0; } }); const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0); if (isTouch) { document.getElementById('mobileControls').style.display = 'flex'; document.getElementById('hintText').style.display = 'none'; document.getElementById('btnUp').addEventListener('touchstart', (e) => { e.preventDefault(); if (snake.dy === 0) { snake.dy = -grid; snake.dx = 0; } }); document.getElementById('btnDown').addEventListener('touchstart', (e) => { e.preventDefault(); if (snake.dy === 0) { snake.dy = grid; snake.dx = 0; } }); document.getElementById('btnLeft').addEventListener('touchstart', (e) => { e.preventDefault(); if (snake.dx === 0) { snake.dx = -grid; snake.dy = 0; } }); document.getElementById('btnRight').addEventListener('touchstart', (e) => { e.preventDefault(); if (snake.dx === 0) { snake.dx = grid; snake.dy = 0; } }); } let touchStartY = 0; let touchStartX = 0; let isScrollingParent = false; window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; touchStartX = e.touches[0].clientX; isScrollingParent = false; }, { passive: true }); window.addEventListener('touchmove', (e) => { const touchY = e.touches[0].clientY; const touchX = e.touches[0].clientX; const dy = touchStartY - touchY; const dx = touchStartX - touchX; if (!isScrollingParent && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) { isScrollingParent = true; } if (isScrollingParent) { try { const feed = window.parent.document.getElementById('mobileGameFeed'); if (feed) { feed.scrollBy(0, dy); } } catch(err) {} } touchStartY = touchY; touchStartX = touchX; }, { passive: true }); requestAnimationFrame(loop);</script></body></html>`
    },
    {
      title: 'Skyward Flutter',
      genre: 'Avoidance Arcade',
      description: 'A physics-based jump and dodge retro flappy game. Guide the bird through gaps.',
      icon: <Sparkles className="w-6 h-6 text-[#C25E43]" />,
      coverImage: '/covers/skyward_flutter.png',
      category: 'Dopamine',
      author: { name: 'carlos_rod', date: '1 Jun' },
      stats: { views: '578', likes: 5, comments: 3 },
      code: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Flappy Bird</title><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><style>body { margin: 0; background: #FBF9F6; color: #191919; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; touch-action: none; } #gameCanvas { background: #F5F2EC; border: 4px solid #E5E0D8; border-radius: 8px; max-width: 90vw; max-height: 60vh; aspect-ratio: 320/480; } #score { font-size: 20px; font-weight: bold; margin-bottom: 10px; } .hint { font-size: 12px; color: #6E6D6A; margin-top: 10px; } #gameOver { display: none; position: absolute; text-align: center; background: rgba(251, 249, 246, 0.95); border: 1px solid #E5E0D8; padding: 20px; border-radius: 8px; z-index: 10; } button { background: #191919; color: #FBF9F6; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px; }</style></head><body><div id="score">Score: 0</div><canvas id="gameCanvas" width="320" height="480"></canvas><div class="hint" id="hintText">Press Space or Click to Jump</div><div id="gameOver"><h2 style="margin: 0 0 10px 0; font-family: Georgia, serif;">Game Over</h2><p id="finalScore"></p><button onclick="resetGame()">Play Again</button></div><script>const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d'); const scoreEl = document.getElementById('score'); const gameOverEl = document.getElementById('gameOver'); const finalScoreEl = document.getElementById('finalScore'); let score = 0; let running = true; let bird = { x: 50, y: 150, velocity: 0, gravity: 0.25, jump: -5.0, radius: 12 }; let pipes = []; let pipeWidth = 50; let pipeGap = 120; let pipeSpeed = 2; let frameCount = 0; function resetGame() { bird.y = 150; bird.velocity = 0; pipes = []; score = 0; scoreEl.innerText = "Score: " + score; gameOverEl.style.display = 'none'; frameCount = 0; running = true; } function spawnPipe() { let minHeight = 50; let maxHeight = canvas.height - pipeGap - minHeight; let height = Math.floor(Math.random() * (maxHeight - minHeight)) + minHeight; pipes.push({ x: canvas.width, top: height, bottom: canvas.height - height - pipeGap, passed: false }); } function jump() { if (!running) return; bird.velocity = bird.jump; } document.addEventListener('keydown', function(e) { if (e.code === 'Space') { e.preventDefault(); jump(); } }); canvas.addEventListener('mousedown', function(e) { e.preventDefault(); jump(); }); canvas.addEventListener('touchstart', function(e) { e.preventDefault(); jump(); }); function loop() { if (!running) return; requestAnimationFrame(loop); ctx.clearRect(0, 0, canvas.width, canvas.height); bird.velocity += bird.gravity; bird.y += bird.velocity; ctx.fillStyle = '#C25E43'; ctx.beginPath(); ctx.arc(bird.x, bird.y, bird.radius, 0, Math.PI * 2); ctx.fill(); if (bird.y + bird.radius >= canvas.height || bird.y - bird.radius <= 0) { endGame(); } if (frameCount % 100 === 0) { spawnPipe(); } frameCount++; ctx.fillStyle = '#191919'; for (let i = pipes.length - 1; i >= 0; i--) { let p = pipes[i]; p.x -= pipeSpeed; ctx.fillRect(p.x, 0, pipeWidth, p.top); ctx.fillRect(p.x, canvas.height - p.bottom, pipeWidth, p.bottom); if ( bird.x + bird.radius > p.x && bird.x - bird.radius < p.x + pipeWidth && (bird.y - bird.radius < p.top || bird.y + bird.radius > canvas.height - p.bottom) ) { endGame(); } if (!p.passed && p.x + pipeWidth < bird.x) { p.passed = true; score++; scoreEl.innerText = "Score: " + score; } if (p.x + pipeWidth < 0) { pipes.splice(i, 1); } } } function endGame() { running = false; finalScoreEl.innerText = "Final Score: " + score; gameOverEl.style.display = 'block'; } const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0); if (isTouch) { document.getElementById('hintText').innerText = 'Tap canvas to jump'; } let touchStartY = 0; let touchStartX = 0; let isScrollingParent = false; window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; touchStartX = e.touches[0].clientX; isScrollingParent = false; }, { passive: true }); window.addEventListener('touchmove', (e) => { const touchY = e.touches[0].clientY; const touchX = e.touches[0].clientX; const dy = touchStartY - touchY; const dx = touchStartX - touchX; if (!isScrollingParent && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) { isScrollingParent = true; } if (isScrollingParent) { try { const feed = window.parent.document.getElementById('mobileGameFeed'); if (feed) { feed.scrollBy(0, dy); } } catch(err) {} } touchStartY = touchY; touchStartX = touchX; }, { passive: true }); spawnPipe(); requestAnimationFrame(loop);</script></body></html>`
    },
    {
      title: 'Grid Breaker',
      genre: 'Brick Breaker',
      description: 'A minimalist breakout clone. Move your finger to guide the slider paddle.',
      icon: <Gamepad2 className="w-6 h-6 text-[#C25E43]" />,
      coverImage: '/covers/grid_breaker.png',
      category: 'Brainrot',
      author: { name: 'hannahedwards', date: '19 May' },
      stats: { views: '2.2k', likes: 12, comments: 2 },
      code: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Breakout</title><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><style>body { margin: 0; background: #FBF9F6; color: #191919; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; touch-action: none; } #gameCanvas { background: #191919; border: 4px solid #E5E0D8; border-radius: 8px; max-width: 90vw; max-height: 55vh; aspect-ratio: 1; } #score { font-size: 20px; font-weight: bold; margin-bottom: 10px; } .hint { font-size: 12px; color: #6E6D6A; margin-top: 10px; } #gameOver { display: none; position: absolute; text-align: center; background: rgba(251, 249, 246, 0.95); border: 1px solid #E5E0D8; padding: 20px; border-radius: 8px; z-index: 10; } button { background: #191919; color: #FBF9F6; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px; }</style></head><body><div id="score">Score: 0</div><canvas id="gameCanvas" width="400" height="400"></canvas><div class="hint" id="hintText">Move mouse to slide paddle</div><div id="gameOver"><h2 style="margin: 0 0 10px 0; font-family: Georgia, serif;">Game Over</h2><p id="finalScore"></p><button onclick="resetGame()">Play Again</button></div><script>const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d'); const scoreEl = document.getElementById('score'); const gameOverEl = document.getElementById('gameOver'); const finalScoreEl = document.getElementById('finalScore'); let score = 0; let running = true; let ball = { x: 200, y: 280, dx: 3, dy: -3, radius: 8 }; let paddle = { x: 160, y: 370, width: 80, height: 12 }; let brickRows = 4; let brickCols = 6; let brickWidth = 55; let brickHeight = 15; let brickPadding = 6; let brickOffsetTop = 40; let brickOffsetLeft = 20; let bricks = []; function initBricks() { bricks = []; for (let r = 0; r < brickRows; r++) { bricks[r] = []; for (let c = 0; c < brickCols; c++) { bricks[r][c] = { x: 0, y: 0, status: 1 }; } } } function resetGame() { ball.x = 200; ball.y = 280; ball.dx = 3; ball.dy = -3; paddle.x = 160; score = 0; scoreEl.innerText = "Score: " + score; gameOverEl.style.display = 'none'; initBricks(); running = true; } function handleMove(clientX) { let rect = canvas.getBoundingClientRect(); let rootX = clientX - rect.left; let scaleX = canvas.width / rect.width; paddle.x = (rootX * scaleX) - paddle.width / 2; if (paddle.x < 0) paddle.x = 0; if (paddle.x + paddle.width > canvas.width) paddle.x = canvas.width - paddle.width; } canvas.addEventListener('mousemove', function(e) { handleMove(e.clientX); }); canvas.addEventListener('touchmove', function(e) { if (e.touches.length > 0) { handleMove(e.touches[0].clientX); } }, { passive: true }); function collisionDetection() { for (let r = 0; r < brickRows; r++) { for (let c = 0; c < brickCols; c++) { let b = bricks[r][c]; if (b.status === 1) { if ( ball.x > b.x && ball.x < b.x + brickWidth && ball.y > b.y && ball.y < b.y + brickHeight ) { ball.dy = -ball.dy; b.status = 0; score += 10; scoreEl.innerText = "Score: " + score; if (checkWin()) { endGame(true); } } } } } } function checkWin() { for (let r = 0; r < brickRows; r++) { for (let c = 0; c < brickCols; c++) { if (bricks[r][c].status === 1) return false; } } return true; } function loop() { if (!running) return; requestAnimationFrame(loop); ctx.clearRect(0, 0, canvas.width, canvas.height); for (let r = 0; r < brickRows; r++) { for (let c = 0; c < brickCols; c++) { if (bricks[r][c].status === 1) { let bx = c * (brickWidth + brickPadding) + brickOffsetLeft; let by = r * (brickHeight + brickPadding) + brickOffsetTop; bricks[r][c].x = bx; bricks[r][c].y = by; ctx.fillStyle = r === 0 ? '#C25E43' : r === 1 ? '#D97706' : r === 2 ? '#8E9E8C' : '#6E6D6A'; ctx.fillRect(bx, by, brickWidth, brickHeight); } } } ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2); ctx.fillStyle = '#FBF9F6'; ctx.fill(); ctx.closePath(); ctx.fillStyle = '#C25E43'; ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height); collisionDetection(); if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) { ball.dx = -ball.dx; } if (ball.y + ball.dy < ball.radius) { ball.dy = -ball.dy; } else if (ball.y + ball.dy > canvas.height - ball.radius) { if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) { ball.dy = -ball.dy; } else { endGame(false); } } ball.x += ball.dx; ball.y += ball.dy; } function endGame(win) { running = false; finalScoreEl.innerText = win ? "You Win! Score: " + score : "Final Score: " + score; gameOverEl.style.display = 'block'; } const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0); if (isTouch) { document.getElementById('hintText').innerText = 'Drag left/right to move paddle'; } let touchStartY = 0; let touchStartX = 0; let isScrollingParent = false; window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; touchStartX = e.touches[0].clientX; isScrollingParent = false; }, { passive: true }); window.addEventListener('touchmove', (e) => { const touchY = e.touches[0].clientY; const touchX = e.touches[0].clientX; const dy = touchStartY - touchY; const dx = touchStartX - touchX; if (!isScrollingParent && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) { isScrollingParent = true; } if (isScrollingParent) { try { const feed = window.parent.document.getElementById('mobileGameFeed'); if (feed) { feed.scrollBy(0, dy); } } catch(err) {} } touchStartY = touchY; touchStartX = touchX; }, { passive: true }); initBricks(); requestAnimationFrame(loop);</script></body></html>`
    },
    {
      title: 'Cosmic Defender',
      genre: 'Space Shooter',
      description: 'Defend your spaceship from invading slate rocks. Controls: drag ship to move.',
      icon: <Sparkles className="w-6 h-6 text-[#C25E43]" />,
      coverImage: '/covers/cosmic_defender.png',
      category: 'Brainrot',
      author: { name: 'space_cadet', date: '3 Jun' },
      stats: { views: '1.5k', likes: 45, comments: 8 },
      code: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Cosmic Defender</title><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><style>body { margin: 0; background: #FBF9F6; color: #191919; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; touch-action: none; } #gameCanvas { background: #111; border: 4px solid #E5E0D8; border-radius: 8px; max-width: 90vw; max-height: 60vh; aspect-ratio: 360/450; } #score { font-size: 20px; font-weight: bold; margin-bottom: 10px; } .hint { font-size: 12px; color: #6E6D6A; margin-top: 10px; } #gameOver { display: none; position: absolute; text-align: center; background: rgba(251, 249, 246, 0.95); border: 1px solid #E5E0D8; padding: 20px; border-radius: 8px; z-index: 10; } button { background: #191919; color: #FBF9F6; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px; }</style></head><body><div id="score">Score: 0</div><canvas id="gameCanvas" width="360" height="450"></canvas><div class="hint" id="hintText">Move mouse to guide ship, Click to Shoot</div><div id="gameOver"><h2 style="margin: 0 0 10px 0; font-family: Georgia, serif;">Game Over</h2><p id="finalScore"></p><button onclick="resetGame()">Play Again</button></div><script>const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d'); const scoreEl = document.getElementById('score'); const gameOverEl = document.getElementById('gameOver'); const finalScoreEl = document.getElementById('finalScore'); let score = 0; let running = true; let player = { x: 165, y: 400, width: 30, height: 20 }; let bullets = []; let enemies = []; let particles = []; let enemySpeed = 1.5; let spawnTimer = 0; function resetGame() { bullets = []; enemies = []; particles = []; player.x = 165; score = 0; scoreEl.innerText = "Score: " + score; gameOverEl.style.display = 'none'; enemySpeed = 1.5; spawnTimer = 0; running = true; } function handleMove(clientX) { let rect = canvas.getBoundingClientRect(); let rootX = clientX - rect.left; let scaleX = canvas.width / rect.width; player.x = (rootX * scaleX) - player.width / 2; if (player.x < 0) player.x = 0; if (player.x + player.width > canvas.width) player.x = canvas.width - player.width; } canvas.addEventListener('mousemove', function(e) { handleMove(e.clientX); }); canvas.addEventListener('touchmove', function(e) { if (e.touches.length > 0) { handleMove(e.touches[0].clientX); } }, { passive: true }); canvas.addEventListener('mousedown', function(e) { e.preventDefault(); if (!running) return; bullets.push({ x: player.x + player.width / 2 - 2, y: player.y - 6, width: 4, height: 10, speed: 6 }); }); document.addEventListener('keydown', function(e) { if (e.code === 'Space') { e.preventDefault(); if (!running) return; bullets.push({ x: player.x + player.width / 2 - 2, y: player.y - 6, width: 4, height: 10, speed: 6 }); } }); function spawnEnemy() { enemies.push({ x: Math.random() * (canvas.width - 25), y: -30, width: 25, height: 20, speed: enemySpeed }); } function createExplosion(x, y) { for (let i = 0; i < 8; i++) { particles.push({ x: x, y: y, dx: (Math.random() - 0.5) * 4, dy: (Math.random() - 0.5) * 4, life: 25, color: '#C25E43' }); } } const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0); if (isTouch) { document.getElementById('hintText').innerText = 'Drag left/right to move (auto-shoots)'; } function loop() { if (!running) return; requestAnimationFrame(loop); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.fillStyle = '#C25E43'; ctx.fillRect(player.x, player.y, player.width, player.height); ctx.fillStyle = '#FBF9F6'; if (isTouch && spawnTimer % 12 === 0) { bullets.push({ x: player.x + player.width / 2 - 2, y: player.y - 6, width: 4, height: 10, speed: 6 }); } for (let i = bullets.length - 1; i >= 0; i--) { let b = bullets[i]; b.y -= b.speed; ctx.fillRect(b.x, b.y, b.width, b.height); if (b.y < 0) bullets.splice(i, 1); } if (spawnTimer++ % 60 === 0) { spawnEnemy(); } ctx.fillStyle = '#8E9E8C'; for (let i = enemies.length - 1; i >= 0; i--) { let en = enemies[i]; en.y += en.speed; ctx.fillRect(en.x, en.y, en.width, en.height); if ( en.x < player.x + player.width && en.x + en.width > player.x && en.y < player.y + player.height && en.y + en.height > player.y ) { endGame(); } for (let j = bullets.length - 1; j >= 0; j--) { let b = bullets[j]; if ( b.x < en.x + en.width && b.x + b.width > en.x && b.y < en.y + en.height && b.y + b.height > en.y ) { createExplosion(en.x + en.width/2, en.y + en.height/2); enemies.splice(i, 1); bullets.splice(j, 1); score += 10; scoreEl.innerText = "Score: " + score; if (score % 100 === 0) enemySpeed += 0.2; break; } } if (en.y > canvas.height) { endGame(); } } for (let i = particles.length - 1; i >= 0; i--) { let p = particles[i]; p.x += p.dx; p.y += p.dy; p.life--; ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, 3, 3); if (p.life <= 0) particles.splice(i, 1); } } function endGame() { running = false; finalScoreEl.innerText = "Final Score: " + score; gameOverEl.style.display = 'block'; } let touchStartY = 0; let touchStartX = 0; let isScrollingParent = false; window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; touchStartX = e.touches[0].clientX; isScrollingParent = false; }, { passive: true }); window.addEventListener('touchmove', (e) => { const touchY = e.touches[0].clientY; const touchX = e.touches[0].clientX; const dy = touchStartY - touchY; const dx = touchStartX - touchX; if (!isScrollingParent && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) { isScrollingParent = true; } if (isScrollingParent) { try { const feed = window.parent.document.getElementById('mobileGameFeed'); if (feed) { feed.scrollBy(0, dy); } } catch(err) {} } touchStartY = touchY; touchStartX = touchX; }, { passive: true }); requestAnimationFrame(loop);</script></body></html>`
    },
    {
      title: 'Classic Pong',
      genre: 'Retro Sports',
      description: 'Defeat the CPU. Move your paddle by dragging vertically.',
      icon: <Gamepad2 className="w-6 h-6 text-[#C25E43]" />,
      coverImage: '/covers/classic_pong.png',
      category: 'Sports',
      author: { name: 'pong_master', date: '24 May' },
      stats: { views: '984', likes: 21, comments: 5 },
      code: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Classic Pong</title><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><style>body { margin: 0; background: #FBF9F6; color: #191919; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; touch-action: none; } #gameCanvas { background: #191919; border: 4px solid #E5E0D8; border-radius: 8px; max-width: 95vw; max-height: 55vh; aspect-ratio: 450/300; } #score { font-size: 20px; font-weight: bold; margin-bottom: 10px; } .hint { font-size: 12px; color: #6E6D6A; margin-top: 10px; } #gameOver { display: none; position: absolute; text-align: center; background: rgba(251, 249, 246, 0.95); border: 1px solid #E5E0D8; padding: 20px; border-radius: 8px; z-index: 10; } button { background: #191919; color: #FBF9F6; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px; }</style></head><body><div id="score">Player: 0 | CPU: 0</div><canvas id="gameCanvas" width="450" height="300"></canvas><div class="hint" id="hintText">Move mouse to guide paddle</div><div id="gameOver"><h2 style="margin: 0 0 10px 0; font-family: Georgia, serif;">Game Over</h2><p id="finalScore"></p><button onclick="resetGame()">Play Again</button></div><script>const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d'); const scoreEl = document.getElementById('score'); const gameOverEl = document.getElementById('gameOver'); const finalScoreEl = document.getElementById('finalScore'); let playerScore = 0; let cpuScore = 0; let running = true; let ball = { x: 225, y: 150, dx: 3, dy: 3, radius: 6 }; let player = { x: 10, y: 110, width: 10, height: 80 }; let cpu = { x: 430, y: 110, width: 10, height: 80 }; function resetGame() { ball.x = 225; ball.y = 150; ball.dx = Math.random() > 0.5 ? 3 : -3; ball.dy = (Math.random() - 0.5) * 4; playerScore = 0; cpuScore = 0; scoreEl.innerText = "Player: " + playerScore + " | CPU: " + cpuScore; gameOverEl.style.display = 'none'; running = true; } function handleMove(clientY) { let rect = canvas.getBoundingClientRect(); let rootY = clientY - rect.top; let scaleY = canvas.height / rect.height; player.y = (rootY * scaleY) - player.height / 2; if (player.y < 0) player.y = 0; if (player.y + player.height > canvas.height) player.y = canvas.height - player.height; } canvas.addEventListener('mousemove', function(e) { handleMove(e.clientY); }); canvas.addEventListener('touchmove', function(e) { if (e.touches.length > 0) { let touch = e.touches[0]; let rect = canvas.getBoundingClientRect(); let rootX = touch.clientX - rect.left; let scaleX = canvas.width / rect.width; if (rootX * scaleX < canvas.width / 2) { handleMove(touch.clientY); } } }, { passive: true }); function loop() { if (!running) return; requestAnimationFrame(loop); ctx.clearRect(0,0,canvas.width,canvas.height); ball.x += ball.dx; ball.y += ball.dy; if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) { ball.dy = -ball.dy; } if (cpu.y + cpu.height/2 < ball.y - 10) { cpu.y += 3.2; } else if (cpu.y + cpu.height/2 > ball.y + 10) { cpu.y -= 3.2; } if (cpu.y < 0) cpu.y = 0; if (cpu.y + cpu.height > canvas.height) cpu.y = canvas.height - cpu.height; if (ball.x - ball.radius < player.x + player.width && ball.y > player.y && ball.y < player.y + player.height) { ball.dx = -ball.dx; ball.x = player.x + player.width + ball.radius; } else if (ball.x + ball.radius > cpu.x && ball.y > cpu.y && ball.y < cpu.y + cpu.height) { ball.dx = -ball.dx; ball.x = cpu.x - ball.radius; } if (ball.x < 0) { cpuScore++; scoreEl.innerText = "Player: " + playerScore + " | CPU: " + cpuScore; checkScores(); ball.x = 225; ball.y = 150; ball.dx = 3; } else if (ball.x > canvas.width) { playerScore++; scoreEl.innerText = "Player: " + playerScore + " | CPU: " + cpuScore; checkScores(); ball.x = 225; ball.y = 150; ball.dx = -3; } ctx.fillStyle = '#C25E43'; ctx.fillRect(player.x, player.y, player.width, player.height); ctx.fillStyle = '#8E9E8C'; ctx.fillRect(cpu.x, cpu.y, cpu.width, cpu.height); ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2); ctx.fillStyle = '#FBF9F6'; ctx.fill(); ctx.closePath(); } function checkScores() { if (playerScore >= 5 || cpuScore >= 5) { running = false; finalScoreEl.innerText = playerScore >= 5 ? "You Won! Score: " + playerScore : "CPU Won! Score: " + cpuScore; gameOverEl.style.display = 'block'; } } const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0); if (isTouch) { document.getElementById('hintText').innerText = 'Drag left half vertically to move. Swipe right half to scroll.'; } let touchStartY = 0; let touchStartX = 0; let isScrollingParent = false; window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; touchStartX = e.touches[0].clientX; isScrollingParent = false; }, { passive: true }); window.addEventListener('touchmove', (e) => { const touchY = e.touches[0].clientY; const touchX = e.touches[0].clientX; const dy = touchStartY - touchY; const dx = touchStartX - touchX; let rect = canvas.getBoundingClientRect(); let rootX = touchStartX - rect.left; let scaleX = canvas.width / rect.width; if (rootX * scaleX >= canvas.width / 2) { if (!isScrollingParent && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) { isScrollingParent = true; } } if (isScrollingParent) { try { const feed = window.parent.document.getElementById('mobileGameFeed'); if (feed) { feed.scrollBy(0, dy); } } catch(err) {} } touchStartY = touchY; touchStartX = touchX; }, { passive: true }); requestAnimationFrame(loop);</script></body></html>`
    },
    {
      title: 'Brick Puzzle',
      genre: 'Grid Puzzle',
      description: 'Classic block puzzle arcade. Rotate and snap blocks using virtual buttons.',
      icon: <Sparkles className="w-6 h-6 text-[#C25E43]" />,
      coverImage: '/covers/brick_puzzle.png',
      category: 'Think',
      author: { name: 'block_builder', date: '8 May' },
      stats: { views: '3.1k', likes: 62, comments: 14 },
      code: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Tetris</title><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><style>body { margin: 0; background: #FBF9F6; color: #191919; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; touch-action: none; } #gameCanvas { background: #191919; border: 4px solid #E5E0D8; border-radius: 8px; max-width: 90vw; max-height: 50vh; aspect-ratio: 240/400; } #score { font-size: 20px; font-weight: bold; margin-bottom: 10px; } .hint { font-size: 12px; color: #6E6D6A; margin-top: 10px; } #gameOver { display: none; position: absolute; text-align: center; background: rgba(251, 249, 246, 0.95); border: 1px solid #E5E0D8; padding: 20px; border-radius: 8px; z-index: 10; } button { background: #191919; color: #FBF9F6; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px; } #mobileControls { display: none; justify-content: center; gap: 10px; margin-top: 10px; width: 100%; } .btn { width: 45px; height: 45px; background: #E5E0D8; color: #191919; border: 2px solid #6E6D6A; border-radius: 50%; font-weight: bold; font-size: 18px; display: flex; align-items: center; justify-content: center; user-select: none; touch-action: manipulation; } .btn:active { background: #C25E43; color: white; }</style></head><body><div id="score">Score: 0</div><canvas id="gameCanvas" width="240" height="400"></canvas><div class="hint" id="hintText">Use Arrow keys: Left/Right to move, Up to rotate</div><div id="mobileControls"><div class="btn" id="btnLeft">◀</div><div class="btn" id="btnRotate">↻</div><div class="btn" id="btnDown">▼</div><div class="btn" id="btnRight">▶</div></div><div id="gameOver"><h2 style="margin: 0 0 10px 0; font-family: Georgia, serif;">Game Over</h2><p id="finalScore"></p><button onclick="resetGame()">Play Again</button></div><script>const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d'); const scoreEl = document.getElementById('score'); const gameOverEl = document.getElementById('gameOver'); const finalScoreEl = document.getElementById('finalScore'); const grid = 20; const cols = 12; const rows = 20; let score = 0; let running = true; let board = []; for(let r=0; r<rows; r++) { board[r] = Array(cols).fill(0); } const colors = [null, '#C25E43', '#D97706', '#8E9E8C', '#6E6D6A', '#C25E43', '#D97706', '#8E9E8C']; const shapes = [ [], [[1,1,1,1]], [[1,1,1],[0,1,0]], [[1,1,0],[0,1,1]], [[0,1,1],[1,1,0]], [[1,1,1],[1,0,0]], [[1,1,1],[0,0,1]], [[1,1],[1,1]] ]; let piece = { matrix: [], x: 0, y: 0 }; function resetGame() { score = 0; scoreEl.innerText = "Score: " + score; for(let r=0; r<rows; r++) board[r].fill(0); gameOverEl.style.display = 'none'; spawnPiece(); running = true; } function spawnPiece() { const id = Math.floor(Math.random() * 7) + 1; piece.matrix = shapes[id]; piece.x = Math.floor((cols - piece.matrix[0].length)/2); piece.y = 0; if (collide()) { running = false; finalScoreEl.innerText = "Final Score: " + score; gameOverEl.style.display = 'block'; } } function collide() { for(let r=0; r<piece.matrix.length; r++) { for(let c=0; c<piece.matrix[r].length; c++) { if (piece.matrix[r][c]) { let nextX = piece.x + c; let nextY = piece.y + r; if (nextX < 0 || nextX >= cols || nextY >= rows || (nextY >= 0 && board[nextY][nextX])) return true; } } } return false; } function merge() { for(let r=0; r<piece.matrix.length; r++) { for(let c=0; c<piece.matrix[r].length; c++) { if (piece.matrix[r][c]) { board[piece.y + r][piece.x + c] = piece.matrix[r][c]; } } } } function rotate() { const n = piece.matrix.length; const m = piece.matrix[0].length; let nextMatrix = Array(m).fill().map(() => Array(n).fill(0)); for(let r=0; r<n; r++) { for(let c=0; c<m; c++) { nextMatrix[c][n - 1 - r] = piece.matrix[r][c]; } } const oldMatrix = piece.matrix; piece.matrix = nextMatrix; if (collide()) piece.matrix = oldMatrix; } function drop() { piece.y++; if (collide()) { piece.y--; merge(); clearLines(); spawnPiece(); } } function clearLines() { for(let r=rows-1; r>=0; r--) { if (board[r].every(v => v > 0)) { board.splice(r, 1); board.unshift(Array(cols).fill(0)); score += 100; scoreEl.innerText = "Score: " + score; r++; } } } let dropCounter = 0; function loop(time = 0) { if (!running) return; requestAnimationFrame(loop); dropCounter++; if (dropCounter >= 30) { drop(); dropCounter = 0; } ctx.clearRect(0,0,canvas.width,canvas.height); for(let r=0; r<rows; r++) { for(let c=0; c<cols; c++) { if (board[r][c]) { ctx.fillStyle = colors[board[r][c]]; ctx.fillRect(c*grid, r*grid, grid-1, grid-1); } } } for(let r=0; r<piece.matrix.length; r++) { for(let c=0; c<piece.matrix[r].length; c++) { if (piece.matrix[r][c]) { ctx.fillStyle = '#C25E43'; ctx.fillRect((piece.x + c)*grid, (piece.y + r)*grid, grid-1, grid-1); } } } } document.addEventListener('keydown', function(e) { if (!running) return; if (e.code === 'ArrowLeft') { piece.x--; if (collide()) piece.x++; } else if (e.code === 'ArrowRight') { piece.x++; if (collide()) piece.x--; } else if (e.code === 'ArrowDown') { drop(); } else if (e.code === 'ArrowUp') { rotate(); } }); const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0); if (isTouch) { document.getElementById('mobileControls').style.display = 'flex'; document.getElementById('hintText').style.display = 'none'; document.getElementById('btnLeft').addEventListener('touchstart', (e) => { e.preventDefault(); if (!running) return; piece.x--; if (collide()) piece.x++; }); document.getElementById('btnRight').addEventListener('touchstart', (e) => { e.preventDefault(); if (!running) return; piece.x++; if (collide()) piece.x--; }); document.getElementById('btnRotate').addEventListener('touchstart', (e) => { e.preventDefault(); if (!running) return; rotate(); }); document.getElementById('btnDown').addEventListener('touchstart', (e) => { e.preventDefault(); if (!running) return; drop(); }); } let touchStartY = 0; let touchStartX = 0; let isScrollingParent = false; window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; touchStartX = e.touches[0].clientX; isScrollingParent = false; }, { passive: true }); window.addEventListener('touchmove', (e) => { const touchY = e.touches[0].clientY; const touchX = e.touches[0].clientX; const dy = touchStartY - touchY; const dx = touchStartX - touchX; if (!isScrollingParent && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) { isScrollingParent = true; } if (isScrollingParent) { try { const feed = window.parent.document.getElementById('mobileGameFeed'); if (feed) { feed.scrollBy(0, dy); } } catch(err) {} } touchStartY = touchY; touchStartX = touchX; }, { passive: true }); spawnPiece(); requestAnimationFrame(loop);</script></body></html>`
    },
    {
      title: 'Pixel Runner',
      genre: 'Infinite Runner',
      description: 'Run, jump, and dodge spikes. Tap canvas to jump.',
      icon: <Gamepad2 className="w-6 h-6 text-[#C25E43]" />,
      coverImage: '/covers/pixel_runner.png',
      category: 'Dopamine',
      author: { name: 'runner_dino', date: '4 Jun' },
      stats: { views: '4.2k', likes: 88, comments: 19 },
      code: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Pixel Runner</title><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><style>body { margin: 0; background: #FBF9F6; color: #191919; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; touch-action: none; } #gameCanvas { background: #F5F2EC; border: 4px solid #E5E0D8; border-radius: 8px; max-width: 90vw; max-height: 55vh; aspect-ratio: 480/270; } #score { font-size: 20px; font-weight: bold; margin-bottom: 10px; } .hint { font-size: 12px; color: #6E6D6A; margin-top: 10px; } #gameOver { display: none; position: absolute; text-align: center; background: rgba(251, 249, 246, 0.95); border: 1px solid #E5E0D8; padding: 20px; border-radius: 8px; z-index: 10; } button { background: #191919; color: #FBF9F6; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px; }</style></head><body><div id="score">Score: 0</div><canvas id="gameCanvas" width="480" height="270"></canvas><div class="hint" id="hintText">Press Space or Up Arrow or Click to Jump</div><div id="gameOver"><h2 style="margin: 0 0 10px 0; font-family: Georgia, serif;">Game Over</h2><p id="finalScore"></p><button onclick="resetGame()">Play Again</button></div><script>const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d'); const scoreEl = document.getElementById('score'); const gameOverEl = document.getElementById('gameOver'); const finalScoreEl = document.getElementById('finalScore'); let score = 0; let running = true; let groundY = 220; let player = { x: 50, y: groundY - 30, width: 20, height: 30, vy: 0, gravity: 0.6, jumpForce: -10, grounded: true }; let obstacles = []; let spawnRate = 90; let frameCount = 0; let gameSpeed = 4; function resetGame() { score = 0; scoreEl.innerText = "Score: " + score; player.y = groundY - player.height; player.vy = 0; player.grounded = true; obstacles = []; gameSpeed = 4; frameCount = 0; gameOverEl.style.display = 'none'; running = true; } function jump() { if (player.grounded && running) { player.vy = player.jumpForce; player.grounded = false; } } document.addEventListener('keydown', function(e) { if (e.code === 'Space' || e.code === 'ArrowUp') { e.preventDefault(); jump(); } }); canvas.addEventListener('mousedown', function(e) { e.preventDefault(); jump(); }); canvas.addEventListener('touchstart', function(e) { e.preventDefault(); jump(); }); function spawnObstacle() { let height = Math.random() * 30 + 15; obstacles.push({ x: canvas.width, y: groundY - height, width: 15, height: height }); } function loop() { if (!running) return; requestAnimationFrame(loop); ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.strokeStyle = '#E5E0D8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(canvas.width, groundY); ctx.stroke(); player.vy += player.gravity; player.y += player.vy; if (player.y + player.height >= groundY) { player.y = groundY - player.height; player.vy = 0; player.grounded = true; } ctx.fillStyle = '#C25E43'; ctx.fillRect(player.x, player.y, player.width, player.height); if (frameCount++ % spawnRate === 0) { spawnObstacle(); spawnRate = Math.max(50, 90 - Math.floor(score / 50) * 5); } ctx.fillStyle = '#191919'; for (let i = obstacles.length - 1; i >= 0; i--) { let obs = obstacles[i]; obs.x -= gameSpeed; ctx.fillRect(obs.x, obs.y, obs.width, obs.height); if ( player.x < obs.x + obs.width && player.x + player.width > obs.x && player.y < obs.y + obs.height && player.y + player.height > obs.y ) { endGame(); } if (obs.x + obs.width < 0) { obstacles.splice(i, 1); score += 10; scoreEl.innerText = "Score: " + score; if (score % 100 === 0) { gameSpeed += 0.5; } } } } function endGame() { running = false; finalScoreEl.innerText = "Final Score: " + score; gameOverEl.style.display = 'block'; } const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0); if (isTouch) { document.getElementById('hintText').innerText = 'Tap canvas to jump'; } let touchStartY = 0; let touchStartX = 0; let isScrollingParent = false; window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; touchStartX = e.touches[0].clientX; isScrollingParent = false; }, { passive: true }); window.addEventListener('touchmove', (e) => { const touchY = e.touches[0].clientY; const touchX = e.touches[0].clientX; const dy = touchStartY - touchY; const dx = touchStartX - touchX; if (!isScrollingParent && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) { isScrollingParent = true; } if (isScrollingParent) { try { const feed = window.parent.document.getElementById('mobileGameFeed'); if (feed) { feed.scrollBy(0, dy); } } catch(err) {} } touchStartY = touchY; touchStartX = touchX; }, { passive: true }); requestAnimationFrame(loop);</script></body></html>`
    },
    {
      title: 'Gold Miner Idle',
      genre: 'Idle Clicker',
      description: 'Tap nugget to mine gold, and purchase upgrades to automate extraction.',
      icon: <Gamepad2 className="w-6 h-6 text-[#C25E43]" />,
      coverImage: '/covers/gold_miner.png',
      category: 'Idle',
      author: { name: 'miner_tom', date: '5 Jun' },
      stats: { views: '1.2k', likes: 24, comments: 2 },
      code: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Gold Miner Idle</title><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><style>body { margin: 0; background: #FBF9F6; color: #191919; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; touch-action: none; } #gameCanvas { background: #2B1E12; border: 4px solid #E5E0D8; border-radius: 8px; max-width: 90vw; max-height: 45vh; aspect-ratio: 320/240; } #stats { font-size: 20px; font-weight: bold; margin-bottom: 10px; } .hint { font-size: 12px; color: #6E6D6A; margin-top: 5px; } #shop { display: flex; gap: 10px; margin-top: 15px; width: 100%; max-width: 320px; justify-content: center; } .shop-btn { flex: 1; background: #191919; color: #FBF9F6; border: 2px solid #E5E0D8; padding: 10px; border-radius: 8px; cursor: pointer; font-size: 11px; font-weight: bold; display: flex; flex-direction: column; align-items: center; justify-content: center; touch-action: manipulation; } .shop-btn:disabled { background: #6E6D6A; color: #A09E9B; cursor: not-allowed; } .shop-btn:active:not(:disabled) { background: #C25E43; }</style></head><body><div id="stats">Gold: <span id="goldCount">0</span></div><canvas id="gameCanvas" width="320" height="240"></canvas><div class="hint">Tap nugget to mine gold!</div><div id="shop"><button class="shop-btn" id="btnPick" onclick="buyPick()">⛏️ Upgrade Pick<br>Cost: <span id="pickCost">10</span></button><button class="shop-btn" id="btnDrill" onclick="buyDrill()">⚙️ Buy Auto-Drill<br>Cost: <span id="drillCost">50</span></button></div><script>const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d'); const goldCountEl = document.getElementById('goldCount'); const pickCostEl = document.getElementById('pickCost'); const drillCostEl = document.getElementById('drillCost'); const btnPick = document.getElementById('btnPick'); const btnDrill = document.getElementById('btnDrill'); let gold = 0; let clickVal = 1; let gps = 0; let pickCost = 10; let drillCost = 50; let nuggets = []; let scale = 1.0; function clickNugget() { gold += clickVal; goldCountEl.innerText = Math.floor(gold); scale = 0.9; setTimeout(() => scale = 1.0, 80); for(let i=0; i<5; i++) { nuggets.push({ x: 160, y: 120, vx: (Math.random() - 0.5) * 6, vy: (Math.random() - 0.5) * 6 - 3, life: 30, size: Math.random() * 6 + 3 }); } updateButtons(); } function buyPick() { if (gold >= pickCost) { gold -= pickCost; clickVal += 1; pickCost = Math.floor(pickCost * 1.5); goldCountEl.innerText = Math.floor(gold); pickCostEl.innerText = pickCost; updateButtons(); } } function buyDrill() { if (gold >= drillCost) { gold -= drillCost; gps += 1; drillCost = Math.floor(drillCost * 1.6); goldCountEl.innerText = Math.floor(gold); drillCostEl.innerText = drillCost; updateButtons(); } } function updateButtons() { btnPick.disabled = gold < pickCost; btnDrill.disabled = gold < drillCost; } canvas.addEventListener('mousedown', function(e) { e.preventDefault(); clickNugget(); }); canvas.addEventListener('touchstart', function(e) { e.preventDefault(); clickNugget(); }); function loop() { requestAnimationFrame(loop); ctx.clearRect(0,0,canvas.width,canvas.height); ctx.save(); ctx.translate(160, 120); ctx.scale(scale, scale); ctx.fillStyle = '#D97706'; ctx.beginPath(); ctx.moveTo(-40, 0); ctx.lineTo(-20, -35); ctx.lineTo(20, -35); ctx.lineTo(40, 0); ctx.lineTo(20, 35); ctx.lineTo(-20, 35); ctx.closePath(); ctx.fill(); ctx.strokeStyle = '#FBF9F6'; ctx.lineWidth = 3; ctx.stroke(); ctx.fillStyle = '#FBBF24'; ctx.beginPath(); ctx.moveTo(-30, 0); ctx.lineTo(-15, -25); ctx.lineTo(15, -25); ctx.lineTo(30, 0); ctx.lineTo(15, 25); ctx.lineTo(-15, 25); ctx.closePath(); ctx.fill(); ctx.restore(); ctx.fillStyle = '#FBBF24'; for(let i=nuggets.length-1; i>=0; i--) { let n = nuggets[i]; n.x += n.vx; n.y += n.vy; n.vy += 0.15; n.life--; ctx.fillRect(n.x, n.y, n.size, n.size); if (n.life <= 0) nuggets.splice(i,1); } ctx.fillStyle = '#FBF9F6'; ctx.font = 'bold 12px monospace'; ctx.fillText("GPS: " + gps + "/s", 10, 20); ctx.fillText("Click: +" + clickVal, 10, 35); } setInterval(() => { if (gps > 0) { gold += gps / 10; goldCountEl.innerText = Math.floor(gold); updateButtons(); } }, 100); let touchStartY = 0; let touchStartX = 0; let isScrollingParent = false; window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; touchStartX = e.touches[0].clientX; isScrollingParent = false; }, { passive: true }); window.addEventListener('touchmove', (e) => { const touchY = e.touches[0].clientY; const touchX = e.touches[0].clientX; const dy = touchStartY - touchY; const dx = touchStartX - touchX; if (!isScrollingParent && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) { isScrollingParent = true; } if (isScrollingParent) { try { const feed = window.parent.document.getElementById('mobileGameFeed'); if (feed) { feed.scrollBy(0, dy); } } catch(err) {} } touchStartY = touchY; touchStartX = touchX; }, { passive: true }); updateButtons(); requestAnimationFrame(loop);</script></body></html>`
    },
    {
      title: '2048 Fusion',
      genre: 'Merge Puzzle',
      description: 'Swipe or tap arrows to slide and merge matching tiles up to 2048.',
      icon: <Gamepad2 className="w-6 h-6 text-[#C25E43]" />,
      coverImage: '/covers/2048_fusion.png',
      category: 'Think',
      author: { name: 'puzzle_guy', date: '6 Jun' },
      stats: { views: '1.8k', likes: 38, comments: 6 },
      code: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>2048 Fusion</title><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><style>body { margin: 0; background: #FBF9F6; color: #191919; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; touch-action: none; } #gameCanvas { background: #BBADA0; border: 4px solid #E5E0D8; border-radius: 8px; max-width: 90vw; max-height: 50vh; aspect-ratio: 1; } #score { font-size: 20px; font-weight: bold; margin-bottom: 10px; } .hint { font-size: 12px; color: #6E6D6A; margin-top: 5px; } #mobileControls { display: none; justify-content: center; gap: 8px; margin-top: 10px; width: 100%; max-width: 320px; } .btn { width: 45px; height: 45px; background: #E5E0D8; color: #191919; border: 2px solid #6E6D6A; border-radius: 50%; font-weight: bold; font-size: 16px; display: flex; align-items: center; justify-content: center; user-select: none; touch-action: manipulation; } .btn:active { background: #C25E43; color: white; }</style></head><body><div id="score">Score: 0</div><canvas id="gameCanvas" width="320" height="320"></canvas><div class="hint" id="hintText">Use Arrow keys or Swipe to merge tiles</div><div id="mobileControls"><div class="btn" id="btnLeft">◀</div><div class="btn" id="btnUp">▲</div><div class="btn" id="btnDown">▼</div><div class="btn" id="btnRight">▶</div></div><script>const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d'); const scoreEl = document.getElementById('score'); let score = 0; let grid = [ [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0] ]; function addTile() { let empty = []; for (let r = 0; r < 4; r++) { for (let c = 0; c < 4; c++) { if (grid[r][c] === 0) empty.push({r, c}); } } if (empty.length > 0) { let spot = empty[Math.floor(Math.random() * empty.length)]; grid[spot.r][spot.c] = Math.random() < 0.9 ? 2 : 4; } } function draw() { ctx.clearRect(0,0,canvas.width,canvas.height); let size = 70; let padding = 8; for (let r = 0; r < 4; r++) { for (let c = 0; c < 4; c++) { let val = grid[r][c]; let x = c * (size + padding) + padding; let y = r * (size + padding) + padding; ctx.fillStyle = getTileColor(val); fillRoundRect(x, y, size, size, 6); if (val > 0) { ctx.fillStyle = val <= 4 ? '#776e65' : '#f9f6f2'; ctx.font = 'bold ' + (val > 512 ? 20 : 24) + 'px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(val, x + size/2, y + size/2); } } } } function fillRoundRect(x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x+r, y); ctx.arcTo(x+w, y, x+w, y+h, r); ctx.arcTo(x+w, y+h, x, y+h, r); ctx.arcTo(x, y+h, x, y, r); ctx.arcTo(x, y, x+w, y, r); ctx.closePath(); ctx.fill(); } function getTileColor(val) { switch(val) { case 2: return '#eee4da'; case 4: return '#ede0c8'; case 8: return '#f2b179'; case 16: return '#f59563'; case 32: return '#f67c5f'; case 64: return '#f65e3b'; case 128: return '#edcf72'; case 256: return '#edcc61'; case 512: return '#edc850'; case 1024: return '#edc53f'; case 2048: return '#edc22e'; default: return 'rgba(238, 228, 218, 0.35)'; } } function slideRow(row) { let arr = row.filter(val => val); let missing = 4 - arr.length; let zeros = Array(missing).fill(0); return arr.concat(zeros); } function mergeRow(row) { for (let i = 0; i < 3; i++) { if (row[i] !== 0 && row[i] === row[i+1]) { row[i] = row[i] * 2; score += row[i]; scoreEl.innerText = "Score: " + score; row[i+1] = 0; } } return row; } function slideLeft() { let changed = false; for (let r = 0; r < 4; r++) { let row = grid[r]; let nextRow = slideRow(mergeRow(slideRow(row))); if (JSON.stringify(row) !== JSON.stringify(nextRow)) changed = true; grid[r] = nextRow; } return changed; } function rotateGrid() { let temp = [ [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0] ]; for (let r = 0; r < 4; r++) { for (let c = 0; c < 4; c++) { temp[c][3-r] = grid[r][c]; } } grid = temp; } function slideRight() { rotateGrid(); rotateGrid(); let changed = slideLeft(); rotateGrid(); rotateGrid(); return changed; } function slideUp() { rotateGrid(); rotateGrid(); rotateGrid(); let changed = slideLeft(); rotateGrid(); return changed; } function slideDown() { rotateGrid(); let changed = slideLeft(); rotateGrid(); rotateGrid(); rotateGrid(); return changed; } function move(dir) { let changed = false; if (dir === 'left') changed = slideLeft(); if (dir === 'right') changed = slideRight(); if (dir === 'up') changed = slideUp(); if (dir === 'down') changed = slideDown(); if (changed) { addTile(); draw(); } } document.addEventListener('keydown', function(e) { if (e.code === 'ArrowLeft') move('left'); if (e.code === 'ArrowRight') move('right'); if (e.code === 'ArrowUp') move('up'); if (e.code === 'ArrowDown') move('down'); }); const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0); if (isTouch) { document.getElementById('mobileControls').style.display = 'flex'; document.getElementById('hintText').style.display = 'none'; document.getElementById('btnLeft').addEventListener('touchstart', (e) => { e.preventDefault(); move('left'); }); document.getElementById('btnRight').addEventListener('touchstart', (e) => { e.preventDefault(); move('right'); }); document.getElementById('btnUp').addEventListener('touchstart', (e) => { e.preventDefault(); move('up'); }); document.getElementById('btnDown').addEventListener('touchstart', (e) => { e.preventDefault(); move('down'); }); } let touchStartY = 0; let touchStartX = 0; let isScrollingParent = false; window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; touchStartX = e.touches[0].clientX; isScrollingParent = false; }, { passive: true }); window.addEventListener('touchmove', (e) => { const touchY = e.touches[0].clientY; const touchX = e.touches[0].clientX; const dy = touchStartY - touchY; const dx = touchStartX - touchX; let rect = canvas.getBoundingClientRect(); if (touchStartX >= rect.left && touchStartX <= rect.right && touchStartY >= rect.top && touchStartY <= rect.bottom) { if (!isScrollingParent && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 40) { isScrollingParent = true; } } else { if (!isScrollingParent && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) { isScrollingParent = true; } } if (isScrollingParent) { try { const feed = window.parent.document.getElementById('mobileGameFeed'); if (feed) { feed.scrollBy(0, dy); } } catch(err) {} } touchStartY = touchY; touchStartX = touchX; }, { passive: true }); let canvasTouchStartX = 0; let canvasTouchStartY = 0; canvas.addEventListener('touchstart', (e) => { canvasTouchStartX = e.touches[0].clientX; canvasTouchStartY = e.touches[0].clientY; }, { passive: true }); canvas.addEventListener('touchend', (e) => { let dx = e.changedTouches[0].clientX - canvasTouchStartX; let dy = e.changedTouches[0].clientY - canvasTouchStartY; if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) { if (dx > 0) move('right'); else move('left'); } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 30) { if (dy > 0) move('down'); else move('up'); } }, { passive: true }); addTile(); addTile(); draw();</script></body></html>`
    },
    {
      title: 'Vortex Dodge',
      genre: 'Vortex Dodger',
      description: 'Orbit a central vortex and dodge expanding slate blocks. Tap left/right to orbit.',
      icon: <Gamepad2 className="w-6 h-6 text-[#C25E43]" />,
      coverImage: '/covers/vortex_dodge.png',
      category: 'Brainrot',
      author: { name: 'retro_coder', date: '7 Jun' },
      stats: { views: '1.4k', likes: 29, comments: 3 },
      code: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Vortex Dodge</title><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><style>body { margin: 0; background: #FBF9F6; color: #191919; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; touch-action: none; } #gameCanvas { background: #121214; border: 4px solid #E5E0D8; border-radius: 8px; max-width: 90vw; max-height: 55vh; aspect-ratio: 1; } #score { font-size: 20px; font-weight: bold; margin-bottom: 10px; } .hint { font-size: 12px; color: #6E6D6A; margin-top: 10px; } #gameOver { display: none; position: absolute; text-align: center; background: rgba(251, 249, 246, 0.95); border: 1px solid #E5E0D8; padding: 20px; border-radius: 8px; z-index: 10; } button { background: #191919; color: #FBF9F6; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px; }</style></head><body><div id="score">Score: 0</div><canvas id="gameCanvas" width="360" height="360"></canvas><div class="hint" id="hintText">Use Left/Right arrows or Tap Left/Right Screen sides</div><div id="gameOver"><h2 style="margin: 0 0 10px 0; font-family: Georgia, serif;">Game Over</h2><p id="finalScore"></p><button onclick="resetGame()">Play Again</button></div><script>const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d'); const scoreEl = document.getElementById('score'); const gameOverEl = document.getElementById('gameOver'); const finalScoreEl = document.getElementById('finalScore'); let score = 0; let running = true; let playerAngle = 0; let obstacles = []; let spawnTimer = 0; let rotationSpeed = 0.08; let activeKeys = {}; function resetGame() { obstacles = []; playerAngle = 0; score = 0; scoreEl.innerText = "Score: " + score; gameOverEl.style.display = 'none'; spawnTimer = 0; running = true; } document.addEventListener('keydown', (e) => activeKeys[e.code] = true); document.addEventListener('keyup', (e) => activeKeys[e.code] = false); let touchLeft = false; let touchRight = false; canvas.addEventListener('touchstart', (e) => { e.preventDefault(); let touch = e.touches[0]; let rect = canvas.getBoundingClientRect(); let touchX = touch.clientX - rect.left; if (touchX < rect.width / 2) { touchLeft = true; } else { touchRight = true; } }, { passive: false }); canvas.addEventListener('touchend', (e) => { touchLeft = false; touchRight = false; }, { passive: true }); function spawnObstacle() { let angle = Math.random() * Math.PI * 2; obstacles.push({ distance: 10, angle: angle, speed: 2.5, size: 8 }); } function loop() { if (!running) return; requestAnimationFrame(loop); if (activeKeys['ArrowLeft'] || touchLeft) playerAngle -= rotationSpeed; if (activeKeys['ArrowRight'] || touchRight) playerAngle += rotationSpeed; ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.strokeStyle = 'rgba(255,255,255,0.1)'; ctx.beginPath(); ctx.arc(180, 180, 110, 0, Math.PI * 2); ctx.stroke(); ctx.fillStyle = '#C25E43'; ctx.beginPath(); ctx.arc(180, 180, 15, 0, Math.PI * 2); ctx.fill(); let px = 180 + Math.cos(playerAngle) * 110; let py = 180 + Math.sin(playerAngle) * 110; ctx.fillStyle = '#8E9E8C'; ctx.beginPath(); ctx.arc(px, py, 10, 0, Math.PI * 2); ctx.fill(); if (spawnTimer++ % 40 === 0) { spawnObstacle(); } ctx.fillStyle = '#D97706'; for (let i = obstacles.length - 1; i >= 0; i--) { let obs = obstacles[i]; obs.distance += obs.speed; let ox = 180 + Math.cos(obs.angle) * obs.distance; let oy = 180 + Math.sin(obs.angle) * obs.distance; ctx.beginPath(); ctx.arc(ox, oy, obs.size, 0, Math.PI * 2); ctx.fill(); if (obs.distance >= 100 && obs.distance <= 120) { let normDiff = Math.abs(Math.atan2(Math.sin(obs.angle - playerAngle), Math.cos(obs.angle - playerAngle))); if (normDiff < 0.18) { endGame(); } } if (obs.distance > 220) { obstacles.splice(i, 1); score += 10; scoreEl.innerText = "Score: " + score; } } } function endGame() { running = false; finalScoreEl.innerText = "Final Score: " + score; gameOverEl.style.display = 'block'; } const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0); if (isTouch) { document.getElementById('hintText').innerText = 'Tap Left/Right screen halves to rotate'; } let touchStartY = 0; let touchStartX = 0; let isScrollingParent = false; window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; touchStartX = e.touches[0].clientX; isScrollingParent = false; }, { passive: true }); window.addEventListener('touchmove', (e) => { const touchY = e.touches[0].clientY; const touchX = e.touches[0].clientX; const dy = touchStartY - touchY; const dx = touchStartX - touchX; if (!isScrollingParent && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) { isScrollingParent = true; } if (isScrollingParent) { try { const feed = window.parent.document.getElementById('mobileGameFeed'); if (feed) { feed.scrollBy(0, dy); } } catch(err) {} } touchStartY = touchY; touchStartX = touchX; }, { passive: true }); requestAnimationFrame(loop);</script></body></html>`
    },
    {
      title: 'Neon Jumper',
      genre: 'Neon Platformer',
      description: 'Hop from platform to platform. Tap left/right to direct your jumps.',
      icon: <Gamepad2 className="w-6 h-6 text-[#C25E43]" />,
      coverImage: '/covers/neon_jumper.png',
      category: 'Dopamine',
      author: { name: 'pixel_jump', date: '8 Jun' },
      stats: { views: '2.5k', likes: 54, comments: 7 },
      code: `<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Neon Jumper</title><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"><style>body { margin: 0; background: #FBF9F6; color: #191919; font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; overflow: hidden; touch-action: none; } #gameCanvas { background: #0c0f1d; border: 4px solid #E5E0D8; border-radius: 8px; max-width: 90vw; max-height: 55vh; aspect-ratio: 320/400; } #score { font-size: 20px; font-weight: bold; margin-bottom: 10px; } .hint { font-size: 12px; color: #6E6D6A; margin-top: 10px; } #gameOver { display: none; position: absolute; text-align: center; background: rgba(251, 249, 246, 0.95); border: 1px solid #E5E0D8; padding: 20px; border-radius: 8px; z-index: 10; } button { background: #191919; color: #FBF9F6; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-top: 10px; }</style></head><body><div id="score">Score: 0</div><canvas id="gameCanvas" width="320" height="400"></canvas><div class="hint" id="hintText">Use Left/Right arrows or Tap Left/Right Screen sides</div><div id="gameOver"><h2 style="margin: 0 0 10px 0; font-family: Georgia, serif;">Game Over</h2><p id="finalScore"></p><button onclick="resetGame()">Play Again</button></div><script>const canvas = document.getElementById('gameCanvas'); const ctx = canvas.getContext('2d'); const scoreEl = document.getElementById('score'); const gameOverEl = document.getElementById('gameOver'); const finalScoreEl = document.getElementById('finalScore'); let score = 0; let running = true; let player = { x: 150, y: 300, vx: 0, vy: 0, size: 16, jumpForce: -10, gravity: 0.4 }; let platforms = []; let cameraY = 0; let activeKeys = {}; function resetGame() { player.x = 150; player.y = 300; player.vx = 0; player.vy = 0; platforms = []; score = 0; scoreEl.innerText = "Score: " + score; for(let i=0; i<6; i++) { platforms.push({ x: Math.random() * 240, y: 400 - i * 80, width: 70, height: 10 }); } gameOverEl.style.display = 'none'; running = true; } document.addEventListener('keydown', (e) => activeKeys[e.code] = true); document.addEventListener('keyup', (e) => activeKeys[e.code] = false); let touchLeft = false; let touchRight = false; canvas.addEventListener('touchstart', (e) => { e.preventDefault(); let touch = e.touches[0]; let rect = canvas.getBoundingClientRect(); let touchX = touch.clientX - rect.left; if (touchX < rect.width / 2) { touchLeft = true; } else { touchRight = true; } }, { passive: false }); canvas.addEventListener('touchend', (e) => { touchLeft = false; touchRight = false; }, { passive: true }); function loop() { if (!running) return; requestAnimationFrame(loop); if (activeKeys['ArrowLeft'] || touchLeft) player.vx = -4; else if (activeKeys['ArrowRight'] || touchRight) player.vx = 4; else player.vx = 0; player.vy += player.gravity; player.x += player.vx; player.y += player.vy; if (player.x < 0) player.x = canvas.width - player.size; if (player.x > canvas.width) player.x = 0; platforms.forEach(p => { if ( player.vy > 0 && player.x + player.size > p.x && player.x < p.x + p.width && player.y + player.size >= p.y && player.y + player.size <= p.y + p.height + player.vy ) { player.vy = player.jumpForce; score += 10; scoreEl.innerText = "Score: " + score; } }); if (player.y < 200) { let diff = 200 - player.y; player.y = 200; platforms.forEach(p => { p.y += diff; }); } platforms.forEach((p, idx) => { if (p.y > canvas.height) { p.y = 0; p.x = Math.random() * (canvas.width - p.width); } }); if (player.y > canvas.height) { endGame(); } ctx.clearRect(0,0,canvas.width,canvas.height); ctx.fillStyle = '#00F2FF'; platforms.forEach(p => { ctx.fillRect(p.x, p.y, p.width, p.height); }); ctx.fillStyle = '#FF0077'; ctx.fillRect(player.x, player.y, player.size, player.size); } function endGame() { running = false; finalScoreEl.innerText = "Final Score: " + score; gameOverEl.style.display = 'block'; } const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0); if (isTouch) { document.getElementById('hintText').innerText = 'Tap Left/Right halves to move'; } let touchStartY = 0; let touchStartX = 0; let isScrollingParent = false; window.addEventListener('touchstart', (e) => { touchStartY = e.touches[0].clientY; touchStartX = e.touches[0].clientX; isScrollingParent = false; }, { passive: true }); window.addEventListener('touchmove', (e) => { const touchY = e.touches[0].clientY; const touchX = e.touches[0].clientX; const dy = touchStartY - touchY; const dx = touchStartX - touchX; if (!isScrollingParent && Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 10) { isScrollingParent = true; } if (isScrollingParent) { try { const feed = window.parent.document.getElementById('mobileGameFeed'); if (feed) { feed.scrollBy(0, dy); } } catch(err) {} } touchStartY = touchY; touchStartX = touchX; }, { passive: true }); resetGame(); requestAnimationFrame(loop);</script></body></html>`
    }
  ];

  const filteredGames = demoGames.filter((game) => {
    const matchesCategory = selectedCategory === 'All' || game.category === selectedCategory;
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

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

  if (isMobile) {
    return (
      <div className="h-screen w-screen bg-[#191919] text-[#FBF9F6] flex flex-col overflow-hidden font-sans select-none">
        {/* Compact Top Header */}
        <header className="h-14 bg-[#191919] border-b border-white/10 flex items-center justify-between px-4 z-40 shrink-0">
          <div className="flex items-center gap-2">
            <Gamepad2 size={20} className="text-[#C25E43]" />
            <span className="font-serif font-black text-lg text-white">Khel AI</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#C25E43] hover:bg-[#a64e36] text-white rounded-full px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles size={12} /> Create
            </button>
            {session?.user ? (
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#C25E43] to-[#D97706] border border-white/20 flex items-center justify-center text-xs font-bold text-white uppercase shrink-0">
                {(session.user.name || session.user.email || 'U')[0]}
              </div>
            ) : (
              <button
                onClick={() => router.push('/account/signin')}
                className="text-xs font-medium text-white/80 hover:text-white"
              >
                Login
              </button>
            )}
          </div>
        </header>

        {/* Categories Pills bar */}
        <div className="h-11 border-b border-white/10 bg-[#191919] flex items-center px-4 overflow-x-auto scrollbar-none gap-2 shrink-0 z-40">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setActiveMobileIndex(0);
                  setActiveInteractionIndex(null);
                }}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                  isActive ? 'bg-[#C25E43] text-white' : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Doom Scrolling Game Feed */}
        <div
          id="mobileGameFeed"
          className="flex-1 overflow-y-scroll snap-y snap-mandatory scroll-smooth relative"
          onScroll={(e) => {
            const container = e.currentTarget;
            const index = Math.round(container.scrollTop / container.clientHeight);
            if (index !== activeMobileIndex && index >= 0 && index < filteredGames.length) {
              setActiveMobileIndex(index);
            }
          }}
        >
          {filteredGames.map((game, idx) => {
            const isActive = activeMobileIndex === idx;
            const isLiked = likedGames[game.title] || false;
            const baseLikes = game.stats.likes;
            const displayLikes = isLiked ? baseLikes + 1 : baseLikes;

            return (
              <div
                key={game.title}
                className="w-full h-full snap-start relative flex flex-col bg-black overflow-hidden"
              >
                {/* Game Play Area */}
                <div className="relative w-full h-[64vh] bg-[#191919] flex items-center justify-center border-b border-white/10">
                  {isActive ? (
                    <iframe
                      key={`${game.title}-${restartKey}`}
                      srcDoc={game.code}
                      className="w-full h-full border-0 bg-[#FBF9F6]"
                      sandbox="allow-scripts allow-same-origin"
                      title={game.title}
                    />
                  ) : (
                    <div className="relative w-full h-full">
                      <img
                        src={game.coverImage}
                        className="w-full h-full object-cover opacity-70"
                        alt={game.title}
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                        <div className="w-14 h-14 rounded-full bg-[#C25E43] text-white flex items-center justify-center shadow-lg">
                          <Play size={22} fill="currentColor" className="ml-1" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile Details and Actions Row */}
                <div className="h-[22vh] bg-[#191919] flex justify-between p-4 relative z-20 overflow-hidden shrink-0">
                  {/* Left Column: Details */}
                  <div className="flex-1 min-w-0 pr-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#C25E43] to-[#D97706] border border-white/20 flex items-center justify-center text-[10px] font-bold text-white uppercase shrink-0">
                          {game.author.name[0]}
                        </div>
                        <p className="text-xs font-bold text-white/90 truncate">@{game.author.name}</p>
                      </div>
                      <h3 className="font-serif font-black text-base text-white leading-tight mb-1">
                        {game.title}
                      </h3>
                      <p className="text-xs text-white/70 line-clamp-2 leading-relaxed">
                        {game.description}
                      </p>
                    </div>
                    <div>
                      <span className="inline-block mt-2 bg-[#C25E43] text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        {game.genre}
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Interaction Icons */}
                  <div className="flex items-center gap-4 shrink-0">
                    {/* Restart Button */}
                    {isActive && (
                      <div className="flex flex-col items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setRestartKey(prev => prev + 1);
                          }}
                          className="w-10 h-10 rounded-full bg-white/10 text-white/90 flex items-center justify-center border border-white/10 active:bg-white/20 transition-all cursor-pointer"
                        >
                          <Mic size={16} className="rotate-180" />
                        </button>
                        <span className="text-[9px] font-medium text-white/60 mt-1">Restart</span>
                      </div>
                    )}

                    {/* Like Button */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(game.title);
                        }}
                        className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all active:scale-90 cursor-pointer ${
                          isLiked ? 'bg-[#C25E43] border-[#C25E43] text-white' : 'bg-white/10 border-white/10 text-white/90 active:bg-white/20'
                        }`}
                      >
                        <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} />
                      </button>
                      <span className="text-[9px] font-medium text-white/60 mt-1">{displayLikes}</span>
                    </div>

                    {/* Comments Button */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          alert('Comments coming soon!');
                        }}
                        className="w-10 h-10 rounded-full bg-white/10 text-white/90 flex items-center justify-center border border-white/10 active:bg-white/20 transition-all cursor-pointer"
                      >
                        <MessageSquare size={16} />
                      </button>
                      <span className="text-[9px] font-medium text-white/60 mt-1">{game.stats.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Create Drawer */}
        <AnimatePresence>
          {showCreateModal && (
            <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs">
              <div className="absolute inset-0" onClick={() => setShowCreateModal(false)} />
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="relative w-full bg-[#FBF9F6] border-t border-[#E5E0D8] rounded-t-2xl p-4 pb-8 z-50 text-[#191919]"
              >
                <div className="w-12 h-1.5 bg-[#E5E0D8] rounded-full mx-auto mb-4" />
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif font-bold text-base text-[#191919]">Generate Game</h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="text-xs font-semibold text-[#6E6D6A] hover:text-[#191919]"
                  >
                    Cancel
                  </button>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setShowCreateModal(false);
                    void handlePromptSubmit(e);
                  }}
                >
                  <div className="flex flex-col rounded-[20px] border border-[#E5E0D8] bg-white p-3.5 focus-within:border-[#C25E43] transition-all">
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe your game concept in detail..."
                      rows={3}
                      disabled={creating}
                      className="w-full bg-transparent text-[#191919] placeholder-[#A09E9B] outline-none text-sm leading-relaxed resize-none text-left"
                    />
                    <div className="flex items-center justify-end mt-2 pt-2 border-t border-[#E5E0D8]/40">
                      <button
                        type="submit"
                        disabled={creating || !prompt.trim()}
                        className="bg-[#191919] hover:bg-[#C25E43] text-white disabled:bg-[#E5E0D8] disabled:text-[#A09E9B] rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer"
                      >
                        {creating ? 'Creating...' : 'Submit'}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

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
              <div className="flex flex-col rounded-[20px] border border-[#E5E0D8] bg-white p-4 focus-within:border-[#C25E43] focus-within:ring-1 focus-within:ring-[#C25E43]/20 transition-all shadow-sm">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask Khel AI to build a one-tap climber with streak combos..."
                  rows={2}
                  disabled={creating}
                  className="w-full bg-transparent text-[#191919] placeholder-[#A09E9B] outline-none text-base leading-relaxed resize-none min-h-[64px] text-left"
                />
                <div className="flex items-center justify-between mt-2 pt-2">
                  <button
                    type="button"
                    className="p-1.5 rounded-full text-[#6E6D6A] hover:text-[#191919] hover:bg-[#F5F2EC] transition-all cursor-pointer"
                    title="Attach asset file (coming soon)"
                  >
                    <Paperclip size={18} />
                  </button>
                  <button
                    type="submit"
                    disabled={creating || !prompt.trim()}
                    className="w-9 h-9 rounded-full bg-[#191919] text-[#FBF9F6] flex items-center justify-center hover:bg-[#C25E43] disabled:bg-[#E5E0D8] disabled:text-[#A09E9B] transition-all cursor-pointer shadow-xs"
                  >
                    {creating ? (
                      <Sparkles size={15} className="animate-spin" />
                    ) : (
                      <ArrowUp size={16} className="stroke-[2.5]" />
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

          {/* Categories Tab and Search Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#E5E0D8] pb-4 mb-10">
            {/* Category Tabs */}
            <div className="flex items-center gap-6 overflow-x-auto w-full sm:w-auto scrollbar-none pb-2 sm:pb-0">
              {categories.map((category) => {
                const isActive = selectedCategory === category;
                return (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`relative pb-2 text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                      isActive ? 'text-[#191919]' : 'text-[#6E6D6A] hover:text-[#191919]'
                    }`}
                  >
                    {category}
                    {isActive && (
                      <motion.div
                        layoutId="activeCategoryUnderline"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C25E43]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A09E9B]" />
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-[#E5E0D8] bg-white placeholder-[#A09E9B] text-[#191919] focus:outline-none focus:border-[#C25E43] focus:ring-1 focus:ring-[#C25E43]/20 transition-all"
              />
            </div>
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredGames.map((game, idx) => (
                <motion.div
                  key={game.title}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col group cursor-pointer"
                  onClick={() => setActivePlayGame({ title: game.title, code: game.code })}
                >
                  {/* Cover Image Container */}
                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#F5F2EC] border border-[#E5E0D8] mb-4 shadow-xs">
                    <img
                      src={game.coverImage}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    {/* Category Badge Floating */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="bg-[#FBF9F6]/90 backdrop-blur-xs border border-[#E5E0D8] text-[#C25E43] text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                        {game.category}
                      </span>
                    </div>
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-xs">
                      <div className="bg-white text-[#191919] rounded-full px-5 py-2.5 text-xs font-semibold flex items-center gap-1.5 shadow-md transform translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                        <Play size={11} fill="currentColor" /> Quick Play
                      </div>
                    </div>
                  </div>

                  {/* Author Avatar and Game Details */}
                  <div className="flex items-start gap-3 px-1">
                    {/* Author Avatar Group */}
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#C25E43] to-[#D97706] border border-[#E5E0D8]/40 flex items-center justify-center text-xs font-bold text-white uppercase shadow-xs shrink-0 select-none">
                      {game.author.name[0]}
                    </div>

                    {/* Title & Author Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-black text-[#191919] text-base group-hover:text-[#C25E43] transition-colors truncate mb-0.5">
                        {game.title}
                      </h3>
                      <p className="text-xs text-[#6E6D6A] truncate">
                        {game.author.name} • {game.author.date}
                      </p>
                    </div>
                  </div>

                  {/* Engagement Stats */}
                  <div className="flex items-center gap-4 mt-3 px-1 text-xs text-[#6E6D6A]">
                    <div className="flex items-center gap-1">
                      <Eye size={13} className="text-[#6E6D6A]" />
                      <span>{game.stats.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart size={13} className="text-[#6E6D6A] hover:text-[#C25E43] transition-colors" />
                      <span>{game.stats.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare size={13} className="text-[#6E6D6A]" />
                      <span>{game.stats.comments}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center py-16 text-[#6E6D6A] font-serif italic text-base">
              No games found matching your filters.
            </div>
          )}
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
