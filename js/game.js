/**
 * 游戏主类
 */
class Game {
    /**
     * 构造函数
     * @param {HTMLCanvasElement} canvas - 游戏画布
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        
        // 游戏状态
        this.isRunning = false;
        this.isPaused = false;
        this.gameTime = 0;
        this.score = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.comboTimeout = 120; // 连击超时（帧数）
        this.difficulty = 0;
        this.maxDifficulty = 1;
        this.difficultyIncreaseRate = 0.0001;
        
        // 游戏对象
        this.player = null;
        this.enemies = [];
        this.bullets = [];
        this.powerUps = [];
        this.explosions = [];
        this.messages = [];
        
        // 游戏计时器
        this.enemySpawnTimer = 0;
        this.powerUpSpawnTimer = 0;
        
        // 背景
        this.stars = [];
        this.createStars();
        
        // 音效
        this.sounds = {};
        
        // 初始化
        this.init();
    }

    /**
     * 初始化游戏
     */
    init() {
        // 调整画布大小
        this.resizeCanvas();
        
        // 创建玩家
        this.player = new Player(
            this.width / 2 - 15,
            this.height - 80,
            30, 30
        );
        
        // 重置游戏状态
        this.isRunning = false;
        this.isPaused = false;
        this.gameTime = 0;
        this.score = 0;
        this.combo = 0;
        this.comboTimer = 0;
        this.difficulty = 0;
        
        // 清空游戏对象
        this.enemies = [];
        this.bullets = [];
        this.powerUps = [];
        this.explosions = [];
        this.messages = [];
        
        // 重置计时器
        this.enemySpawnTimer = 60;
        this.powerUpSpawnTimer = 600;
        
        // 加载音效
        // this.loadSounds();
    }

    /**
     * 调整画布大小
     */
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // 重新创建星星
        this.createStars();
        
