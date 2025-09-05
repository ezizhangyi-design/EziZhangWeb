// 统一的天气客户端系统
// 所有页面使用相同的天气客户端实现，确保一致性
// 完全被动模式：只在天气系统主动更新时才响应

class WeatherClient {
    constructor(pageName = 'Unknown') {
        this.pageName = pageName;
        this.weatherTransitionStarted = false;
        this.defaultColor = '#0080FF'; // 默认亮蓝色背景
        this.isInitialized = false;
        
        console.log(`🌤️ ${this.pageName}页面天气客户端初始化...`);
        this.init();
    }
    
    init() {
        // 立即设置初始背景（静默模式，不触发任何变化）
        this.setInitialBackground();
        
        // 监听全局天气变化事件（只在天气系统主动更新时触发）
        window.addEventListener('globalWeatherChange', (event) => {
            console.log(`🌤️ ${this.pageName}页面接收到天气系统主动更新:`, event.detail.baseColor);
            this.handleWeatherChange(event.detail);
        });
        
        // 监听localStorage变化（只在其他页面更新天气时触发）
        window.addEventListener('storage', (event) => {
            if (event.key === 'globalWeatherData') {
                try {
                    const weatherData = JSON.parse(event.newValue);
                    if (weatherData && weatherData.baseColor) {
                        console.log(`🌤️ ${this.pageName}页面接收到其他页面的天气更新:`, weatherData.baseColor);
                        this.handleWeatherChange(weatherData);
                    }
                } catch (error) {
                    console.error('❌ 解析天气数据失败:', error);
                }
            }
        });
        
        this.isInitialized = true;
    }
    
    handleWeatherChange(weatherData) {
        if (this.weatherTransitionStarted) {
            console.log(`⏳ ${this.pageName}页面天气渐变已开始，跳过重复请求`);
            return;
        }
        
        console.log(`🌤️ ${this.pageName}页面接收到天气变化:`, weatherData.baseColor);
        
        if (weatherData.baseColor) {
            this.startBackgroundTransition(weatherData.baseColor);
        }
    }
    
    setInitialBackground() {
        console.log(`🎨 ${this.pageName}页面设置初始背景（过渡模式）...`);
        
        const storedWeather = localStorage.getItem('globalWeatherData');
        if (storedWeather) {
            try {
                const weatherData = JSON.parse(storedWeather);
                if (weatherData && weatherData.baseColor) {
                    console.log(`🌤️ ${this.pageName}页面从亮蓝色过渡到天气背景:`, weatherData.baseColor);
                    // 从亮蓝色过渡到天气背景色
                    this.startBackgroundTransition(weatherData.baseColor);
                } else {
                    this.applyDefaultBackground();
                }
            } catch (error) {
                console.error('❌ 解析天气数据失败:', error);
                this.applyDefaultBackground();
            }
        } else {
            console.log(`🌤️ ${this.pageName}页面没有天气数据，使用默认背景`);
            this.applyDefaultBackground();
        }
    }
    
    applyDefaultBackground() {
        console.log(`🎨 ${this.pageName}页面应用默认背景:`, this.defaultColor);
        document.body.style.setProperty('background-color', this.defaultColor, 'important');
        document.documentElement.style.setProperty('background-color', this.defaultColor, 'important');
    }
    
    startBackgroundTransition(targetColor) {
        if (this.weatherTransitionStarted) return;
        
        this.weatherTransitionStarted = true;
        console.log(`🎬 开始${this.pageName}页面背景渐变:`, targetColor);
        
        // 使用统一的背景渐变动画
        this.animateBackgroundTransition(this.defaultColor, targetColor, 2000);
    }
    
    animateBackgroundTransition(fromColor, toColor, duration) {
        console.log(`🎬 开始${this.pageName}页面JavaScript背景渐变动画:`, { fromColor, toColor, duration });
        
        const startTime = Date.now();
        const fromRGB = this.hexToRgb(fromColor);
        const toRGB = this.hexToRgb(toColor);
        
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // 使用缓动函数
            const easeProgress = progress < 0.5 ? 
                2 * progress * progress : 
                1 - Math.pow(-2 * progress + 2, 2) / 2;
            
            const currentRGB = {
                r: Math.round(fromRGB.r + (toRGB.r - fromRGB.r) * easeProgress),
                g: Math.round(fromRGB.g + (toRGB.g - fromRGB.g) * easeProgress),
                b: Math.round(fromRGB.b + (toRGB.b - fromRGB.b) * easeProgress)
            };
            
            const currentColor = `rgb(${currentRGB.r}, ${currentRGB.g}, ${currentRGB.b})`;
            
            // 应用背景色，使用!important确保覆盖CSS
            document.body.style.setProperty('background-color', currentColor, 'important');
            document.documentElement.style.setProperty('background-color', currentColor, 'important');
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                console.log(`✅ ${this.pageName}页面背景渐变完成！`);
            }
        };
        
        animate();
    }
    
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 65, b: 255 };
    }
    
    // 重置状态，允许重新触发天气变化
    reset() {
        this.weatherTransitionStarted = false;
        console.log(`🔄 ${this.pageName}页面天气客户端状态已重置`);
    }
}

// 自动初始化天气客户端
document.addEventListener('DOMContentLoaded', function() {
    // 根据页面标题确定页面名称
    const pageTitle = document.title;
    let pageName = 'Unknown';
    
    if (pageTitle.includes('Album 1')) pageName = 'Sonification专辑';
    else if (pageTitle.includes('Album 2')) pageName = 'If It Happens In A Flash专辑';
    else if (pageTitle.includes('Album 3')) pageName = 'PrintSHIFT专辑';
    else if (pageTitle.includes('Album 4')) pageName = 'Wandering Object专辑';
    else if (pageTitle.includes('Exhibition')) pageName = '展览经历';
    else if (pageTitle.includes('Rasterize')) pageName = '光栅化系列';
    else if (pageTitle.includes('Anti-Human')) pageName = '反人类系列';
    else if (pageTitle.includes('Digital Painting')) pageName = '数字绘画';
    else if (pageTitle.includes('Homepage')) pageName = '主页';
    else pageName = pageTitle;
    
    // 创建天气客户端实例（只创建一次）
    if (!window.weatherClient) {
        window.weatherClient = new WeatherClient(pageName);
        console.log(`🌤️ ${pageName}页面天气客户端已启动`);
    } else {
        console.log(`🌤️ 天气客户端已存在，跳过重复创建`);
        // 如果已存在，确保当前页面使用正确的天气背景色
        window.weatherClient.setInitialBackground();
    }
});

console.log('🌤️ 统一天气客户端系统已加载完成！');
