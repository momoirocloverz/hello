<!--评价详情-->
<template>
  <el-dialog class="comment-detail" :title="dialogObj.title" :visible.sync="dialogObj.show" width="60%" append-to-body>
    <div :loading="!hasLoad">
      <div class="top mb-15">
        <div class="right">
          <img :src="commentDetail.avatar" class="avatar" alt="头像" />
          <div class="name">{{ commentDetail.userName }}</div>
          <div class="time">{{ commentDetail.createdTime | momentTime }}</div>
        </div>
        <div class="left">
          <span :class="['dot', `dot${commentDetail.status}`]"></span>
          <span>{{ constant.statusMap[commentDetail.status] }}</span>
        </div>
      </div>
      <div class="content">
        <p>
          <label>购买商品：</label><strong>{{ commentDetail.targetName }}</strong
          ><span class="common_tip ml-15">({{ commentDetail.skuPropertyValue }})</span>
        </p>
        <p>
          <label>商品评价：</label
          ><strong>{{ commentDetail.star ? constant.levelMap[commentDetail.star.starValue] : "-" }}</strong>
        </p>
        <p class="comment-text">{{ commentDetail.commentText }}</p>
        <viewer class="pic" :images="commentDetail.pics">
          <div class="pic-item" v-for="pic in commentDetail.pics" :key="pic">
            <img :src="pic" alt="" />
          </div>
        </viewer>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { getCommentDetail } from "@/api";
import Const from "../../const/comment";
@Component({
  name: "commentStatistic",
  components: {}
})
export default class extends Vue {
  @Prop({ default: () => {} }) private dialogObj: any;
  constant = new Const(this).const;
  commentDetail: any = {};
  hasLoad: boolean = false;
  async getData() {
    this.hasLoad = false;
    let res = await getCommentDetail(this.dialogObj.info);
    this.hasLoad = true;
    this.commentDetail = res.data;
  }
  created() {
    this.getData();
  }
}
</script>

<style scoped lang="scss">
.comment-detail {
  .top {
    display: flex;
    overflow: hidden;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .right {
      flex: 1;
      .name {
        margin-bottom: 20px;
      }
    }
    .left {
      width: 120px;
    }
    .avatar {
      float: left;
      width: 80px;
      height: 80px;
    }
  }
  .comment-text {
    color: #999;
  }
  .pic {
    display: flex;
    flex-direction: row;
  }
  .pic-item {
    width: 200px;
    height: 160px;
    margin-left: 15px;
    margin-bottom: 15px;
    cursor: pointer;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
