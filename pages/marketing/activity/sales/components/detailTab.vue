<template>
  <div class="common_active-detail sales-active-detail">
    <div class="mb-15">
      <strong>活动设置</strong>
      <common-form :form="detailInfo" :props="constant.DETAIL_ACTIVE_PROP">
        <img class="active-img" alt="活动图片" :src="detailInfo.campaignImageUrl" slot="campaignImageUrl" />
      </common-form>
    </div>
    <div class="mb-15">
      <strong>团购商品</strong>
      <groupGoods
        class="mt-15"
        :data="detailInfo.reletedGoods"
        :form="detailInfo"
        usedFrom="detail"
        activeType="sales"
      ></groupGoods>
    </div>
    <div class="mb-15">
      <strong>分享设置</strong>
      <common-form :form="detailInfo.shareSetting || {}" :props="commonConst.DETAIL_SHARE_PROPS">
        <img
          class="share-img"
          :src="detailInfo.shareSetting && detailInfo.shareSetting.image"
          alt="分享图片"
          slot="image"
        />
      </common-form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref } from "vue-property-decorator";
import commonForm from "@/components/common-form/index.vue";
import commonTable from "@/components/common-table/index.vue";
import Const from "../const/index";
import * as commonConst from "../../const/common";
import groupGoods from "../../components/groupGoods.vue";
import { getSaleDetail } from "@/api/";
import { mixins } from "vue-class-component";
import ActivityMixin from "../../mixin/activity.mixin";
@Component({
  name: "detailTab",
  components: {
    commonForm,
    commonTable,
    groupGoods
  }
})
export default class AdviserDetail extends mixins(ActivityMixin) {
  readonly commonConst: any = commonConst;
  readonly config: any = new Const(this);
  readonly constant: any = this.config.const;
  detailInfo: any = {};
  async loadDetail() {
    let res = await getSaleDetail(
      {
        releaseId: this.releaseId,
        campaignId: this.activeId
      },
      this.sysPlat
    );
    this.detailInfo = res.data;
  }
  created() {
    this.loadDetail();
  }
}
</script>
<style lang="scss" scoped></style>
