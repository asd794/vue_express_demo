// import jQuery from 'jquery';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle'
// import './assets/main.css'
import './assets/all.scss'; 

import axios from 'axios';
import VueAxios from 'vue-axios';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// import VueCookies from 'vue-cookie'

import App from './App.vue'
import store from './stores/index';


import router from './router'
// import onNavbar from './components/navbar/onNavbar.vue'
// import offNavbar from './components/navbar/offNavbar.vue'


const app = createApp(App)


// 配置 axios，使其在跨域請求中攜帶 cookie
axios.defaults.withCredentials = true;
axios.defaults.baseURL = 'http://localhost:3000'; // 根據您的後端 URL 配置


// app.use(VueCookies)
// app.config.globalProperties.$cookie = VueCookies

// axios.defaults.withCredentials=true
// axios套件必須使用vue3版本。使用插件方式運用
app.use(VueAxios, axios)


app.use(router)

app.use(store);

app.mount('#app')
 