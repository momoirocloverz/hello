<template>
  <div>
    <goodsDetailHighlight :highlightListForSubmit.sync="highlightListForSubmit">
      <div slot="header" />
      <div slot="footer" />
    </goodsDetailHighlight>
  </div>
</template>

<script lang='ts'>
import GoodsDetailMixin from "../mixin/goods-detail.mixin";
import { Component, Vue, PropSync, Ref } from 'vue-property-decorator';
import { getModelBase, dealerModelBase, modifyModelBase, isRepeatModelName } from "@/api";
import goodsDetailHighlight from "./detail-highlight.vue";
import { mixins } from "vue-class-component";
const BigNumber = require('bignumber.js');

@Component({
  inheritAttrs: false,
  components: { goodsDetailHighlight }
})
export default class GoodsBasisView extends mixins(GoodsDetailMixin) {
  @PropSync('basisForm', {
    type: Object, default: () => {
      return {}
    }
  }) _basisForm: any;
  @PropSync('modelData', { type: Object }) _modelData: any;
  basisModelName: string = '';
  highlightListForSubmit: any[] = [];

  async getModelBase() {
    if (this.operationType === 'add') return;
    try {
      const modelCode = this.modelCode;
      let fn = this.sysPlat === 'agent' ? dealerModelBase : getModelBase
      const { data } = await fn(modelCode);
      this._modelData = data;
      this.basisModelName = data.name
      this._basisForm = {
        logo: data.logo,
        name: data.name,
        guidePrice: Number(BigNumber(data.guidePrice).dividedBy(10000)),
        listingDate: data.listingDate,
        introduction: data.introduction,
      }
    } catch (e) {
      this.log(e)
    }
  };
  created() {
    this.getModelBase();
  };
}
</script>