<template>
  <div>
    <el-admin-table :tableAttrs="tableAttrs"
                    :apiFn="articleShareList" />
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
import { Component, Prop, Vue } from "vue-property-decorator";
import { articelShareTable } from "../const/adviser-config";
import { articleShareList, articleBaseDetail } from "@/api";
import dayjs from "dayjs";

@Component
export default class ArticleShare extends Vue {
  readonly componentName: string = "ArticleShare";
  dialogTableVisible: boolean = false;
  detailInfo: Object = {};
  readonly tableAttrs = {
    border: true,
    columns: [
      ...articelShareTable,
      {
        type: "operation",
        btns: [
          {
            text: "预览",
            atClick: (row: any) => {
              this.articleDetail(row.articleDetailId);
            }
          }
        ]
      }
    ]
  };
  async articleDetail(id: number) {
    try {
      this.dialogTableVisible = true;
      let { data } = await articleBaseDetail(id);
      data.publishTime = dayjs(data.publishTime).format("YYYY-MM-DD HH:mm");
      this.detailInfo = data;
    } catch (error) {
      this.log(error);
    }
  }
  closeModel() {
    this.detailInfo = {};
  }
  get id() {
    return this.$route.params.id;
  }
  articleShareList(params = {}) {
    return articleShareList({ id: this.$route.params.id, ...params });
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