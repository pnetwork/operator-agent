# 安裝依賴
install:
	npm install

# 構建配置文件和網頁
build:
	npm run build

# 啟動本地開發伺服器
serve:
	npm run serve

# 一鍵開發（構建並啟動伺服器）
dev:
	npm run dev

# 列出所有可用的配置文件
list-configs:
	@ls -l mcp-servers/*.config

# 查看整合後的 JSON 配置
show-json:
	@cat public/configs.json | json_pp

# 清理生成的文件
clean:
	rm -rf public/

# 檢查配置文件的格式和結構
lint:
	npm run lint

# 幫助信息
help:
	@echo "可用的命令："
	@echo "  make install      - 安裝專案依賴"
	@echo "  make build       - 構建配置文件和網頁"
	@echo "  make serve       - 啟動本地開發伺服器"
	@echo "  make dev         - 一鍵開發（構建並啟動伺服器）"
	@echo "  make list-configs - 列出所有可用的配置文件"
	@echo "  make show-json   - 查看整合後的 JSON 配置"
	@echo "  make lint        - 檢查配置文件的格式和結構"
	@echo "  make clean       - 清理生成的文件"
	@echo "  make help        - 顯示此幫助信息"

.PHONY: install build serve dev list-configs show-json clean help lint
