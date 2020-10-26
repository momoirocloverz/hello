<template>
  <div class="no_mm">
    <el-form-item label="车系：">{{maxRuleInPage.seriesName}}</el-form-item>
    <el-form-item label="车型：">
      {{maxRuleInPage.modelName}}
      <span v-if="maxRuleInPage.dealerModelStatus===1"
            class="dfspan">（<i class="dot dot5" /> 已下架）</span>
      <span v-else
            class="dfspan">（<i class="dot dot2" /> 已上架）</span>
    </el-form-item>
    <el-form-item label="厂家指导价：">
      {{maxRuleInPage.guidePrice? BigNumber(maxRuleInPage.guidePrice).dividedBy(10000) : '-'}} 万元
    </el-form-item>

    <template v-if="dialogType<3">
      <el-form-item prop="unitPrice"
                    class="min_input"
                    label="优惠报价：">
        <el-input v-model="_modelForm.unitPrice"
                  v-formatNum:2="_modelForm.unitPrice"
                  clearable /> 万元
      </el-form-item>
      <el-form-item label="初始预约人数："
                    class="min_input"
                    v-show="dialogType!==2"
                    prop="initialReservationCount">
        <el-input v-model="_modelForm.initialReservationCount"
                  v-formatNum:0="_modelForm.initialReservationCount"
                  clearable /> 人已预约
        <div class="sma_tip">用户端预约试驾-选择车系，初始预约人数显示</div>
      </el-form-item>
    </template>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, PropSync, Vue } from 'vue-property-decorator';
const BigNumber = require('bignumber.js');

@Component({
  inheritAttrs: false,
})
export default class MaxRulePage extends Vue {
  readonly BigNumber = BigNumber;
  @Prop({ type: Object }) maxRuleInPage: any;
  @Prop({ type: Function }) isRelease: Function;

  @Prop({ type: Number }) dialogType: number;
  @PropSync("modelForm", { type: Object }) _modelForm: any;
  noSpaceStart(txt: string) {
    this._modelForm.reason = txt.replace(/^\s*/, '')
  }
}
</script>
<style lang='scss' scoped>
.reason {
  /deep/ {
    .el-input__inner {
      padding-right: 60px;
    }
  }
}
.no_mm {
  // height: 330px;
  // overflow: auto;
  .el-form-item {
    margin-bottom: 0;
  }
  .min_input.el-form-item {
    margin-bottom: 18px;
    .el-input {
      width: 130px;
    }
  }
}
.sma_tip {
  font-size: 12px;
  color: #999;
}
.dfspan {
  display: inline-flex;
  align-items: center;
  .dot {
    width: 6px;
    height: 6px;
  }
}
</style>