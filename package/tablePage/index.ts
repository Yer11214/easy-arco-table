import type { App } from 'vue'
import TablePage from './index.vue'

// 使用install方法，在app.use挂载
TablePage.install = (app: App) => {
  app.component('easyArcoTable', TablePage)
}

export default TablePage
