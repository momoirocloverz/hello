<template>
  <div>
    <!--dialog-->
    <el-dialog title="文章统计"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="70%">
      <div class="dialog-content">
        <div class="article-box">
          <div class="article-box_left">
            <img :src="_articleObj.coverUrl"
                 class="cover_url">
            <div class="article-box_content">
              <h4 class="article-box_title">{{_articleObj.title}}</h4>
              <div>
                <span class="article-box_note">发布人：{{_articleObj.publisher}}</span>
                <span class="article-box_note">发布时间：{{dayjs(_articleObj.publishTime).format('YYYY-MM-DD HH:mm')}}</span>
                <span class="article-box_note">素材来源：{{arr[parseInt(_articleObj.materialSource)]}}</span>
              </div>
            </div>
          </div>
          <div class="article-box_fixed">
            <span>更新时间：{{dayjs(_articleObj.refreshDate).format('YYYY-MM-DD HH:mm:ss')}}</span>&nbsp;&nbsp;
            <el-button size="small"
                       @click="refresh">刷新</el-button>
          </div>
        </div>
        <el-tabs v-model="curTab"
                 v-if="showDialog && sysPlat==='agent'">
          <!-- <el-tab-pane label="微信公众号"
                       name="0">
            <wxStatistics></wxStatistics>
          </el-tab-pane> -->
          <el-tab-pane label="商城资讯"
                       name="1">
          </el-tab-pane>
          <el-tab-pane label="内部资讯"
                       name="2">
          </el-tab-pane>
        </el-tabs>
        <mallInfoStatistics v-show="curTab==='1'"
                            v-if="showDialog"
                            :articleObj="_articleObj"
                            ref="mallStatisticsRef"
                            :radioGroup="radioGroup"
                            :handleData="handleData"
                            :articleAll="articleAll" />
        <infoStatistics v-show="curTab==='2'"
                        v-if="showDialog && sysPlat==='agent'"
                        :articleObj="_articleObj"
                        :internalAll="articleInternalAll"
                        :sumaryFn="articleInternalSumary"
                        ref="infoStatisticsRef" />
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, PropSync, Ref } from "vue-property-decorator";
// import wxStatistics from "../components/wxStatistics.vue";
import mallInfoStatistics from "../components/mallInfoStatistics.vue";
import infoStatistics from "../components/infoStatistics.vue";
import dayjs from "dayjs";
import {
  // 经销商
  agentHandleData,
  agentCustomerTable,
  agentAdviserTable,
  // 集团
  companyHandleData,
  companyBlocTable,
  companyAgentTable,
  // 主机厂
  factoryHandleData,
  factoryMfTable,
  factoryBlocTable,
  factoryAgentTable
} from "../const/mallInfoConfig";
import {
  articleInternalAll,
  articleInternalSumary,
  // 经销商
  articleShopAll,
  articleAgentCustomer,
  articleAgentAdviser,
  // 主机厂
  articleMfAll,
  articleMfFactory,
  articleMfDealer,
  articleMfBloc,
  // 集团
  articleBlocAll,
  articleBloc,
  articleBlocDealer
} from "@/api";

@Component({
  components: {
    // wxStatistics,
    mallInfoStatistics,
    infoStatistics
  }
})
export default class dialogReview extends Vue {
  @Ref() readonly mallStatisticsRef: any;
  @Ref() readonly infoStatisticsRef: any;
  readonly articleInternalAll = articleInternalAll;
  readonly articleInternalSumary = articleInternalSumary;

  readonly dayjs = dayjs;
  private get arr() {
    const key = '自建';
    let t = ["主机厂", "集团", "经销商"];
    let sp = this.$route.query.sysPlat;
    // if (sp === 'factory') {
    //   t[0] = key // 吉利营销平台GLEMP-1989
    // }
    if (sp === 'company') {
      t[1] = key
    }
    if (sp === 'agent') {
      t[2] = key
    }
    return t
  };

