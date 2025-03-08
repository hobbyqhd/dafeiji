/**
 * 游戏精灵基类
 */
class Sprite {
    /**
     * 构造函数
     * @param {Number} x - x坐标
     * @param {Number} y - y坐标
     * @param {Number} width - 宽度
     * @param {Number} height - 高度
     */
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speedX = 0;
        this.speedY = 0;
        this.active = true;
        this.image = null;
        this.color = '#fff';
        this.alpha = 1;
        this.rotation = 0;
        this.scale = 1;
        this.frameIndex = 0;
        this.frameCount = 1;
        this.frameDelay = 5;
        this.frameTimer = 0;
        this.animations = {};
        this.currentAnimation = null;
    }

    /**
     * 获取碰撞盒
     * @returns {Object} 碰撞盒 {x, y, width, height}
     */
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }

    /**
     * 检测与另一个精灵的碰撞
     * @param {Sprite} sprite - 另一个精灵
     * @returns {Boolean} 是否碰撞
     */
    collidesWith(sprite) {
        return Utils.checkCollision(this.getBounds(), sprite.getBounds());
    }

    /**
     * 设置位置
     * @param {Number} x - x坐标
     * @param {Number} y - y坐标
     */
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * 设置速度
     * @param {Number} x - x方向速度
     * @param {Number} y - y方向速度
     */
    setSpeed(x, y) {
        this.speedX = x;
        this.speedY = y;
    }

    /**
     * 设置图像
     * @param {HTMLImageElement|HTMLCanvasElement} image - 图像
     */
    setImage(image) {
        this.image = image;
    }

    /**
     * 添加动画
     * @param {String} name - 动画名称
     * @param {Array} frames - 帧索引数组
     * @param {Number} frameDelay - 帧延迟
     */
    addAnimation(name, frames, frameDelay) {
        this.animations[name] = {
            frames: frames,
            frameDelay: frameDelay || this.frameDelay
        };
    }

    /**
     * 播放动画
     * @param {String} name - 动画名称
     */
    playAnimation(name) {
        if (this.currentAnimation !== name && this.animations[name]) {
            this.currentAnimation = name;
            this.frameIndex = 0;
            this.frameTimer = 0;
            this.frameDelay = this.animations[name].frameDelay;
        }
    }

    /**
     * 更新动画
     */
    updateAnimation() {
        if (this.currentAnimation) {
            const animation = this.animations[this.currentAnimation];
            if (animation) {
                this.frameTimer++;
                if (this.frameTimer >= this.frameDelay) {
                    this.frameTimer = 0;
                    this.frameIndex = (this.frameIndex + 1) % animation.frames.length;
                    this.frameCount = animation.frames[this.frameIndex];
                }
            }
        }
    }

    /**
     * 更新精灵
     * @param {Number} dt - 时间增量
     */
    update(dt) {
        this.x += this.speedX * dt;
        this.y += this.speedY * dt;
        this.updateAnimation();
    }

    /**
     * 绘制精灵
     * @param {CanvasRenderingContext2D} ctx - 画布上下文
     */
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        
        // 应用变换
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.rotation);
        ctx.scale(this.scale, this.scale);
        
        if (this.image) {
            // 绘制图像
            const frameWidth = this.image.width / this.frameCount;
            const frameX = frameWidth * this.frameIndex;
            
            ctx.drawImage(
                this.image,
                frameX, 0, frameWidth, this.image.height,
                -this.width / 2, -this.height / 2, this.width, this.height
            );
        } else {
            // 绘制矩形
            ctx.fillStyle = this.color;
            ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        }
        
        ctx.restore();
    }
} 