        // 设置像素渲染
        this.ctx.imageSmoothingEnabled = false;
    }

    /**
     * 创建背景星星
     */
    createStars() {
        this.stars = [];
        const starCount = Math.floor(this.width * this.height / 2000);
        
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 0.5 + 0.1
            });
        }
    }

    /**
     * 加载音效
     */
    loadSounds() {
        // 在实际项目中加载音效
        // this.sounds.shoot = new Audio('assets/sounds/shoot.wav');
        // this.sounds.explosion = new Audio('assets/sounds/explosion.wav');
        // this.sounds.powerup = new Audio('assets/sounds/powerup.wav');
        // this.sounds.hit = new Audio('assets/sounds/hit.wav');
        // this.sounds.gameOver = new Audio('assets/sounds/gameover.wav');
    }

    /**
     * 开始游戏
     */
    start() {
        if (!this.isRunning) {
            this.init();
            this.isRunning = true;
            this.isPaused = false;
        }
    }

    /**
     * 暂停游戏
     */
    pause() {
        if (this.isRunning) {
            this.isPaused = !this.isPaused;
        }
    }

    /**
     * 结束游戏
     */
    gameOver() {
        this.isRunning = false;
        // if (this.sounds.gameOver) this.sounds.gameOver.play();
        
        // 显示游戏结束屏幕
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.remove('hidden');
        document.getElementById('final-score').textContent = this.score;
    }

    /**
     * 处理输入
     * @param {Number} touchX - 触摸x坐标
     * @param {Number} touchY - 触摸y坐标
     * @param {Boolean} isShooting - 是否射击
     */
    handleInput(touchX, touchY, isShooting) {
        if (this.isRunning && !this.isPaused && this.player) {
            this.player.handleInput(touchX, touchY, isShooting);
        }
    }

    /**
     * 更新游戏
     * @param {Number} dt - 时间增量
     */
    update(dt) {
        if (!this.isRunning || this.isPaused) return;
        
        // 更新游戏时间和难度
        this.gameTime += dt;
        this.difficulty = Math.min(this.maxDifficulty, 
                                  this.gameTime * this.difficultyIncreaseRate);
        
        // 更新连击计时器
        if (this.combo > 0) {
            this.comboTimer -= dt;
            if (this.comboTimer <= 0) {
                this.combo = 0;
            }
        }
        
        // 更新玩家
        if (this.player) {
            this.player.update(dt, this.width, this.height);
            
            // 玩家射击
            if (this.player.isShooting) {
                const bullets = this.player.shoot();
                if (bullets.length > 0) {
                    this.bullets.push(...bullets);
                    // if (this.sounds.shoot) this.sounds.shoot.play();
                }
            }
        }
        
        // 更新敌机
        this.updateEnemies(dt);
        
        // 更新子弹
        this.updateBullets(dt);
        
        // 更新道具
        this.updatePowerUps(dt);
        
        // 更新爆炸效果
        this.updateExplosions(dt);
        
        // 更新消息
        this.updateMessages(dt);
        
        // 更新背景
        this.updateBackground(dt);
        
        // 检测碰撞
        this.checkCollisions();
    }

    /**
     * 更新敌机
     * @param {Number} dt - 时间增量
     */
    updateEnemies(dt) {
        // 生成敌机
        this.enemySpawnTimer -= dt;
        if (this.enemySpawnTimer <= 0) {
            // 根据难度调整生成间隔
            const spawnInterval = Math.max(20, 100 - this.difficulty * 80);
            this.enemySpawnTimer = spawnInterval;
            
            // 根据难度调整同时生成的敌机数量
            const spawnCount = Math.floor(1 + this.difficulty * 2);
            
            for (let i = 0; i < spawnCount; i++) {
                const enemy = createRandomEnemy(this.width, this.difficulty);
                this.enemies.push(enemy);
            }
        }
        
        // 更新敌机
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            // 更新敌机位置
            enemy.update(dt, this.width, this.player);
            
            // 敌机射击
            const bullets = enemy.shoot();
            if (bullets.length > 0) {
                this.bullets.push(...bullets);
            }
            
            // 移除超出屏幕的敌机
            if (enemy.y > this.height) {
                this.enemies.splice(i, 1);
            }
        }
    }

    /**
     * 更新子弹
     * @param {Number} dt - 时间增量
     */
    updateBullets(dt) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            // 更新子弹位置
            bullet.update(dt, this.player);
            
            // 移除超出屏幕的子弹
            if (bullet.isOutOfBounds(this.width, this.height)) {
                this.bullets.splice(i, 1);
            }
        }
    }

    /**
     * 更新道具
     * @param {Number} dt - 时间增量
     */
    updatePowerUps(dt) {
        // 生成道具
        this.powerUpSpawnTimer -= dt;
        if (this.powerUpSpawnTimer <= 0) {
            // 根据难度调整生成间隔
            const spawnInterval = Math.max(300, 600 - this.difficulty * 300);
            this.powerUpSpawnTimer = spawnInterval;
            
            // 随机位置生成道具
            const x = Utils.randomInt(20, this.width - 40);
            const powerUp = createRandomPowerUp(x, -20);
            this.powerUps.push(powerUp);
        }
        
        // 更新道具
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            
            // 更新道具位置
            powerUp.update(dt);
            
            // 移除超出屏幕的道具
            if (powerUp.isOutOfBounds(this.height)) {
                this.powerUps.splice(i, 1);
            }
        }
    }

    /**
     * 更新爆炸效果
     * @param {Number} dt - 时间增量
     */
    updateExplosions(dt) {
        for (let i = this.explosions.length - 1; i >= 0; i--) {
            const explosion = this.explosions[i];
            
            // 更新爆炸效果
            explosion.update(dt);
            
            // 移除完成的爆炸效果
            if (!explosion.active) {
                this.explosions.splice(i, 1);
            }
        }
    }

    /**
     * 更新消息
     * @param {Number} dt - 时间增量
     */
    updateMessages(dt) {
        for (let i = this.messages.length - 1; i >= 0; i--) {
            const message = this.messages[i];
            
            // 更新消息
            message.timer -= dt;
            message.y -= 0.5 * dt;
            
            // 移除过期消息
            if (message.timer <= 0) {
                this.messages.splice(i, 1);
            }
        }
    }

    /**
     * 更新背景
     * @param {Number} dt - 时间增量
     */
    updateBackground(dt) {
        // 更新星星位置
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            star.y += star.speed * dt;
            
            // 重置超出屏幕的星星
            if (star.y > this.height) {
                star.y = 0;
                star.x = Math.random() * this.width;
            }
        }
    }

    /**
     * 检测碰撞
     */
    checkCollisions() {
        if (!this.player || !this.player.active) return;
        
        // 玩家子弹与敌机碰撞
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            // 只检测玩家子弹
            if (bullet.owner === 'player') {
                for (let j = this.enemies.length - 1; j >= 0; j--) {
                    const enemy = this.enemies[j];
                    
                    if (bullet.collidesWith(enemy)) {
                        // 敌机受伤
                        const isDead = enemy.takeDamage(bullet.damage);
                        
                        // 移除子弹
                        this.bullets.splice(i, 1);
                        
                        // 如果敌机死亡
                        if (isDead) {
                            // 增加分数
                            this.increaseScore(enemy.score);
                            
                            // 增加连击
                            this.combo++;
                            this.comboTimer = this.comboTimeout;
                            
                            // 创建爆炸效果
                            this.createExplosion(enemy.x, enemy.y, enemy.width, enemy.height);
                            
                            // 随机掉落道具
                            if (Math.random() < 0.1 + this.difficulty * 0.1) {
                                const powerUp = createRandomPowerUp(
                                    enemy.x + enemy.width / 2 - 10,
                                    enemy.y + enemy.height / 2 - 10
                                );
                                this.powerUps.push(powerUp);
                            }
                            
                            // 移除敌机
                            this.enemies.splice(j, 1);
                            
                            // 播放爆炸音效
                            // if (this.sounds.explosion) this.sounds.explosion.play();
                        } else {
                            // 播放命中音效
                            // if (this.sounds.hit) this.sounds.hit.play();
                        }
                        
                        break;
                    }
                }
            }
        }
        
        // 敌机子弹与玩家碰撞
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            // 只检测敌机子弹
            if (bullet.owner === 'enemy' && bullet.collidesWith(this.player)) {
                // 玩家受伤
                const isDead = this.player.takeDamage();
                
                // 移除子弹
                this.bullets.splice(i, 1);
                
                // 如果玩家死亡
                if (isDead) {
                    this.createExplosion(
                        this.player.x, 
                        this.player.y, 
                        this.player.width, 
                        this.player.height
                    );
                    this.player.active = false;
                    
                    // 延迟结束游戏
                    setTimeout(() => this.gameOver(), 1000);
                }
                
                // 播放命中音效
                // if (this.sounds.hit) this.sounds.hit.play();
            }
        }
        
        // 敌机与玩家碰撞
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            if (enemy.collidesWith(this.player)) {
                // 玩家受伤
                const isDead = this.player.takeDamage();
                
                // 敌机死亡
                this.createExplosion(enemy.x, enemy.y, enemy.width, enemy.height);
                this.enemies.splice(i, 1);
                
                // 如果玩家死亡
                if (isDead) {
                    this.createExplosion(
                        this.player.x, 
                        this.player.y, 
                        this.player.width, 
                        this.player.height
                    );
                    this.player.active = false;
                    
                    // 延迟结束游戏
                    setTimeout(() => this.gameOver(), 1000);
                }
                
                // 播放爆炸音效
                // if (this.sounds.explosion) this.sounds.explosion.play();
            }
        }
        
        // 道具与玩家碰撞
        for (let i = this.powerUps.length - 1; i >= 0; i--) {
            const powerUp = this.powerUps[i];
            
            if (powerUp.collidesWith(this.player)) {
                // 应用道具效果
                const effectInfo = powerUp.applyEffect(this.player);
                
                // 如果是炸弹
                if (powerUp.type === 'bomb') {
                    // 清除所有敌机和敌机子弹
                    for (let j = this.enemies.length - 1; j >= 0; j--) {
                        const enemy = this.enemies[j];
                        this.createExplosion(enemy.x, enemy.y, enemy.width, enemy.height);
                        this.increaseScore(enemy.score / 2); // 炸弹击杀只给一半分数
                    }
                    this.enemies = [];
                    
                    // 清除敌机子弹
                    this.bullets = this.bullets.filter(bullet => bullet.owner === 'player');
                }
                
                // 显示效果消息
                this.addMessage(
                    effectInfo.message,
                    this.player.x + this.player.width / 2,
                    this.player.y - 20,
                    effectInfo.duration
                );
                
                // 移除道具
                this.powerUps.splice(i, 1);
                
                // 播放道具音效
                // if (this.sounds.powerup) this.sounds.powerup.play();
            }
        }
    }

    /**
     * 增加分数
     * @param {Number} points - 增加的分数
     */
    increaseScore(points) {
        // 应用连击加成
        const comboMultiplier = 1 + this.combo * 0.1;
        const finalPoints = Math.floor(points * comboMultiplier);
        
        this.score += finalPoints;
        
        // 更新UI
        document.getElementById('score').textContent = this.score;
        
        // 显示得分消息
        let message = `+${finalPoints}`;
        if (this.combo > 1) {
            message += ` (${this.combo}连击!)`;
        }
        
        this.addMessage(
            message,
            this.player.x + this.player.width / 2,
            this.player.y - 30,
            1000
        );
    }

    /**
     * 创建爆炸效果
     * @param {Number} x - x坐标
     * @param {Number} y - y坐标
     * @param {Number} width - 宽度
     * @param {Number} height - 高度
     */
    createExplosion(x, y, width, height) {
        // 简单的爆炸效果
        const explosion = new Sprite(x, y, width, height);
        explosion.alpha = 1;
        explosion.scale = 1;
        explosion.active = true;
        
        // 创建爆炸图像
        const explosionImage = Utils.createPixelImage(width, height, (ctx) => {
            ctx.fillStyle = '#f39c12';
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#e67e22';
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, width / 3, 0, Math.PI * 2);
            ctx.fill();
            
            ctx.fillStyle = '#e74c3c';
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, width / 4, 0, Math.PI * 2);
            ctx.fill();
        });
        
        explosion.setImage(explosionImage);
        
        // 爆炸动画
        explosion.update = function(dt) {
            this.alpha -= 0.05 * dt;
            this.scale += 0.05 * dt;
            
            if (this.alpha <= 0) {
                this.active = false;
            }
        };
        
        this.explosions.push(explosion);
    }

    /**
     * 添加消息
     * @param {String} text - 消息文本
     * @param {Number} x - x坐标
     * @param {Number} y - y坐标
     * @param {Number} duration - 持续时间（毫秒）
     */
    addMessage(text, x, y, duration = 2000) {
        this.messages.push({
            text: text,
            x: x,
            y: y,
            timer: duration / 16.67, // 转换为帧数
            alpha: 1
        });
    }

    /**
     * 绘制游戏
     */
    draw() {
        // 清除画布
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // 绘制背景
        this.drawBackground();
        
        // 绘制游戏对象
        this.drawPowerUps();
        this.drawBullets();
        this.drawEnemies();
        
        // 绘制玩家
        if (this.player && this.player.active) {
            this.player.draw(this.ctx);
        }
        
        // 绘制爆炸效果
        this.drawExplosions();
        
        // 绘制消息
        this.drawMessages();
        
        // 绘制UI
        this.drawUI();
    }

    /**
     * 绘制背景
     */
    drawBackground() {
        // 绘制星星
        this.ctx.fillStyle = '#fff';
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            this.ctx.fillRect(star.x, star.y, star.size, star.size);
        }
    }

    /**
     * 绘制敌机
     */
    drawEnemies() {
        for (let i = 0; i < this.enemies.length; i++) {
            this.enemies[i].draw(this.ctx);
        }
    }

    /**
     * 绘制子弹
     */
    drawBullets() {
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].draw(this.ctx);
        }
    }

    /**
     * 绘制道具
     */
    drawPowerUps() {
        for (let i = 0; i < this.powerUps.length; i++) {
            this.powerUps[i].draw(this.ctx);
        }
    }

    /**
     * 绘制爆炸效果
     */
    drawExplosions() {
        for (let i = 0; i < this.explosions.length; i++) {
            this.explosions[i].draw(this.ctx);
        }
    }

    /**
     * 绘制消息
     */
    drawMessages() {
        this.ctx.save();
        this.ctx.font = '16px "Courier New", Courier, monospace';
        this.ctx.textAlign = 'center';
        
        for (let i = 0; i < this.messages.length; i++) {
            const message = this.messages[i];
            const alpha = Math.min(1, message.timer / 30);
            
            this.ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            this.ctx.fillText(message.text, message.x, message.y);
        }
        
        this.ctx.restore();
    }

    /**
     * 绘制UI
     */
    drawUI() {
        // 绘制生命图标
        if (this.player) {
            this.ctx.save();
            this.ctx.fillStyle = '#e74c3c';
            
            for (let i = 0; i < this.player.lives; i++) {
                this.ctx.fillRect(60 + i * 15, 10, 10, 10);
            }
            
            this.ctx.restore();
        }
        
        // 绘制难度指示器
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.fillRect(this.width - 110, 10, 100, 5);
        
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.fillRect(this.width - 110, 10, 100 * this.difficulty / this.maxDifficulty, 5);
        this.ctx.restore();
        
        // 绘制连击指示器
        if (this.combo > 1) {
            this.ctx.save();
            this.ctx.font = '16px "Courier New", Courier, monospace';
            this.ctx.textAlign = 'right';
            this.ctx.fillStyle = '#f39c12';
            this.ctx.fillText(`${this.combo}连击!`, this.width - 10, 30);
            
            // 连击计时器
            const comboPercent = this.comboTimer / this.comboTimeout;
            this.ctx.fillStyle = 'rgba(243, 156, 18, 0.5)';
            this.ctx.fillRect(this.width - 110, 35, 100 * comboPercent, 3);
            
            this.ctx.restore();
        }
    }
} 