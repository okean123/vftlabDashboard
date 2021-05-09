import Vue from 'vue'
import App from './App.vue'
import LoadScript from "vue-plugin-load-script";
Vue.use(LoadScript);

Vue.config.productionTip = false

Vue.loadScript("https://unpkg.com/axios/dist/axios.min.js")
    .then(() => {
        Vue.loadScript("https://cdn.jsdelivr.net/npm/sscjs@latest/dist/ssc.min.js").then(function () {
            window.App = new Vue({
                render: h => h(App),
            }).$mount('#app')
        })
    })






