<template>
  <div style="width:100%;">
    <el-button icon="el-icon-plus" size="mini" v-if="accessIsOpened('PERM:MATERIAL:EDIT')" @click="toPath"
      >新建图文</el-button
    >
    <el-button size="mini" @click="showDialog">从素材库中选择</el-button>
    <ul class="article-box" v-if="article.contentShortList && article.contentShortList.length > 0">
      <li class="main-article">
        <div class="article-operations">
          <a href="javascript:" @click="showReviewDialog(article.id, article.contentShortList[0])">预览</a>
        </div>
        <img :src="article.contentShortList[0].coverUrl" alt="article.contentShortList[0].title" />
        <span class="main-article_title">{{ article.contentShortList[0].title }}</span>
      </li>
      <li v-for="(item, index) in article.contentShortList" v-show="index !== 0" :key="index">
        <span class="article-title">{{ item.title }}</span>
        <img :src="item.coverUrl" :alt="item.title" />
        <div class="article-operations-common">
          <a href="javascript:" @click="showReviewDialog(article.id, item)">预览</a>
        </div>
      </li>
    </ul>

    <!-- 素材库弹窗 -->
    <dialog-article
      :showDialog="dialogVisible"
      :info="curItem"
      @selected="articleChange"
      @close="dialogVisible = false"
    >
    </dialog-article>

    <!-- 预览弹窗 -->
    <dialog-review :showDialog="dialogVisible0" :info="curItem" :isResource="true" @close="dialogVisible0 = false">
    </dialog-review>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import dialogArticle from "./dialogSelectArticle.vue";
import { Item } from "../../const/config";
import dialogReview from "../../components/dialogReviewFormId.vue";

@Component({
  components: {
    dialogArticle,
    dialogReview
  }
})
export default class CouponDetail extends Vue {
  private article: Item | {} = {};
  private curItem: object = {};
  @Prop({ default: null }) private id: number | null;
  private dialogVisible: boolean = false;
  private dialogVisible0: boolean = false;
  articleChange(val: Item) {
    this.article = val;
    this.$emit("articleChange", val.id);
  }
  showReviewDialog(id: number, item: Item) {
    item.id = id;
    this.curItem = item;
    this.dialogVisible0 = true;
  }
  showDialog() {
    this.curItem = {
      id: this.id
    };
    this.dialogVisible = true;
  }
  toPath() {
    this.$router.push("/marketing/tweets/source/create?source=2");
  }
}
</script>

<style lang="scss" scoped>
ul.article-box {
  width: 360px;
  background: #f1f1f1;
  padding: 10px;
  box-sizing: border-box;

  li {
    width: 100%;
    display: flex;
    justify-content: space-between;
    list-style: none;
    padding: 10px;
    line-height: 60px;
    background: #fff;
    position: relative;
    border-bottom: 1px solid #f7f7f7;

    .article-title {
      width: 70%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    img {
      width: 60px;
      height: 60px;
    }
  }

  .article-operations:before,
  .article-operations-common:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 150px;
    background: #000;
    z-index: +4;
    opacity: 0.6;
  }

  .article-operations-common:before {
    height: 80px;
  }

  .article-operations,
  .article-operations-common {
    position: absolute;
    width: 100%;
    text-align: center;
    left: 0;
    vertical-align: middle;
    top: 0;
    z-index: +3;
    display: none;

    a {
      line-height: 150px;
      color: #fff;
      text-decoration: none;
      position: relative;
      z-index: +6;
    }
  }

  .article-operations-common a {
    line-height: 80px;
  }

  li:hover .article-operations-common,
  li:hover .article-operations {
    display: block;
  }

  li.main-article {
    width: 100%;
    position: relative;
    padding: 0;

    img {
      width: 100%;
      height: 150px;
    }

    .main-article_title {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      line-height: 1em;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 8px 10px;
      background: rgba(255, 255, 255, 0.4);
    }
  }
}
</style>
