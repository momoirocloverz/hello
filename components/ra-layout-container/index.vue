<template>
  <div class="layout-header-aside-group">
    <div class="layout-header-aside-content">
      <div class="theme-header">
        <div class="logo-group"
             :class="{'collapse':isCollapse}">
          <img src="/imgs/logo.png"
               class="logo"
               :class="{'small_logo':isCollapse}" />
        </div>
        <div class="header-right">
          <div>
            <i @click="setCollapse"
               class="icon_coll el-link el-link--info"
               :class="{'el-icon-s-fold':!isCollapse,'el-icon-s-unfold':isCollapse}"></i>
            <b class="header-title">吉利{{title}}营销管理平台</b>
          </div>
          <header-user />
        </div>
      </div>
      <div class="theme-container"
           :class="{'expand_double_por':!isCollapse}">
        <div v-if="!_aside">
          <permissions></permissions>
        </div>
        <div v-loading.fullscreen="loging"
             class="loading"
             element-loading-text="拼命加载中"
             v-if="_aside && _aside.length === 0"></div>
        <div ref="aside"
             class="theme-container-aside"
             :class="!isCollapse?'asideWidth':'asideWidthCollapse'"
             v-if="_aside && _aside.length > 0">
          <menu-side :isCollapse.sync="isCollapse"
                     :subMenuIsOpen.sync="subMenuIsOpen" />
        </div>
        <!-- id=theme-container-main 基于这个scroll -->
        <div class="theme-container-main"
             id="theme-container-main"
             :class="{'small_inner':smallInner}"
             v-if="_aside && _aside.length > 0">
          <transition name="el-zoom-in-center">
            <div class="theme-container-main-layer">
              <div class="theme-container-main-body">
                <!-- routers -->
                <router-view />
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import "element-ui/lib/theme-chalk/base.css";
import MenuSide from "./menu-side/index.vue";
import HeaderUser from "./header-user/index.vue";
import { Component, Vue, Watch } from "vue-property-decorator";
import Watermark from "@/plugins/watermark.ts";
import { State } from "vuex-class";
import { userRoleConfig } from "@/const";
import { filterUser } from "@/utils/userSetting";
import Permissions from "./components/permissions.vue";

const deepFind = (menu: any, path: string) => {
  let res: any = {}
  const go = (menu: any) => {
    if (!menu) return
    for (let x = 0; x < menu.length; x++) {
      let item = menu[x]
      if (item.path === path) {
        res = item;
        break;
      } else if (
        item.path !== path
        && item.children
        && item.children.length > 0
      ) {
        go(item.children);
      }
    }
  }
  go(menu)
  return res
}
@Component({
  name: "layout-header-aside",
  components: {
    MenuSide,
    HeaderUser,
    Permissions
  }
})
export default class HeaderAside extends Vue {
  @State(state => state.user.info) _userInfo: any;
  @State(state => state.menu.aside) _aside: any;
  private msgCount: number = 0;
  private timer: number = 0;
  private unread_count: number = 60;
  private isCollapse: boolean = localStorage.isCollapse === "true";
  private subMenuIsOpen: boolean = false;
  get smallInner() {
    return !this.isCollapse && this.subMenuIsOpen;
  }
  get title(): string {
    return filterUser().label;
  }
  get loging(): boolean {
    return this._aside === null ? false : true;
  }
  @Watch("_userInfo")
  onChangeUserInfo() {
    this.waterMark();
  }
  @Watch("$route")
  @Watch("_aside")
  onRouteChange() {
    if (this._aside) {
      const item = deepFind(this._aside, this.$route.path)
      if (item.parentId) {
        this.isCollapse = false;
        this.subMenuIsOpen = true;
      }
    }
  }

  private setCollapse() {
    this.isCollapse = !this.isCollapse;
    localStorage.setItem("isCollapse", String(this.isCollapse));
  }
  private waterMark() {
    if (this._userInfo.info && this._userInfo.info.account && this._userInfo.info.name) {
      Watermark.set(`${this._userInfo.info.name}@${this._userInfo.info.account}`);
    }
  }
  private created() {
    this.waterMark();
  }
}
</script>

<style lang="scss" scoped>
.small_inner {
  margin-left: 130px;
}
.asideWidthCollapse {
  width: 65px;
}
.icon_coll {
  font-size: 20px;
  margin-left: 20px;
  cursor: pointer;
}
.header-right {
  width: calc(100% - 150px);
  padding-right: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.header-title {
  font-size: 19px;
  margin-left: 15px;
  vertical-align: middle;
}
.wait_box {
  margin-right: 10px;
}
.logo {
  width: 90px;
}
.logo-group {
  width: 120px;
  height: 100%;
  background: #127dd7;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    margin-right: 5px;
  }
}
.collapse {
  width: 65px;
}
.zone {
  font-size: 20px;
}
</style>
