<template>
  <div class="g_container"
       v-loading="loading">
    <breadcrumb-group :breadGroup="[{label:'车型列表'}]" />

    <el-row :gutter="20"
            class="g_container">
      <el-col :span="4"
              class="box g_container">
        <div class="title">
          <b>车系（{{seriesGroup.length}}）</b>
          <el-button size="mini"
                     v-if='accessIsOpened("PERM:MODEL:EDIT")'
                     @click="getDeposit">
            订金设置
          </el-button>
        </div>
        <ul class="group">
          <li v-for="(serie, i) in seriesGroup"
              :key="i"
              @click.stop="chooseSerie(serie)"
              :class="{'active':currentSeriesTab === serie.code}">
            <div class="dfvc_box">
              <div class="dfvc">
                <!-- <img :src="serie.logo"
                     class="small_logo"> -->
                <el-tooltip effect="dark"
                            placement="right"
                            :content="serie.name+''">
                  <span class="el-link--inner">
                    {{serie.name}}
                  </span>
                </el-tooltip>
              </div>
              <div class="tags">
                <span v-for="(tag, j) in serie.tagOutputs.filter(e => e.type===0)"
                      :key="j">{{tag.name}}</span>
              </div>
            </div>

            <div class='end_btn'>
              <span class="el-button--text"
                    v-if='accessIsOpened("PERM:MODEL:VIEW")'
                    @click.stop="viewSeire(serie)">详情</span>
              <span class="el-button--text"
                    v-if='accessIsOpened("PERM:MODEL:EDIT")'
                    @click.stop="setSerie(serie)">设置</span>
            </div>
          </li>
        </ul>
      </el-col>
      <el-col :span="20">
        <el-admin-table ref="adminTableRef"
                        :hasPager="false"
                        :totalCount.sync="totalCount"
                        :tableAttrs="tableAttrs"
                        :customQuery="customQuery"
                        :pagerAttrs="{'page-sizes': [100], 'page-size':100}"
                        :apiFn="getModelBySeriesCode">
          <template slot="top-content">
            <div class="dfc">
              <b>{{seriesInPage.name || '车型'}}（{{totalCount}}）</b>
            </div>
          </template>
        </el-admin-table>
      </el-col>
    </el-row>

    <elBtnDialog title="车系设置"
                 :visible.sync="serieModalVisible"
                 @save="saveSerieForm">
      <el-form @submit.native.prevent
               :model="serieForm"
               :rules="serieFormRules"
               v-loading="serieLoading"
               class="se_mm"
               size="small"
               label-width="130px"
               style="width:90%">
        <el-form-item label="车系">
          <span class="dark_txt">{{serieOnSetting.name}}</span>
        </el-form-item>
        <el-form-item label="营销状态">
          <el-checkbox-group v-model="serieForm.DEFAULT_TAG"
                             :max="3">
            <el-checkbox v-for="(tag,i) in DEFAULT_TAG_IN_PAGE"
                         :key="i"
                         :label="tag.id">
              {{tag.name}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="销量标签">
          <el-checkbox-group v-model="serieForm.MARKETING_TAG"
                             :max="3">
            <el-checkbox v-for="(tag,i) in tagList.filter(e=>e.type==='MARKETING_TAG' || e.type===1)"
                         :key="i"
                         :label="tag.id">
              {{tag.name}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="性能标签">
          <el-checkbox-group v-model="serieForm.PERFORMANCE_TAG"
                             :max="3">
            <el-checkbox v-for="(tag,i) in tagList.filter(e=>e.type==='PERFORMANCE_TAG' || e.type===2)"
                         :key="i"
                         :label="tag.id">
              {{tag.name}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </elBtnDialog>

    <elBtnDialog :visible.sync="modalVisible"
                 :title="dialogTitle"
                 class="ask_dialog"
                 :saveAutoClose="false"
                 @save="saveModelForm">
      <el-form @submit.native.prevent
               :model="modelForm"
               ref="modelFormRef"
               :rules="modelFormRule"
               size="small"
               label-width="130px"
               v-loading="modelFormLoading"
               style="width:90%">

        <maxRulePage :maxRuleInPage="maxRuleInPage"
                     :dialogType="dialogType"
                     :isRelease="isRelease"
                     :modelForm.sync="modelForm" />
      </el-form>
    </elBtnDialog>

    <elBtnDialog title="订金设置"
                 :visible.sync="depositModal"
                 :saveAutoClose="false"
                 :dialogAttr="{width:'40%'}"
                 @save="setDeposit">
      <el-form :model="depositForm"
               ref="depositFormRef"
               :rules="depositFormRule"
               @submit.native.prevent
               size="small"
               label-width="80px">
        <el-form-item label="订金金额"
                      prop="deposit">
          <el-input v-model="depositForm.deposit"
                    v-formatNum:2="depositForm.deposit"
                    clearable>
            <span slot="append">元</span>
          </el-input>
        </el-form-item>
      </el-form>
      <div class="fz12">
        注：<br>
        <div>1.用户在线预订车型，需要支付的订金金额，所有车型统一设置</div>
        <div>2.订金金额修改后，不影响已提交的订单，之后用户将按新的订金金额进行支付</div>
      </div>
    </elBtnDialog>

    <img-preview v-model="previewUrl" />
  </div>
</template>

<script lang='ts'>
import { Component, Ref } from "vue-property-decorator";
import maxRulePage from "./components/maxRulePage.vue";
import { mixins } from "vue-class-component";
import elBtnDialog from "@/components/el-btn-dialog/index.vue";
import GoodsListMixin from "./mixin/goods-list.mixin";
import AgentDialogMixin from "./mixin/agent-dialog.mixin"
import ImgPreview from "@femessage/img-preview";
import { agentListColumn, dealerStatusList, depositValidator } from "./const/list-config";
import {
  dealerEnabling,
  dealerDiscontinuate,
  dealerUnitPrice,
  applyLowPrice,
  tagList,
  setSerieTags,
  dealerMaxRule,
  getDeposit,
  setDeposit
} from "@/api";
const trigger = ['blur', 'change'];
const DEFAULT_TAG_IN_PAGE = [
  { id: 1, name: "直降" },
  { id: 2, name: "热销" },
  { id: 3, name: "新品" }
];
const brandCode = 'geely';

@Component({
  inheritAttrs: false,
  components: { elBtnDialog, maxRulePage, ImgPreview }
})
export default class GoodAgentList extends mixins(GoodsListMixin, AgentDialogMixin) {
  @Ref() readonly adminTableRef: any;
  @Ref() readonly depositFormRef: element.Refs;
  depositModal: boolean = false;
  readonly dealerStatusList = dealerStatusList;
  readonly DEFAULT_TAG_IN_PAGE = DEFAULT_TAG_IN_PAGE;
  get tableAttrs() {
    return {
      border: true,
      columns: [
        {
          col: {
            width: "50px"
          },
          type: "index",
          label: "序号"
        },
        // {
        //   prop: "logo",
        //   label: "车型图片",
        //   render: (h: Function, row: any) =>
        //     h("img", {
        //       class: "row_img",
        //       attrs: {
        //         src: row.logo
        //       },
        //       on: {
        //         click: () => this.showImgPreview(row)
        //       }
        //     })
        // },
        // table静态列
        ...agentListColumn,
        {
          prop: "initialReservationCount",
          label: "初始预约人数"
        },
        {
          prop: "dealerModelStatus",
          label: "状态",
          render: (h: any, row: any) => h("div", [
            h('span', {
              class: (row => {
                return row.dealerModelStatus === 1
                  ? 'dot dot5'
                  : 'dot dot2'
              })(row)
            }),
            h("span", this.dealerStatusList[row.dealerModelStatus].txt)
          ])
        },
        {
          type: "operation",
          col: {
            width: "180px"
          },
          btns: [
            {
              prop: (row: any) => {
                return {
                  disabled: row.msgType === "1",
                };
              },
              text: "车型详情",
              show: (row: any) => this.accessIsOpened("PERM:MODEL:VIEW"),
              atClick: (row: any) => this.goDetail(row, "view")
            },
            ...this.operationBtns
          ]
        }
      ]
    }
  };
  maxRuleInPage: any = {}; // 最大优惠
  modelFormLoading: boolean = false;
  serieModalVisible: boolean = false;
  serieOnSetting: any = {};
  serieLoading: boolean = true;
  serieForm: any = {
    DEFAULT_TAG: [],
    PERFORMANCE_TAG: [],
    MARKETING_TAG: []
  };
  tagList: any = [];
  serieFormRules: any = {};
  depositForm: any = {
    deposit: ''
  };
  depositFormRule: any = {
    deposit: [
      { required: true, message: '请输入订金金额', trigger },
      { validator: depositValidator, trigger }
    ]
  }
  /**
   * @description 设置车系
   * @param series 车系
   */
  setSerie(serie: any) {
    this.serieOnSetting = serie;
    this.serieLoading = true;
    let DEFAULT_TAG: string[] = [];
    let MARKETING_TAG: string[] = [];
    let PERFORMANCE_TAG: string[] = [];
    serie.tagOutputs.forEach((ele: any) => {
      switch (ele.type) {
        case 0:
        case 'DEFAULT_TAG':
          DEFAULT_TAG.push(ele.id);
          break;
        case 1:
        case 'MARKETING_TAG':
          MARKETING_TAG.push(ele.id);
          break;
        case 2:
        case 'PERFORMANCE_TAG':
          PERFORMANCE_TAG.push(ele.id);
          break;
      }
    });
    this.serieForm = {
      DEFAULT_TAG,
      PERFORMANCE_TAG,
      MARKETING_TAG
    }
    this.getTagList();
    this.serieModalVisible = true;
  };
  /**
   * @description 保存标签
   */
  async saveSerieForm() {
    const type = "SERIES";
    const code = this.serieOnSetting.code;
    try {
      const params = {
        type,
        code,
        tagIds: [
          ...this.serieForm.DEFAULT_TAG,
          ...this.serieForm.PERFORMANCE_TAG,
          ...this.serieForm.MARKETING_TAG,
        ]
      }
      const { data } = await setSerieTags(params);
      if (data) {
        this.showMsg('操作成功');
        this.getSeriesByBrandCode()
      }
    } catch (e) {
      this.log(e)
    }
  }
  /**
   * @description 获取标签列表
   */
  async getTagList() {
    try {
      const params = { page: 1, size: 999 };
      const { data } = await tagList(params);
      this.tagList = data;
      this.serieLoading = false;
    } catch (e) {
      this.log(e)
      this.serieLoading = false;
    }
  };
  async getDeposit() {
    try {
      const { data } = await getDeposit();
      this.depositForm.deposit = data;
      this.depositModal = true;
      this.$nextTick(() => {
        this.depositFormRef.clearValidate();
      })
    } catch (e) {
      this.log(e)
    }
  };
  setDeposit() {
    try {
      this.depositFormRef.validate(async (v: boolean) => {
        if (v) {
          const params = { deposit: Number(this.depositForm.deposit) };
          const { data } = await setDeposit(params);
          this.showMsg('订金设置成功')
          this.depositModal = false;
        }
      })
    } catch (e) {
      this.log(e)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./style/list-page.scss";
.dfc {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 0 15px;
  height: 50px;
  border-bottom: 1px solid #ddd;
}
.se_mm {
  max-height: 400px;
  overflow: auto;
  .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }
}
.dark_txt {
  color: #222;
}
.dfvc_box {
  max-width: calc(100% - 60px);
}
.dfvc {
  display: flex;
  align-items: center;
}
.tags {
  $pa: 2;
  width: 100%;
  padding: 2px 15px 2px #{10 - $pa}px;
  font-size: 12px;
  font-weight: 400;

  span {
    color: #666;
    display: inline-block;
    padding: 0 #{$pa}px;
  }
}

.ask_dialog /deep/ {
  .el-dialog__body {
    padding-top: 10px;
    padding-bottom: 0;
  }
}
</style>
