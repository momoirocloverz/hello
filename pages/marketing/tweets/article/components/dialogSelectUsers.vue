<template>
  <div>
    <!--dialog-->
    <el-dialog title="选择用户"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="70%">
      <div class="dialog-content">
        <search-table ref="searchTableRef"
                      :url="urls.ACCOUNT"
                      :tableColumns="tableColumns"
                      :searchConfig="searchConfig"
                      :isDefaultQuery="true"
                      :isCommonURL="true"
                      :proxyQuery="proxyQuery"
                      :defaultSelected="info.selectList"
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
import { Config } from "../../const/config";
import api from "@/api/restful";
import urls from "@/api/urls";

interface Item {
  id: number;
  mobile: string;
  name: string;
  position: string;
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
  private selectList: Item[] = [];
  private conf = new Config().get(this);
  private searchConfig: object = {
    props: [
      {
        tag: "input",
        prop: "name",
        placeholder: "姓名"
      },
      {
        tag: "input",
        prop: "account",
        placeholder: "帐号"
      },
      {
        tag: "input",
        prop: "phone",
        placeholder: "手机号"
      }
    ]
  };
  private tableColumns: object = [
    {
      type: "selection",
      width: 80
    },
    {
      title: "姓名",
      key: "name",
      width: 150
    },
    {
      title: "帐号",
      key: "account",
      width: 200
    },
    {
      title: "手机号",
      key: "phone"
    },
    {
      title: "职位",
      key: "position"
    }
  ];
  closeDialog() {
    this.searchTableRef.resetDefaultSelect();
    this.$emit("close", true);
  }
  /**
   * 关闭弹窗并通知刷新
   */
  closeAndRefresh() {
    let arr: number[] = [];
    this.selectList.map((v: Item) => {
      arr.push(v.id);
    });
    this.$emit("selected", arr);
    this.$emit("close", true);
  }
  proxyQuery(filters: any) {
    // 渠道 0：主机厂用户 1：集团用户 2：经销商用户 3：商城用户, 4:销售顾问
    switch (this.info.role) {
      case "agent":
        filters.channel = 2;
        break;
      case "factory":
        filters.channel = 0;
        break;
      case "company":
        filters.channel = 1;
        break;
      default:
        break;
    }
    filters.status = "ACTIVE";
    return filters;
  }
  selectionChange(arr: Item[]) {
    this.selectList = arr;
  }
  // toggleSelection(rows) {
  //       if (rows) {
  //         rows.forEach(row => {
  //           this.$refs.multipleTable.toggleRowSelection(row);
  //         });
  //       } else {
  //         this.$refs.multipleTable.clearSelection();
  //       }
  //     }
  @Watch("showDialog")
  onShowDialog(newVal: boolean, oldVal: boolean) {}
}
</script>
