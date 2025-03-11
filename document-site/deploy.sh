#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vitepress/dist

# 创建 .nojekyll 文件，防止 GitHub Pages 使用 Jekyll 处理
touch .nojekyll

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy documentation site'

# 在新初始化的 git 仓库中，默认分支通常是 main 或 master
# 我们需要先创建并切换到该分支
git branch -M main

# 如果发布到 https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:AlwaysSum/fast-json-ui.git main:gh-pages

cd - 