<!--图片列表-->
<template>
  <div v-loading="loading">
    <water-full-load class="source-list" v-if="loaded" :dataList="sourceList" @loadData="loadData">
      <div
        :class="['source-item', { active: checkedSource.mediaId === item.mediaId }]"
        @click="chooseSource(item)"
        slot="content"
        slot-scope="{ item }"
      >
        <img :src="item.url" />
        <div class="name">{{ item.name }}</div>
      </div>
    </water-full-load>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Action, State } from "vuex-class";
import waterFullLoad from "./water-full-load.vue";

@Component({
  name: "picVideoDialog",
  components: {
    waterFullLoad
  }
})
export default class extends Vue {
  @State(state => state.weChat.materialsInfo) private materialsInfo!: any;
  @State(state => state.weChat.organId) private organId!: any;
  @Prop({ default: "" }) private contentType: string;
  @Action("getFileList", { namespace: "weChat" })
  getFileList: Function;
  checkedSource: any = {};
  loading: boolean = false;
  pageNum: number = 0;
  pageSize: number = 10;
  total: number = 0;
  loaded: boolean = false;

  sourceList: Array<any> = [];

  chooseSource(source: any) {
    this.checkedSource = source;
    this.$emit("chooseItem", source);
  }

  private async loadImgs() {
    this.loading = true;
    let res = await this.getFileList({
      organId: this.organId,
      pageNum: this.pageNum,
      pageSize: this.pageSize,
      type: "image"
    });
    this.loading = false;
    this.loaded = true;
    this.total = res.data.totalCount;
    this.sourceList = this.sourceList.concat(res.data.items);
  }
  loadData() {
    if (this.total > this.sourceList.length && !this.loading) {
      this.pageNum++;
      this.loadImgs();
    }
  }
  mounted() {
    this.loadImgs();
  }
}
</script>

<style lang="scss">
.source-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  height: 500px;
  overflow: auto;
  .source-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    float: left;
    width: 100px;
    height: 120px;
    margin: 0 20px 15px 0;
    border: 1px solid #f5f5f5;
    cursor: pointer;

    .name {
      width: 100%;
      height: 28px;
      line-height: 28px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 5px;
      text-align: center;
    }

    img {
      width: 100px;
      height: 90px;
    }

    &.active {
      &:after {
        content: "";
        position: absolute;
        bottom: 0;
        right: 0;
        display: inline-block;
        width: 19px;
        height: 19px;

        background: url("../../../../assets/images/activity/checked.png");
      }
    }
  }
}
</style>
