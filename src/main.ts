import dayjs from 'dayjs';
import {createApp} from 'vue';
import {initPlcAuth} from './api';
import App from './App.vue';
import router from './router';
// css
import '@unocss/reset/normalize.css';
import 'uno.css';
import './styles/basic.scss';
// svg-icons
import 'virtual:svg-icons-register';
// dayjs汉化
import 'dayjs/locale/zh-cn';

dayjs.locale('zh-cn');

const app = createApp(App);
app.use(router);

// 先与 PLC 建立认证会话，再挂载 App
initPlcAuth()
  .then(() => {
    app.mount('#app');
  })
  .catch((err) => {
    console.error('[PLC] 初始化登录失败，请检查网络或配置:', err);
    // 即使登录失败也挂载 App，避免白屏（可按需改为显示错误页）
    app.mount('#app');
  });
