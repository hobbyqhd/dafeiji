/**
 * 道具类
 */
class PowerUp extends Sprite {
    /**
     * 构造函数
     * @param {Number} x - x坐标
     * @param {Number} y - y坐标
     * @param {String} type - 道具类型 ('power', 'shield', 'life', 'bomb')
     */
    constructor(x, y, type) {
        super(x, y, 20, 20);
        this.type = type;
        this.speedY = 2;
        this.rotationSpeed = 0.02;
        this.createPowerUpImage();
    }

    /**
     * 创建道具图像
     */
    createPowerUpImage() {
        let powerUpImage;
        
        switch (this.type) {
            case 'power':
                // 火力增强道具
                powerUpImage = Utils.createPixelImage(20, 20, (ctx) => {
                    // 背景
                    ctx.fillStyle = '#f39c12';
                    ctx.fillRect(0, 0, 20, 20);
                    
                    // 边框
                    ctx.strokeStyle = '#e67e22';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(1, 1, 18, 18);
                    
                    // 闪电符号
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.moveTo(10, 3);
                    ctx.lineTo(5, 10);
                    ctx.lineTo(10, 10);
                    ctx.lineTo(8, 17);
                    ctx.lineTo(15, 8);
                    ctx.lineTo(10, 8);
                    ctx.lineTo(12, 3);
                    ctx.closePath();
                    ctx.fill();
                });
                break;
                
            case 'shield':
                // 护盾道具
                powerUpImage = Utils.createPixelImage(20, 20, (ctx) => {
                    // 背景
                    ctx.fillStyle = '#3498db';
                    ctx.fillRect(0, 0, 20, 20);
                    
                    // 边框
                    ctx.strokeStyle = '#2980b9';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(1, 1, 18, 18);
                    
                    // 盾牌符号
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.moveTo(10, 3);
                    ctx.lineTo(4, 6);
                    ctx.lineTo(4, 12);
                    ctx.lineTo(10, 17);
                    ctx.lineTo(16, 12);
                    ctx.lineTo(16, 6);
                    ctx.closePath();
                    ctx.fill();
                    
                    ctx.fillStyle = '#3498db';
                    ctx.beginPath();
                    ctx.moveTo(10, 6);
                    ctx.lineTo(7, 8);
                    ctx.lineTo(7, 11);
                    ctx.lineTo(10, 14);
                    ctx.lineTo(13, 11);
                    ctx.lineTo(13, 8);
                    ctx.closePath();
                    ctx.fill();
                });
                break;
                
            case 'life':
                // 生命道具
                powerUpImage = Utils.createPixelImage(20, 20, (ctx) => {
                    // 背景
                    ctx.fillStyle = '#2ecc71';
                    ctx.fillRect(0, 0, 20, 20);
                    
                    // 边框
                    ctx.strokeStyle = '#27ae60';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(1, 1, 18, 18);
                    
                    // 心形符号
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.moveTo(10, 16);
                    ctx.lineTo(5, 11);
                    ctx.quadraticCurveTo(3, 9, 3, 7);
                    ctx.quadraticCurveTo(3, 4, 6, 4);
                    ctx.quadraticCurveTo(8, 4, 10, 7);
                    ctx.quadraticCurveTo(12, 4, 14, 4);
                    ctx.quadraticCurveTo(17, 4, 17, 7);
                    ctx.quadraticCurveTo(17, 9, 15, 11);
                    ctx.closePath();
                    ctx.fill();
                });
                break;
                
            case 'bomb':
                // 炸弹道具
                powerUpImage = Utils.createPixelImage(20, 20, (ctx) => {
                    // 背景
                    ctx.fillStyle = '#9b59b6';
                    ctx.fillRect(0, 0, 20, 20);
                    
                    // 边框
                    ctx.strokeStyle = '#8e44ad';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(1, 1, 18, 18);
                    
                    // 炸弹符号
                    ctx.fillStyle = '#fff';
                    ctx.beginPath();
                    ctx.arc(10, 12, 6, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // 炸弹引线
                    ctx.strokeStyle = '#fff';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(10, 6);
                    ctx.lineTo(10, 3);
                    ctx.stroke();
                    
                    // 炸弹细节
                    ctx.fillStyle = '#9b59b6';
                    ctx.beginPath();
                    ctx.arc(8, 10, 1, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(12, 10, 1, 0, Math.PI * 2);
                    ctx.fill();
                });
                break;
                
            default:
                // 默认道具
                powerUpImage = Utils.createPixelImage(20, 20, (ctx) => {
                    ctx.fillStyle = '#95a5a6';
                    ctx.fillRect(0, 0, 20, 20);
                    
                    ctx.strokeStyle = '#7f8c8d';
                    ctx.lineWidth = 2;
                    ctx.strokeRect(1, 1, 18, 18);
                    
                    ctx.fillStyle = '#fff';
                    ctx.fillRect(5, 5, 10, 10);
                });
                break;
        }
        
        this.setImage(powerUpImage);
    }

    /**
     * 应用道具效果
     * @param {Player} player - 玩家对象
     * @returns {Object} 效果信息
     */
    applyEffect(player) {
        let effectInfo = {
            message: '',
            duration: 2000
        };
        
        switch (this.type) {
            case 'power':
                player.increasePower(1);
                effectInfo.message = '火力增强！';
                break;
                
            case 'shield':
                player.addShield(3);
                effectInfo.message = '护盾激活！';
                break;
                
            case 'life':
                player.addLife(1);
                effectInfo.message = '生命 +1';
                break;
                
            case 'bomb':
                // 炸弹效果在游戏主逻辑中处理
                effectInfo.message = '炸弹！清除所有敌人';
                break;
        }
        
        return effectInfo;
    }

    /**
     * 更新道具
     * @param {Number} dt - 时间增量
     */
    update(dt) {
        super.update(dt);
        
        // 旋转道具
        this.rotation += this.rotationSpeed;
    }

    /**
     * 检查道具是否超出屏幕
     * @param {Number} canvasHeight - 画布高度
     * @returns {Boolean} 是否超出屏幕
     */
    isOutOfBounds(canvasHeight) {
        return this.y > canvasHeight;
    }
}

/**
 * 创建随机道具
 * @param {Number} x - x坐标
 * @param {Number} y - y坐标
 * @returns {PowerUp} 道具对象
 */
function createRandomPowerUp(x, y) {
    const types = ['power', 'shield', 'life', 'bomb'];
    const weights = [40, 30, 10, 20]; // 权重，决定各类道具出现概率
    
    // 根据权重随机选择类型
    let totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;
    let cumulativeWeight = 0;
    let selectedType = types[0];
    
    for (let i = 0; i < types.length; i++) {
        cumulativeWeight += weights[i];
        if (random < cumulativeWeight) {
            selectedType = types[i];
            break;
        }
    }
    
    return new PowerUp(x, y, selectedType);
} 