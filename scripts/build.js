const fs = require('fs');
const path = require('path');

// 檢查目錄是否存在
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    console.error(`錯誤: 目錄 ${dir} 不存在`);
    process.exit(1);
  }
};

// 確保輸出目錄存在
const publicDir = path.join(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 檢查並收集所有配置
const configs = [];
const configsDir = path.join(process.cwd(), 'mcp-servers');

// 確保 mcp-servers 目錄存在
ensureDir(configsDir);
console.log('開始處理配置文件...\n');

fs.readdirSync(configsDir).forEach(file => {
  if (file.endsWith('.config')) {
    try {
      const filePath = path.join(configsDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      try {
        const content = JSON.parse(fileContent);
        configs.push({
          filename: file,
          content: content
        });
        console.log(`✓ 成功載入配置文件: ${file}`);
      } catch (parseError) {
        console.error(`\n錯誤: 解析 ${file} 失敗`);
        console.error('JSON 解析錯誤:', parseError.message);
        console.error('檔案內容:\n', fileContent);
        process.exit(1);
      }
    } catch (readError) {
      console.error(`\n錯誤: 讀取 ${file} 失敗:`, readError.message);
      process.exit(1);
    }
  }
});

if (configs.length === 0) {
  console.warn('\n警告: 在 mcp-servers 目錄中沒有找到 .config 文件');
} else {
  console.log(`\n共載入 ${configs.length} 個配置文件`);
}

// 生成 JSON 文件
fs.writeFileSync(
  path.join(publicDir, 'configs.json'),
  JSON.stringify(configs, null, 2)
);

// 生成 HTML 文件
function generateHtml(configs) {
  const configsContent = configs.length > 0
    ? configs.map(({filename, content}) => {
        try {
          return `
            <div class="bg-white shadow rounded-lg p-6">
              <h2 class="text-xl font-semibold mb-4">${content.marketplace?.name || '未命名配置'}</h2>
              <p class="text-gray-600 mb-4">${content.marketplace?.description || '無描述'}</p>
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-sm text-gray-500">Version</p>
                  <p>${content.marketplace?.version || 'N/A'}</p>
                </div>
                <div>
                  <p class="text-sm text-gray-500">Maintainer</p>
                  <p>${content.marketplace?.maintainer?.name || 'N/A'}</p>
                </div>
              </div>
              <div class="mt-4">
                <p class="text-sm text-gray-500">Tags</p>
                <div class="flex flex-wrap gap-2 mt-1">
                  ${(content.marketplace?.tags || []).map(tag =>
                    `<span class="bg-gray-200 rounded-full px-3 py-1 text-sm">${tag}</span>`
                  ).join("")}
                </div>
              </div>
              <div class="mt-4 text-sm text-gray-500">
                檔案名稱: ${filename}
              </div>
            </div>
          `;
        } catch (error) {
          console.error(`警告: 處理配置 ${filename} 時發生錯誤:`, error);
          return `
            <div class="bg-red-50 border-l-4 border-red-500 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">
                    無法解析配置文件: ${filename}
                  </p>
                </div>
              </div>
            </div>
          `;
        }
      }).join("")
    : `
        <div class="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                尚無可用的配置文件
              </p>
            </div>
          </div>
        </div>
      `;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>MCP Server Configs</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gray-100">
  <div class="container mx-auto px-4 py-8">
    <h1 class="text-3xl font-bold mb-8">MCP Server Configs</h1>
    <div class="mb-4">
      <a href="configs.json" download class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        下載完整配置文件
      </a>
    </div>
    <div class="grid gap-6">
      ${configsContent}
    </div>
  </div>
</body>
</html>
  `;
}

const html = generateHtml(configs);

try {
  // 保存 JSON 配置
  const jsonPath = path.join(publicDir, 'configs.json');
  fs.writeFileSync(jsonPath, JSON.stringify(configs, null, 2));
  console.log(`✓ 成功生成配置文件: ${jsonPath}`);

  // 保存 HTML 文件
  const htmlPath = path.join(publicDir, 'index.html');
  fs.writeFileSync(htmlPath, html);
  console.log(`✓ 成功生成網頁文件: ${htmlPath}`);

  console.log('\n構建完成！您可以：');
  console.log('1. 執行 `make serve` 啟動本地預覽');
  console.log('2. 直接開啟 public/index.html 查看結果');
  console.log('3. 使用 `make show-json` 查看 JSON 配置\n');
} catch (error) {
  console.error('\n錯誤: 寫入文件失敗:', error.message);
  process.exit(1);
}
