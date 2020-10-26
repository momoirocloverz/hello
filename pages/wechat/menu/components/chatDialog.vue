<template>
  <el-dialog
    class="award-dialog"
    :title="dialogObj.title"
    :visible.sync="dialogObj.show"
    width="53%"
    :before-close="handleClose"
  >
    <add-video :selectedInfo="selectedInfo" v-if="dialogObj.type === 'video'"></add-video>
    <news-list :selectedInfo="selectedInfo" v-if="dialogObj.type === 'news'" @chooseItem="chooseItem"></news-list>
    <pic-list :selectedInfo="selectedInfo" v-if="dialogObj.type === 'img'" @chooseItem="chooseItem" />
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleClose" size="small">取 消</el-button>
      <el-button type="primary" @click="sure" size="small">确认</el-button>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import AddVideo from "./addVideo.vue";
import picList from "./picList.vue";
import newsList from "./newsList.vue";
import { DialogInfo } from "@/@types/activity";
import { State, Action } from "vuex-class";

@Component({
  name: "chatDialog",
  components: { AddVideo, newsList, picList }
})
export default class extends Vue {
  @State(state => state.weChat.selectedMenu) private selectedMenu!: any; // 选中的menu

  @Prop({ default: false }) private dialogObj: DialogInfo;
  @Prop({ default: "" }) private contentType: string;

  private selectedInfo: any = {};
  private handleClose(): void {
    this.$emit("handleClose");
  }
  private chooseItem(item: any) {
    this.selectedMenu.valid = true;
    this.selectedInfo = item;
  }
  private sure() {
    if (this.contentType === "news") {
      this.selectedMenu.show = true;
      this.selectedMenu.dataInfo = this.selectedInfo;
    } else {
      this.selectedMenu.show = true;
      this.selectedMenu.dataInfo = this.selectedInfo;
    }
    this.handleClose();
  }
  mounted() {}
}
</script>

<style scoped lang="scss"></style>
