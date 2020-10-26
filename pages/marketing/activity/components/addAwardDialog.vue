<!--添加奖品弹框-->
<template>
  <el-dialog
    class="award-dialog"
    :title="dialogObj.title"
    :visible.sync="dialogObj.show"
    width="60%"
    :before-close="handleClose"
    append-to-body
  >
    <el-tabs v-if="activeType === 'lottery'">
      <el-tab-pane label="优惠券" v-if="sysPlat === 'agent'">
        <search-table
          :tableColumns="constant.COUPON_COLUMNS"
          :searchConfig="constant.COUPON_SEARCH_CONFIG"
          :searchParams="couponSearchParams"
          url="campaign/coupon"
        ></search-table>
      </el-tab-pane>
      <el-tab-pane label="实物奖品">
        <search-table
          :tableColumns="constant.ENTITY_AWARD"
          :searchConfig="constant.ENTITY_SEARCH_CONFIG"
          :searchParams="entityParams"
          url="campaign/prize"
        ></search-table>
      </el-tab-pane>
      <el-tab-pane label="再来一次">
        <search-table :data="noAward" :tableColumns="constant.NO_AWARD"></search-table>
      </el-tab-pane>
    </el-tabs>
    <search-table
      :tableColumns="constant.ENTITY_AWARD"
      :searchConfig="constant.ENTITY_SEARCH_CONFIG"
      :searchParams="entityParams"
      url="campaign/prize"
      v-if="activeType === 'site'"
    ></search-table>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import SearchTable from "@/components/search-table/index.vue";
import { DialogInfo } from "@/@types/activity";
import Const from "../const/index";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";
@Component({
  name: "addAwardDialog",
  components: { SearchTable }
})
export default class extends mixins(ActivityMixin) {
  @Prop({ default: null }) private campaignEndAt: any;
  @Prop({ default: false }) private dialogObj: DialogInfo;
  noAward: Array<{}> = [
    {
      prizeId: -2,
      id: -2,
      type: 2,
      name: "再来一次",
      numValid: true,
      quantity: 1,
      posterUrl: require("@/assets/images/activity/again.png")
    }
  ];

  // 实物筛选参数
  get entityParams() {
    let _obj: any = {
      enabled: true
    };
    if (this.isFactory && this.isHosted) {
      if (this.activeType === "lottery") {
        _obj.subType = 2;
      } else if (this.activeType === "site") {
        _obj.subType = 4;
      }
    }
    return _obj;
  }
  get couponSearchParams() {
    return {
      campaignEndAt: this.campaignEndAt,
      expireStatus: "ALLOW",
      enabled: true,
      releaseChannel: 0
    };
  }
  private get config() {
    return new Const(this);
  }
  private get constant(): any {
    return this.config.const;
  }

  /**
   * 选取
   * @param row
   */
  private checkedAward(row: any) {
    this.$emit("checkedAward", row);
    this.handleClose();
  }

  /**
   * 关闭
   */
  private handleClose(): void {
    this.dialogObj.show = false;
  }
  created() {}
}
</script>

<style scoped lang="scss">
.poster {
  width: 100px;
  height: 100px;
}
</style>
