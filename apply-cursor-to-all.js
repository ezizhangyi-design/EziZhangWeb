// 批量应用光标到所有HTML页面的脚本
const fs = require('fs');
const path = require('path');

// 光标CSS代码
const cursorCSS = `            /* 添加在线动画光标 */
            cursor: url('https://ani.cursors-4u.net/games/gam-16/gam1565.cur'), url('../oth870.ani'), auto !important;`;

// 需要处理的HTML文件列表
const htmlFiles = [
    'Html/album-3.html',
    'Html/album-4.html',
    'Html/tangential.html',
    'Html/rgb-star-history.html',
    'Html/Ezi signifer-relic-series.html',
    'Html/digital-painting-fully-responsive.html',
    'Html/digital-painting-responsive.html',
    'Html/simple-test.html',
    'Html/test-image.html',
    'Html/test-images.html',
    'Html/fugue-sequencer-demo.html',
    'Html/test-all-interaction.html',
    'Html/check-interaction.html',
    'Html/test-03-simple.html',
    'Html/debug-03-interaction.html',
    'Html/debug-03.html',
    'Html/debug-test.html',
    'Html/simple-hover.html',
    'Html/hover-test.html',
    'Html/server-test.html',
    'Html/test-rgb4.html',
    'Html/simple-test-rgb4.html',
    'Html/test.html',
    'Html/simple.html',
    'Html/debug.html'
];

// 根目录的HTML文件
const rootHtmlFiles = [
    'weather-colors.html',
    'dot_test.html',
    'weather-test.html',
    'test_volume.html',
    'test-subtitle-fonts.html',
    'test-font-size.html'
];

function addCursorToFile(filePath, isRootFile = false) {
    try {
        if (!fs.existsSync(filePath)) {
            console.log(`❌ 文件不存在: ${filePath}`);
            return false;
        }

        let content = fs.readFileSync(filePath, 'utf8');
        
        // 检查是否已经有光标设置
        if (content.includes('cursor: url(')) {
            console.log(`✅ 文件已有光标设置: ${filePath}`);
            return true;
        }

        // 查找html, body样式块
        const bodyStyleRegex = /(html,\s*body\s*\{[^}]*)(\})/;
        const match = content.match(bodyStyleRegex);
        
        if (match) {
            // 在}之前添加光标CSS
            const newContent = content.replace(
                bodyStyleRegex,
                `$1${cursorCSS}\n        }`
            );
            
            fs.writeFileSync(filePath, newContent, 'utf8');
            console.log(`✅ 已添加光标到: ${filePath}`);
            return true;
        } else {
            console.log(`⚠️ 未找到html, body样式块: ${filePath}`);
            return false;
        }
    } catch (error) {
        console.error(`❌ 处理文件失败 ${filePath}:`, error.message);
        return false;
    }
}

// 处理所有文件
console.log('🎯 开始批量应用光标到所有HTML页面...\n');

let successCount = 0;
let totalCount = 0;

// 处理Html目录下的文件
htmlFiles.forEach(file => {
    totalCount++;
    if (addCursorToFile(file)) {
        successCount++;
    }
});

// 处理根目录下的文件
rootHtmlFiles.forEach(file => {
    totalCount++;
    if (addCursorToFile(file, true)) {
        successCount++;
    }
});

console.log(`\n📊 处理完成:`);
console.log(`✅ 成功: ${successCount}/${totalCount} 个文件`);
console.log(`❌ 失败: ${totalCount - successCount}/${totalCount} 个文件`);

if (successCount === totalCount) {
    console.log('\n🎉 所有页面都已成功添加光标！');
} else {
    console.log('\n⚠️ 部分页面添加光标失败，请检查上述错误信息。');
}
