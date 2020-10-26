<template>
  <div>
    <el-admin-table :tableAttrs="tableAttrs"
                    ref="adminTableRef"
                    :apiFn="getlowPriceList"
                    v-on="$listeners"
                    :formData.sync="searchData">
      <template slot="search">
        <el-form-item prop="dealerCode"
                      label="经销商">
          <el-select v-model="searchData.dealerCode"
                     clearable>
            <el-option v-for="(item, i) in dealerList"
                       :key="i"
                       :label="item.dealerName"
                       :value="item.dealerCode" />
          </el-select>
        </el-form-item>
        <el-form-item prop="status"
                      label="审核状态">
          <el-select v-model="searchData.status"
                     clearable>
            <el-option v-for="(item, i) in statusList"
                       :key="i"
                       :label="item.label"
                       :value="item.value" />
          </el-select>
        </el-form-item>
      </template>
    </el-admin-table>
  </div>
</template>

<script lang='ts'>
import { Component, Ref, PropSync, Vue } from 'vue-property-decorator';
import { listColumn, statusList } from "../const/apply-low-price";
import { roleInfoSetting } from "@/utils/userSetting";
import {
  getlowPriceList,
  examinePriceApproval,
  examinePriceRejected,
  blocDealerList,
  dealerList
} from "@/api";
const BigNumber = require('bignumber.js');

@Component({
  inheritAttrs: false
})
export default class ApplyForLowPrice extends Vue {
  @Ref() readonly adminTableRef: any;
  readonly BigNumber = BigNumber;
  readonly tableAttrs = {
    border: true,
    columns: [
      ...listColumn,
      {
        type: "operation",
        col: {
          width: "100px",
          fixed: 'right'
        },
        btns: [
          {
            text: "-",
            show: (row: any) => row.status !== 0
          },
          {
            prop: (row: any) => {
              return {
                disabled: row.msgType === "1",
              };
            },
            show: (row: any) => this.accessIsOpened("PERM:LIMITED_PRICE:EDIT") && row.status === 0,
            text: "通过",
            atClick: (row: any) => this.examinePriceApply(row, 'APPROVAL')
          },
          {
            prop: (row: any) => {
              return {
                disabled: row.msgType === "1",
              };
            },
            show: (row: any) => this.accessIsOpened("PERM:LIMITED_PRICE:EDIT") && row.status === 0,
            text: "驳回",
            atClick: (row: any) => this.examinePriceApply(row, 'REJECT')
          }
        ]
      }
    ]
  };
  searchData = {
    dealerCode: '',
    status: ''
  };
  dealerList: element.Options[] = [];
  statusList: element.Options[] = statusList;
  getlowPriceList(params = {}) {
    return getlowPriceList(params)
  };
  async getDealerList(param = { size: 999, page: 1 }) {
    try {
      let fn = dealerList;
      if (roleInfoSetting.getRole() === "1") {
        fn = blocDealerList;
      }
      const { data } = await fn(param);
      this.dealerList = data;
    } catch (e) {
      this.log(e)
    }
  }
  examinePriceApply(row: any, status: string) {
    const textStyle = "color:#777;font-size:13px";
    const txt = "删除后该限价范围内的区域将不再受此规则的价格限制，不影响已出售的产品";
    const fn = status === 'APPROVAL' ? examinePriceApproval : examinePriceRejected;
    const operate = status === 'APPROVAL' ? '通过' : '驳回';
    this.$confirm(
      `确定${operate}“${row.dealerName}”的低价申请？
      <p style='${textStyle}'>申请优惠金额： ${BigNumber(row.maxDiscount).dividedBy(10000)} 万</p>
      <p style='${textStyle}'>申请车型： ${row.seriesName + ' — ' + row.modelName}</p>
      <p style='${textStyle}'>申请原因： ${row.reason}</p>`,
      `${operate}`,
      {
        dangerouslyUseHTMLString: true
      }).then(async () => {
        try {
          const params = {
            status,
            ruleId: row.ruleId
          }
          const { data } = await fn(params)
          if (data) {
            this.showMsg('操作成功')
            this.adminTableRef.getList();
          }
        } catch (e) {
          this.log(e)
        }
      });
  };
  created() {
    this.getDealerList()
  }
}
</script>