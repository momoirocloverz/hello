<template>
  <div class="kkk">
    <el-submenu :index="menuIndex"
                @click.native.stop="jumpMenu($event,menu)">
      <template slot="title">
        <i v-if="menu.icon"
           :class="menu.icon" />
        <!-- <i v-if="menu.icon === undefined & !menu.iconSvg"
         class="fa fa-folder-o" /> -->
        <span slot="title">{{menu.title}}</span>
      </template>
      <template v-for="(child, childIndex) in menu.children">
        <layout-main-menu-item v-if="child.children === null || child.children === undefined"
                               :menu="child"
                               :key="childIndex" />
        <!-- 自引用组件 -->
        <layout-header-aside-menu-sub v-else
                                      :menu="child"
                                      :key="childIndex" />
      </template>
    </el-submenu>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import { Mutation, State } from "vuex-class";
import uniqueId from "./const/uniqueId";
// 组件
import layoutMainMenuItem from "./menu-item.vue";
let path = "";
let indexList: string[] = [];
let lsIndexList: string[] = [];
const deep = (menu: any) => {
  if (menu.children && menu.children.length > 0) {
    indexList.push(uniqueId(menu));
    deep(menu.children[0]);
  } else {
    path = menu.path;
    return;
  }
};

@Component({
  name: "layout-header-aside-menu-sub",
  components: {
    layoutMainMenuItem
  }
})
export default class MenuSub extends Vue {
  @Prop({ type: Object, required: false, default: () => {} }) menu: any;
  get menuIndex() {
    return this.menu.path || uniqueId(this.menu);
  }
  @State(state => state.menu.indexPath) indexPath: string[];
  @State(state => state.menu.aside) aside: any;

  @Mutation("setIndexList", { namespace: "menu" }) setIndexList: any;
  /**
   * menu穿透跳转
   */
  jumpMenu(ev: any, menu: any) {
    if (ev.target.className.indexOf("el-menu--inline") > -1) {
      return;
    }
    const { sysPlat } = this.$route.query;
    path = "";
    indexList = [];
    lsIndexList = [];
    deep(menu);

    if (menu.parentId) {
      let item: any = null;
      let lsp = localStorage[`${sysPlat}-storeIndexPath`];
      for (let x of this.aside) {
        if (JSON.stringify(x).indexOf(menu.title) > -1) {
          item = x;
          break;
        }
      }
      if (lsp.includes(uniqueId(item))) {
        lsIndexList = lsp.split(",");
        indexList = [lsIndexList[0], ...indexList].filter(e => e);
      }
    }

    this.setIndexList({ menuIndexPath: indexList, sysPlat });

    if (this.$route.path === path) return;
    this.$router.push({ path });
  }
}
</script>