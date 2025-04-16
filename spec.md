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
    "source": {
      "type": "object",
      "description": "程式碼來源設定",
      "required": ["repository", "build", "registry"],
      "properties": {
        "repository": {
          "type": "object",
          "required": ["type", "url", "branch", "tag", "auth"],
          "properties": {
            "type": {
              "type": "string",
              "enum": ["git"]
            },
            "url": {
              "type": "string",
              "format": "uri"
            },
            "branch": {
              "type": "string"
            },
            "tag": {
              "type": "string"
            },
            "auth": {
              "type": "object",
              "required": ["type"],
              "properties": {
                "type": {
                  "type": "string",
                  "enum": ["ssh", "token"]
                },
                "sshKeySecret": {
                  "type": "string"
                }
              }
            }
          }
        },
        "build": {
          "type": "object",
          "required": ["context", "dockerfile"],
          "properties": {
            "context": {
              "type": "string"
            },
            "dockerfile": {
              "type": "string"
            },
            "args": {
              "type": "object",
              "additionalProperties": {
                "type": "string"
              }
            }
          }
        },
        "registry": {
          "type": "object",
          "required": ["url", "auth"],
          "properties": {
            "url": {
              "type": "string"
            },
            "auth": {
              "type": "object",
              "required": ["type", "secretName"],
              "properties": {
                "type": {
                  "type": "string",
                  "enum": ["token"]
                },
                "secretName": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "runtime": {
      "type": "object",
      "description": "執行環境設定",
      "required": ["language", "baseImage", "command", "args", "envs", "alwaysAllow", "disabled"],
      "properties": {
        "language": {
          "type": "object",
          "required": ["name", "version"],
          "properties": {
            "name": {
              "type": "string"
            },
            "version": {
              "type": "string"
            }
          }
        },
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
        "dependencies": {
          "type": "object",
          "properties": {
            "language-specific": {
              "type": "object",
              "additionalProperties": {
                "type": "string"
              }
            },
            "system": {
              "type": "object",
              "properties": {
                "memory": {
                  "type": "string"
                },
                "cpu": {
                  "type": "string"
                }
              }
            }
          }
        }
      }
    },
    "installConfig": {
      "type": "object",
      "description": "安裝配置",
      "required": ["required"],
      "properties": {
        "required": {
          "type": "object",
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
                  }
                }
              }
            }
          }
        },
        "advanced": {
          "type": "object",
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
              "default": {},
              "validation": {
                "type": "object",
                "properties": {
                  "min": {
                    "type": "number"
                  },
                  "max": {
                    "type": "number"
                  }
                }
              },
              "required": {
                "type": "boolean"
              }
            }
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
    "disabled": false
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

2. source
- 程式碼來源設定
- 定義程式碼儲存庫位置、認證方式和建置設定
- repository、build、registry 皆為必填

3. runtime
- 執行環境設定
- 指定程式語言、基礎映像檔和啟動命令等
- dependencies 為選填

4. installConfig
- 安裝配置
- required 為必填
- advanced 為選填

另有一個選填的頂層屬性：
