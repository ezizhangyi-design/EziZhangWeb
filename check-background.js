// 背景色检测脚本
console.log('🎨 开始检测主界面背景色...');

function checkBackgroundColor() {
    // 检测body的背景色
    const bodyStyle = window.getComputedStyle(document.body);
    const bodyBgColor = bodyStyle.backgroundColor;
    const bodyBgImage = bodyStyle.backgroundImage;
    
    // 检测html的背景色
    const htmlStyle = window.getComputedStyle(document.documentElement);
    const htmlBgColor = htmlStyle.backgroundColor;
    const htmlBgImage = htmlStyle.backgroundImage;
    
    // 检测内联样式
    const bodyInlineBg = document.body.style.backgroundColor;
    const htmlInlineBg = document.documentElement.style.backgroundColor;
    
    console.log('📊 背景色检测结果:');
    console.log('Body 计算后背景色:', bodyBgColor);
    console.log('Body 内联背景色:', bodyInlineBg); 
    console.log('Body 背景图片:', bodyBgImage);
    console.log('HTML 计算后背景色:', htmlBgColor);
    console.log('HTML 内联背景色:', htmlInlineBg);
    console.log('HTML 背景图片:', htmlBgImage);
    
    // 检测天气系统状态
    if (window.globalWeatherSystem) {
        const currentWeather = window.globalWeatherSystem.getCurrentWeather();
        console.log('🌤️ 当前天气:', currentWeather);
        if (currentWeather) {
            console.log('天气名称:', currentWeather.name);
            console.log('天气颜色:', currentWeather.baseColor);
        }
    } else {
        console.log('❌ 天气系统未找到');
    }
    
    // 检测localStorage中的天气数据
    const storedWeather = localStorage.getItem('globalWeatherData');
    if (storedWeather) {
        try {
            const weatherData = JSON.parse(storedWeather);
            console.log('💾 存储的天气数据:', weatherData);
        } catch (error) {
            console.log('❌ 解析存储的天气数据失败:', error);
        }
    } else {
        console.log('❌ 没有存储的天气数据');
    }
    
    // 判断是否为黑色或深色
    function isDarkColor(color) {
        if (!color || color === 'transparent' || color === 'rgba(0, 0, 0, 0)') {
            return false;
        }
        
        // 解析RGB值
        const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
            const r = parseInt(rgbMatch[1]);
            const g = parseInt(rgbMatch[2]);
            const b = parseInt(rgbMatch[3]);
            
            // 计算亮度
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            console.log(`颜色 ${color} 的亮度: ${brightness.toFixed(2)}`);
            
            return brightness < 100; // 亮度小于100认为是深色
        }
        
        return false;
    }
    
    // 检查是否为深色背景
    const isBodyDark = isDarkColor(bodyBgColor);
    const isHtmlDark = isDarkColor(htmlBgColor);
    
    console.log('🔍 背景色分析:');
    console.log('Body 是否为深色:', isBodyDark);
    console.log('HTML 是否为深色:', isHtmlDark);
    
    if (isBodyDark || isHtmlDark) {
        console.log('⚠️ 检测到深色背景！');
        console.log('建议点击左上角的"🌤️ 重置天气"按钮');
    } else {
        console.log('✅ 背景色正常，不是深色');
    }
    
    // 创建视觉指示器
    createColorIndicator(bodyBgColor, htmlBgColor);
}

function createColorIndicator(bodyColor, htmlColor) {
    // 移除已存在的指示器
    const existingIndicator = document.getElementById('color-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // 创建颜色指示器
    const indicator = document.createElement('div');
    indicator.id = 'color-indicator';
    indicator.style.cssText = `
        position: fixed;
        top: 80px;
        left: 20px;
        z-index: 999999;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 15px;
        border-radius: 8px;
        font-family: 'VCR OSD Mono', monospace;
        font-size: 12px;
        max-width: 300px;
        backdrop-filter: blur(10px);
    `;
    
    indicator.innerHTML = `
        <div style="margin-bottom: 10px; font-weight: bold;">🎨 背景色检测结果</div>
        <div>Body: <span style="color: ${bodyColor};">${bodyColor}</span></div>
        <div>HTML: <span style="color: ${htmlColor};">${htmlColor}</span></div>
        <div style="margin-top: 10px; font-size: 10px; opacity: 0.8;">
            如果背景是深色，请点击"🌤️ 重置天气"按钮
        </div>
    `;
    
    document.body.appendChild(indicator);
    
    // 5秒后自动移除
    setTimeout(() => {
        if (indicator && indicator.parentNode) {
            indicator.remove();
        }
    }, 5000);
}

// 检测页面加载完成
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', checkBackgroundColor);
} else {
    checkBackgroundColor();
}

// 导出检测函数
window.checkBackground = checkBackgroundColor;

console.log('🎨 背景色检测脚本加载完成');
