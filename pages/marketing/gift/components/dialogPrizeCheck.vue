<template>
  <div>
    <!--dialog-->
    <el-dialog title="奖品验券"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="50%">
      <div class="dialog-content">
        <el-form @submit.native.prevent
                 ref="form"
                 :model="form"
                 :rules="rule"
                 label-width="150px">
          <el-form-item label="核销码："
                        prop="value">
            <el-input type="input"
                      maxlength="8"
                      size="small"
                      v-model.number="form.value"
                      style="width:50%;margin-right:10px;"
                      placeholder="请输入核销码"></el-input>
            <el-button type="primary"
                       size="small"
                       :disabled="(form.value+'').length !== 8"
                       @click="search">查询</el-button>
            <p v-if="!pageData.canUse && pageData.name"
               class="danger-text">优惠券已过期</p>
            <p v-if="pageData.canUse && pageData.name"
               class="success-text"><i class="el-icon-success"></i>有效核销码</p>
          </el-form-item>
        </el-form>
        <common-info-line :info="pageData"
                          v-if="pageData.name"
                          :columns="infoColumns"></common-info-line>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary"
                   :disabled="!pageData.canUse"
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
import { Config } from "../const/checkConfig";

@Component({
  components: {
    commonInfoLine
  }
})
export default class dialogReview extends Vue {
  private conf = new Config().get(this);
  @Prop({ default: true }) readonly showDialog: boolean;
  @Prop({ default: { code: "" } }) readonly info: any;
  private form: any = { value: "" };
  private rule: any = {
    value: [{ required: true, message: "请输入核销码" }]
  };
  private pageData: any = {};
  private infoColumns: any = this.conf.infoColumns;
  closeDialog() {
    this.$emit("close", true);
  }
  async search() {
    (<any>this.$refs["form"]).validate(async (valid: boolean, params: any) => {
      if (valid) {
        try {
          let now = new Date().getTime();
          let { data } = await api.get({ url: "QUERY_INFO_BY_CODE", isAdminApi: true, code: this.form.value });
          data.canUse = false;
          if (data.useEndAt > now && data.useStartAt <= now) {
            data.canUse = true;
          }
          this.pageData = data;
          if (data.prizeType === 0) {
            this.infoColumns = this.conf.infoColumns1;
          } else {
            this.infoColumns = this.conf.infoColumns;
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        let message = params[Object.keys(params)[0]][0].message;
        this.$message({ type: "error", message: message });
        return false;
      }
    });
  }
  async closeAndRefresh() {
    let res = await api.put({
      url: "CHECK_COUPON",
      isAdminApi: true,
      code: this.form.value
    });
    this.$message({ type: "success", message: "核销成功" });
    this.$emit("refresh", true);
    this.closeDialog();
  }
  @Watch("showDialog")
  onShowDialog(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal && newVal) {
      this.form.value = "";
      this.pageData = {};
    } else {
      (<any>this.$refs).form.resetFields();
    }
  }
}
</script>


<style lang="scss" scoped>
/deep/ {
  .common-form-line {
    .title {
      text-align: right;
    }
  }

  .danger-text {
    color: #f56c6c;
    line-height: 1em;
    font-size: 13px;
  }
  .success-text {
    color: #67c23a;
    line-height: 1em;
    font-size: 13px;
  }
}
</style>