# test-platform-client-dev

## 构建
```npm
npm install --registry=https://registry.npm.taobao.org
```

## 本地运行
```npm
npm run dev --registry=https://registry.npm.taobao.org
```

## WebStrom配置 vue-cli3 webpack别名
File-Settings-Languages & Frameworks-JavaScript-Webpack选项中配置 webpack.config.js文件的绝对路径
```
项目根目录/node_modules/@vue/cli-service/webpack.config.js
```

## 目录结构
```
├── build                      // 构建相关
├── config                     // 配置相关
├── mock                       // 项目mock 模拟数据
├── public                     // 公共相关
│   ├── favicon.ico            // favicon图标
│   └── index.html             // html模板
├── src                        // 源代码
│   ├── api                    // 所有请求
│   ├── assets                 // 主题 字体等静态资源
│   ├── components             // 全局公用组件
│   ├── directive              // 全局指令
│   ├── filtres                // 全局 filter
│   ├── icons                  // 项目所有 svg icons
│   ├── lang                   // 国际化 language
│   ├── router                 // 路由
│   ├── store                  // 全局 store管理
│   ├── styles                 // 全局样式
│   ├── utils                  // 全局公用方法
│   ├── vendor                 // 公用vendor
│   ├── views                  // view
│   ├── App.vue                // 入口页面
│   ├── main.js                // 入口 加载组件 初始化等
│   └── permission.js          // 权限管理
├── static                     // 第三方不打包资源
│   └── Tinymce                // 富文本
├── .babelrc                   // babel-loader 配置
├── .eslintrc.js               // eslint 配置项
├── .gitignore                 // git 忽略项
└── package.json               // package.json

```
