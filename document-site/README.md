# Fast-JSON-UI 文档站点

这是 Fast-JSON-UI 库的官方文档站点，使用 VitePress 构建。

## 在线访问

文档站点已部署到 GitHub Pages，您可以通过以下链接访问：

[https://alwayssum.github.io/fast-json-ui/](https://alwayssum.github.io/fast-json-ui/)

## 本地开发

要在本地运行文档站点，请执行以下命令：

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run docs:dev
```

## 构建

要构建文档站点，请执行以下命令：

```bash
npm run docs:build
```

构建后的文件将位于 `docs/.vitepress/dist` 目录中。

## 部署

文档站点使用 GitHub Pages 进行部署。要部署最新的更改，请执行以下命令：

```bash
npm run deploy
```

这将构建文档站点并将其推送到 GitHub 仓库的 `gh-pages` 分支。 