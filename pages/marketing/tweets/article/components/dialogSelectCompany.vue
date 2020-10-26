<template>
  <div>
    <!--dialog-->
    <el-dialog title="选择集团"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="70%">
      <div class="dialog-content">
        <search-table ref="searchTableRef"
                      :url="urls.GROUP_URL"
                      :tableColumns="tableColumns"
                      :searchConfig="searchConfig"
                      :isDefaultQuery="true"
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
import api from "@/api/restful";
import urls from "@/api/urls";

interface Item {
  id: number;
  shortName: string;
  name: string;
  principalName: string;
  enabled: boolean;
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
  private searchConfig: object = {
    props: [
      {
        tag: "input",
        prop: "name",
        placeholder: "集团名称"
      }
    ]
  };
  private tableColumns: object = [
    {
      type: "selection",
      width: 80
    },
    {
      title: "集团名称",
      key: "name"
    },
    {
      title: "集团简称",
      key: "shortName"
    },
    {
      title: "联系电话",
      key: "principalPhone"
    },
    {
      title: "所在城市",
      key: "area"
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
    filters.enabled = 1;
    return filters;
  }
  selectionChange(arr: Item[]) {
    this.selectList = arr;
  }
  @Watch("showDialog")
  onShowDialog(newVal: boolean, oldVal: boolean) {}
}
</script>
