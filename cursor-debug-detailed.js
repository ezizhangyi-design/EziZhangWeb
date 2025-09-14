// 详细的光标调试脚本
console.log('🔍 开始详细光标调试...');

function detailedCursorDebug() {
    console.log('=== 光标调试报告 ===');
    
    // 1. 检测浏览器信息
    console.log('🌐 浏览器信息:');
    console.log('User Agent:', navigator.userAgent);
    console.log('Platform:', navigator.platform);
    console.log('Language:', navigator.language);
    
    // 2. 检测当前页面信息
    console.log('📄 页面信息:');
    console.log('URL:', window.location.href);
    console.log('Protocol:', window.location.protocol);
    console.log('Host:', window.location.host);
    
    // 3. 检测光标文件可访问性
    console.log('🔗 光标文件检测:');
    
    // 检测在线光标文件
    fetch('https://ani.cursors-4u.net/games/gam-16/gam1565.cur')
        .then(response => {
            console.log('在线光标文件状态:', response.status);
            if (response.ok) {
                console.log('✅ 在线光标文件可访问');
                return response.blob();
            } else {
                console.log('❌ 在线光标文件无法访问');
                return null;
            }
        })
        .then(blob => {
            if (blob) {
                console.log('在线光标文件大小:', blob.size, '字节');
                console.log('在线光标文件类型:', blob.type);
            }
        })
        .catch(error => {
            console.log('❌ 在线光标文件加载失败:', error.message);
        });
    
    // 检测本地光标文件
    fetch('oth870.ani')
        .then(response => {
            console.log('本地光标文件状态:', response.status);
            if (response.ok) {
                console.log('✅ 本地光标文件可访问');
                return response.blob();
            } else {
                console.log('❌ 本地光标文件无法访问');
                return null;
            }
        })
        .then(blob => {
            if (blob) {
                console.log('本地光标文件大小:', blob.size, '字节');
                console.log('本地光标文件类型:', blob.type);
            }
        })
        .catch(error => {
            console.log('❌ 本地光标文件加载失败:', error.message);
        });
    
    // 4. 检测CSS样式
    console.log('🎨 CSS样式检测:');
    const bodyStyle = window.getComputedStyle(document.body);
    const htmlStyle = window.getComputedStyle(document.documentElement);
    
    console.log('Body cursor:', bodyStyle.cursor);
    console.log('HTML cursor:', htmlStyle.cursor);
    console.log('Body background:', bodyStyle.backgroundColor);
    console.log('HTML background:', htmlStyle.backgroundColor);
    
    // 5. 检测内联样式
    console.log('📝 内联样式检测:');
    console.log('Body 内联 cursor:', document.body.style.cursor);
    console.log('HTML 内联 cursor:', document.documentElement.style.cursor);
    
    // 6. 检测样式表
    console.log('📋 样式表检测:');
    const stylesheets = document.styleSheets;
    console.log('样式表数量:', stylesheets.length);
    
    for (let i = 0; i < stylesheets.length; i++) {
        try {
            const sheet = stylesheets[i];
            console.log(`样式表 ${i}:`, sheet.href || '内联样式');
            
            if (sheet.cssRules) {
                for (let j = 0; j < sheet.cssRules.length; j++) {
                    const rule = sheet.cssRules[j];
                    if (rule.selectorText && rule.selectorText.includes('html, body') && rule.style.cursor) {
                        console.log('找到光标规则:', rule.selectorText, '->', rule.style.cursor);
                    }
                }
            }
        } catch (error) {
            console.log(`样式表 ${i} 访问被阻止 (跨域):`, error.message);
        }
    }
    
    // 7. 创建测试元素
    console.log('🧪 创建测试元素:');
    const testElement = document.createElement('div');
    testElement.style.cssText = `
        position: fixed;
        top: 50px;
        left: 50px;
        width: 100px;
        height: 100px;
        background: rgba(255, 0, 0, 0.5);
        border: 2px solid red;
        cursor: url('https://ani.cursors-4u.net/games/gam-16/gam1565.cur'), url('oth870.ani'), auto !important;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
        text-align: center;
    `;
    testElement.textContent = '光标测试';
    testElement.title = '将鼠标移到这里测试光标';
    
    document.body.appendChild(testElement);
    console.log('✅ 测试元素已创建');
    
    // 8. 检测计算后的样式
    setTimeout(() => {
        const computedStyle = window.getComputedStyle(testElement);
        console.log('测试元素计算后的光标:', computedStyle.cursor);
        
        if (computedStyle.cursor === 'auto') {
            console.log('⚠️ 光标回退到默认样式');
        } else if (computedStyle.cursor.includes('url(')) {
            console.log('✅ 光标URL已应用');
        } else {
            console.log('❓ 未知光标状态:', computedStyle.cursor);
        }
    }, 100);
    
    // 9. 检测浏览器支持
    console.log('🔧 浏览器支持检测:');
    console.log('支持CSS cursor:', 'cursor' in document.body.style);
    console.log('支持URL cursor:', CSS.supports('cursor', 'url(test.cur)'));
    
    // 10. 创建多种光标测试
    console.log('🎯 创建多种光标测试:');
    const cursorTests = [
        { name: '默认', cursor: 'default' },
        { name: '指针', cursor: 'pointer' },
        { name: '文本', cursor: 'text' },
        { name: '移动', cursor: 'move' },
        { name: '在线CUR', cursor: 'url(https://ani.cursors-4u.net/games/gam-16/gam1565.cur), auto' },
        { name: '本地ANI', cursor: 'url(oth870.ani), auto' },
        { name: 'SVG光标', cursor: 'url(data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="8" fill="red"/></svg>), auto' }
    ];
    
    cursorTests.forEach((test, index) => {
        const testDiv = document.createElement('div');
        testDiv.style.cssText = `
            position: fixed;
            top: ${200 + index * 30}px;
            left: 200px;
            width: 150px;
            height: 25px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 5px;
            font-size: 12px;
            cursor: ${test.cursor};
            z-index: 999999;
            border: 1px solid white;
        `;
        testDiv.textContent = `${test.name}: ${test.cursor}`;
        testDiv.title = `测试 ${test.name} 光标`;
        document.body.appendChild(testDiv);
    });
    
    console.log('✅ 多种光标测试已创建');
    
    // 5秒后清理测试元素
    setTimeout(() => {
        const testElements = document.querySelectorAll('[style*="position: fixed"][style*="z-index: 999999"]');
        testElements.forEach(el => el.remove());
        console.log('🧹 测试元素已清理');
    }, 10000);
}

// 检测页面加载完成
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', detailedCursorDebug);
} else {
    detailedCursorDebug();
}

// 导出调试函数
window.detailedCursorDebug = detailedCursorDebug;

console.log('🔍 详细光标调试脚本加载完成');
