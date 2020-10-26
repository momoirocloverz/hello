<!--投放-->
<template>
  <el-dialog
    class="put-in"
    :title="dialogObj.title"
    :visible.sync="dialogObj.show"
    width="70%"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="handleClose"
  >
    <common-form ref="putRef" :rules="constant.PUT_IN_RULES" :props="putInProp" :form="putInForm" :inline="false">
      <div slot="location">
        <el-input
          type="text"
          @click.native="showMap"
          v-model="putInForm.location"
          placeholder="请选择位置"
          suffix-icon="el-icon-map-location"
        />
      </div>
      <!--限制人数-->
      <div slot="memberLimit" class="common_limit-ipt">
        <el-radio-group v-model="putInForm.memberLimit" @change="changeLimit">
          <el-radio v-for="item in constant.LIMIT_PERSON" :key="item.value" :value="item.value" :label="item.value">{{
            item.label
          }}</el-radio>
        </el-radio-group>
        <el-form-item :inline="true" prop="limitPerson" class="ipt-num"
          ><el-input
            :disabled="putInForm.memberLimit < 1"
            v-model="putInForm.limitPerson"
            style="width: 120px;margin:0 5px"
          ></el-input>
          人</el-form-item
        >
      </div>
      <!--奖项设置-->
      <awards-set
        slot="priceSetList"
        :data="priceSetList"
        :campaignEndAt="campaignEndAt"
        :activeItem="activeItem"
        :activeType="activeType"
        @addAward="addAward"
        usedFrom="put"
        @deleteAward="deleteAward"
        @changeAward="changeAward"
      />
      <!--团购商品-->
      <group-goods slot="reletedGoods" :form="putInForm" @validateGoods="validateGoods"></group-goods>
    </common-form>
    <div class="bottom-btn">
      <el-button size="small" @click="handleClose">取消</el-button>
      <el-button size="small" @click="handleSure" type="primary">确定</el-button>
    </div>
    <map-dialog :mapInPageCount="mapInPageCount" :dialogObj="mapDialog" @hideMap="hideMap" />
    <active-query
      v-if="queryDialog.show"
      :activeType="activeType"
      :form="putInForm"
      :dialogObj="queryDialog"
      usedFrom="put"
    ></active-query>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref, Watch } from "vue-property-decorator";
import CommonForm from "@/components/common-form/index.vue";
import Const from "../const/index";
import AwardsSet from "./awardsSet.vue";
import { DialogInfo } from "@/@types/activity";
import { State, Action } from "vuex-class";
import MapDialog from "./mapDialog.vue";
import GroupGoods from "./groupGoods.vue";
import { putInActive, checkActiveTime } from "@/api";
import activeQuery from "./activeQuery.vue";
import _ from "lodash";
import dayjs from "dayjs";
import { mixins } from "vue-class-component";
import ActivityMixin from "../mixin/activity.mixin";
const startSuffix = " 00:00";
const endSuffix = " 23:59";
const statTime = dayjs(Date.now() + 24 * 60 * 60 * 1000).format("YYYY-MM-DD") + startSuffix;
const endTime = dayjs(Date.now() + 2 * 24 * 60 * 60 * 1000).format("YYYY-MM-DD") + endSuffix;
const initPutInForm: any = {
  isHot: false,
  memberLimit: -1,
  location: "",
  regTime: [],
  tool: [1],
  reletedGoods: [],
  activeTime: [new Date(statTime).getTime(), new Date(endTime).getTime()] // 活动时间
};
@Component({
  name: "putInDialog",
  components: {
    CommonForm,
    AwardsSet,
    MapDialog,
    GroupGoods,
    activeQuery
  }
})
export default class PutInDialog extends mixins(ActivityMixin) {
  @Ref() putRef: { formRef: HTMLFormElement };
  @Prop({ default: false }) private dialogObj: DialogInfo;
  @Action("setSiteForm", { namespace: "activity" })
  setSiteForm: Function;

