<template>
  <div>
    <!--dialog-->
    <el-dialog title="文章详情"
               :visible.sync="showDialog"
               :before-close="closeDialog">
      <div class="dialog-content"
           id="article-detail">
        <h4>{{info.title || '请输入标题'}}</h4>
        <em>{{now}} {{info.author || author}}</em>
        <!-- <div class="image-box"
             v-if="info.coverUrl">
          <img :src="info.coverUrl"
               :alt="info.title" />
        </div> -->
        <div v-html="info.content || '请输入内容'"
             class="content"></div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from "vue-property-decorator";
import dayjs from "dayjs";
import { storeInfoSetting } from "@/utils/userSetting";

@Component
export default class dialogReview extends Vue {
  @Prop({ default: true })
  readonly showDialog: boolean;
  @Prop({ default: {} })
  readonly info: any;
  @Prop()
  readonly editMode: boolean;
  private form: object = {};
  get author() {
    let s = storeInfoSetting.getInfo().info;
    return s && s.account;
  }
  get now() {
    let n = (time?: string) => dayjs(time || new Date().getTime()).format("YYYY-MM-DD HH:mm:ss");
    if (this.info.updateTime) {
      return n(this.info.updateTime);
    } else {
      return n();
    }
  }
  closeDialog() {
    this.$emit("close", true);
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
