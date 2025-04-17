# MCP Server Marketplace Specification

本文檔定義了 MCP Server 在市集發布時所需的規格。

## 規格結構

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "description": "MCP Server 市集規格定義",
  "required": ["marketplace", "runtime", "installConfig"],
  "properties": {
    "marketplace": {
      "type": "object",
      "description": "市集顯示資訊",
      "required": ["name", "description", "version", "maintainer", "tags", "iconUrl", "documentation"],
      "properties": {
        "name": {
          "type": "string",
          "description": "伺服器名稱"
        },
        "description": {
          "type": "string",
          "description": "功能描述"
        },
        "version": {
          "type": "string",
          "description": "版本號",
          "pattern": "^\\d+\\.\\d+\\.\\d+$"
        },
        "maintainer": {
          "type": "object",
          "required": ["name", "email"],
          "properties": {
            "name": {
              "type": "string",
              "description": "維護者名稱"
            },
            "email": {
              "type": "string",
              "description": "維護者電子郵件",
              "format": "email"
            }
          }
        },
        "tags": {
          "type": "array",
          "items": {
            "type": "string"
          },
          "minItems": 1
        },
        "iconUrl": {
          "type": "string",
          "format": "uri"
        },
        "documentation": {
          "type": "string",
          "format": "uri"
        }
      }
    },
    "runtime": {
      "type": "object",
      "description": "執行環境設定",
      "required": ["baseImage", "command", "args", "envs", "alwaysAllow", "disabled"],
      "properties": {
        "baseImage": {
          "type": "object",
          "required": ["repository", "tag", "registry"],
          "properties": {
            "repository": {
              "type": "string"
            },
            "tag": {
              "type": "string"
            },
            "registry": {
              "type": "string"
            }
          }
        },
        "command": {
          "type": "string"
        },
        "args": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "envs": {
          "type": "object",
          "additionalProperties": {
            "type": "string"
          }
        },
        "alwaysAllow": {
          "type": "boolean"
        },
        "disabled": {
          "type": "boolean"
        },
      }
    },
    "installConfig": {
      "type": "object",
      "description": "安裝配置",
      "minProperties": 1,
      "additionalProperties": {
        "type": "object",
        "required": ["type", "label", "description"],
        "properties": {
          "type": {
            "type": "string"
          },
          "label": {
            "type": "string"
          },
          "description": {
            "type": "string"
          },
          "validation": {
            "type": "object",
            "properties": {
              "pattern": {
                "type": "string"
              },
              "message": {
                "type": "string"
              },
              "min": {
                "type": "number"
              },
              "max": {
                "type": "number"
              }
            }
          },
          "default": {},
          "required": {
            "type": "boolean"
          }
        }
      }
    }
  }
}
```

## 範例

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
  "runtime": {
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
    "disabled": false
  },
  "installConfig": {
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
  }
}
```

## 說明

此規格使用 JSON Schema 格式定義，主要包含以下必填的頂層屬性：

1. marketplace
- 市集顯示資訊
- 包含名稱、描述、版本等基本資訊
- 所有子屬性皆為必填

2. runtime
- 執行環境設定
- 指定基礎映像檔和啟動命令等

3. installConfig
- 安裝配置
- 每個配置項目可以設定是否必填
