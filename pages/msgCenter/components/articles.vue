<template>
  <div>
    <el-admin-table :tableAttrs="tableAttrs"
                    :formData.sync="subForm"
                    :apiFn="getList"
                    ref="adminTableRef"
                    @reset="resetForm">
      <template slot="search">
        <el-form-item prop="title">
          <el-input v-model="subForm.title"
                    placeholder="文章标题"
                    clearable />
        </el-form-item>
        <el-form-item prop="publisher">
          <el-input v-model="subForm.publisher"
                    placeholder="发布人"
                    clearable />
        </el-form-item>
      </template>
    </el-admin-table>
    <el-dialog title="文章详情"
               @close="closeModel"
               :visible.sync="dialogTableVisible">
      <div class="article-info">
        <p class="title">{{detailInfo.title}}</p>
        <div class="atticle-title">
          <span>{{detailInfo.publishTime}}</span>
          <span>{{detailInfo.publisher}}</span>
        </div>
        <div class="info"
             v-html="detailInfo.content"></div>
      </div>

    </el-dialog>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Ref } from "vue-property-decorator";
import { articleList, articleDetail, readSysMsg } from "@/api";
import dayjs from "dayjs";
interface SubForm {
  title: string;
  publisher: string;
}
@Component({})
export default class Article extends Vue {
  @Ref() readonly adminTableRef: any;
  subForm: SubForm = {
    title: "",
    publisher: ""
  };
  getList(param = {}) {
    return articleList(param);
  }
  dialogTableVisible: boolean = false;
  detailInfo: Object = {};
  datePickerVal: string[] = [];
  readonly tableAttrs = {
    border: true,
    columns: [
      {
        prop: "title",
        label: "文章标题"
      },
      {
        prop: "publishTime",
        label: "发布时间",
        formatter: (row: any) => dayjs(row.publishTime).format("YYYY-MM-DD HH:mm")
      },
      {
        prop: "readerNum",
        label: "阅读人数"
      },
      {
        prop: "publisher",
        label: "发布人"
      },
      {
        prop: "publisherOrgName",
        label: "来源"
      },
      {
        type: "operation",
        btns: [
          {
            prop: (row: any) => {
              return {
                disabled: row.msgType === "1"
              };
            },
            text: "详情",
            atClick: (row: any) => {
              this.articleDetail(row.id);
              this.readSysMsg(row.id)
            }
          }
        ]
      }
    ]
  };
  async readSysMsg(id: number) {
    try {
      let { msg } = await readSysMsg(id);
    } catch (error) {
      this.log(error);
    }
  }
  async articleDetail(id: number) {
    try {
      this.dialogTableVisible = true;
      let { data } = await articleDetail(id);
      data.publishTime = dayjs(data.publishTime).format("YYYY-MM-DD HH:mm");
      this.detailInfo = data;
    } catch (error) {
      this.log(error);
    }
  }
  closeModel() {
    this.detailInfo = {};
    this.adminTableRef.goSearch();
  }
  datePickerChange(val = []): void {
    console.log(val);
  }
  resetForm(): void {
    this.datePickerVal = [];
  }
}
</script>
<style lang="scss" scoped>
/deep/ {
  .el-dialog__body {
    padding-top: 10px;
  }
  .article-info {
    height: 60vh;
    overflow-y: scroll;
    .title {
      font-size: 18px;
      margin: 0;
    }
    .atticle-title {
      color: rgb(146, 140, 140);
      span {
        margin-right: 15px;
      }
    }
    .info {
      img {
        width: 100%;
      }
    }
  }
}
</style>