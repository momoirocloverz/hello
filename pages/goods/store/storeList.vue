<template>
  <!-- 商品列表 -->
  <div>
    <breadcrumb-group :breadGroup="[{label:'商品列表'}]" />
    <AgentTable v-if="channel === '2'"></AgentTable>
    <FactoryTable v-if="channel === '0'"></FactoryTable>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Ref } from "vue-property-decorator";
import { filterUser } from "@/utils/userSetting";
import AgentTable from "./components/agentStoreListTable.vue";
import FactoryTable from "./components/factoryStoreListTable.vue";

@Component({
  components: { AgentTable, FactoryTable }
})
export default class StoreList extends Vue {
  private channel: any = filterUser().channel;
}
</script>
<style lang='scss' scoped>
</style>
