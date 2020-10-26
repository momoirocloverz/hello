<template>
  <div class="record-list">
    <div class="message-list" v-if="messageList.length > 0">
      <div class="message-item" v-for="(item, idx) in messageList" :key="idx">
        <div>
          <span class="time">{{ (item.msgTimestamp * 1000) | momentTime }}</span>
          <span class="person">[{{ item.fromName }}]</span>
        </div>
        <div class="content">
          {{ getContent(item) }}
        </div>
      </div>
      <div class="fr mt-15">
        <el-pagination
          layout="prev, pager, next, sizes, jumper, total"
          :page-size="filter.size"
          :page-sizes="[10, 20, 30]"
          :pager-count="5"
          :current-page="filter.page"
          @current-change="currentChange"
          @size-change="sizeChange"
          background
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <div class="common_flex-center" v-else>暂无数据</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { getMessageList } from "@/api";
import { State } from "vuex-class";
import { FilterInter } from "@/@types/activity";
@Component({
  name: "messageRecord"
})
export default class extends Vue {
  @State(state => state.activity.actDetailInfo) private actDetailInfo!: any;
  @Prop({ default: () => [] }) private messageList: Array<any>;
  @Prop({ default: () => {} }) private filter: FilterInter;
  @Prop({ default: () => 0 }) private totalCount: number;
  private dataList: Array<any> = [];
  private total: number = 0;
  private currentChange(val: number) {
    this.$emit("msgPageChange", val);
    this.$emit("getMsgList");
  }
  private sizeChange(val: number) {
    this.$emit("msgSizeChange", val);
    this.$emit("getMsgList");
  }
  getContent(content: any) {
    return JSON.parse(content.msgContents || "")[0] && JSON.parse(content.msgContents || "")[0].Text;
  }
  @Watch("messageList")
  onMessageList() {
    this.total = this.totalCount;
    this.dataList = this.messageList;
  }

  mounted() {}
}
</script>

<style scoped lang="scss">
.record-list {
  .message-item {
    margin: 10px 0;
    .time {
      color: #666;
    }
    .person {
      color: #56c658;
      margin-left: 10px;
    }
    .content {
      margin-top: 10px;
    }
  }
}
</style>
