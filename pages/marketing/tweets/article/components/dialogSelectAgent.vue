<template>
  <div>
    <!--dialog-->
    <el-dialog title="选择经销商"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="70%">
      <div class="dialog-content">
        <search-table ref="searchTableRef"
                      :url="reqUrl"
                      :tableColumns="tableColumns"
                      :searchConfig="searchConfig"
                      :isDefaultQuery="true"
                      :proxyQuery="proxyQuery"
                      :defaultSelected="info.selectList"
                      selectItemKey="dealerCode"
                      @selectionChange="selectionChange">
        </search-table>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <span style="float:left;margin-top:10px;">已选：{{selectList.length}}</span>
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary"
                   @click="closeAndRefresh">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue, Ref } from "vue-property-decorator";
import SearchTable from "@/components/search-table/index.vue";
import api from "@/api/restful";
import urls from "@/api/urls";

interface Item {
  id: number;
  dealerCode: string;
  dealerName: string;
  dealerShortName: string;
  blocName: string;
  dealerStatus: string;
}

@Component({
  components: {
    SearchTable
  }
})
export default class dialogReview extends Vue {
  @Ref() searchTableRef!: SearchTable;
  @Prop({ default: true })
  readonly showDialog: boolean;
  @Prop({ default: {} })
  readonly info: any;

  private tableData: Item[] = [];
  private urls: any = urls;
  private role: string | null = null;
  private selectList: Item[] = [];
  get searchConfig() {
    if (this.role === "company") {
      return {
        props: [
          {
            tag: "input",
            prop: "name",
            placeholder: "经销商名称"
          },
          {
            tag: "input",
            prop: "buName",
            placeholder: "事业部"
          }
        ]
      };
    } else {
      return {
        props: [
          {
            tag: "input",
            prop: "name",
            placeholder: "经销商名称"
          },
          {
            tag: "input",
            prop: "buName",
            placeholder: "事业部"
          },
          {
            tag: "input",
            prop: "blocName",
            placeholder: "所属集团"
          }
        ]
      };
    }
  }
  private tableColumns: object = [
    {
      type: "selection",
      width: 80
    },
    {
      title: "经销商代码",
      key: "dealerCode"
    },
    {
      title: "经销商名称",
      key: "dealerName"
    },
    {
      title: "经销商简称",
      key: "dealerShortName"
    },
    {
      title: "事业部",
      key: "buName"
    },
    {
      title: "大区",
      key: "regionName"
    },
    {
      title: "联系电话",
      key: "contactNumber"
    },
    {
      title: "所在城市",
      key: "area"
    },
    {
      title: "营业状态",
      key: "dealerStatus",
      formatter: (val: string) => {
        return val === "1" ? "营业" : "非营业";
      }
    },
    {
      title: "所属集团",
      key: "blocName"
    }
  ];
  get reqUrl() {
    if (this.role === "company") {
      return urls.COMPANY_AGENT_LIST;
    } else if (this.role === "factory") {
      return urls.FACTORY_AGENT_LIST;
    } else {
      return "";
    }
  }
  closeDialog() {
    this.searchTableRef.resetDefaultSelect();
    this.$emit("close", true);
  }
  /**
   * 关闭弹窗并通知刷新
   */
  closeAndRefresh() {
    let arr: string[] = [];
    this.selectList.map((v: Item) => {
      arr.push(v.dealerCode);
    });
    this.$emit("selected", arr);
    this.$emit("close", true);
  }
  selectionChange(arr: Item[]) {
    this.selectList = arr;
  }
  proxyQuery(filters: any) {
    filters.enabled = 1;
    return filters;
  }
  created() {
    this.role = (<any>this.$route.query).sysPlat;
  }
  @Watch("showDialog")
  onShowDialog(newVal: boolean, oldVal: boolean) {}
}
</script>
