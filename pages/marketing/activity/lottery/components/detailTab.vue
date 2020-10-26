<template>
  <div class="lottery-active-detail">
    <div class="mb-15">
      <strong>活动设置</strong>
      <common-form :form="actDetailInfo" :props="constant.DETAIL_ACTIVE_PROP">
        <img class="active-img" alt="活动图片" :src="actDetailInfo.posterUrl" slot="posterUrl" />
      </common-form>
    </div>
    <div class="mb-15" v-if="actDetailInfo.status > 0">
      <strong>奖项设置</strong>
      <awardsSet class="mt-15" :data="actDetailInfo.prizeSettings" usedFrom="lottery" activeType="lottery"></awardsSet>
    </div>
    <div class="mb-15">
      <strong>分享设置</strong>
      <common-form :form="actDetailInfo.shareSetting || {}" :props="commonConst.DETAIL_SHARE_PROPS">
        <img
          class="share-img"
          :src="actDetailInfo.shareSetting && actDetailInfo.shareSetting.image"
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
import { State, Action } from "vuex-class";
import Const from "../const/index";
import * as commonConst from "../../const/common";
import awardsSet from "../../components/awardsSet.vue";
import { mixins } from "vue-class-component";
import ActivityMixin from "../../mixin/activity.mixin";
@Component({
  name: "lotteryDetail",
  components: {
    commonForm,
    commonTable,
    awardsSet
  }
})
export default class AdviserDetail extends mixins(ActivityMixin) {
  readonly commonConst: any = commonConst;
  readonly config: any = new Const(this);
  readonly constant: any = this.config.const;

  created() {
    this.getActDetailInfo();
  }
}
</script>
<style lang="scss" scoped>
.lottery-active-detail {
  .active-img {
    max-width: 355px;
    max-height: 193px;
  }
  .share-img {
    max-width: 200px;
    max-height: 200px;
  }
}
</style>
