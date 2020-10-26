import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "animate.css";
import api from "@/api/restful";

import "./utils/filters";

// import { i18n } from "./locale"; /** 国际化 */
import appMixin from "@/mixins/app.mixin";
// ElementUI 按需引入
import "./plugins/element-ui";
import "./plugins/ra-container";
import "./assets/style/iconfont/iconfont.css";
import "element-ui/lib/theme-chalk/index.css";
import elAdminTable from "@/components/el-admin-table/index.vue";
import '@/directive/index.ts';
import AMap from "vue-amap";
import Component from 'vue-class-component';
import breadcrumbGroup from "@/components/breadcrumb-group"
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
});
Vue.use(AMap)
Vue.component("el-admin-table", elAdminTable);
Vue.component("breadcrumb-group", breadcrumbGroup);

Vue.config.productionTip = false;
Vue.mixin(appMixin);

Vue.prototype.$api = api;
Vue.prototype.$envTitle = process.env.VUE_APP_TITLE;

// Register the router hooks with their names
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate' // for vue-router 2.2+
])

new Vue({
  // i18n, /** 国际化 */
  router,
  store,
  render: h => h(App),
}).$mount("#app");
