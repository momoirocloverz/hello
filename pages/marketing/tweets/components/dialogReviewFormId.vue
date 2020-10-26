<template>
  <div>
    <!--dialog-->
    <el-dialog title="文章详情"
               :visible.sync="showDialog"
               :before-close="closeDialog">
      <div class="dialog-content"
           id="article-detail">
        <h4>{{pageData.title}}</h4>
        <em>{{now}} {{isResource ? pageData.author: pageData.publisher}}</em>
        <!-- <div class="image-box"
             v-if="pageData.coverUrl">
          <img :src="pageData.coverUrl"
               :alt="pageData.title" />
        </div> -->
        <div v-html="pageData.content"
             class="content"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from "vue-property-decorator";
import dayjs from "dayjs";
import api from "@/api/restful";

const obj = {
  title: "请输入标题",
  author: "作者",
  content: "请输入内容",
  publishTime: new Date().getTime()
};

@Component
export default class dialogReview extends Vue {
  @Prop({ default: true }) readonly showDialog: boolean;
  @Prop({ default: { id: null } }) readonly info: any;
  @Prop({ default: false }) readonly editMode: boolean;
  // 是否是图文素材，图文素材的预览和文章的预览请求地址不一样
  @Prop({ default: false }) readonly isResource: boolean;
  private pageData: any = obj;
  get now() {
    let n = (time?: string) => dayjs(time || new Date().getTime()).format("YYYY-MM-DD HH:mm:ss");
    if (this.pageData.publishTime || this.pageData.createdTime) {
      return n(this.pageData.publishTime || this.pageData.createdTime);
    } else {
      return '-';
    }
  }
  closeDialog() {
    this.$emit("close", true);
  }
  async getDetail() {
    try {
      let { data } = await api.get({ url: "ARTICLE_DETAIL", isAdminApi: true, id: this.info.id });
      this.pageData = data;
    } catch (err) {
      console.log(err);
    }
  }
  async getDetailByIdAndIndex() {
    try {
      let { data } = await api.get({
        url: "MATERIAL_ARTICLE",
        isAdminApi: true,
        id: this.info.id,
        index: this.info.index
      });
      this.pageData = data;
    } catch (err) {
      console.log(err);
    }
  }
  @Watch("showDialog")
  onShowDialog(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal && newVal) {
      this.isResource ? this.getDetailByIdAndIndex() : this.getDetail();
    } else {
      this.pageData = obj;
    }
  }
}
</script>


<style lang="scss">
#article-detail {
  .dialog-content {
    height: 80vh;
    overflow: scroll;
  }
  h4 {
    margin: 0;
    margin-bottom: 10px;
  }
  em {
    font-style: normal;
    color: #666;
  }
  .content {
    margin-top: 20px;
    img {
      width: 100%;
    }
  }
  .image-box {
    width: 100%;
    margin: 10px 0;
    img {
      width: 100%;
    }
  }
}
</style>