  @Prop({ default: false })
  readonly showDialog: boolean;
  @Prop()
  readonly info: object;
  @Prop()
  readonly editMode: boolean;
  @PropSync("articleObj", { type: Object }) _articleObj: any;
  private curTab: string = "1";
  private form: object = {};
  private radioGroup: any[] = [];
  private handleData: any = [];
  private articleAll: Function;
  get sysPlat() {
    return this.$route.query.sysPlat;
  }
  get agentRadioGroup(): any[] {
    return [
      {
        label: "0",
        text: "客户阅读分享记录",
        tableAttrs: agentCustomerTable,
        apiFn: this.articleAgentCustomer
      },
      {
        label: "1",
        text: "顾问分享记录",
        tableAttrs: agentAdviserTable,
        apiFn: this.articleAgentAdviser
      }
    ];
  }
  get companyRadioGroup(): any[] {
    return [
      {
        label: "0",
        text: "集团",
        tableAttrs: companyBlocTable,
        apiFn: this.articleBloc
      },
      {
        label: "1",
        text: "经销商",
        tableAttrs: companyAgentTable,
        apiFn: this.articleBlocDealer
      }
    ];
  }
  get factoryRadioGroup(): any[] {
    return [
      {
        label: "0",
        text: "主机厂",
        tableAttrs: factoryMfTable,
        apiFn: this.articleMfFactory
      },
      {
        label: "1",
        text: "集团",
        tableAttrs: factoryBlocTable,
        apiFn: this.articleMfBloc
      },
      {
        label: "2",
        text: "经销商",
        tableAttrs: factoryAgentTable,
        apiFn: this.articleMfDealer
      }
    ];
  }
  /** agent */
  articleAgentCustomer(params = {}) {
    return articleAgentCustomer(this._articleObj.id, params);
  }
  articleAgentAdviser(params = {}) {
    return articleAgentAdviser(this._articleObj.id, params);
  }
  /** company */
  articleBloc(params = {}) {
    return articleBloc(this._articleObj.id, params);
  }
  articleBlocDealer(params = {}) {
    return articleBlocDealer(this._articleObj.id, params);
  }
  /** factory */
  articleMfFactory(params = {}) {
    return articleMfFactory(this._articleObj.id, params);
  }
  articleMfBloc(params = {}) {
    return articleMfBloc(this._articleObj.id, params);
  }
  articleMfDealer(params = {}) {
    return articleMfDealer(this._articleObj.id, params);
  }

  closeDialog() {
    this.curTab = "1";
    this.$emit("close", true);
  }
  refresh() {
    this.mallStatisticsRef && this.mallStatisticsRef.refresh();
    this.infoStatisticsRef && this.infoStatisticsRef.refresh();
    this.$nextTick(() => {
      this._articleObj.refreshDate = new Date();
    });
  }
  /**
   * @description 根据sysPlay 来选择将要显示的内容、接口
   */
  initPageView() {
    switch (this.sysPlat) {
      case "agent":
        this.radioGroup = this.agentRadioGroup;
        this.handleData = agentHandleData;
        this.articleAll = articleShopAll;
        break;
      case "company":
        this.radioGroup = this.companyRadioGroup;
        this.handleData = companyHandleData;
        this.articleAll = articleBlocAll;
        break;
      case "factory":
        this.radioGroup = this.factoryRadioGroup;
        this.handleData = factoryHandleData;
        this.articleAll = articleMfAll;
        break;
    }
  }

  created() {
    this.initPageView();
  }
}
</script>


<style lang="scss" scoped>
.article-box {
  width: 100%;
  margin: 5px 0;
  margin: 10px 0;
  position: relative;
  .article-box_left {
    display: flex;
    justify-content: space-between;
    width: calc(100% - 320px);
  }
  img {
    width: 60px;
    height: 60px;
    margin-right: 10px;
  }
  .article-box_content {
    width: 100%;
  }

  .article-box_title {
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    vertical-align: middle;
    color: #333;
    font-size: 13px;
    line-height: 1.5em;
    margin: 0;
    margin-bottom: 10px;
  }

  .article-box_note {
    color: #666;
    display: inline-block;
    margin-right: 15px;
  }
  .article-box_fixed {
    position: absolute;
    right: 20px;
    top: 10px;
    width: 300px;
    text-align: right;
  }
}
.cover_url {
  width: 40px;
  height: 40px;
}
</style>
