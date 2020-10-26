<template>
  <div>
    <el-admin-table :tableAttrs="tableAttrs"
                    :apiFn="getPriceRule"
                    ref="adminTableRef">
      <div slot="top-content"
           class="add_rule">
        <el-button size="small"
                   v-if='accessIsOpened("PERM:LIMITED_PRICE:EDIT")'
                   type="primary"
                   @click="addLimitRule">
          新建限价规则
        </el-button>
      </div>
    </el-admin-table>
    <elBtnDialog :visible.sync="modalVisible"
                 :closeOnClickModal="true"
                 :showClose="false"
                 title="限价详情"
                 :dialogAttr="{width:'40%'}">
      <el-form @submit.native.prevent
               label-width="140px"
               size="mini">
        <el-form-item label="分组名称：">
          {{dialogForm.name}}
        </el-form-item>
        <el-form-item label="最高优惠金额：">
          {{dialogForm.discountType === 0 ? BigNumber(dialogForm.maxDiscount).dividedBy(10000) : "—"}}
        </el-form-item>
        <el-form-item label="最高优惠百分比：">
          {{dialogForm.discountType === 1 ? `${BigNumber(dialogForm.maxDiscount).multipliedBy(100)} %` : "—"}}
        </el-form-item>
      </el-form>
      <el-tabs>
        <el-tab-pane label="限价车型">
          <div v-for="item in dialogForm.models"
               :key="item.code"
               class="labelx">{{item.seriesName + ' — ' + item.name}}</div>
        </el-tab-pane>
        <el-tab-pane label="限价区域">
          <div v-for="item in dialogForm.regions"
               :key="item.regionCode"
               class="labelx">{{item.regionName}}</div>
        </el-tab-pane>
      </el-tabs>
    </elBtnDialog>
  </div>
</template>

<script lang='ts'>
import { Component, Prop, Vue, Ref } from 'vue-property-decorator';
import { listColumn } from "../const/limit-rule";
import elBtnDialog from "@/components/el-btn-dialog/index.vue";
import { getPriceRule, removeRuleById } from "@/api";
const BigNumber = require('bignumber.js');

@Component({
  inheritAttrs: false,
  components: { elBtnDialog }
})
export default class LimitRule extends Vue {
  @Ref() readonly adminTableRef: any;
  readonly BigNumber = BigNumber;
  readonly tableAttrs = {
    border: true,
    columns: [
      ...listColumn,
      {
        type: "operation",
        col: {
          width: "200px"
        },
        btns: [
          {
            prop: (row: any) => {
              return {
                disabled: row.msgType === "1",
              };
            },
            show: (row: any) => this.accessIsOpened("PERM:LIMITED_PRICE:VIEW"),
            text: "详情",
            atClick: (row: any) => this.viewRule(row)
          },
          {
            prop: (row: any) => {
              return {
                disabled: row.msgType === "1",
              };
            },
            show: (row: any) => this.accessIsOpened("PERM:LIMITED_PRICE:EDIT"),
            text: "编辑",
            atClick: (row: any) => this.editRule(row)
          },
          {
            prop: (row: any) => {
              return {
                disabled: row.msgType === "1",
              };
            },
            show: (row: any) => this.accessIsOpened("PERM:LIMITED_PRICE:EDIT"),
            text: "删除",
            atClick: (row: any) => this.removeRuleById(row)
          }
        ]
      }
    ]
  };
  modalVisible: boolean = false;
  dialogForm: any = {};
  getPriceRule(params = {}) {
    return getPriceRule(params)
  };
  addLimitRule() {
    this.$router.push({
      name: "goods-price-rule",
      params: {
        operation: "add"
      }
    })
  };
  viewRule(row: any) {
    this.modalVisible = true;
    this.dialogForm = row;
  }
  editRule(row: any) {
    this.$router.push({
      name: "goods-price-rule",
      params: {
        operation: "edit",
        ruleId: row.id
      }
    })
  }
  removeRuleById(row: any) {
    const textStyle = "color:#888;font-size:13px";
    const txt = "删除后该限价范围内的区域将不再受此规则的价格限制，不影响已出售的产品";
    this.$confirm(
      `确定删除该限价规则？<p style='${textStyle}'>${txt}</p>`,
      '提示',
      {
        dangerouslyUseHTMLString: true
      }).then(async () => {
        try {
          const { data } = await removeRuleById(row.id);
          if (data) {
            this.showMsg("操作成功");
            this.adminTableRef.getList();
          }
        } catch (e) {
          this.log(e)
        }
      });
  }
}
</script>
<style lang="scss" scoped>
.add_rule {
  margin-bottom: 15px;
}
.el-form-item--mini.el-form-item {
  margin-bottom: 8px;
}
.labelx {
  line-height: 30px;
}
/deep/ {
  .el-tabs__content {
    max-height: 200px;
    overflow: auto;
  }
}
</style>
