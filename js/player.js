/**
 * 玩家类
 */
class Player extends Sprite {
    /**
     * 构造函数
     * @param {Number} x - x坐标
     * @param {Number} y - y坐标
     * @param {Number} width - 宽度
     * @param {Number} height - 高度
     */
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.lives = 3;
        this.score = 0;
        this.fireRate = 10; // 射击频率（帧数）
        this.fireTimer = 0;
        this.firepower = 1; // 火力等级
        this.invincible = false;
        this.invincibleTimer = 0;
        this.invincibleDuration = 120; // 无敌时间（帧数）
        this.shield = false;
        this.shieldHealth = 0;
        this.touchX = null;
        this.touchY = null;
        this.isShooting = true; // 默认一直发射子弹
        // 键盘控制相关属性
        this.keyboardControl = false;
        this.moveUp = false;
        this.moveDown = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.keyboardSpeed = 5; // 键盘控制时的移动速度
        this.createPlayerImage();
    }

    /**
     * 创建玩家飞机图像
     */
    createPlayerImage() {
        // 创建像素风格的飞机图像
        const playerImage = Utils.createPixelImage(30, 30, (ctx) => {
            // 飞机主体
            ctx.fillStyle = '#3498db';
            ctx.fillRect(10, 0, 10, 25);
            
            // 机翼
            ctx.fillStyle = '#2980b9';
            ctx.fillRect(0, 15, 30, 5);
            
            // 机头
            ctx.fillStyle = '#e74c3c';
            ctx.fillRect(13, 0, 4, 5);
            
            // 引擎
            ctx.fillStyle = '#f39c12';
            ctx.fillRect(10, 25, 3, 5);
            ctx.fillRect(17, 25, 3, 5);
            
            // 引擎火焰
            ctx.fillStyle = '#e67e22';
            ctx.fillRect(10, 28, 3, 2);
            ctx.fillRect(17, 28, 3, 2);
        });
        
        this.setImage(playerImage);
    }

    /**
     * 处理触摸输入
     * @param {Number} touchX - 触摸x坐标
     * @param {Number} touchY - 触摸y坐标
     * @param {Boolean} isShooting - 是否射击
     */
    handleInput(touchX, touchY, isShooting) {
        this.touchX = touchX;
        this.touchY = touchY;
        // 不再更新isShooting，保持默认为true
        this.keyboardControl = false; // 当使用触摸控制时，禁用键盘控制
    }

    /**
     * 处理键盘输入
     * @param {String} key - 按键
     * @param {Boolean} isPressed - 是否按下
     */
    handleKeyInput(key, isPressed) {
        this.keyboardControl = true; // 当使用键盘控制时，启用键盘控制
        
        // 方向键控制
        switch (key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                this.moveUp = isPressed;
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                this.moveDown = isPressed;
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                this.moveLeft = isPressed;
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                this.moveRight = isPressed;
                break;
            // 移除空格键射击控制，因为默认一直发射
        }
    }

    /**
     * 射击
     * @returns {Array} 子弹数组
     */
    shoot() {
        if (this.fireTimer <= 0) {
            this.fireTimer = this.fireRate;
            
            const bullets = [];
            
            // 根据火力等级创建不同数量和类型的子弹
            switch (this.firepower) {
                case 1: // 单发子弹
                    bullets.push(new Bullet(
                        this.x + this.width / 2 - 2,
                        this.y - 5,
                        4, 10,
                        0, -10,
                        'player'
                    ));
                    break;
                    
                case 2: // 双发子弹
                    bullets.push(new Bullet(
                        this.x + this.width / 3 - 2,
                        this.y,
                        4, 10,
                        0, -10,
                        'player'
                    ));
                    bullets.push(new Bullet(
                        this.x + this.width * 2/3 - 2,
                        this.y,
                        4, 10,
                        0, -10,
                        'player'
                    ));
                    break;
                    
                case 3: // 三发子弹（直线+斜线）
                    bullets.push(new Bullet(
                        this.x + this.width / 2 - 2,
                        this.y - 5,
                        4, 10,
                        0, -10,
                        'player'
                    ));
                    bullets.push(new Bullet(
                        this.x + this.width / 4 - 2,
                        this.y,
                        4, 10,
                        -1, -9,
                        'player'
                    ));
                    bullets.push(new Bullet(
                        this.x + this.width * 3/4 - 2,
                        this.y,
                        4, 10,
                        1, -9,
                        'player'
                    ));
                    break;
                    
                default: // 更高级的火力
                    bullets.push(new Bullet(
                        this.x + this.width / 2 - 2,
                        this.y - 5,
                        4, 10,
                        0, -10,
                        'player',
                        true // 加强子弹
                    ));
                    bullets.push(new Bullet(
                        this.x + this.width / 4 - 2,
                        this.y,
                        4, 10,
                        -1.5, -9,
                        'player'
                    ));
                    bullets.push(new Bullet(
                        this.x + this.width * 3/4 - 2,
                        this.y,
                        4, 10,
                        1.5, -9,
                        'player'
                    ));
                    break;
            }
            
            return bullets;
        }
        
        return [];
    }

    /**
     * 受到伤害
     * @returns {Boolean} 是否死亡
     */
    takeDamage() {
        if (this.invincible) {
            return false;
        }
        
        if (this.shield) {
            this.shieldHealth--;
            if (this.shieldHealth <= 0) {
                this.shield = false;
            }
            return false;
        }
        
        this.lives--;
        this.invincible = true;
        this.invincibleTimer = this.invincibleDuration;
        
        return this.lives <= 0;
    }

    /**
     * 增加火力
     * @param {Number} amount - 增加量
     */
    increasePower(amount) {
        this.firepower = Math.min(this.firepower + amount, 4);
    }

    /**
     * 增加护盾
     * @param {Number} health - 护盾生命值
     */
    addShield(health) {
        this.shield = true;
        this.shieldHealth = health;
    }

    /**
     * 增加生命
     * @param {Number} amount - 增加量
     */
    addLife(amount) {
        this.lives += amount;
    }

    /**
     * 更新玩家
     * @param {Number} dt - 时间增量
     * @param {Number} canvasWidth - 画布宽度
     * @param {Number} canvasHeight - 画布高度
     */
    update(dt, canvasWidth, canvasHeight) {
        super.update(dt);
        
        // 更新射击计时器
        if (this.fireTimer > 0) {
            this.fireTimer--;
        }
        
        // 更新无敌状态
        if (this.invincible) {
            this.invincibleTimer--;
            if (this.invincibleTimer <= 0) {
                this.invincible = false;
            }
        }
        
        // 根据控制方式更新位置
        if (this.keyboardControl) {
            // 键盘控制
            if (this.moveLeft) {
                this.x -= this.keyboardSpeed;
            }
            if (this.moveRight) {
                this.x += this.keyboardSpeed;
            }
            if (this.moveUp) {
                this.y -= this.keyboardSpeed;
            }
            if (this.moveDown) {
                this.y += this.keyboardSpeed;
            }
        } else if (this.touchX !== null) {
            // 触摸控制
            const targetX = this.touchX - this.width / 2;
            this.x = Utils.lerp(this.x, targetX, 0.2);
        }
        
        // 限制飞机在画布范围内
        this.x = Utils.clamp(this.x, 0, canvasWidth - this.width);
        this.y = Utils.clamp(this.y, 0, canvasHeight - this.height);
    }

    /**
     * 绘制玩家
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    draw(ctx) {
        // 无敌状态闪烁效果
        if (this.invincible && Math.floor(Date.now() / 100) % 2 === 0) {
            this.alpha = 0.5;
        } else {
            this.alpha = 1;
        }
        
        super.draw(ctx);
        
        // 绘制护盾
        if (this.shield) {
            ctx.save();
            ctx.beginPath();
            ctx.arc(this.x + this.width / 2, this.y + this.height / 2, 
                    this.width / 2 + 5, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.restore();
        }
    }
} 