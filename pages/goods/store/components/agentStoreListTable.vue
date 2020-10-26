<template>
  <div>
    <el-tabs v-model="activeName"
             @tab-click="handleClick">
      <el-tab-pane label="自建商品"
                   name="2">
        <AgentTabel :apiFn="apiFn"
                    :active="activeName"
                    v-if="activeName === '2'"></AgentTabel>
      </el-tab-pane>
      <el-tab-pane label="主机厂商品"
                   name="0">
        <AgentTabel :apiFn="apiFn"
                    :active="activeName"
                    v-if="activeName === '0'"></AgentTabel>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import AgentTabel from "./agentSearchTabel.vue";
import { product_spus_list_api, product_manufacturer_spus_list_api } from "@/api";

@Component({
  components: {
    AgentTabel
  }
})
export default class AgentStoreListTable extends Vue {
  private activeName: string = "2";
  private apiFn: any = product_spus_list_api;

  private handleClick() {
    this.apiFn = this.activeName === "2" ? product_spus_list_api : product_manufacturer_spus_list_api;
  }
}
</script>
<style lang='scss' scoped>
</style>