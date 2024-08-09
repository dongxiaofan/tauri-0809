import { createApp } from "vue";
import App from "./App.vue";
import router from './router';
import store from './store';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import '@/assets/fonts/iconfont.css';
import '@/assets/styles/style.less';
import mixinComponents from './components/mixin/mixin';

// createApp(App).mount("#app");
const app = createApp(App)
app.use(router)
app.use(store)
app.use(Antd)
app.use(mixinComponents)
app.mount('#app')
