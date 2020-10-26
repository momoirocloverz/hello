<!--活动设置-->
<template>
  <common-form
    ref="stepRef"
    :rules="constant.SALES_FORM_RULES"
    :props="constant.SALES_ACTIVE_PROP"
    :form="salesForm"
    :inline="false"
    class="common_active-set-form"
  >
    <div slot="campaignPeopleLimit" class="common_limit-ipt">
      <el-radio-group v-model="salesForm.campaignPeopleLimit" @change="changeLimit">
        <el-radio v-for="item in allCon.LIMIT_PERSON" :key="item.value" :value="item.value" :label="item.value">{{
          item.label
        }}</el-radio>
      </el-radio-group>
      <el-form-item :inline="true" prop="limitPerson" class="ipt-num"
        ><el-input
          maxLength="6"
          :disabled="salesForm.campaignPeopleLimit < 1"
          v-model="salesForm.limitPerson"
          style="width: 120px;margin: 0 5px"
        ></el-input>
        人</el-form-item
      >
    </div>
  </common-form>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import CommonForm from "@/components/common-form/index.vue";
import { State, Action } from "vuex-class";
import * as CONST from "../../const/common";

@Component({
  name: "stepActiveSet",
  components: {
    CommonForm
  }
})
export default class StepActiveSet extends Vue {
  @Ref() stepRef: { formRef: HTMLFormElement };
  @State(state => state.activity.salesForm) private salesForm!: any;
  @Prop({ default: () => {} }) private constant: any;
  allCon: any = CONST;

  changeLimit(val: any) {
    if (val === 0||val===-1) {
      this.salesForm.limitPerson = null;
    }
  }
}
</script>

<style scoped lang="scss">

</style>
