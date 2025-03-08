/**
 * 游戏主入口
 */
(function() {
    // 游戏实例
    let game = null;
    
    // 游戏画布
    let canvas = null;
    
    // 触摸状态
    let touchX = null;
    let touchY = null;
    
    // 游戏循环
    let lastTime = 0;
    let animationFrameId = null;
    
    /**
     * 初始化游戏
     */
    function init() {
        // 获取游戏画布
        canvas = document.getElementById('game-canvas');
        
        // 创建游戏实例
        game = new Game(canvas);
        
        // 绑定事件
        bindEvents();
        
        // 显示开始屏幕
        document.getElementById('start-screen').classList.remove('hidden');
        document.getElementById('game-screen').classList.add('hidden');
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
    }
    
    /**
     * 绑定事件
     */
    function bindEvents() {
        // 窗口大小改变事件
        window.addEventListener('resize', handleResize);
        
        // 触摸事件
        canvas.addEventListener('touchstart', handleTouchStart);
        canvas.addEventListener('touchmove', handleTouchMove);
        canvas.addEventListener('touchend', handleTouchEnd);
        
        // 鼠标事件（用于桌面端测试）
        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('mousemove', handleMouseMove);
        canvas.addEventListener('mouseup', handleMouseUp);
        
        // 键盘事件
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        
        // 按钮事件
        document.getElementById('start-button').addEventListener('click', startGame);
        document.getElementById('pause-btn').addEventListener('click', pauseGame);
        document.getElementById('resume-button').addEventListener('click', resumeGame);
        document.getElementById('restart-button').addEventListener('click', restartGame);
        document.getElementById('restart-game-button').addEventListener('click', restartGame);
    }
    
    /**
     * 处理窗口大小改变
     */
    function handleResize() {
        if (game) {
            game.resizeCanvas();
        }
    }
    
    /**
     * 处理触摸开始
     * @param {TouchEvent} e - 触摸事件
     */
    function handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        touchX = touch.clientX;
        touchY = touch.clientY;
        
        if (game) {
            // 传递false作为isShooting参数，但Player类会忽略它
            game.handleInput(touchX, touchY, false);
        }
    }
    
    /**
     * 处理触摸移动
     * @param {TouchEvent} e - 触摸事件
     */
    function handleTouchMove(e) {
        e.preventDefault();
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            touchX = touch.clientX;
            touchY = touch.clientY;
            
            if (game) {
                // 传递false作为isShooting参数，但Player类会忽略它
                game.handleInput(touchX, touchY, false);
            }
        }
    }
    
    /**
     * 处理触摸结束
     * @param {TouchEvent} e - 触摸事件
     */
    function handleTouchEnd(e) {
        e.preventDefault();
        
        if (game) {
            // 传递false作为isShooting参数，但Player类会忽略它
            game.handleInput(touchX, touchY, false);
        }
    }
    
    /**
     * 处理鼠标按下
     * @param {MouseEvent} e - 鼠标事件
     */
    function handleMouseDown(e) {
        e.preventDefault();
        touchX = e.clientX;
        touchY = e.clientY;
        
        if (game) {
            // 传递false作为isShooting参数，但Player类会忽略它
            game.handleInput(touchX, touchY, false);
        }
    }
    
    /**
     * 处理鼠标移动
     * @param {MouseEvent} e - 鼠标事件
     */
    function handleMouseMove(e) {
        e.preventDefault();
        touchX = e.clientX;
        touchY = e.clientY;
        
        if (game) {
            // 传递false作为isShooting参数，但Player类会忽略它
            game.handleInput(touchX, touchY, false);
        }
    }
    
    /**
     * 处理鼠标松开
     * @param {MouseEvent} e - 鼠标事件
     */
    function handleMouseUp(e) {
        e.preventDefault();
        
        if (game) {
            // 传递false作为isShooting参数，但Player类会忽略它
            game.handleInput(touchX, touchY, false);
        }
    }
    
    /**
     * 处理键盘按下
     * @param {KeyboardEvent} e - 键盘事件
     */
    function handleKeyDown(e) {
        // 防止方向键滚动页面
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
        
        if (game && game.player) {
            game.player.handleKeyInput(e.key, true);
        }
    }
    
    /**
     * 处理键盘松开
     * @param {KeyboardEvent} e - 键盘事件
     */
    function handleKeyUp(e) {
        if (game && game.player) {
            game.player.handleKeyInput(e.key, false);
        }
    }
    
    /**
     * 开始游戏
     */
    function startGame() {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        
        if (game) {
            game.start();
            startGameLoop();
        }
    }
    
    /**
     * 暂停游戏
     */
    function pauseGame() {
        if (game) {
            game.pause();
            
            if (game.isPaused) {
                document.getElementById('pause-screen').classList.remove('hidden');
            } else {
                document.getElementById('pause-screen').classList.add('hidden');
            }
        }
    }
    
    /**
     * 恢复游戏
     */
    function resumeGame() {
        if (game) {
            game.pause();
            document.getElementById('pause-screen').classList.add('hidden');
        }
    }
    
    /**
     * 重新开始游戏
     */
    function restartGame() {
        document.getElementById('start-screen').classList.add('hidden');
        document.getElementById('game-screen').classList.remove('hidden');
        document.getElementById('pause-screen').classList.add('hidden');
        document.getElementById('game-over-screen').classList.add('hidden');
        
        if (game) {
            game.start();
            startGameLoop();
        }
    }
    
    /**
     * 开始游戏循环
     */
    function startGameLoop() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        
        lastTime = performance.now();
        gameLoop();
    }
    
    /**
     * 游戏循环
     */
    function gameLoop() {
        const currentTime = performance.now();
        const deltaTime = (currentTime - lastTime) / 16.67; // 转换为帧数（60fps）
        lastTime = currentTime;
        
        if (game) {
            game.update(deltaTime);
            game.draw();
        }
        
        animationFrameId = requestAnimationFrame(gameLoop);
    }
    
    // 当文档加载完成后初始化游戏
    document.addEventListener('DOMContentLoaded', init);
})(); 