  hasValid: boolean = true;
  mapInPageCount: number = 0;
  activeLength: number = 0; // 活动的场次
  queryDialog: DialogInfo = {
    title: "活动查询",
    show: false
  };
  campaignTypeMap: any = {
    lottery: 0,
    sales: 1,
    site: 2
  };
  trueTime: boolean = true;
  activeEndTime: number;
  activeStartTime: number;

  private mapDialog: DialogInfo = {
    title: "选择地点",
    show: false
  };
  putInForm: any = _.cloneDeep(initPutInForm);
  get activeLen() {
    return this.activeLength;
  }
  private get config() {
    return new Const(this);
  }
  private get constant(): any {
    return this.config.const;
  }

  /**
   * 获取投放属性
   */
  get putInProp(): any {
    let putInPropMap: any = {
      lottery: this.constant.PUT_IN_LOTTERY_PROPS,
      sales: this.constant.PUT_IN_SALES_PROPS,
      site: this.constant.PUT_IN_SITE_PROPS
    };

    return putInPropMap[this.activeType];
  }

  /**
   * 活动结束时间
   */
  get campaignEndAt() {
    return this.putInForm.activeTime ? this.putInForm.activeTime[1] : null;
  }
  /**
   * 检验时间冲突
   * 二期改为查询当前时间下活动的场次
   */
  async checkTime() {
    // 注：抽奖活动主机厂端列表，活动类型返回的是campaignType,而本身应该返回marketingToolType
    let { activeTime, marketingToolType, campaignType } = this.putInForm;
    let [validFrom, validTo] = activeTime;
    let releaseId = this.actDetailInfo.releaseId || null;
    let res = await checkActiveTime({
      campaignType: this.campaignTypeMap[this.activeType],
      marketingToolType: this.activeType === "lottery" ? campaignType || marketingToolType || 0 : null,
      releaseId,
      validFrom,
      validTo,
      scenario: this.isFactory ? "MANUFACTOR_SELF_MADE" : "DEALER_SELF_MADE_OR_RELEASE"
    });
    this.activeLength = res.totalCount;
    // this.trueTime = res.data;
    this.putRef.formRef.validateField("activeTime");
  }
  /**
   * 这儿和新建活动的相似
   * 根据活动类型判断奖品的个数
   * 九宫格 只能设置8个奖品 1
   * 刮刮乐：最多设置20个奖品 2
   * 大转盘：请设置4个/6个/8个奖品 0
   */
  validatePriceLenByType() {
    let len = this.priceSetList.length;
    let valid = true;
    switch (this.actDetailInfo.campaignType) {
      case 2:
        if (len > 20) {
          valid = false;
          this.$message.warning("刮刮乐最多设置20个奖品");
        }
        break;
      case 0:
        if (len === 4 || len === 6 || len === 8) {
          valid = true;
        } else {
          valid = false;
          this.$message.warning("大转盘请设置4个/6个/8个奖品");
        }
        break;
      case 1:
        if (len !== 8) {
          valid = false;
          this.$message.warning("九宫格需要设置8个奖项");
        }
        break;
    }
    return valid;
  }

  /**
   * 检验抽奖奖品设置
   */
  validateLotteryPriceSet() {
    let valid = false;
    let totalPer = 0;
    if (!this.validatePriceLenByType()) {
      this.hasValid = false;
      return false;
    }
    this.priceSetList.forEach((item: any) => {
      // 如果数量不对
      if (!item.quantity) {
        item.numValid = false;
      }
      // 如果不是谢谢参与且无概率
      if (!item.probability && item.id !== -1) {
        item.perValid = false;
      }
      totalPer += Number(item.probability);
      if (item.numValid && item.perValid) {
        valid = true;
      }
    });
    this.hasValid = valid;
    if (valid) {
      this.hasValid = totalPer === 100;
      if (totalPer !== 100) {
        this.$message.warning("请完善奖项设置,中奖概率合计需为100%");
      }
    }
  }

