const fs = require('fs');
const path = require('path');

// 顏色代碼
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// 驗證 JSON 結構
function validateConfig(content, filename) {
  const errors = [];
  
  // 檢查必要的頂層欄位
  const requiredFields = ['marketplace', 'runtime', 'config'];
  requiredFields.forEach(field => {
    if (!content[field]) {
      errors.push(`缺少必要的頂層欄位: ${field}`);
    }
  });

  // 檢查 marketplace 欄位
  if (content.marketplace) {
    const marketplaceFields = ['name', 'description', 'version', 'maintainer'];
    marketplaceFields.forEach(field => {
      if (!content.marketplace[field]) {
        errors.push(`marketplace 缺少必要欄位: ${field}`);
      }
    });

    // 檢查 maintainer
    if (content.marketplace.maintainer) {
      if (!content.marketplace.maintainer.name) {
        errors.push('maintainer 缺少 name 欄位');
      }
      if (!content.marketplace.maintainer.email) {
        errors.push('maintainer 缺少 email 欄位');
      }
    }
  }

  // 檢查 runtime 欄位
  if (content.runtime) {
    const runtimeFields = ['baseImage', 'command'];
    runtimeFields.forEach(field => {
      if (!content.runtime[field]) {
        errors.push(`runtime 缺少必要欄位: ${field}`);
      }
    });
  }

  return errors;
}

// 主要檢查邏輯
function lintConfig(filepath) {
  const filename = path.basename(filepath);
  console.log(`\n${colors.blue}檢查文件: ${filename}${colors.reset}`);
  
  try {
    // 讀取文件
    const content = fs.readFileSync(filepath, 'utf-8');
    
    try {
      // 嘗試解析 JSON
      const parsed = JSON.parse(content);
      
      // 驗證結構
      const errors = validateConfig(parsed, filename);
      
      if (errors.length > 0) {
        console.log(`${colors.yellow}發現以下問題：${colors.reset}`);
        errors.forEach(error => {
          console.log(`  - ${error}`);
        });
        return false;
      } else {
        console.log(`${colors.green}✓ JSON 格式正確${colors.reset}`);
        console.log(`${colors.green}✓ 配置結構驗證通過${colors.reset}`);
        return true;
      }
    } catch (parseError) {
      console.log(`${colors.red}JSON 解析錯誤：${colors.reset}`);
      console.log(`  - ${parseError.message}`);
      // 顯示錯誤位置附近的內容
      const lines = content.split('\n');
      if (parseError.lineNumber) {
        const start = Math.max(0, parseError.lineNumber - 2);
        const end = Math.min(lines.length, parseError.lineNumber + 2);
        console.log('\n相關代碼：');
        for (let i = start; i < end; i++) {
          const lineNum = i + 1;
          console.log(`${lineNum === parseError.lineNumber ? '>' : ' '} ${lineNum}: ${lines[i]}`);
        }
      }
      return false;
    }
  } catch (readError) {
    console.log(`${colors.red}讀取文件失敗：${colors.reset}`);
    console.log(`  - ${readError.message}`);
    return false;
  }
}

// 執行檢查
const configsDir = path.join(process.cwd(), 'mcp-servers');
let hasErrors = false;

if (!fs.existsSync(configsDir)) {
  console.error(`${colors.red}錯誤: ${configsDir} 目錄不存在${colors.reset}`);
  process.exit(1);
}

const files = fs.readdirSync(configsDir)
  .filter(file => file.endsWith('.config'))
  .map(file => path.join(configsDir, file));

if (files.length === 0) {
  console.log(`${colors.yellow}警告: 未找到任何 .config 文件${colors.reset}`);
  process.exit(0);
}

console.log(`${colors.blue}開始檢查 ${files.length} 個配置文件...${colors.reset}`);

files.forEach(file => {
  if (!lintConfig(file)) {
    hasErrors = true;
  }
});

if (hasErrors) {
  console.log(`\n${colors.red}檢查完成：發現錯誤${colors.reset}`);
  process.exit(1);
} else {
  console.log(`\n${colors.green}檢查完成：所有文件都通過驗證${colors.reset}`);
  process.exit(0);
}