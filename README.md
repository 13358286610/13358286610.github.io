# 林茂将的学术主页

一个无需安装依赖的静态学术主页，适合直接部署到 GitHub Pages。页面参考了常见的 Academic Pages 布局：顶部导航、左侧个人资料和首页介绍卡片。页面代码与内容为独立实现。

## 修改内容

打开 `content.js`，填写姓名、学校、邮箱、研究方向，以及论文、项目、成果、团队和动态。没有资料的栏目可以留作空数组，页面会显示“内容整理中”。

头像可保存为 `assets/profile.jpg`，再将 `content.js` 中的 `photo` 改为 `"assets/profile.jpg"`。未提供照片时显示姓名首字母。

## 在 GitHub Pages 发布

1. 在 GitHub 新建公开仓库，名称必须是 `你的用户名.github.io`，例如 `13358286610.github.io`。
2. 将本目录里的 `index.html`、`styles.css`、`script.js`、`content.js`、`.nojekyll` 和 `assets/` 上传到仓库根目录。
3. 在仓库 **Settings → Pages** 中，将 **Source** 设置为 **Deploy from a branch**，选择 `main` 和 `/ (root)`，保存。
4. 等待发布，然后访问 `https://你的用户名.github.io/`。

此站点没有构建步骤，直接打开 `index.html` 也能预览。修改 `content.js` 后提交到 GitHub，网站会自动更新。
