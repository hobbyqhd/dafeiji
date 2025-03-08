/**
 * 子弹类
 */
class Bullet extends Sprite {
    /**
     * 构造函数
     * @param {Number} x - x坐标
     * @param {Number} y - y坐标
     * @param {Number} width - 宽度
     * @param {Number} height - 高度
     * @param {Number} speedX - x方向速度
     * @param {Number} speedY - y方向速度
     * @param {String} owner - 子弹所有者 ('player' 或 'enemy')
     * @param {Boolean} isPowered - 是否为强化子弹
     * @param {Boolean} isHoming - 是否为追踪子弹
     */
    constructor(x, y, width, height, speedX, speedY, owner, isPowered = false, isHoming = false) {
        super(x, y, width, height);
        this.speedX = speedX;
        this.speedY = speedY;
        this.owner = owner;
        this.damage = isPowered ? 2 : 1;
        this.isPowered = isPowered;
        this.isHoming = isHoming;
        this.homingStrength = 0.2;
        this.createBulletImage();
    }

    /**
     * 创建子弹图像
     */
    createBulletImage() {
        let bulletImage;
        
        if (this.owner === 'player') {
            if (this.isPowered) {
                // 玩家强化子弹
                bulletImage = Utils.createPixelImage(this.width, this.height, (ctx) => {
                    ctx.fillStyle = '#3498db';
                    ctx.fillRect(0, 0, this.width, this.height);
                    
                    // 发光效果
                    ctx.fillStyle = '#2980b9';
                    ctx.fillRect(1, 1, this.width - 2, this.height - 2);
                    
                    ctx.fillStyle = '#ecf0f1';
                    ctx.fillRect(this.width / 2 - 1, 0, 2, this.height);
                });
            } else {
                // 玩家普通子弹
                bulletImage = Utils.createPixelImage(this.width, this.height, (ctx) => {
                    ctx.fillStyle = '#3498db';
                    ctx.fillRect(0, 0, this.width, this.height);
                    
                    ctx.fillStyle = '#ecf0f1';
                    ctx.fillRect(this.width / 2 - 1, 0, 2, this.height / 2);
                });
            }
        } else {
            if (this.isHoming) {
                // 敌人追踪子弹
                bulletImage = Utils.createPixelImage(this.width, this.height, (ctx) => {
                    ctx.fillStyle = '#e74c3c';
                    ctx.beginPath();
                    ctx.moveTo(this.width / 2, 0);
                    ctx.lineTo(this.width, this.height);
                    ctx.lineTo(0, this.height);
                    ctx.closePath();
                    ctx.fill();
                    
                    // 尾部火焰
                    ctx.fillStyle = '#f39c12';
                    ctx.fillRect(this.width / 2 - 1, this.height - 3, 2, 3);
                });
            } else if (this.isPowered) {
                // 敌人强化子弹（激光）
                bulletImage = Utils.createPixelImage(this.width, this.height, (ctx) => {
                    // 激光主体
                    ctx.fillStyle = '#e74c3c';
                    ctx.fillRect(0, 0, this.width, this.height);
                    
                    // 激光核心
                    ctx.fillStyle = '#f1c40f';
                    ctx.fillRect(this.width / 2 - 1, 0, 2, this.height);
                });
            } else {
                // 敌人普通子弹
                bulletImage = Utils.createPixelImage(this.width, this.height, (ctx) => {
                    ctx.fillStyle = '#e74c3c';
                    ctx.fillRect(0, 0, this.width, this.height);
                });
            }
        }
        
        this.setImage(bulletImage);
    }

    /**
     * 更新子弹
     * @param {Number} dt - 时间增量
     * @param {Player} player - 玩家对象，用于追踪子弹
     */
    update(dt, player = null) {
        // 如果是追踪子弹且有玩家目标
        if (this.isHoming && player && player.active) {
            // 计算到玩家的方向
            const dx = player.x + player.width / 2 - (this.x + this.width / 2);
            const dy = player.y + player.height / 2 - (this.y + this.height / 2);
            const angle = Math.atan2(dy, dx);
            
            // 调整速度向玩家方向
            this.speedX += Math.cos(angle) * this.homingStrength;
            this.speedY += Math.sin(angle) * this.homingStrength;
            
            // 限制最大速度
            const speed = Math.sqrt(this.speedX * this.speedX + this.speedY * this.speedY);
            if (speed > 6) {
                this.speedX = (this.speedX / speed) * 6;
                this.speedY = (this.speedY / speed) * 6;
            }
            
            // 更新旋转角度
            this.rotation = Math.atan2(this.speedY, this.speedX);
        }
        
        super.update(dt);
    }

    /**
     * 检查子弹是否超出屏幕
     * @param {Number} canvasWidth - 画布宽度
     * @param {Number} canvasHeight - 画布高度
     * @returns {Boolean} 是否超出屏幕
     */
    isOutOfBounds(canvasWidth, canvasHeight) {
        return this.x < -this.width || 
               this.x > canvasWidth || 
               this.y < -this.height || 
               this.y > canvasHeight;
    }
} 