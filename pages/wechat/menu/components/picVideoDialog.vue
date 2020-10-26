<!--需要和本地素材相结合的，一期暂时无用-->
<template>
  <el-dialog
    class="chat-dialog"
    :show-close="false"
    :visible.sync="dialogObj.show"
    width="55%"
    :before-close="handleClose"
  >
    <div class="dialog-head " slot="title">
      <strong class="title">{{ dialogObj.title }}</strong>
      <div class="belong-choose">
        <span
          @click="chooseBelong(item)"
          :class="['item ', { active: curBelong.value === item.value }]"
          v-for="(item, idx) in belongArr"
          :key="idx"
          >{{ item.label }}</span
        >
      </div>
    </div>
    <div class="content">
      <div class="right">
        <el-upload action="/">
          <el-button type="primary" size="small" class="local-upload">本地上传</el-button>
        </el-upload>
        <ul class="group-list">
          <li
            @click="chooseGroup(item)"
            :class="['group-item', { current: item.value === curGroup.value }]"
            v-for="(item, idx) in groupList"
            :key="idx"
          >
            {{ item.label }}
          </li>
        </ul>
      </div>
      <div class="left" :loading="materialsInfo.loading">
        <div class="source-list" v-if="contentType === 'img'">
          <div
            :class="['source-item', { active: checkedSource.mediaId === item.mediaId }]"
            v-for="(item, idx) in sourceList"
            :key="idx"
            @click="chooseSource(item)"
          >
            <img :src="item.url" alt="" />
            <div class="name">{{ item.name }}</div>
          </div>
        </div>
        <div class="source-list" v-if="contentType === 'video'">
          <div
            :class="['source-item', { active: checkedSource.mediaId === item.mediaId }]"
            v-for="(item, idx) in sourceList"
            :key="idx"
            @click="chooseSource(item)"
          >
            <img src="https://via.placeholder.com/220x200.png" alt="" />
            <div class="duration">00:04:13</div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer common_flex-space-center" slot="footer">
      <div>已选: {{ checkedSource.url ? "1" : 0 }}/1</div>
      <div>
        <el-button size="small" @click="handleClose">取消</el-button>
        <el-button type="primary" size="small" @click="choosedPicVideo">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { DialogInfo } from "@/@types/activity";
import { Action, State } from "vuex-class";
import { BELONG_ARR } from "../../const/index";
@Component({
  name: "picVideoDialog"
})
export default class extends Vue {
  @State(state => state.weChat.materialsInfo) private materialsInfo!: any;

  @Prop({ default: {} }) private dialogObj: DialogInfo;
  @Prop({ default: "" }) private contentType: string;
  private belongArr = BELONG_ARR;
  curBelong: any = {
    label: "自建",
    value: 1
  };
  groupList: Array<{}> = [
    {
      label: "未分组",
      value: 1
    },
    {
      label: "分组1",
      value: 2
    },
    {
      label: "分组1",
      value: 3
    }
  ];

  curGroup: any = {
    label: "未分组",
    value: 1
  };
  checkedSource: any = {};
  get sourceList(): Array<{}> {
    return this.materialsInfo.data.items || [];
  }
  handleClose(): void {
    this.$emit("handleClose");
  }
  chooseBelong(item: any) {
    this.curBelong = item;
  }
  chooseGroup(item: any) {
    this.curGroup = item;
  }
  chooseSource(source: any) {
    this.checkedSource = source;
  }
  choosedPicVideo() {
    this.$emit("choosedPicVideo", this.checkedSource);
  }
}
</script>

<style lang="scss">
.chat-dialog {
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 0 !important;
  }
  .dialog-head {
    display: flex;
    height: 50px;
    line-height: 50px;
    .title {
      display: inline-block;
      width: 20%;
      padding: 0 20px;
    }
    .belong-choose {
      padding: 0 20px;
      .item {
        display: inline-block;
        width: 100px;
        text-align: center;
        cursor: pointer;
        border-bottom: 3px solid transparent;
        transition: all 0.3s ease-in-out;
        margin-right: 10px;
        &.active {
          border-bottom: 3px solid $primary-color;
        }
      }
    }
  }

  .content {
    display: flex;
    border-bottom: 1px solid #f5f5f5;
    min-height: 400px;
    .right {
      width: 20%;
      padding: 20px;
      border-right: 1px solid #f5f5f5;
      .el-upload {
        width: 100%;
      }
      .local-upload {
        width: 100%;
      }
      .group-list {
        width: 100%;
        .group-item {
          width: 100%;
          text-align: center;
          padding: 6px;
          margin-top: 10px;
          cursor: pointer;
          transition: all 0.3s ease-in-out;
          &.current {
            color: #fff;
            background: $primary-color;
          }
        }
      }
    }
    .left {
      flex: 1;
      padding: 20px;
      .source-list {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .source-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          width: 100px;
          height: 120px;
          margin: 0 10px 10px 0;
          border: 1px solid #f5f5f5;
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
    }
  }
}
</style>
