// 强制设置光标的JavaScript脚本
console.log('🎯 开始强制设置光标...');

function forceCursor() {
    // 自定义光标
    const customCursor = `url('https://cur.cursors-4u.net/symbols/sym-5/sym414.cur'), auto`;
    
    // 强制设置body和html的光标
    document.body.style.setProperty('cursor', customCursor, 'important');
    document.documentElement.style.setProperty('cursor', customCursor, 'important');
    
    console.log('✅ 已强制设置body和html光标');
    
    // 为所有元素设置光标（除了特定元素）
    const allElements = document.querySelectorAll('*');
    allElements.forEach(element => {
        const tagName = element.tagName.toLowerCase();
        const className = element.className || '';
        
        // 跳过特定元素类型
        if (tagName === 'input' || tagName === 'textarea' || 
            className.includes('text-cursor') || 
            element.contentEditable === 'true') {
            // 这些元素保持文本光标
            element.style.setProperty('cursor', 'text', 'important');
        } else if (tagName === 'a' || tagName === 'button' || 
                   className.includes('clickable') || 
                   element.onclick) {
            // 这些元素使用自定义光标
            element.style.setProperty('cursor', customCursor, 'important');
        } else {
            // 其他元素继承自定义光标
            element.style.setProperty('cursor', customCursor, 'important');
        }
    });
    
    console.log(`✅ 已为 ${allElements.length} 个元素设置光标`);
    
    // 创建光标测试区域
    createCursorTestArea();
}

function createCursorTestArea() {
    // 移除已存在的测试区域
    const existingTest = document.getElementById('cursor-force-test');
    if (existingTest) {
        existingTest.remove();
    }
    
    // 创建新的测试区域
    const testArea = document.createElement('div');
    testArea.id = 'cursor-force-test';
    testArea.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        width: 200px;
        height: 100px;
        background: rgba(255, 0, 0, 0.8);
        border: 3px solid white;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
        text-align: center;
        z-index: 999999;
        cursor: url('https://cur.cursors-4u.net/symbols/sym-5/sym414.cur'), auto !important;
    `;
    testArea.innerHTML = '强制光标测试<br>如果这里和外面<br>光标一样，说明成功！';
    testArea.title = '强制光标测试区域';
    
    document.body.appendChild(testArea);
    console.log('✅ 强制光标测试区域已创建');
    
    // 10秒后移除测试区域
    setTimeout(() => {
        if (testArea && testArea.parentNode) {
            testArea.remove();
            console.log('🧹 强制光标测试区域已移除');
        }
    }, 10000);
}

// 监听DOM变化，确保新添加的元素也有正确的光标
function observeDOM() {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // 元素节点
                        const customCursor = `url('https://cur.cursors-4u.net/symbols/sym-5/sym414.cur'), auto`;
                        
                        if (node.tagName && node.tagName.toLowerCase() !== 'input' && 
                            node.tagName.toLowerCase() !== 'textarea') {
                            node.style.setProperty('cursor', customCursor, 'important');
                        }
                        
                        // 为新元素的子元素也设置光标
                        const childElements = node.querySelectorAll('*');
                        childElements.forEach(child => {
                            if (child.tagName && child.tagName.toLowerCase() !== 'input' && 
                                child.tagName.toLowerCase() !== 'textarea') {
                                child.style.setProperty('cursor', customCursor, 'important');
                            }
                        });
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    console.log('👀 DOM变化监听器已启动');
}

// 页面加载完成后执行
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(forceCursor, 100); // 延迟100ms确保CSS加载完成
        observeDOM();
    });
} else {
    setTimeout(forceCursor, 100);
    observeDOM();
}

// 导出函数供手动调用
window.forceCursor = forceCursor;

console.log('🎯 强制光标脚本加载完成');
