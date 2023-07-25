# /bin/bash

# 确保脚本抛出遇到的错误
set -e

 # 读取package.json中的version
version=`jq -r .version package.json`

 # 打包构建
pnpm build

 # 提交代码到github
git add .
git commit -m "update $version"
git push

 # 发布到npm，pnpm(高性能的npm)
pnpm publish

# 升级 依赖版本
pnpm up easy-arco-table@$version

# 提交版本更新代码到github
git add .
git commit -m "update $version"
git push
