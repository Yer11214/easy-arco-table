import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { createStyleImportPlugin } from "vite-plugin-style-import";
import { resolve } from 'path'

import { existsSync } from "node:fs";
import { join } from "node:path";



// 获取arco样式路径
function getArcoStylePath(name) {
  const names = name.split("-");
  const path = `@arco-design/web-vue/es/${name}/style/css.js`;

  if (existsSync(join(__dirname, "./node_modules/" + path))) {
    return path;
  } else {
    names.pop()
    return getArcoStylePath(names.join("-")) || ""
  }

}





// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createStyleImportPlugin({
      libs: [
        {
          libraryName: "@arco-design/web-vue",
          esModule: true,
          resolveStyle: (name) => {
            return getArcoStylePath(name)
          },
        },
      ],
    }),
  ],
  // 构建为库
  build: {
    lib: {
      // 构建为库。如果指定了 build.lib，build.cssCodeSplit 会默认为 false。
      // __dirname的值是vite.config.ts文件所在目录
      entry: resolve(__dirname, "package/index.ts"), // entry是必需的，因为库不能使用HTML作为入口。
      name: "easy-arco-table", // 暴露的全局变量
      fileName: "easy-arco-table", // 输出的包文件名，默认是package.json的name选项
    },
    rollupOptions: {
      // 自定义底层的Rollup打包配置
      // https://rollupjs.org/configuration-options/
      // 确保外部化处理那些你不想打包进库的依赖
      external: ["vue",'@arco-design/web-vue'],
      output: {
        // format: 'es', // 默认es，可选 'amd' 'cjs' 'es' 'iife' 'umd' 'system'
        exports: "named", // https://rollupjs.org/configuration-options/#output-exports
        //   // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        globals: {
          vue: "Vue",
        },
      },
    },

  },
});