  /**
   * 检验线下奖品设置
   */
  validateSitePriceSet() {
    let valid = true;
    if (this.priceSetList.length < 1) {
      this.hasValid = false;
      this.$message.warning("请设置奖项");
      return false;
    }
    // 如果选择了大屏抽奖
    if (this.putInForm.tool.indexOf(3) > -1) {
      this.priceSetList.forEach((item: any) => {
        if (!item.quantity) {
          item.numValid = false;
          item.numMsg = "请输入奖品个数";
          valid = false;
        }
        this.hasValid = item.numValid;
      });
      this.hasValid = valid;
    } else {
      this.hasValid = true;
    }
  }
  validateGoods() {
    this.putRef.formRef.validateField("reletedGoods");
  }
  /**
   * 投放抽奖和线下
   */
  async putLotteryAndSite() {
    this.putInForm.priceSetList = this.priceSetList;
    let _set: Array<any> = this.dealPriceSetList();
    let _data = {};
    // 处理抽奖的参数
    if (this.activeType === "lottery") {
      _data = {
        isHot: this.putInForm.isHot,
        prizeList: _set,
        validFrom: this.putInForm.activeTime[0],
        validTo: this.putInForm.activeTime[1]
      };
    } else {
      // 处理线下参数
      let { latitude, location, tool, regTime, longitude, memberLimit, limitPerson } = this.putInForm;
      let luckydrawEnabled = tool.indexOf(3) > -1;
      let messageBoardEnabled = tool.indexOf(2) > -1;
      _data = {
        latitude,
        location,
        longitude,
        signinEnabled: true,
        luckydrawEnabled,
        memberLimit: memberLimit > 0 ? limitPerson : -1,
        messageBoardEnabled,
        isHot: this.putInForm.isHot,
        prizeList: _set,
        validFrom: this.putInForm.activeTime[0],
        validTo: this.putInForm.activeTime[1],
        signinValidFrom: regTime[0],
        signinValidTo: regTime[1]
      };
    }
    if (this.hasValid) {
      await putInActive({
        id: this.actDetailInfo.releaseId,
        activeType: this.activeType,
        data: _data
      });
    }
  }

  /**
   * 投放促销
   */
  async putSales() {
    let goods: Array<any> = [];
    // 处理团购商品
    this.putInForm.reletedGoods.forEach((item: any) => {
      let { salesPrice, modelName, goodsGrouponPrice, modelCode } = item;
      goods.push({
        modelName,
        salesPrice,
        goodsGrouponPrice,
        modelCode
      });
    });
    await putInActive({
      activeType: this.activeType,
      data: {
        releaseId: this.actDetailInfo.releaseId,
        id: this.actDetailInfo.id,
        isHot: this.putInForm.isHot,
        peopleLimit: this.putInForm.memberLimit,
        reletedGoods: goods,
        startTime: this.putInForm.activeTime[0],
        endTime: this.putInForm.activeTime[1]
      }
    });
  }

  /**
   * 确定投放
   */
  handleSure(): void {
    this.putRef.formRef.validate(async (valid: boolean) => {
      if (valid) {
        if (this.activeType === "lottery") {
          this.validateLotteryPriceSet();
        } else if (this.activeType === "site" && this.putInForm.tool.indexOf(3) > -1) {
          this.validateSitePriceSet();
        }
        if (this.hasValid) {
          if (this.activeType !== "sales") {
            await this.putLotteryAndSite();
          } else {
            await this.putSales();
          }
          this.$message.success("活动投放操作成功");
          this.$emit("putInSure");
        }
      }
    });
  }

