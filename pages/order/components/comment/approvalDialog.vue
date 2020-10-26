<!--通过和拒绝-->
<template>
  <el-dialog class="comment-detail" :title="dialogObj.title" :visible.sync="dialogObj.show" width="60%" append-to-body>
    <div class="approval-content">
      <div v-if="loading">
        <el-progress :percentage="percent" :stroke-width="20" :text-inside="true"></el-progress>
        <div>批量处理中，请耐心等待</div>
      </div>
      <div class="approval-result mb-15" v-else>
        批量通过操作成功
        <span class="success-text"></span>, 操作失败
        <span class="fail-text"></span>
      </div>
    </div>
    <div class="bottom-btn" v-if="!loading">
      <el-button type="primary" size="mall" @click="handleClose">知道了{{ timeLeft }}</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Const from "../../const/comment";
import { approveComment } from "@/api";

@Component({
  name: "approvalDialog",
  components: {}
})
export default class extends Vue {
  @Prop({ default: () => {} }) private dialogObj: any;
  loading: boolean = false;
  timeLeft: number = 3;
  percent: number = 1;
  get selectedIds(): any {
    return this.dialogObj.info.map((item: any) => item.id) || [];
  }
  async passComment() {
    this.loading = true;
    this.getPercent();
    await approveComment({
      ids: this.selectedIds,
      status: "PASS"
    });
    this.percent = 100;
    setTimeout(() => {
      this.loading = false;
      this.getTimeLeft();
    }, 100);
  }
  async rejectComment() {
    this.loading = true;
    this.getPercent();
    await approveComment({
      ids: this.selectedIds,
      status: "REJECT"
    });
    this.percent = 100;
    setTimeout(() => {
      this.loading = false;
      this.getTimeLeft();
    }, 100);
  }
  getPercent() {
    if (this.percent < 95) {
      let timer = setInterval(() => {
        this.percent += Math.ceil(Math.random() * 30);
        if (this.percent < 98) {
          clearInterval(timer);
          this.percent++;
        }
      }, 0);
    }
  }
  getTimeLeft() {
    let timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft === 0) {
        clearInterval(timer);
        this.handleClose();
      }
    }, 1000);
  }
  handleClose() {
    this.dialogObj.show = false;
    this.$emit("handleClose");
  }
  created() {
    if (this.dialogObj.type === "reject") {
      this.rejectComment();
    } else {
      this.passComment();
    }
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
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
