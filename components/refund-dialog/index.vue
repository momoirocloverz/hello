<template>
  <!-- 退款相关弹框 -->
  <div>
    <el-dialog :show-close="isShowClose"
               @close="closeDialog"
               :visible.sync="dialogStatus">
      <div slot="title">
        {{dialogTitle}}
        <span class="refund-tips"
              v-if="!again && (dialogType === 'goodsOrderRefund' || dialogType === 'carOrderRefund')">用户申请7天内未处理，系统将自动退款，剩余时长：{{applyTime}}</span>
      </div>
      <div>
        <div v-for="(item, index) in dialogInfo"
             :key="index">
          <p class="apply-title"
             v-show="item.label">{{item.label}}:</p>
          <el-row class="row-height"
                  v-for="(items, indexs) in item.list"
                  :key="indexs">
            <el-col class="text-right"
                    :span="5"
                    v-show="items.key !== 'history'">{{items.name}}</el-col>
            <el-col :push="1"
                    :span="16"
                    v-if="items.key === 'imgs'">
              <img v-for="(itemImg, index) in items.val"
                   :key="index"
                   @click="prevImg(itemImg)"
                   class="refund-img"
                   :src="itemImg">
            </el-col>
            <el-col :push="1"
                    :span="16"
                    v-else-if="items.key === 'history'">
              <el-steps direction="vertical">
                <el-step v-for="(itemh, index) in items.val"
                         :key="index"
                         :title="itemh.description"
                         :description="itemh.createdTime"></el-step>
              </el-steps>
            </el-col>
            <el-col :push="1"
                    :span="16"
                    v-else>
              <span :class="items.key === 'goodsSize'?'goods':''"
                    @click="goodsDetail(items.key)">{{items.val}}</span>
            </el-col>
          </el-row>
        </div>
        <el-form ref="ruleFormRef"
                 :model="formParam"
                 :rules="formRule"
                 class="from-style"
                 label-width="30%"
                 v-show="dialogType === 'carOrderRefund' || dialogType === 'goodsOrderRefund' || dialogType === 'returnGoods'|| dialogType === 'changegoods'">
          <el-form-item label="售后状态:"
                        prop="status"
                        v-if="!again">
            <el-radio-group v-model="formParam.status">
              <el-radio :label="0">{{dialogType === "changegoods" ? "确认换货": "同意退款"}}</el-radio>
              <el-radio :label="1">{{dialogType === "changegoods" ? "拒绝换货": "拒绝退款"}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="售后状态:"
                        v-else>
            {{afterSaleText}}
          </el-form-item>
          <el-form-item label="处理意见:"
                        prop="applyExplain">
            <el-input v-model="formParam.applyExplain"
                      type="textarea"
                      placeholder="请填写处理意见"
                      maxlength="500"
                      show-word-limit>
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer"
           class="dialog-footer"
           v-show="!isShowClose">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary"
                   @click="confirm">确 定</el-button>
      </div>
    </el-dialog>
    <img-preview v-model="currentPreImg" />
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import { agentAfterSaleDetail, factoryAfterSaleDetail, afterSaleDeal } from "@/api/modules/appointment";
import { dialogDatas, returnReason, afterSale } from "./const/index";
import dayjs from "dayjs";
import StoreClassPanel from "../../pages/goods/store/components/storeClassPanel.vue";
import ImgPreview from "@femessage/img-preview";
interface msgList {
  status: number | string;
  applyExplain: string;
}

@Component({
  components: {
    ImgPreview
  }
})
export default class SearchRegion extends Vue {
  @Ref("ruleFormRef") readonly ruleFormRef: element.Refs;
  @Prop({ type: String }) dialogType: string;
  formRule: Object = {
    status: [{ required: true, message: "请选择状态", trigger: "change" }],
    applyExplain: [{ required: true, message: "请填写处理意见", trigger: "blur" }]
  };
  // 弹框状态
  dialogStatus: boolean = false;
  dialogInfo: any[] = [];
  // 表单参数
  formParam: msgList = {
    status: 0,
    applyExplain: ""
  };
  isShowClose: boolean = false;
  // 退款申请时间
  applyTime: string = "";
  // 售后id
  afterSaleOrderId: number | string = "";
  // 重新退款
  again: boolean = false;
  // 弹框title
  dialogTitle: string = "";
  // 售后类型 退款-refund，退货returnGoods，换货-changeGoods
  afterSaleType: string = "";
  times: any = null;
  // 预览图片
  currentPreImg: string = "";
  // 退款货物信息
  goodsOutputs: any[] = [];
  // 售后状态
  afterSaleText: string = "";
  prevImg(src: string) {
    this.currentPreImg = src;
  }
  goodsDetail(key: string) {
    if (key === "goodsSize") {
      this.closeDialog();
      this.$emit("openDetail", { goodsOutputs: this.goodsOutputs });
    }
  }
  closeDialog() {
    clearInterval(this.times);
    this.afterSaleOrderId = "";
    this.dialogStatus = false;
    this.dialogInfo = [];
    this.formParam = {
      status: 0,
      applyExplain: ""
    };
  }
  openDialog(id: number, title: string, again: boolean) {
    this.again = again;
    this.dialogInfo = JSON.parse(JSON.stringify(dialogDatas[this.dialogType]));
    this.dialogTitle = title;
    this.afterSaleOrderId = id;
    this.dialogStatus = true;
    this.afterSaleDetail(id);
  }
  // 确定
  confirm() {
    this.ruleFormRef.validate((valid: any) => {
      if (valid) {
        this.afterSaleDeal();
      }
    });
  }
  // 售后订单详情
  async afterSaleDetail(id: number) {
    const fn = this.$route.query.sysPlat === "agent" ? agentAfterSaleDetail : factoryAfterSaleDetail;
    let { data } = await fn(id);
    if (data) {
      this.goodsOutputs = data.goodsOutputs;
      if (!this.again && (this.dialogType === "goodsOrderRefund" || this.dialogType === "carOrderRefund")) {
        this.setTime(data.applyTime);
      }
      data.applyTime = dayjs(data.applyTime).format("YYYY-MM-DD HH:mm");
      data.orderTime = dayjs(data.orderTime).format("YYYY-MM-DD HH:mm");
      data.applyReason = returnReason[data.applyReason];
      data.dealerShowStatus = afterSale[data.dealerShowStatus];
      data.afterSaleMoney = `${data.afterSaleMoney.toFixed(2)}元`;
      data.orderMoney = `${data.orderMoney.toFixed(2)}元`;
      this.afterSaleText = data.dealerShowStatus;
      if (data.history) {
        data.history.forEach((el: any) => {
          el.createdTime = dayjs(el.createdTime).format("YYYY-MM-DD HH:mm");
        });
      }
      if (this.dialogType === "carOrderRefund") {
        data.modelForCollectionsOutput = data.goodsOutputs[0].skuName;
      }
      this.dialogInfo.forEach((el: any, index: any) => {
        el.list.forEach((e: any, inx: any) => {
          this.dialogInfo[index].list[inx].val = data[this.dialogInfo[index].list[inx].key];
        });
      });
      if (data.handlingOpinions) {
        this.formParam.applyExplain = data.handlingOpinions;
      }
    }
  }
  // 处理售后订单
  async afterSaleDeal() {
    let type = 0;
    if (this.dialogType === "changegoods") {
      type = 2;
    } else if (this.dialogType === "returnGoods") {
      type = 1;
    }
    let param = {
      afterSaleOrderId: Number(this.afterSaleOrderId),
      afterSaleType: type,
      applyExplain: this.formParam.applyExplain,
      status: Number(this.formParam.status)
    };
    let { data, msg } = await afterSaleDeal(param);
    if (msg === "SUCCESS") {
      this.dialogStatus = false;
      this.$message("操作成功");
      this.$emit("successful", "success");
    } else {
      this.dialogStatus = false;
      this.$emit("successful", "error");
    }
  }
  // 退款倒计时
  setTime(time: number) {
    let num = 7;
    let day, h, m;
    time = time + num * 1000 * 60 * 60 * 24;
    let currentTime = new Date().getTime();
    time = time - currentTime;
    if (time <= 0) {
      this.applyTime = "0天0小时0分";
      clearInterval(this.times);
      return;
    }
    this.times = setInterval(() => {
      time = time - 1000;
      if (time <= 0) {
        this.applyTime = "0天0小时0分";
        clearInterval(this.times);
        return;
      }
      day = Math.floor(time / (24 * 3600 * 1000));
      h = Math.floor((time % (24 * 3600 * 1000)) / (3600 * 1000));
      m = Math.floor(((time % (24 * 3600 * 1000)) % (3600 * 1000)) / (60 * 1000));
      this.applyTime = `${day}天${h}小时${m}分`;
    }, 1000);
  }
  created() {
    if (
      this.dialogType === "goodsOrderDetail" ||
      this.dialogType === "returnGoodsDetail" ||
      this.dialogType === "changeGoodsDetail"
    ) {
      this.isShowClose = true;
    }
    // this.dialogInfo = JSON.parse(JSON.stringify(dialogDatas[this.dialogType]));
  }
}
</script>
<style lang='scss' scoped>
/deep/ {
  .el-step__title {
    font-size: 14px;
  }
}
.row-height {
  padding: 5px 0;
  .text-right {
    text-align: right;
  }
  .el-code {
    width: 260px;
    margin-right: 10px;
  }
  .refund-img {
    width: 50px;
    height: 50px;
    margin-right: 8px;
  }
  .success-code {
    color: #26c24d;
  }
  .error-code {
    color: #a0aa11;
  }
}
.apply-title {
  font-size: 16px;
}
.from-style {
  width: 70%;
}
.refund-tips {
  font-size: 14px;
  color: red;
}
.goods {
  color: #0077aa;
  cursor: pointer;
}
</style>