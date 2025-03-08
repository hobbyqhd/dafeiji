/**
 * 游戏工具函数
 */

const Utils = {
    /**
     * 检测两个矩形是否碰撞
     * @param {Object} rect1 - 第一个矩形 {x, y, width, height}
     * @param {Object} rect2 - 第二个矩形 {x, y, width, height}
     * @returns {Boolean} 是否碰撞
     */
    checkCollision: function(rect1, rect2) {
        return rect1.x < rect2.x + rect2.width &&
               rect1.x + rect1.width > rect2.x &&
               rect1.y < rect2.y + rect2.height &&
               rect1.y + rect1.height > rect2.y;
    },
    
    /**
     * 生成指定范围内的随机整数
     * @param {Number} min - 最小值
     * @param {Number} max - 最大值
     * @returns {Number} 随机整数
     */
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * 生成指定范围内的随机浮点数
     * @param {Number} min - 最小值
     * @param {Number} max - 最大值
     * @returns {Number} 随机浮点数
     */
    randomFloat: function(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    /**
     * 从数组中随机选择一个元素
     * @param {Array} array - 数组
     * @returns {*} 随机元素
     */
    randomChoice: function(array) {
        return array[Math.floor(Math.random() * array.length)];
    },
    
    /**
     * 计算两点之间的距离
     * @param {Number} x1 - 第一个点的x坐标
     * @param {Number} y1 - 第一个点的y坐标
     * @param {Number} x2 - 第二个点的x坐标
     * @param {Number} y2 - 第二个点的y坐标
     * @returns {Number} 距离
     */
    distance: function(x1, y1, x2, y2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },
    
    /**
     * 计算两点之间的角度
     * @param {Number} x1 - 第一个点的x坐标
     * @param {Number} y1 - 第一个点的y坐标
     * @param {Number} x2 - 第二个点的x坐标
     * @param {Number} y2 - 第二个点的y坐标
     * @returns {Number} 角度（弧度）
     */
    angle: function(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },
    
    /**
     * 将角度转换为方向向量
     * @param {Number} angle - 角度（弧度）
     * @returns {Object} 方向向量 {x, y}
     */
    angleToVector: function(angle) {
        return {
            x: Math.cos(angle),
            y: Math.sin(angle)
        };
    },
    
    /**
     * 限制值在指定范围内
     * @param {Number} value - 值
     * @param {Number} min - 最小值
     * @param {Number} max - 最大值
     * @returns {Number} 限制后的值
     */
    clamp: function(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },
    
    /**
     * 线性插值
     * @param {Number} a - 起始值
     * @param {Number} b - 结束值
     * @param {Number} t - 插值因子 (0-1)
     * @returns {Number} 插值结果
     */
    lerp: function(a, b, t) {
        return a + (b - a) * t;
    },
    
    /**
     * 创建像素风格的图像
     * @param {Number} width - 宽度
     * @param {Number} height - 高度
     * @param {Function} drawFunction - 绘制函数，接收context参数
     * @returns {HTMLCanvasElement} 画布元素
     */
    createPixelImage: function(width, height, drawFunction) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingEnabled = false;
        
        // 清除画布
        ctx.clearRect(0, 0, width, height);
        
        // 执行绘制函数
        drawFunction(ctx);
        
        return canvas;
    }
}; 