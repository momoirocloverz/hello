<template>
  <!-- 退款售后 -->
  <div class="afterSale">
    <breadcrumb-group :breadGroup="[{ label: '退款售后', to: '' }]" />
    <el-tabs v-model="activeTab"
             class="tabs">
      <el-tab-pane label="仅退款"
                   name="0">
        <RefundTable type="0"
                     v-if="activeTab === '0'"></RefundTable>
      </el-tab-pane>
      <el-tab-pane label="退款退货"
                   name="1">
        <RefundTable type="1"
                     v-if="activeTab === '1'"></RefundTable>
      </el-tab-pane>
      <el-tab-pane label="换货"
                   name="2">
        <RefundTable type="2"
                     v-if="activeTab === '2'"></RefundTable>
      </el-tab-pane>
    </el-tabs>

  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import RefundTable from "./components/refundTable.vue";

@Component({
  components: {
    RefundTable
  }
})
export default class AfterSale extends Vue {
  activeTab: string = "18";

  created() {
    let _type: any = this.$route.params.type || "18";
    this.activeTab = _type === "18" ? "0" : _type === "19" ? "1" : "2";
  }
}
</script>
<style lang='scss' scoped>
</style>