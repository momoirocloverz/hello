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
            <img :src="pageData.coverUrl"
                 :alt="pageData.title">
            <div class="article-box_content">
              <h4 class="article-box_title">{{pageData.title}}</h4>
              <div>
                <span class="article-box_note">创建人：{{pageData.author}}</span>
                <span class="article-box_note">创建时间：{{pageData.createdTime}}</span>
                <span class="article-box_note">素材来源：{{pageData.source}}</span>
              </div>
            </div>
          </div>
          <div class="article-box_fixed">
            <span>更新时间：{{updateTime}}</span>&nbsp;&nbsp;
            <el-button size="small"
                       @click="refresh">刷新</el-button>
          </div>
        </div>
        <div style="margin:20px 0;text-align:center;"
             v-if="role!=='agent'">
          <el-radio-group v-model="curTab"
                          size="small"
                          @change="tabChange">
            <el-radio-button :label="item.index"
                             v-for="(item, index) in tabs"
                             :key="index">{{item.name}}</el-radio-button>
          </el-radio-group>
        </div>
        <!-- <p style="margin:20px 0;">
          {{role==='agent'? '发布文章记录':tabs[parseInt(curTab)].name}}({{total}})
        </p> -->
        <search-table ref="searchTableRef"
                      :url="url"
                      :tableColumns="tableColumns"
                      :searchConfig="searchConfig"
                      :isDefaultQuery="true"
                      :proxyQuery="proxyQuery"
                      :isDelayRequest="true"
                      :proxyData="proxyData">
        </search-table>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue, Ref } from "vue-property-decorator";
import api from "@/api/restful";
import urls from "@/api/urls";
import dayjs from "dayjs";
import SearchTable from "@/components/search-table/index.vue";

const urlArr: string[] = [
  urls.COUNT_BLOC_DEALER,
  urls.COUNT_BLOC,
  urls.COUNT_DEALER,
  urls.COUNT_FACTORY_BLOC,
  urls.COUNT_FACTORY_DEALER,
  urls.COUNT_FACTORY
];

@Component({
  components: {
    SearchTable
  }
})
export default class dialogReview extends Vue {
  @Ref() searchTableRef!: SearchTable;
  @Prop({ default: true })
  readonly showDialog: boolean;
  @Prop({ default: { id: null } })
  readonly info: any;
  @Prop()
  readonly editMode: boolean;
  private urls: any = urls;
  private url: string = "";
  private role: string = "";
  private pageData: object = {};
  private total: number = 0;
  private dealerOption: any[] = [];
  private tabs: any[] = [
    { index: "0", name: "经销商发布记录" },
    { index: "1", name: "集团发布记录" },
    { index: "2", name: "主机厂发布记录" }
  ];
  private tableColumns: any = [
    {
      title: "经销商名称",
      key: "publisher"
    },
    {
      title: "发布次数",
      key: "publishCount"
    },
    {
      title: "最近发布",
      key: "currentPublishTime",
      formatter: (item: any) => {
        return dayjs(item).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    {
      title: "阅读人数",
      key: "readCount"
    },
    {
      title: "阅读次数",
      key: "readTimes"
    }
  ];
  private curTab: string = "0";
  private form: object = {};
  private updateTime: string = "";
  get searchConfig() {
    if (this.curTab === "0" && this.role !== "agent") {
      return {
        props: [
          {
            tag: "select",
            prop: "dealerCode",
            placeholder: "经销商名称",
            filterable: true,
            remoteMethod: this.remoteMethod,
            options: this.dealerOption,
            keyProp: {
              label: "dealerName",
              value: "dealerCode"
            }
          }
        ]
      };
    } else if (this.curTab === "1") {
      return {
        props: [
          {
            tag: "select",
            prop: "blocId",
            placeholder: "集团名称",
            filterable: true,
            remoteMethod: this.remoteMethod,
            options: this.dealerOption,
            keyProp: {
              label: "name",
              value: "id"
            }
          }
        ]
      };
    } else {
      return {
        props: [
          {
            tag: "input",
            prop: "publisher",
            placeholder: "发布人"
          }
        ]
      };
    }
  }
  closeDialog() {
    this.$emit("close", true);
  }
  tabChange() {
    if (this.curTab === "0") {
      if (this.role === "agent") {
        this.tableColumns[0].title = this.searchConfig.props[0].placeholder = "发布人";
      } else {
        this.tableColumns[0].title = this.searchConfig.props[0].placeholder = "经销商名称";
      }
      switch (this.role) {
        case "factory":
          this.url = urlArr[4];
          break;
        case "agent":
          this.url = urlArr[2];
          break;
        case "company":
          this.url = urlArr[0];
          break;
        default:
          break;
      }
    } else if (this.curTab === "1") {
      this.tableColumns[0].title = this.searchConfig.props[0].placeholder = "发布人";
      switch (this.role) {
        case "company":
          this.url = urlArr[1];
          break;
        case "factory":
          this.url = urlArr[3];
          break;
        default:
          break;
      }
    } else if (this.curTab === "2") {
      this.tableColumns[0].title = this.searchConfig.props[0].placeholder = "发布人";
      this.tableColumns[0].key = "publisher";
      switch (this.role) {
        case "factory":
          this.url = urlArr[5];
          break;
        default:
          break;
      }
    }
    this.$nextTick(() => {
      this.searchTableRef.handleReset();
    });
  }
  proxyQuery(filters: any) {
    filters.materialArticleId = this.info.id;
    filters.index = this.info.index;
    return filters;
  }
  proxyData(data: any[]) {
    this.total = data.length;
    return data;
  }
  // 获取文章详情
  async getDetailByIdAndIndex() {
    let arr: string[] = ["主机厂", "集团", "自建"];
    try {
      let { data } = await api.get({
        url: "MATERIAL_ARTICLE",
        isAdminApi: true,
        id: this.info.id,
        index: this.info.index
      });
      data.source = arr[data.source];
      data.updatedTime = dayjs(data.updatedTime).format("YYYY-MM-DD HH:mm:ss");
      data.createdTime = dayjs(data.createdTime).format("YYYY-MM-DD HH:mm:ss");
      this.pageData = data;
      this.getUpdateTime();
    } catch (err) {
      console.log(err);
    }
  }
  async remoteMethod(val: string) {
    let url;
    switch (this.curTab) {
      case "0":
        url = "FACTORY_AGENT_LIST";
        break;
      case "1":
        url = "GROUP_URL";
        break;
      default:
        break;
    }
    let res = await api.get({ url: url, isAdminApi: true, name: val, page: 1, size: 10 });
    this.dealerOption = res.data;
  }
  getUpdateTime() {
    this.updateTime = dayjs().format("YYYY-MM-DD HH:mm:ss");
  }
  refresh() {
    this.getDetailByIdAndIndex();
    this.$nextTick(() => {
      this.searchTableRef.handleReset();
    });
  }
  created() {
    this.role = (<any>this.$route.query).sysPlat;
    if (this.role === "company") {
      this.tabs.pop();
    }
  }
  @Watch("showDialog")
  onShowDialog(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal && newVal) {
      this.tabChange();
      this.getDetailByIdAndIndex();
      this.getUpdateTime();
    }
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
</style>
