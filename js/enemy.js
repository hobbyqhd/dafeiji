/**
 * 敌机类
 */
class Enemy extends Sprite {
    /**
     * 构造函数
     * @param {Number} x - x坐标
     * @param {Number} y - y坐标
     * @param {Number} width - 宽度
     * @param {Number} height - 高度
     * @param {String} type - 敌机类型 ('basic', 'advanced', 'elite')
     */
    constructor(x, y, width, height, type = 'basic') {
        super(x, y, width, height);
        this.type = type;
        this.health = this.getInitialHealth();
        this.score = this.getScore();
        this.shootRate = this.getShootRate();
        this.shootTimer = Utils.randomInt(0, this.shootRate);
        this.movementPattern = this.getMovementPattern();
        this.movementTimer = 0;
        this.createEnemyImage();
    }

    /**
     * 获取初始生命值
     * @returns {Number} 初始生命值
     */
    getInitialHealth() {
        switch (this.type) {
            case 'basic': return 1;
            case 'advanced': return 3;
            case 'elite': return 10;
            default: return 1;
        }
    }

    /**
     * 获取分数
     * @returns {Number} 分数
     */
    getScore() {
        switch (this.type) {
            case 'basic': return 100;
            case 'advanced': return 300;
            case 'elite': return 1000;
            default: return 100;
        }
    }

    /**
     * 获取射击频率
     * @returns {Number} 射击频率（帧数）
     */
    getShootRate() {
        switch (this.type) {
            case 'basic': return 120;
            case 'advanced': return 90;
            case 'elite': return 60;
            default: return 120;
        }
    }

    /**
     * 获取移动模式
     * @returns {String} 移动模式
     */
    getMovementPattern() {
        switch (this.type) {
            case 'basic': return 'straight';
            case 'advanced': return Utils.randomChoice(['zigzag', 'sine']);
            case 'elite': return Utils.randomChoice(['zigzag', 'sine', 'circle']);
            default: return 'straight';
        }
    }

    /**
     * 创建敌机图像
     */
    createEnemyImage() {
        let enemyImage;
        
        switch (this.type) {
            case 'basic':
                // 基础敌机 - 简单的三角形
                enemyImage = Utils.createPixelImage(30, 30, (ctx) => {
                    ctx.fillStyle = '#e74c3c';
                    ctx.beginPath();
                    ctx.moveTo(15, 0);
                    ctx.lineTo(0, 30);
                    ctx.lineTo(30, 30);
                    ctx.closePath();
                    ctx.fill();
                    
                    // 细节
                    ctx.fillStyle = '#c0392b';
                    ctx.fillRect(10, 15, 10, 10);
                });
                break;
                
            case 'advanced':
                // 高级敌机 - 更复杂的形状
                enemyImage = Utils.createPixelImage(40, 40, (ctx) => {
                    // 主体
                    ctx.fillStyle = '#9b59b6';
                    ctx.fillRect(10, 0, 20, 35);
                    
                    // 机翼
                    ctx.fillStyle = '#8e44ad';
                    ctx.fillRect(0, 10, 40, 10);
                    
                    // 引擎
                    ctx.fillStyle = '#e67e22';
                    ctx.fillRect(15, 35, 10, 5);
                    
                    // 细节
                    ctx.fillStyle = '#ecf0f1';
                    ctx.fillRect(15, 5, 10, 5);
                });
                break;
                
            case 'elite':
                // 精英敌机 - 复杂的形状和细节
                enemyImage = Utils.createPixelImage(50, 50, (ctx) => {
                    // 主体
                    ctx.fillStyle = '#2c3e50';
                    ctx.fillRect(15, 0, 20, 45);
                    
                    // 机翼
                    ctx.fillStyle = '#34495e';
                    ctx.beginPath();
                    ctx.moveTo(0, 15);
                    ctx.lineTo(15, 25);
                    ctx.lineTo(15, 35);
                    ctx.lineTo(0, 45);
                    ctx.closePath();
                    ctx.fill();
                    
                    ctx.beginPath();
                    ctx.moveTo(50, 15);
                    ctx.lineTo(35, 25);
                    ctx.lineTo(35, 35);
                    ctx.lineTo(50, 45);
                    ctx.closePath();
                    ctx.fill();
                    
                    // 引擎
                    ctx.fillStyle = '#e74c3c';
                    ctx.fillRect(20, 45, 10, 5);
                    
                    // 武器
                    ctx.fillStyle = '#7f8c8d';
                    ctx.fillRect(10, 30, 5, 10);
                    ctx.fillRect(35, 30, 5, 10);
                    
                    // 细节
                    ctx.fillStyle = '#f1c40f';
                    ctx.fillRect(20, 10, 10, 5);
                });
                break;
                
            default:
                // 默认敌机
                enemyImage = Utils.createPixelImage(30, 30, (ctx) => {
                    ctx.fillStyle = '#95a5a6';
                    ctx.fillRect(5, 5, 20, 20);
                });
                break;
        }
        
        this.setImage(enemyImage);
    }

    /**
     * 受到伤害
     * @param {Number} damage - 伤害值
     * @returns {Boolean} 是否死亡
     */
    takeDamage(damage) {
        this.health -= damage;
        return this.health <= 0;
    }

