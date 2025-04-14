# AI-Operator

## MCP Server Marketplace Example

```json
{
  "marketplace": {
    "name": "OpenAI Assistant",
    "description": "OpenAI API 整合服務，提供 GPT-4、GPT-3.5 等模型的存取能力",
    "version": "1.0.0",
    "maintainer": {
      "name": "AI Operator Team",
      "email": "support@ai-operator.com"
    },
    "tags": ["AI", "OpenAI", "GPT", "LLM"],
    "iconUrl": "https://ai-operator.com/icons/openai-assistant.png",
    "documentation": "https://ai-operator.com/docs/openai-assistant"
  },
  "source": {
    "repository": {
      "type": "git",
      "url": "https://github.com/ai-operator/openai-assistant.git",
      "branch": "main",
      "tag": "v1.0.0",
      "auth": {
        "type": "ssh",
        "sshKeySecret": "openai-assistant-deploy-key"
      }
    },
    "build": {
      "context": ".",
      "dockerfile": "Dockerfile",
      "args": {
        "PYTHON_VERSION": "3.9"
      }
    },
    "registry": {
      "url": "ghcr.io/ai-operator",
      "auth": {
        "type": "token",
        "secretName": "registry-auth-token"
      }
    }
  },
  "runtime": {
    "language": {
      "name": "python",
      "version": "3.9"
    },
    "baseImage": {
      "repository": "python",
      "tag": "3.9-slim",
      "registry": "docker.io"
    },
    "command": "python",
    "args": ["/path/to/server.py"],
    "envs": {
      "PYTHONPATH": "/app",
      "PYTHONUNBUFFERED": "1",
      "API_KEY": "your_api_key"
    },
    "alwaysAllow": true,
    "disabled": false,
    "dependencies": {
      "python": {
        "openai": "^1.0.0",
        "pydantic": "^2.0.0",
        "fastapi": "^0.100.0"
      },
      "system": {
        "memory": "512Mi",
        "cpu": "0.5"
      }
    }
  },
  "installConfig": {
    "required": {
      "apiKey": {
        "type": "string",
        "label": "OpenAI API 金鑰",
        "description": "請輸入您的 OpenAI API 金鑰",
        "validation": {
          "pattern": "^sk-[A-Za-z0-9]{48}$",
          "message": "請輸入有效的 OpenAI API 金鑰格式"
        }
      },
      "organizationId": {
        "type": "string",
        "label": "組織 ID",
        "description": "請輸入您的 OpenAI 組織 ID（選填）",
        "required": false
      }
    },
    "advanced": {
      "apiEndpoint": {
        "type": "string",
        "label": "API 端點",
        "description": "自訂 API 端點（選填）",
        "default": "https://api.openai.com/v1",
        "required": false
      },
      "maxTokens": {
        "type": "number",
        "label": "最大 Token 數",
        "description": "單次請求的最大 Token 限制",
        "default": 4096,
        "validation": {
          "min": 1,
          "max": 8192
        },
        "required": false
      },
      "timeout": {
        "type": "number",
        "label": "請求逾時時間",
        "description": "API 請求逾時時間（秒）",
        "default": 30,
        "validation": {
          "min": 1,
          "max": 300
        },
        "required": false
      }
    }
  },
  "tools": [
    {
      "name": "chat",
      "description": "使用 GPT 模型進行對話",
      "parameters": {
        "model": {
          "type": "string",
          "enum": ["gpt-4", "gpt-3.5-turbo"],
          "default": "gpt-3.5-turbo"
        },
        "message": {
          "type": "string",
          "description": "使用者輸入的訊息"
        }
      }
    }
  ]
}
```

此規格定義了 MCP Server 在市集上的顯示資訊、程式碼來源、運行環境需求以及安裝時的配置要求。當使用者點選安裝時，系統會根據 `installConfig` 中的定義產生配置表單，要求使用者填寫必要資訊。

### 規格說明

1. marketplace：定義在市集上的顯示資訊
   - name：伺服器名稱
   - description：功能描述
   - version：版本號
   - maintainer：維護者資訊
   - tags：分類標籤
   - iconUrl：圖示網址
   - documentation：文件連結

2. source：程式碼來源設定
   - repository：程式碼儲存庫資訊
     - type：版本控制類型
     - url：儲存庫網址
     - branch：使用分支
     - tag：版本標籤
     - auth：存取認證設定
   - build：建置相關設定
   - registry：容器映像檔登錄設定

3. runtime：執行環境設定
   - language：程式語言及版本
   - baseImage：Docker 基礎映像檔資訊
   - dependencies：相依套件清單
   - environmentVariables：環境變數設定

4. installConfig：安裝配置
   - required：必要配置項目
   - advanced：進階配置選項
   - 每個配置項目包含：
     - type：資料類型
     - label：顯示標籤
     - description：說明文字
     - validation：驗證規則
     - default：預設值（選填）
     - required：是否必填

5. tools：提供的工具列表
   - name：工具名稱
   - description：工具說明
   - parameters：工具參數定義