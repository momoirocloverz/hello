<template>
  <div>
    <breadcrumb-group :breadGroup="[{label:'消息中心',to:''}]" />
    <el-tabs v-model="activeTab">
      <el-tab-pane v-for="(tab, i) in tabs"
                   :key="i"
                   :label="tab.label"
                   :name="tab.name"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component :is="tabIsComponent"
                 @changeTab="changeTab" />
    </keep-alive>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import sysMsg from "./components/sysMsg.vue";
import rArticles from "./components/articles.vue";
@Component({
  components: {
    sysMsg,
    rArticles
  }
})
export default class App extends Vue {
  activeTab: string = "sysMsg";
  tabs: any = [
    {
      label: "系统提醒",
      name: "sysMsg"
    },
    {
      label: "内部资讯",
      name: "rArticles"
    }
  ];
  get tabIsComponent() {
    return this.activeTab;
  }
  changeTab() {
    this.activeTab = "rArticles";
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  .flex_left {
    .el-form--inline {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
    .el-form-item {
      height: 40px;
      margin-bottom: 10px;
    }
  }
  .shadow_line {
    background: #f8f8f8;
  }
}
</style>
