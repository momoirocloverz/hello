<template>
  <div>
    <!--dialog-->
    <el-dialog title="发货"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="50%">
      <div class="dialog-content">
        <common-info-line :info="info"
                          :columns="infoColumns"></common-info-line>
        <p v-if="action === 'release'"
           style="margin-top:30px;">物流信息填写: <b class='warning-text'>请线下发货后将物流单号填写到此处</b></p>
        <p v-if="action !== 'release'"
           style="margin-top:30px;">物流详情: <b class='warning-text'>{{logistics.companyName}}{{logistics.logisticsNo}}</b></p>
        <div class="logstic-list"
             v-if="action !== 'release'">
          <div class="item"
               :class="{'active': index === 0}"
               :key="index"
               v-for="(item, index) in logistics.logisticsDetailOutList">{{item.context}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}}</div>
        </div>
        <el-form ref="form"
                 :model="form"
                 :rules="rule"
                 v-if="action === 'release'"
                 label-width="150px">
          <el-form-item label="物流公司："
                        prop="logisticsCompanyId">
            <el-autocomplete v-model="form.logisticsCompany"
                             label="name"
                             :fetch-suggestions="getCompany"
                             placeholder="请输入关键词"
                             @select="handleSelect"></el-autocomplete>
          </el-form-item>
          <el-form-item label="物流单号："
                        prop="logisticsNo">
            <el-input type="input"
                      maxlength="50"
                      size="small"
                      v-model="form.logisticsNo"
                      style="width:50%;margin-right:10px;"
                      placeholder="请填写物流单号"></el-input>
            <span>{{form.logisticsNo.length}}/50</span>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button v-if="action === 'release'"
                   @click="closeDialog">取 消</el-button>
        <el-button type="primary"
                   v-if="action === 'release'"
                   @click="closeAndRefresh">确 定</el-button>
        <el-button v-if="action !== 'release'"
                   @click="closeDialog">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from "vue-property-decorator";
import commonInfoLine from "../components/commonInfoLine.vue";
import { COUPON_TYPE } from "../const/type";
import api from "@/api/restful";
import dayjs from "dayjs";

@Component({
  components: {
    commonInfoLine
  }
})
export default class dialogReview extends Vue {
  @Prop({ default: true }) readonly showDialog: boolean;
  @Prop({ default: { code: "" } }) readonly info: any;
  @Prop({ default: "release" }) readonly action: any;
  private form: any = { logisticsCompanyId: "", logisticsNo: "", logisticsCompany: "" };
  private loading: boolean = false;
  private dayjs: any = dayjs;
  private rule: any = {
    logisticsCompanyId: [{ required: true, message: "请选择物流公司" }],
    logisticsNo: [{ required: true, message: "请填写物流单号" }]
  };
  private pageData: any = {};
  private logistics: any = {
    logisticsDetailOutList: []
  };
  private infoColumns: any = [
    {
      label: "奖品名称：",
      prop: "prizeName"
    },
    {
      label: "收获地址：",
      prop: "consumerAddress"
    },
    {
      label: "收货人：",
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
    (<any>this.$refs["form"]).validate(async (valid: boolean, params: any) => {
      if (valid) {
        let res = await api.post({
          url: "RELEASE_PRIZE",
          isAdminApi: true,
          businessId: this.info.id,
          ...this.form
        });
        this.$message({ type: "success", message: "发货成功" });
        this.$emit("refresh", true);
        this.closeDialog();
      } else {
        let message = params[Object.keys(params)[0]][0].message;
        this.$message({ type: "error", message: message });
        return false;
      }
    });
  }
  async getCompany(str: string, cb: Function) {
    if (!str) return;
    try {
      let res = await api.get({ url: "LOGISTICS_LIST", isAdminApi: true, search: str });
      res.data.map((v: any) => {
        v.value = v.name;
      });
      cb(res.data);
    } catch (err) {
      console.log(err);
    }
  }
  async getDetail() {
    try {
      let res = await api.get({ url: "LOGISTICS_DETAIL", isAdminApi: true, businessId: this.info.id, businessType: 1 });
      this.logistics = res.data;
    } catch (err) {
      console.log(err);
    }
  }
  handleSelect(item: any) {
    this.form.logisticsCompanyId = item.id;
  }
  @Watch("showDialog")
  onShowDialog(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal && newVal) {
      if (this.action !== "release") {
        this.getDetail();
      }
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
  .logstic-list {
    font-size: 13px;
    box-sizing: border-box;

    .item {
      padding: 0 0 20px 20px;
      position: relative;
      border-left: 2px solid #d1d1d1;

      &:last-child {
        padding-bottom: 0;
        &:after {
          width: 2px;
          height: 0;
        }
      }

      &:before {
        content: "";
        position: absolute;
        left: -6px;
        width: 10px;
        height: 10px;
        border-radius: 10px;
        background: #d1d1d1;
        top: 4px;
        z-index: +5;
      }
      // &:after {
      //   content: "";
      //   width: 2px;
      //   height: 60px;
      //   background: #d1d1d1;
      //   position: absolute;
      //   left: -20px;
      //   top: 3px;
      //   z-index: +3;
      // }
    }
    .active {
      color: #449aff;

      &:before {
        background: #449aff;
      }
    }
  }
}
</style>