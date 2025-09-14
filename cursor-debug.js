// 光标调试脚本
console.log('🎯 开始光标调试...');

// 检测浏览器信息
console.log('浏览器信息:', navigator.userAgent);
console.log('当前URL:', window.location.href);

// 检测光标文件是否存在
function checkCursorFile() {
    const cursorPath = window.location.pathname.includes('Html/') ? '../oth870.ani' : 'oth870.ani';
    
    fetch(cursorPath)
        .then(response => {
            console.log('光标文件状态:', response.status);
            if (response.ok) {
                console.log('✅ 光标文件存在且可访问');
                return response.blob();
            } else {
                console.log('❌ 光标文件无法访问');
                return null;
            }
        })
        .then(blob => {
            if (blob) {
                console.log('光标文件大小:', blob.size, '字节');
                console.log('光标文件类型:', blob.type);
            }
        })
        .catch(error => {
            console.log('❌ 光标文件加载失败:', error);
        });
}

// 检测光标支持
function checkCursorSupport() {
    const testElement = document.createElement('div');
    testElement.style.cursor = 'url(oth870.ani), auto';
    
    // 检查计算后的样式
    const computedStyle = window.getComputedStyle(testElement);
    console.log('计算后的光标样式:', computedStyle.cursor);
    
    // 检查是否回退到默认光标
    if (computedStyle.cursor === 'auto') {
        console.log('⚠️ 光标回退到默认样式，可能不支持ANI格式');
    } else {
        console.log('✅ 光标样式已应用');
    }
}

// 光标测试区域已移除
function createCursorTest() {
    // 不再创建光标测试区域
    console.log('✅ 光标测试区域已禁用');
}

// 检测页面加载完成
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        checkCursorFile();
        checkCursorSupport();
        // 不再创建光标测试区域
    });
} else {
    checkCursorFile();
    checkCursorSupport();
    // 不再创建光标测试区域
}

// 导出调试函数
window.debugCursor = {
    checkFile: checkCursorFile,
    checkSupport: checkCursorSupport
    // createTest 方法已移除
};

console.log('🎯 光标调试脚本加载完成');
