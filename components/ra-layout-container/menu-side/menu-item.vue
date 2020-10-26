<template>
  <el-menu-item :index="menuIndex"
                :class="{'is-actived':isCurrentRoute}"
                @click.native.stop="setLSPath">
    <div class="line-right">
      <i v-if="menu.icon"
         :class="menu.icon"></i>
      <!-- <i v-if="menu.icon === undefined & !menu.iconSvg"
       class="el-icon-document" /> -->
      <span slot="title">{{menu.title || '未命名菜单'}}</span>
    </div>
  </el-menu-item>
</template>

<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";
import uniqueId from "./const/uniqueId";
@Component({
  name: "layout-header-aside-menu-item"
})
export default class MenuItem extends Vue {
  @State(state => state.menu.indexPath) indexPath: string[];
  @Prop({ type: Object, required: false, default: () => { } }) menu: any;
  get menuIndex() {
    return this.menu.path || uniqueId(this.menu)
  }
  get isCurrentRoute() {
    const { path } = this.$route
    return path === this.menu.path
  }
  @Mutation("setIndexList", { namespace: "menu" }) setIndexList: any;
  setLSPath() {
    if (this.indexPath.length > 0) {
      const menuIndexPath = this.indexPath;
      const { sysPlat } = this.$route.query
      this.setIndexList({ menuIndexPath, sysPlat });
    }
  }
}
</script>
