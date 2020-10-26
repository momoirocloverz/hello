<template>
  <div>
    <!--dialog-->
    <el-dialog title="选择活动"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="70%">
      <div class="dialog-content">
        <search-table ref="searchTableRef"
                      :url="urls.ACTIVITY_LIST"
                      :tableColumns="tableColumns"
                      :searchConfig="searchConfig"
                      :isDefaultQuery="true"
                      :proxyQuery="proxyQuery"
                      :defaultSelected="info.list"
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
import dayjs from "dayjs";

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
        prop: "code",
        placeholder: "活动代码"
      },
      {
        tag: "input",
        prop: "name",
        placeholder: "活动名称"
      },
      {
        tag: "select",
        prop: "type",
        placeholder: "活动类型",
        options: [
          {
            value: 0,
            label: "抽奖活动",
            key: "LUCKY_DRAW"
          },
          {
            value: 1,
            label: "团购活动",
            key: "GROUP_ON"
          },
          {
            value: 2,
            label: "线下活动",
            key: "OFF_LINE"
          }
        ]
      }
    ]
  };
  private tableColumns: object = [
    {
      type: "selection",
      width: 80
    },
    {
      title: "活动编号",
      key: "code",
      width: 150
    },
    {
      title: "活动名称",
      key: "name"
    },
    {
      title: "创建时间",
      key: "createdTime",
      formatter: (val: number) => {
        return dayjs(val).format("YYYY-MM-DD HH:mm:ss");
      }
    },
    {
      title: "活动类型",
      key: "typeStr"
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
    if (this.selectList.length > 5) {
      return this.$message({ type: "warning", message: "最多只能选择5个活动" });
    }
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
    return filters;
  }
  selectionChange(arr: Item[]) {
    this.selectList = arr;
  }
  @Watch("showDialog")
  onShowDialog(newVal: boolean, oldVal: boolean) {}
}
</script>
