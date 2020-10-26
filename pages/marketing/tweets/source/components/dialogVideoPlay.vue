<template>
  <div class="main-container">
    <!--dialog-->
    <el-dialog :title="info.title"
               :visible.sync="showDialog"
               :before-close="closeDialog"
               width="50%">
      <div class="dialog-content">
        <div class="video-box"
             v-if="play">
          <video controls
                 height="320"
                 ref="video">
            <source :src="info.url"
                    type="video/mp4">
            <p>Your browser doesn't support HTML5 video. Here is
              a <a :href="info.url">link to the video</a> instead.</p>
          </video>
        </div>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="closeDialog">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Watch, Prop, Vue } from "vue-property-decorator";

@Component
export default class dialogReview extends Vue {
  @Prop({ default: true }) readonly showDialog: boolean;
  @Prop({ default: {} }) readonly info: any;
  private play: boolean = true;
  closeDialog() {
    this.$emit("close", true);
  }
  @Watch("showDialog")
  onShowDialog(newVal: boolean, oldVal: boolean) {
    if (newVal !== oldVal) {
      if(!newVal){
        setTimeout(() => {
          this.play = newVal;
        }, 100);
      }else{
        this.play = newVal;
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.video-box {
  width: 100%;
  margin-top: 10px;
  display: block;
  video {
    width: 100%;
    background: #f7f7f7;
    margin-top: 10px;
    // object-fit: cover;
  }
}
</style>
