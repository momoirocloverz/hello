<template>
  <div>
    <el-admin-table :tableAttrs="tableAttrs"
                    :formData.sync="subForm"
                    :apiFn="getList"
                    @getTableData="getDatas"
                    @reset="resetForm">
      <template slot="search">
        <el-form-item prop="msgType"
                      v-if="role !== '1'">
          <el-select v-model="subForm.type"
                     placeholder="消息类型"
                     clearable>
            <el-option v-for="(item, index) in msgType"
                       :key="index"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="msgContent">
          <el-date-picker v-model="datePickerVal"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          @change="datePickerChange"
                          clearable />
        </el-form-item>
      </template>
    </el-admin-table>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { roleInfoSetting } from "@/utils/userSetting";
import { sysMessage, readMsg } from "@/api";
import dayjs from "dayjs";
interface SubForm {
  type: number | string;
  startDate: string;
  endDate: string;
}
interface msgList {
  msgType: string;
  msgContent: string;
  date: string;
}
@Component({})
export default class Article extends Vue {
  subForm: SubForm = {
    type: "",
    startDate: "",
    endDate: ""
  };
  role: number | string = roleInfoSetting.getRole();
  currentPageDatas: any[] = [];
  getList(param = {}) {
    return sysMessage(param);
  }
  msgType: any[] = [
    {
      label: "营销管理",
      value: "0"
    },
    {
      label: "商品管理",
      value: "1"
    },
    {
      label: "订单管理",
      value: "2"
    },
    {
      label: "实物奖品",
      value: "3"
    }
  ];
  datePickerVal: string[] = [];
  readonly tableAttrs = {
    border: true,
    columns: [
      {
        prop: "title",
        label: "标题"
      },
      {
        prop: "content",
        label: "消息内容",
        render: (h: any, row: any) =>
          h(
            "div",
            {
              attrs: {
                class: row.isRead ? "colorStyle2" : "colorStyle"
              },
              on: {
                click: () => {
                  this.jump(row);
                }
              }
            },
            row.content
          )
      },
      {
        prop: "createdTime",
        label: "提醒时间",
        formatter: (row: any) => dayjs(row.createdTime).format("YYYY-MM-DD HH:mm")
      }
    ]
  };
  getDatas(val: any) {
    this.currentPageDatas = val;
  }
  async readMsg(id: number) {
    // 阅读消息
    try {
      let { msg } = await readMsg(id);
      if (msg === "SUCCESS") {
        this.currentPageDatas.forEach((item, index) => {
          if (item.id === id) {
            this.currentPageDatas[index].isRead = true;
          }
        });
      }
    } catch (error) {
      this.log(error);
    }
  }
  jump(row: any) {
    this.readMsg(row.id);
    let linkParam = row.linkParam ? row.linkParam.split("&&") : row.linkParam;
    // 跳转
    switch (row.linkType) {
      case 0:
        // 内部资讯
        this.$emit("changeTab");
        break;
      case 1:
        // 车型列表
        if (!this.accessIsOpened("PERM:MODEL:VIEW", true)) {
          return;
        }
        this.$router.push({
          path: `/goods/list-agent`
        });
        break;
      case 2:
        // 经销商低价申请列表
        if (!this.accessIsOpened("PERM:LIMITED_PRICE:VIEW", true)) {
          return;
        }
        this.$router.push({
          path: `/goods/limitPrice`,
          query: {
            activeTab: "applyForLowPrice"
          }
        });
        break;
      case 3:
        // 活动审批列表
        if (!this.accessIsOpened("PERM:ACTIVITY_APPROVE:VIEW", true)) {
          return;
        }
        this.$router.push({
          path: `/marketing/activity/approval/list`
        });
        break;
      case 4:
        // 抽奖活动详情
        if (!this.accessIsOpened("PERM:LOTTERY_ACTIVITY:VIEW", true)) {
          return;
        }
        this.$router.push({
          name: `marketing-activity-lottery-detail`,
          params: {
            id: linkParam[0]
          },
          query: {
            releaseId: linkParam[1],
            activeItem: "agent"
          }
        });
        break;
      case 5:
        // 促销活动详情
        if (!this.accessIsOpened("PERM:PROMOTION_ACTIVITY:VIEW", true)) {
          return;
        }
        this.$router.push({
          name: `marketing-activity-sales-detail`,
          params: {
            id: linkParam[0]
          },
          query: {
            releaseId: linkParam[1],
            activeItem: "agent"
          }
        });
        break;
      case 6:
        // 线下活动详情
        if (!this.accessIsOpened("PERM:OFFLINE_ACTIVITY:VIEW", true)) {
          return;
        }
        this.$router.push({
          name: `marketing-activity-site-detail`,
          params: {
            id: linkParam[0]
          },
          query: {
            releaseId: linkParam[1],
            activeItem: "agent"
          }
        });
        break;
      case 7:
        // 抽奖活动主机厂活动列表
        if (!this.accessIsOpened("PERM:LOTTERY_ACTIVITY:VIEW", true)) {
          return;
        }
        this.$router.push({
          path: `/marketing/activity/lottery/index`,
          query: {
            activeItem: "factory"
          }
        });
        break;
      case 8:
        // 促销活动主机厂活动列表
        if (!this.accessIsOpened("PERM:PROMOTION_ACTIVITY:VIEW", true)) {
          return;
        }
        this.$router.push({
          path: `/marketing/activity/sales/index`,
          query: {
            activeItem: "factory"
          }
        });
        break;
      case 9:
        // 线下活动主机厂活动列表
        if (!this.accessIsOpened("PERM:OFFLINE_ACTIVITY:VIEW", true)) {
          return;
        }
        this.$router.push({
          path: `/marketing/activity/site/index`,
          query: {
            activeItem: "factory"
          }
        });
        break;
      case 10:
        // 抽奖活动集团活动列表
        if (!this.accessIsOpened("PERM:LOTTERY_ACTIVITY:VIEW", true)) {
          return;
        }
        this.$router.push({
          path: `/marketing/activity/lottery/index`,
          query: {
            activeItem: "company"
          }
        });
        break;
      case 11:
        // 促销活动集团活动列表
        if (!this.accessIsOpened("PERM:PROMOTION_ACTIVITY:VIEW", true)) {
          return;
        }
        this.$router.push({
          path: `/marketing/activity/sales/index`,
          query: {
            activeItem: "company"
          }
        });
        break;
      case 12:
        // 线下活动集团活动列表
        if (!this.accessIsOpened("PERM:OFFLINE_ACTIVITY:VIEW", true)) {
          return;
        }
        this.$router.push({
          path: `/marketing/activity/site/index`,
          query: {
            activeItem: "company"
          }
        });
        break;
      case 13:
        // 提醒主机厂添加类目-商品类目
        // if (!this.accessIsOpened("PERM:OFFLINE_ACTIVITY:VIEW", true)) {
        //   return;
        // }
        this.$router.push({
          path: `/goods/store/storeCategory`
        });
        break;
      case 14:
        // 实物奖品未发货列表
        if (!this.accessIsOpened("PERM:PRIZE:VIEW", true)) {
          return;
        }
        this.$router.push({
          path: `/marketing/gift/release/index`
        });
        break;
      case 15:
        // 主机厂上架商品或下架商品的时候会给经销商发消息，经销商查看主机厂的商品详情
        if (!this.accessIsOpened("PERM:GOODS_LIST:VIEW", true) || !linkParam[0]) {
          return;
        }
        this.$router.push({
          path: `/goods/store/storeListDetail/${linkParam[0]}/0`
        });
        break;
      case 16:
        // 邮寄订单列表
        if (!this.accessIsOpened("PERM:MAIL_ORDER_LIST:VIEW", true)) {
          return;
        }
        this.$router.push({
          path: `/order/mailOrder`
        });
        break;
      case 17:
        // 经销商模板列表
        if (!this.accessIsOpened("PERM:DEALER:VIEW", true)) {
          return;
        }
        this.$router.push({
          path: `/marketing/activity/template/index`
        });
        break;
      case 18:
        // 售后订单-仅退款
        if (!this.accessIsOpened("PERM:AFTER_SALE:VIEW", true)) {
          return;
        }
        this.$router.push({
          path: `/order/afterSale/18`
        });
        break;
      case 19:
        // 售后订单-退款退货
        if (!this.accessIsOpened("PERM:AFTER_SALE:VIEW", true)) {
          return;
        }
        this.$router.push({
          path: `/order/afterSale/19`
        });
        break;
      case 20:
        // 售后订单-换货
        if (!this.accessIsOpened("PERM:AFTER_SALE:VIEW", true)) {
          return;
        }
        this.$router.push({
          path: `/order/afterSale/20`
        });
        break;
    }
  }
  datePickerChange(val = []): void {
    if (val) {
      this.subForm.startDate = val[0];
      this.subForm.endDate = val[1];
    } else {
      this.subForm.startDate = "";
      this.subForm.endDate = "";
    }
  }
  resetForm(): void {
    this.datePickerVal = [];
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  .colorStyle {
    color: #168ff1;
    cursor: pointer;
  }
  .colorStyle2 {
    color: #494949;
    cursor: pointer;
  }
}
</style>