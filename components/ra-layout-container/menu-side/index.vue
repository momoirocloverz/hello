<template>
  <div class="layout-header-aside-menu-side expand_double">
    <el-menu ref="menu"
             class="expand_double"
             :unique-opened="true"
             :default-active="activeMenu"
             :collapse="isCollapse"
             :default-openeds="_indexOfOpenMenu"
             @open="openSubMenu"
             @close="asideClose"
             router>
      <template v-for="(menu, menuIndex) in aside">
        <layout-main-menu-item v-if="menu.children === null || menu.children === undefined"
                               :menu="menu"
                               :key="menuIndex"
                               @click.native.stop="closeSubMenu" />
        <layout-main-menu-sub v-else
                              :menu="menu"
                              :key="menuIndex" />
      </template>
    </el-menu>
    <div v-if="aside && aside.length === 0 "
         class="layout-header-aside-menu-empty"
         flex="dir:top main:center cross:center">
      <span>加载中</span>
    </div>
  </div>
</template>

<script lang="ts">
import LayoutMainMenuItem from "./menu-item.vue";
import LayoutMainMenuSub from "./menu-sub.vue";
import { State, Mutation } from "vuex-class";
import { Component, Vue, Watch, PropSync, Prop } from "vue-property-decorator";
import uniqueId from "./const/uniqueId";

@Component({
  name: "layout-header-aside-menu",
  components: {
    LayoutMainMenuItem,
    LayoutMainMenuSub
  }
})
export default class MenuAside extends Vue {
  asideHeight: number = 300;
  indexOfOpenMenu: string[] = [];
  get _indexOfOpenMenu(): string[] {
    return this.isCollapse ? [] : this.indexOfOpenMenu;
  }
  openMenuOnPage: string[] = [];
  // 不在 aside 里面
  breakWatchList: string[] = ["/msgCenter/index"];
  // 菜单数据
  @State(state => state.menu.aside) aside: any;
  @State(state => state.menu.indexPath) indexPath: string[];
  @Mutation("setIndexList", { namespace: "menu" }) setIndexList: any;
  @Mutation("clearIndexList", { namespace: "menu" }) clearIndexList: any;
  @PropSync("subMenuIsOpen", { type: Boolean }) _subMenuIsOpen: boolean;
  @Prop({ type: Boolean, default: false }) isCollapse: boolean;
  @Watch("$route")
  routeChange(newVal: any, oldVal: any) {
    const { path, meta } = newVal;
    if (oldVal && path === oldVal.path) return;
    if (meta.ignoreCollapseMenu) return;
    if (this.breakWatchList.includes(path)) {
      return this.closeSubMenu();
    }
    this._subMenuIsOpen = !this.openIsFirstLevel(this.activeMenu);
  }
  get activeMenu(): string {
    const { path, meta } = this.$route;
    return meta.ignoreCollapseMenu ? "" : path;
  }

  openIsFirstLevel(target: string) {
    return this.aside.some((e: any) => e.path === target);
  }

  openSubMenu(key: string, indexPath: string[]) {
    if (indexPath.indexOf(key) > 0) return;
    this.setDefaultIndex();
  }
  asideClose(key: string, indexPath: string[]) {
    if (key === indexPath[0]) {
      this.$nextTick(() => {
        this._subMenuIsOpen = false;
        this.clearIndexList(this.$route.query.sysPlat);
      });
    }
  }
  closeSubMenu() {
    this._subMenuIsOpen = false;
    this.clearIndexList(this.$route.query.sysPlat);
    this.indexOfOpenMenu = [];
  }
  setDefaultIndex() {
    let sp = this.$route.query.sysPlat;
    let t = localStorage[`${sp}-storeIndexPath`];
    if (t) {
      let arr = t.split(",");
      this._subMenuIsOpen = true;
      this.indexOfOpenMenu = arr;
    }
  }
  created() {
    this.setDefaultIndex();
  }
}
</script>
<style lang="scss" scoped>
.el-menu {
  border-right: 0;
}
</style>
