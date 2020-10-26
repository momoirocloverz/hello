<!--团购商品-->
<template>
  <div class="group-goods">
    <common-form ref="stepRef" formLabelWidth="0" :form="form" :props="groupGoodsProp" :inline="false">
      <div slot="reletedGoodIds">
        <common-table
          border
          :tableColumns="constant.GROUP_GOODS_COLUMNS"
          :data="goodsData"
          :filter="filter"
          :total="reletedGoods.length"
          :showPage="reletedGoods.length > 10"
          @currentChange="currentChange"
          @sizeChange="sizeChange"
        ></common-table>
        <div class="box" v-if="usedFrom === 'new'">
          <el-button type="text" icon="el-icon-plus" @click="addGroupGoods" v-if="reletedGoods.length < 100"
            >添加</el-button
          >
          <span class="common_tip ml-15">单次活动，最多添加100个商品</span>
        </div>
      </div>
    </common-form>
    <good-item-dialog
      v-if="addGoodsDialog.show"
      :form="form"
      :constant="constant"
      @handleClose="handleClose"
      :dialogObj="addGoodsDialog"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Ref, Prop } from "vue-property-decorator";
import CommonForm from "@/components/common-form/index.vue";
import CommonTable from "@/components/common-table/index.vue";
import { State, Action } from "vuex-class";
import goodItemDialog from "./goodItemDialog.vue";
import { DialogInfo } from "@/@types/activity";
import Const from "../const/index";

@Component({
  name: "groupGoods",
  components: {
    CommonForm,
    CommonTable,
    goodItemDialog
  }
})
export default class StepActiveSet extends Vue {
  @Ref() stepRef: { formRef: HTMLFormElement };
  @Prop({ default: () => {} }) private form: any;
  @Prop({ default: "new" }) usedFrom: Array<any>;
  @State(state => state.activity.salesForm) private salesForm!: any;
  filter: any = {
    page: 1,
    size: 10
  };
  private addGoodsDialog: DialogInfo = {
    title: "添加团购活动",
    show: false,
    type: "",
    info: {}
  };
  get reletedGoods(): any {
    return this.form.reletedGoods || [];
  }
  get goodsData(): Array<any> {
    let { page, size } = this.filter;
    return this.reletedGoods.slice((page - 1) * size, page * size);
  }
  get config() {
    return new Const(this);
  }
  get constant(): any {
    return this.config.const;
  }
  // 团购商品
  groupGoodsProp = [
    {
      label: "",
      prop: "reletedGoodIds"
    }
  ];
  currentChange(val: number): void {
    this.filter.page = val;
  }
  sizeChange(val: number): void {
    this.filter.size = val;
  }
  addGroupGoods(): void {
    this.addGoodsDialog.show = true;
    this.addGoodsDialog.type = "addGoods";
  }
  handleClose() {
    this.addGoodsDialog.show = false;
    this.addGoodsDialog.type = "";
    this.$emit("validateGoods");
  }
  delete(row: any, idx: number) {
    this.reletedGoods.splice(idx, 1);
  }
  created() {}
}
</script>

<style scoped></style>