    /**
     * 射击
     * @returns {Array} 子弹数组
     */
    shoot() {
        if (this.shootTimer <= 0) {
            this.shootTimer = this.shootRate;
            
            const bullets = [];
            
            switch (this.type) {
                case 'basic':
                    // 基础敌机发射单发子弹
                    bullets.push(new Bullet(
                        this.x + this.width / 2 - 2,
                        this.y + this.height,
                        4, 10,
                        0, 5,
                        'enemy'
                    ));
                    break;
                    
                case 'advanced':
                    // 高级敌机发射散射子弹
                    for (let i = -1; i <= 1; i++) {
                        bullets.push(new Bullet(
                            this.x + this.width / 2 - 2,
                            this.y + this.height,
                            4, 10,
                            i * 2, 5,
                            'enemy'
                        ));
                    }
                    break;
                    
                case 'elite':
                    // 精英敌机发射多种子弹
                    const bulletType = Utils.randomInt(0, 2);
                    
                    if (bulletType === 0) {
                        // 散射子弹
                        for (let i = -2; i <= 2; i++) {
                            bullets.push(new Bullet(
                                this.x + this.width / 2 - 2,
                                this.y + this.height,
                                4, 10,
                                i * 2, 5,
                                'enemy'
                            ));
                        }
                    } else if (bulletType === 1) {
                        // 激光
                        bullets.push(new Bullet(
                            this.x + this.width / 2 - 4,
                            this.y + this.height,
                            8, 20,
                            0, 8,
                            'enemy',
                            true
                        ));
                    } else {
                        // 追踪导弹
                        bullets.push(new Bullet(
                            this.x + this.width / 2 - 3,
                            this.y + this.height,
                            6, 12,
                            0, 3,
                            'enemy',
                            false,
                            true
                        ));
                    }
                    break;
            }
            
            return bullets;
        }
        
        return [];
    }

    /**
     * 更新敌机
     * @param {Number} dt - 时间增量
     * @param {Number} canvasWidth - 画布宽度
     * @param {Player} player - 玩家对象，用于追踪导弹
     */
    update(dt, canvasWidth, player = null) {
        super.update(dt);
        
        // 更新射击计时器
        if (this.shootTimer > 0) {
            this.shootTimer--;
        }
        
        // 更新移动计时器
        this.movementTimer += dt;
        
        // 根据移动模式更新位置
        switch (this.movementPattern) {
            case 'straight':
                // 直线移动，不需要额外处理
                break;
                
            case 'zigzag':
                // 之字形移动
                this.speedX = Math.sin(this.movementTimer * 0.05) * 2;
                break;
                
            case 'sine':
                // 正弦波移动
                this.speedX = Math.sin(this.movementTimer * 0.1) * 3;
                break;
                
            case 'circle':
                // 圆形移动
                const radius = 50;
                const centerX = this.x;
                const speed = 0.02;
                
                this.speedX = Math.cos(this.movementTimer * speed) * radius - 
                              Math.cos((this.movementTimer - dt) * speed) * radius;
                break;
        }
        
        // 限制敌机在画布范围内
        if (this.x < 0) {
            this.x = 0;
            this.speedX = Math.abs(this.speedX);
        } else if (this.x > canvasWidth - this.width) {
            this.x = canvasWidth - this.width;
            this.speedX = -Math.abs(this.speedX);
        }
    }

    /**
     * 绘制敌机
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    draw(ctx) {
        super.draw(ctx);
        
        // 绘制生命条（仅高级和精英敌机）
        if (this.type !== 'basic' && this.health > 1) {
            const healthPercent = this.health / this.getInitialHealth();
            const barWidth = this.width;
            const barHeight = 3;
            
            ctx.save();
            
            // 背景
            ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
            ctx.fillRect(this.x, this.y - barHeight - 2, barWidth, barHeight);
            
            // 血量
            ctx.fillStyle = 'rgba(0, 255, 0, 0.7)';
            ctx.fillRect(this.x, this.y - barHeight - 2, barWidth * healthPercent, barHeight);
            
            ctx.restore();
        }
    }
}

/**
 * 创建随机敌机
 * @param {Number} canvasWidth - 画布宽度
 * @param {Number} difficulty - 难度系数 (0-1)
 * @returns {Enemy} 敌机对象
 */
function createRandomEnemy(canvasWidth, difficulty) {
    // 根据难度决定敌机类型
    let type;
    const rand = Math.random();
    
    if (rand < 0.1 * difficulty) {
        type = 'elite';
    } else if (rand < 0.3 * difficulty) {
        type = 'advanced';
    } else {
        type = 'basic';
    }
    
    // 根据类型设置尺寸
    let width, height;
    switch (type) {
        case 'basic':
            width = 30;
            height = 30;
            break;
        case 'advanced':
            width = 40;
            height = 40;
            break;
        case 'elite':
            width = 50;
            height = 50;
            break;
        default:
            width = 30;
            height = 30;
    }
    
    // 随机位置
    const x = Utils.randomInt(0, canvasWidth - width);
    const y = -height;
    
    // 创建敌机
    const enemy = new Enemy(x, y, width, height, type);
    
    // 设置速度
    const baseSpeed = 1 + difficulty;
    enemy.speedY = baseSpeed * (type === 'basic' ? 1.5 : (type === 'advanced' ? 1 : 0.7));
    
    return enemy;
} 