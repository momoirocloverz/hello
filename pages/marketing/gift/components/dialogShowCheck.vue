<template>
  <div>
    <!--dialog-->
    <el-dialog title="奖品已使用确认"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="50%">
      <div class="dialog-content">
        <common-info-line :info="info"
                          :columns="infoColumns"></common-info-line>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary"
                   @click="closeAndRefresh">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from "vue-property-decorator";
import commonInfoLine from "../components/commonInfoLine.vue";
import { COUPON_TYPE } from "../const/type";
import api from "@/api/restful";

@Component({
  components: {
    commonInfoLine
  }
})
export default class dialogReview extends Vue {
  @Prop({ default: true }) readonly showDialog: boolean;
  @Prop({ default: { code: '' } }) readonly info: any;
  private infoColumns: any = [
    {
      label: "奖品类型：",
      prop: "prizeTypeName"
    },
    {
      label: "奖品名称：",
      prop: "name"
    },
    {
      label: "核销码",
      prop: "code"
    },
    {
      label: "客户姓名：",
      prop: "consumerName"
    },
    {
      label: "手机号：",
      prop: "consumerMobile"
    }
  ];
  closeDialog() {
    this.$emit("close", true);
  }
  async closeAndRefresh() {
    let res = await api.put({
      url: "CHECK_COUPON",
      isAdminApi: true,
      code: this.info.code
    });
    this.$message({ type: "success", message: "核销成功" });
    this.$emit("refresh", true);
    this.closeDialog();
  }
}
</script>
