<!--活动设置-->
<template>
  <common-form
    ref="stepRef"
    :rules="lotteryCon.LOTTERY_RULES"
    :props="lotteryCon.LOTTERY_ACTIVE_PROP"
    :form="lotteryForm"
    :inline="false"
    class="common_active-set-form"
  >
    <!--免费抽奖次数-->
    <el-input slot="freeChanceTimes" v-model="lotteryForm.freeChanceTimes" max="100" min="1">
      <el-select style="width: 120px" v-model="lotteryForm.freeChanceMode" slot="append">
        <el-option
          v-for="num in constant.NUMS_RULES"
          :key="num.value"
          :value="num.value"
          :label="num.label"
        ></el-option>
      </el-select>
    </el-input>

    <!--任务次数限制-->
    <el-input slot="chanceLimit" v-model="lotteryForm.chanceLimit" :max="100" :min="1">
      <el-select style="width: 120px" v-model="lotteryForm.chanceMode" slot="append">
        <el-option
          v-for="num in constant.NUMS_RULES"
          :key="num.value"
          :value="num.value"
          :label="num.label"
        ></el-option>
      </el-select>
    </el-input>
    <!--领取时限-->
    <div slot="prizeValidityPeriod">
      <div class="common_limit-ipt" v-if="isAgent">
        <el-radio-group v-model="lotteryForm.prizeValidityPeriod" @change="changePrize">
          <el-radio v-for="item in constant.LIMIT_RULES" :key="item.value" :value="item.value" :label="item.value">{{
            item.label
          }}</el-radio>
        </el-radio-group>
        <el-form-item :inline="true" prop="dayNum" class="ipt-num"
          ><el-input
            :disabled="lotteryForm.prizeValidityPeriod < 1"
            v-model="lotteryForm.dayNum"
            style="width: 120px;margin:0 5px"
          ></el-input
        ></el-form-item>
        天内领取
      </div>
      <el-radio v-model="lotteryForm.prizeValidityPeriod" :label="0" :value="0" v-else>活动时间内领取</el-radio>
    </div>
  </common-form>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import CommonForm from "@/components/common-form/index.vue";
import { State, Action } from "vuex-class";
import * as constant from "../../const/common";
import { LotteryForm } from "@/@types/activity";
import { mixins } from "vue-class-component";
import ActivityMixin from "../../mixin/activity.mixin";
@Component({
  name: "stepActiveSet",
  components: {
    CommonForm
  }
})
export default class StepActiveSet extends mixins(ActivityMixin) {
  @Prop({ default: () => {} }) private lotteryCon: any;
  @Ref() stepRef: { formRef: HTMLFormElement };
  constant: any = constant;
  changePrize(val: number) {
    if (val === 0) {
      this.lotteryForm.dayNum = null;
    }
  }
}
</script>

<style scoped lang="scss"></style>
