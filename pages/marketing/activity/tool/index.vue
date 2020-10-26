<!--抽奖工具-->
<template>
  <div class="tool-wrap">
    <breadcrumb-group :breadGroup="breadGroup" />
    <div class="tool-category" v-for="(tool, idx) in toolList" :key="idx">
      <p class="title">{{ tool.title }}</p>
      <el-row class="tool-content" :gutter="20">
        <el-col class="tool-item" :sm="12" :lg="8" :xl="6" v-for="(item, idx) in tool.children" :key="idx">
          <div><tool-card-item :parent="tool" :toolItem="item"></tool-card-item></div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ToolCardItem from "./components/ToolCardItem.vue";
import { TOOL_LIST } from "@/mock/marketing";
@Component({
  name: "",
  components: {
    ToolCardItem
  }
})
export default class extends Vue {
  name: "index";
  private toolList = TOOL_LIST;
  get breadGroup() {
    return [{ label: "营销工具" }];
  }
  private clickItem(tool: any, item: any) {
    let _path: string = "";
    switch (tool.id) {
      case 1:
        _path = "/marketing/activity/lottery/add";
        break;
      case 2:
        _path = "/marketing/activity/lottery/add";
        break;
      case 3:
        _path = "/marketing/activity/site/add";
        break;
    }
    this.$router.push({
      path: _path,
      query: {
        tool: item.id
      }
    });
  }
}
</script>

<style scoped lang="scss">
.tool-wrap {
  .tool-category {
    .title {
      color: #091017;
      font-size: 16px;
      font-weight: 600;
    }
    .tool-content {
      background: #fff;
      padding: 30px 20px;
    }
  }
}
</style>