  /**
   * 改变活动时间
   * @param val
   * @param item
   */
  changeActTime(val: Array<any>, item: any) {
    if (val) {
      let [start, end] = val;
      // 因为奖品有效期在活动结束时间之后的奖品，所以修改时间会清空奖项
      // 有一个固定奖项
      if (this.priceSetList.length > 1 && end !== this.activeEndTime) {
        if (this.putInForm.tool.indexOf(3) < 0 && this.activeType === "site") {
          return;
        }
        this.$confirm("重新选择活动结束时间会清空奖项设置，确定要取消？")
          .then(() => {
            this.putInForm.regTime = [];
            this.setAndCheckTime(val);
            this.resetPriceList();
          })
          .catch(() => {
            // 如果取消，回退到开始的时间
            this.putInForm.activeTime = [this.activeStartTime, this.activeEndTime];
          });
      } else {
        this.putInForm.regTime = [];
        this.setAndCheckTime(val);
      }
    }
  }
  /**
   * 设置并且检查时间，如果选择的时间比当前时间小，置为当前时间
   * @param val
   */
  setAndCheckTime(val: Array<any>) {
    let [start, end] = val;
    this.activeEndTime = end;
    this.activeStartTime = start;
    this.putInForm.activeTime = val;
    if (val[0] < Date.now()) {
      this.putInForm.activeTime[0] = Date.now() + 2 * 60 * 1000;
    }
    this.checkTime();
  }
  /**
   * 改变签到时间
   * @param val
   * @param item
   */
  changeRegTime(val: Array<any>, item: any) {
    if (val) {
      let [start, end] = val;
      if (val[0] < Date.now()) {
        this.putInForm.regTime[0] = Date.now() + 60 * 1000;
      } else {
        this.putInForm.regTime[0] = start;
      }
      this.putInForm.regTime[1] = end;
      if (val[1] < Date.now() || val[1] < this.putInForm.regTime[0]) {
        this.putInForm.regTime[1] = this.putInForm.regTime[0] + 60 * 60 * 1000;
      }
    }
  }

  /**
   * 新增奖品，这儿可以提出公用
   * @param row
   */
  addAward(row: any) {
    if (this.activeType === "lottery") {
      let len = this.priceSetList.length + 1;
      switch (this.actDetailInfo.marketingToolType) {
        case "SCRATCH_TICKETS":
          //  刮刮乐 最多20个
          if (len > 19) {
            this.$message.warning("刮刮乐最多设置20个奖项");
            return;
          }
          break;
        case "NINE_BLOCK_BOX":
          // 九宫格 只能8个
          if (len > 7) {
            this.$message.warning("九宫格只能设置8个奖品");
            return;
          }
          break;
      }
      this.priceSetList.push({
        numValid: true,
        perValid: true,
        ...row
      });
    } else if (this.activeType === "site") {
      if (this.priceSetList.length < 100) {
        this.priceSetList.push({
          numValid: true,
          perValid: true,
          ...row
        });
      }
    }
  }

  /**
   * 关闭投放
   */
  handleClose(): void {
    this.dialogObj.show = false;
    this.resetPriceList();
    this.putInForm = _.cloneDeep(initPutInForm);
  }

  /**
   * 删除奖品
   * @param row
   * @param idx
   */
  deleteAward(row: any, idx: number) {
    this.priceSetList.splice(idx, 1);
  }

  /**
   * 更换奖品
   * @param row
   * @param idx
   */
  changeAward(row: any, idx: number) {
    this.priceSetList.splice(idx, 1, row);
  }

  /**
   * 展示地图
   */
  showMap() {
    this.mapInPageCount += 1;
    this.mapDialog.show = true;
    this.mapDialog.title = "选择地点";
  }

  /**
   * 隐藏地图
   * @param addr
   * @param lonLat
   * @param longitude
   * @param latitude
   */
  hideMap(addr: any, lonLat: any, longitude: any, latitude: any) {
    this.putInForm.location = addr;
    this.putInForm.longitude = longitude;
    this.putInForm.latitude = latitude;
    this.mapDialog.show = false;
    // this.putRef.formRef.validateField("location");
  }
  created() {
    this.putInForm = Object.assign({}, this.putInForm, this.actDetailInfo);
    this.putInForm.name = this.actDetailInfo.name || this.actDetailInfo.campaignName;

    this.putInForm.location = null;
    this.checkTime();
  }

  /**
   * 切换限制人数
   * @param val
   */
  changeLimit(val: any) {
    if (val === 0) {
      this.putInForm.limitPerson = null;
    }
  }
  showActiveDialog() {
    if (!this.putInForm.activeTime) {
      this.$message.warning("请选择活动时间");
      return;
    }
    this.queryDialog.show = true;
  }
  mounted() {
    this.resetPriceList();
  }
}
</script>

<style scoped lang="scss">
.put-in {
  .bottom-btn {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
