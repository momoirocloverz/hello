<template>
  <div>
    <common-dealer-filter @getDealerCode="getDealerCode"
                          @getData="getCustomerData"></common-dealer-filter>
    <div class="tcontent">
      <el-row :gutter="40">
        <el-col :span="leftCol">
          <mallLeftSumary :dateRange="dateRange"
                          :dealerCode="dealerCode"
                          :regionObj="regionObj" />
        </el-col>
        <el-col :span="24 - leftCol">
          <mallRightSumary :dateRange="dateRange"
                           :dealerCode="dealerCode"
                           :regionObj="regionObj" />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import mallLeftSumary from "./mall-left-sumary.vue";
import mallRightSumary from "./mall-right-sumary.vue";
import commonDealerFilter from "./commonDealerFilter.vue";
@Component({
  components: {
    mallRightSumary,
    mallLeftSumary,
    commonDealerFilter
  }
})
export default class MallSnap extends Vue {
  readonly leftCol: number = 7;
  @Prop({ default: () => [] }) dateRange: (string | null)[];
  dealerCode: any = "";
  regionObj: any = {};
  getDealerCode(dealerCode: any) {
    this.dealerCode = dealerCode;
  }
  getCustomerData(obj = {}) {
    this.regionObj = obj;
  }
}
</script>
<style lang="scss" scoped>
.tcontent {
  padding: 0 20px;
}
</style>
