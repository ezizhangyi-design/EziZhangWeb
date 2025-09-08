// 全局天气系统
// 每天早上6点生成新的天气数据并更新所有页面背景

class GlobalWeatherSystem {
    constructor() {
        this.weatherTypes = [
            // 常见天气（调整概率以平衡特殊天气增加）
            { name: '晴天', baseColor: '#003cff', description: 'Clear Sky', probability: 0.47 },
            { name: '多云', baseColor: '#006fff', description: 'Cloudy', probability: 0.15 },
            { name: '雨天', baseColor: '#005398', description: 'Rainy', probability: 0.1 },
            { name: '雾天', baseColor: '#7c4900', description: 'Foggy', probability: 0.05 },
            { name: '风暴', baseColor: '#008282', description: 'Stormy', probability: 0.05 },
            
            // 特殊天气（提高概率到18%）
            { name: '血夜', baseColor: '#9d0051', description: 'Blood Night', probability: 0.08 },
            { name: '腐化之地', baseColor: '#5200cc', description: 'Corrupted Land', probability: 0.05 },
            { name: '酸雨', baseColor: '#007f51', description: 'Acid Rain', probability: 0.03 },
            { name: '地狱', baseColor: '#841900', description: 'Hell', probability: 0.02 }
        ];
        
        this.currentWeather = null;
        this.lastUpdateDate = localStorage.getItem('weatherUpdatedToday') || null;
        this.weatherTimer = null;
        
        // 加载已存在的天气数据
        this.loadExistingWeather();
        
        console.log('🌤️ 全局天气系统初始化完成');
        this.init();
    }
    
    loadExistingWeather() {
        // 从localStorage加载已存在的天气数据
        const storedWeather = localStorage.getItem('globalWeatherData');
        if (storedWeather) {
            try {
                this.currentWeather = JSON.parse(storedWeather);
                console.log('🌤️ 加载已存在的天气数据:', this.currentWeather.name, this.currentWeather.baseColor);
            } catch (error) {
                console.error('❌ 解析天气数据失败:', error);
                this.currentWeather = null;
            }
        } else {
            console.log('🌤️ 没有已存在的天气数据');
        }
    }
    
    init() {
        // 立即应用当前天气背景色
        this.applyCurrentWeather();
        
        // 检查是否需要更新天气
        this.checkAndUpdateWeather();
        
        // 设置定时器，每分钟检查一次是否需要更新
        this.weatherTimer = setInterval(() => {
            this.checkAndUpdateWeather();
        }, 60000); // 每分钟检查一次
        
        console.log('⏰ 天气系统定时器已启动，每分钟检查一次');
        console.log('🌤️ 天气系统只会在每天早上6点更新一次，其他时间保持稳定');
    }
    
    checkAndUpdateWeather() {
        const now = new Date();
        const currentDate = now.toDateString();
        const currentHour = now.getHours();
        
        // 如果没有天气数据，生成初始天气
        if (!this.currentWeather) {
            console.log('🌤️ 没有天气数据，生成初始天气...');
            this.generateNewWeather();
            this.lastUpdateDate = currentDate;
            localStorage.setItem('weatherUpdatedToday', currentDate);
            return;
        }
        
        // 检查是否是新的一天且已经过了早上6点
        if (this.lastUpdateDate !== currentDate && currentHour >= 6) {
            console.log('🌅 检测到新的一天，开始更新天气...');
            this.generateNewWeather();
            this.lastUpdateDate = currentDate;
            
            // 标记今天已经更新过天气
            localStorage.setItem('weatherUpdatedToday', currentDate);
        }
    }
    
    generateNewWeather() {
        // 根据概率选择天气类型
        const random = Math.random();
        let cumulativeProbability = 0;
        let selectedWeather = null;
        
        for (const weather of this.weatherTypes) {
            cumulativeProbability += weather.probability;
            if (random <= cumulativeProbability) {
                selectedWeather = weather;
                break;
            }
        }
        
        // 如果没有选中（理论上不应该发生），选择第一个
        if (!selectedWeather) {
            selectedWeather = this.weatherTypes[0];
        }
        
        this.currentWeather = {
            ...selectedWeather,
            timestamp: Date.now(),
            date: new Date().toISOString()
        };
        
        console.log('🌤️ 生成新天气:', this.currentWeather.name, this.currentWeather.baseColor);
        
        // 保存到localStorage
        this.saveWeatherData();
        
        // 分发天气变化事件
        this.dispatchWeatherChange();
        
        // 更新主页面背景
        this.updateMainPageBackground();
    }
    
    saveWeatherData() {
        try {
            localStorage.setItem('globalWeatherData', JSON.stringify(this.currentWeather));
            console.log('💾 天气数据已保存到localStorage');
        } catch (error) {
            console.error('❌ 保存天气数据失败:', error);
        }
    }
    
    dispatchWeatherChange() {
        // 创建自定义事件
        const weatherEvent = new CustomEvent('globalWeatherChange', {
            detail: this.currentWeather
        });
        
        // 分发事件
        window.dispatchEvent(weatherEvent);
        console.log('📡 天气变化事件已分发');
    }
    
    applyCurrentWeather() {
        // 立即应用当前天气背景色
        if (this.currentWeather && this.currentWeather.baseColor) {
            if (document.body) {
                document.body.style.setProperty('background-color', this.currentWeather.baseColor, 'important');
                document.documentElement.style.setProperty('background-color', this.currentWeather.baseColor, 'important');
                console.log('🎨 立即应用天气背景色:', this.currentWeather.baseColor);
            }
        } else {
            console.log('🌤️ 没有天气数据，使用默认背景色');
        }
    }
    
    updateMainPageBackground() {
        // 更新主页面的背景色
        if (document.body) {
            document.body.style.setProperty('background-color', this.currentWeather.baseColor, 'important');
            document.documentElement.style.setProperty('background-color', this.currentWeather.baseColor, 'important');
            console.log('🎨 主页面背景已更新为:', this.currentWeather.baseColor);
        }
    }
    
    // 手动触发天气更新（用于测试）
    forceWeatherUpdate() {
        console.log('🔄 手动触发天气更新...');
        this.generateNewWeather();
    }
    
    // 获取当前天气
    getCurrentWeather() {
        return this.currentWeather;
    }
    
    // 停止天气系统
    stop() {
        if (this.weatherTimer) {
            clearInterval(this.weatherTimer);
            this.weatherTimer = null;
            console.log('⏹️ 天气系统已停止');
        }
    }
}

// 创建全局天气系统实例（只创建一次）
if (!window.globalWeatherSystem) {
    window.globalWeatherSystem = new GlobalWeatherSystem();
    console.log('🌤️ 全局天气系统实例已创建');
} else {
    console.log('🌤️ 全局天气系统实例已存在，跳过重复创建');
}

// 添加调试功能到控制台
window.testWeather = () => {
    console.log('🧪 测试天气系统...');
    window.globalWeatherSystem.forceWeatherUpdate();
};

window.getWeather = () => {
    const weather = window.globalWeatherSystem.getCurrentWeather();
    console.log('🌤️ 当前天气:', weather);
    return weather;
};

console.log('🌤️ 全局天气系统已加载完成！');
console.log('💡 调试命令: testWeather() - 手动更新天气, getWeather() - 查看当前天气');
