import { createApp } from 'vue'
import router from './router'
import store from './store'
import App from './App.vue'
import { useElementPlus } from "@/plugins/element-plus"; // element-plus
import { useFontAwesome } from "@/plugins/font-awesome";
import SvgIcon from './components/SvgIcon/index.vue'

import '@/style/index.scss';
// 导入字体图标
import "@/assets/icons/iconfont/iconfont.js";
import "@/assets/icons/iconfont/iconfont.css";

const app = createApp(App)

app.component('svg-icon', SvgIcon); // 全局注册svg图标组件
app.use(router)
app.use(store)
app.use(useElementPlus)
app.use(useFontAwesome);
// 全局配置
app.config.globalProperties.$ELEMENT = { size: 'small', zIndex: 3000 }
app.mount('#app')
