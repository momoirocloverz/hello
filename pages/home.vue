<template>
  <div v-loading.fullscreen="loging" element-loading-text="拼命加载中"></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";
import { getMenuAside } from "@/mock";
import { roleInfoSetting, filterUser } from "@/utils/userSetting";

@Component
export default class App extends Vue {
  @State(state => state.menu.aside) _aside: any;
  private path: string = "";
  get loging(): boolean {
    if (this._aside && this._aside.length > 0) {
      this.getPath(this._aside);
    }
    return this._aside === null ? false : true;
  }

  private getPath(arr: any) {
    for (let item of arr) {
      if (!this.path) {
        if (item.path) {
          this.path = item.path;
          break;
        } else if (!item.path && item.children.length > 0) {
          this.getPath(item.children);
        }
      }
    }
    this.$router.push({ path: this.path });
  }

  private created() {
    let _hasToken = roleInfoSetting.hasToken(filterUser().key);
    if (_hasToken && this._aside && this._aside.length <= 0) {
      getMenuAside();
    }
  }
}
</script>
<style lang="scss" scoped></style>
