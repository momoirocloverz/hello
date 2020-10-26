<!--图文选择列表-->
<template>
  <div v-loading="loading">
    <water-full-load class="news-list" v-if="loaded" :dataList="itemsList" @loadData="loadData">
      <div
        :class="['news-item', { current: item.mediaId === currentItem.mediaId }]"
        @click="chooseItem(item)"
        slot="content"
        slot-scope="{ item }"
      >
        <div class="new-top">更新于 {{ item.updateTime | momentTime }}</div>
        <div class="article-list">
          <div class="article-item" v-for="(art, idx) in item.content.articles" :key="idx">
            <span class="title">{{ art.title }}</span>
            <img class="art-img" alt="" :src="art.thumbUrl" />
          </div>
        </div>
        <div class="mask">
          <i class="el-icon-check"></i>
        </div>
      </div>
      <div class="common_flex-center mt-15 common_tip" slot="footer">
        <i class="el-icon-loading" v-if="loading"></i>
        <!--        <span>{{ bottomText }}</span>-->
      </div>
    </water-full-load>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import SearchTable from "@/components/search-table/index.vue";
import { State, Action } from "vuex-class";
import waterFullLoad from "./water-full-load.vue";

@Component({
  name: "newsDialog",
  components: { SearchTable, waterFullLoad }
})
export default class extends Vue {
  @Ref() itemRef: HTMLElement;
  @State(state => state.weChat.newsInfoList) private newsInfoList!: any;
  @State(state => state.weChat.selectedMenu) private selectedMenu!: any; // 选中的menu
  @State(state => state.weChat.organId) private organId!: any;
  @Action("setSelectedMenu", { namespace: "weChat" })
  setSelectedMenu: Function;
  @Action("getMaterialNewsInfo", { namespace: "weChat" })
  getMaterialNewsInfo: Function;
  currentItem: any = {};
  pageNum: number = 0;
  pageSize: number = 10;
  total: number = 0;
  loading: boolean = false;
  loaded: boolean = false;
  itemsList: Array<any> = [];
  get bottomText() {
    return this.total > this.itemsList.length ? "加载中" : "已经到底了";
  }
  chooseItem(item: any) {
    this.currentItem = item;
    this.$emit("chooseItem", item);
  }
  async loadNewsInfo() {
    this.loading = true;
    try {
      let res = await this.getMaterialNewsInfo({
        organId: this.organId,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        type: "news"
      });
      this.loaded = true;
      this.loading = false;
      this.total = res.data.totalCount;
      this.itemsList = this.itemsList.concat(res.data.items);
    } catch (e) {
      console.log(e);
    }
  }
  async loadData() {
    if (this.total > this.itemsList.length && !this.loading) {
      this.pageNum++;
      await this.loadNewsInfo();
    }
  }
  mounted() {
    this.loadNewsInfo();
  }
}
</script>

<style scoped lang="scss">
.news-list {
  position: relative;
  padding: 15px;
  height: 500px;
  overflow: auto;
  .new-top {
    border-bottom: 1px solid $card-border;
    padding: 10px 15px;
    margin-bottom: 5px;
  }
  .news-item {
    float: left;
    position: relative;
    width: 45%;
    margin: 10px;
    border: 1px solid $card-border;

    .article-list {
      display: flex;
      justify-content: space-between;
      flex-direction: column;

      .article-item {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 10px;
        padding: 0 15px;

        .art-img {
          width: 50px;
          height: 50px;
        }

        &:first-child {
          .title {
            position: absolute;
            bottom: 20px;
            left: 20px;
          }

          .art-img {
            width: 100%;
            height: 180px;
          }
        }
      }
    }

    &:hover {
      .mask {
        display: block;
      }
    }
    &.current {
      .mask {
        display: block;
        .el-icon-check {
          color: $primary-color;
        }
      }
    }

    .mask {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6) !important;
      color: #fff;
      z-index: 1;
      text-align: center;
      padding: 14px;
    }

    .el-icon-check {
      position: absolute;
      left: 50%;
      top: 50%;
      font-size: 32px;
    }
  }
  .footer {
    position: absolute;
    bottom: 0;
  }
}
</style>
