<template>
  <div id="app">
    <!-- <span>国际化翻译eg: -> {{$t("common.btn")}}</span> -->
    <ra-container v-if="$route.meta.withMenu" />
    <router-view v-else />
  </div>
</template>
<script lang="ts">
import { Prop, PropSync, Watch } from "vue-property-decorator";
import Component, { mixins } from "vue-class-component";
import { languageMixin } from "@/mixins/language.mixin";
import { State, Mutation } from "vuex-class";
import { getMenuAside } from "@/mock";
import { roleInfoSetting, filterUser } from "@/utils/userSetting";

@Component
export default class HelloWorld extends mixins(languageMixin) {
  @Prop({ default: "1212" }) readonly msg!: string | number;
  @State(state => state.user.info) userInfo!: object;
  @PropSync("name", { type: String, default: "2323" }) _name!: string;
  @Mutation("menu/loadMenu") loadMenu: (menuData: any) => void;
  @State(state => state.menu.aside) _aside: any;

  @Watch("$route")
  routeChanged(val: any) {
    if (!val.path.includes("Login")) {
      let _hasToken = roleInfoSetting.hasToken(filterUser().key);
      if (_hasToken && this._aside && this._aside.length <= 0) {
        getMenuAside();
      }
    }
  }
  private created() {
    (<any>window).geely_app_version = process.env.VUE_APP_VERSION
    console.log("version =>", process.env.VUE_APP_VERSION);
    // this.setLocaleLanguage(); /** 国际化 */
  }
}
</script>

<style lang="scss">
@import "@/assets/style/index.scss";
</style>
