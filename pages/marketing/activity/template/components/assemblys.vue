<template>
  <!-- 九宫格 -->
  <div class="assemblys">
    <!-- 九宫格 -->
    <div class="assemblyWrapper"
         v-if="type === 'NINE_BLOCK_BOX'">
      <div class="assemblyList">
        <div class="des">
          <p class="title">活动背景：</p>
        </div>
        <div class="preview">
          <p class="smallTit">背景色</p>
          <el-color-picker v-model="assembly.mainBgColor"
                           size="mini"
                           show-alpha></el-color-picker>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">活动时间：</p>
        </div>
        <div class="preview">
          <p class="smallTit">字体色</p>
          <el-color-picker v-model="assembly.fontColor"
                           size="mini"></el-color-picker>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">活动规则：</p>
        </div>
        <div class="preview">
          <p class="smallTit">背景色</p>
          <el-color-picker v-model="assembly.rule.bgColor"
                           size="mini"
                           show-alpha></el-color-picker>
          <p class="smallTit">字体色</p>
          <el-color-picker v-model="assembly.rule.color"
                           size="mini"></el-color-picker>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">我的奖品：</p>
        </div>
        <div class="preview">
          <p class="smallTit">背景色</p>
          <el-color-picker v-model="assembly.prizes.bgColor"
                           size="mini"
                           show-alpha></el-color-picker>
          <p class="smallTit">字体色</p>
          <el-color-picker v-model="assembly.prizes.color"
                           size="mini"></el-color-picker>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">活动标题：</p>
          <p class="tip">(建议尺寸：490x186)</p>
        </div>
        <div class="preview">
          <div class="previewBox">
            <upload-to-ali class="up-img"
                           v-model="assembly.title"
                           :size="1024 * 3"
                           ref="upLoad"></upload-to-ali>
          </div>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">活动头图：</p>
          <p class="tip">(建议尺寸：750x531)</p>
        </div>
        <div class="preview">
          <upload-to-ali class="up-img"
                         v-model="assembly.top"
                         :size="1024 * 3"
                         ref="upLoad"></upload-to-ali>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">获奖轮播：</p>
          <p class="tip">(Tip：需要开启获奖轮播才会生效)</p>
        </div>
        <div class="preview">
          <p class="smallTit">背景色</p>
          <el-color-picker v-model="assembly.prizeScroll.bgColor"
                           size="mini"
                           show-alpha></el-color-picker>
          <p class="smallTit">字体色</p>
          <el-color-picker v-model="assembly.prizeScroll.color"
                           size="mini"></el-color-picker>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">中奖人数：</p>
          <p class="tip">(Tip：需要开启参与人数才会生效)</p>
        </div>
        <div class="preview">
          <p class="smallTit">背景色</p>
          <el-color-picker v-model="assembly.partakes.bgColor"
                           size="mini"
                           show-alpha></el-color-picker>
          <p class="smallTit">字体色</p>
          <el-color-picker v-model="assembly.partakes.color"
                           size="mini"></el-color-picker>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">抽奖区域：</p>
        </div>
        <div class="preview">
          <p class="smallTit">背景色</p>
          <el-color-picker v-model="assembly.prizeView"
                           size="mini"
                           show-alpha></el-color-picker>
          <p class="smallTit">阴影色</p>
          <el-color-picker v-model="assembly.prizeViewShadow"
                           size="mini"
                           show-alpha></el-color-picker>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">抽奖按钮：</p>
          <p class="tip">(建议尺寸：332x191)</p>
        </div>
        <div class="preview">
          <div class="previewBox">
            <upload-to-ali class="up-img"
                           v-model="assembly.prizeBtn.bgImg"
                           :size="1024 * 3"
                           ref="upLoad"></upload-to-ali>
          </div>
          <div class="previewBox noBorder">
            <p class="smallTit">字体色</p>
            <el-color-picker v-model="assembly.prizeBtn.color"
                             size="mini"></el-color-picker>
          </div>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">抽奖任务：</p>
        </div>
        <div class="preview">
          <p class="tit">抽奖任务背景(建议尺寸：654x369)</p>
          <div class="previewBox">
            <upload-to-ali class="up-img"
                           v-model="assembly.prizeTask.bgImg"
                           :size="1024 * 3"
                           ref="upLoad"></upload-to-ali>
          </div>
          <div class="line"></div>
          <p class="tit">抽奖任务标题</p>
          <div class="previewBox noBorder">
            <p class="smallTit">背景色</p>
            <el-color-picker v-model="assembly.prizeTask.taskTitle.bgColor"
                             size="mini"
                             show-alpha></el-color-picker>
            <p class="smallTit">字体色</p>
            <el-color-picker v-model="assembly.prizeTask.taskTitle.color"
                             size="mini"></el-color-picker>
          </div>
          <div class="line"></div>
          <p class="tit">抽奖任务按钮(建议尺寸：284x83)</p>
          <div class="previewBox">
            <upload-to-ali class="up-img"
                           v-model="assembly.prizeTask.taskBtn.bgImg"
                           :size="1024 * 3"
                           ref="upLoad"></upload-to-ali>
          </div>
          <div class="previewBox noBorder">
            <p class="smallTit">字体色</p>
            <el-color-picker v-model="assembly.prizeTask.taskBtn.color"
                             size="mini"></el-color-picker>
          </div>
          <div class="previewBox noBorder">
            <p class="smallTit">我的邀请字体色</p>
            <el-color-picker v-model="assembly.prizeTask.taskInvite"
                             size="mini"></el-color-picker>
          </div>
        </div>
      </div>

    </div>
    <!-- 刮刮乐 -->
    <div class="assemblyWrapper"
         v-else-if="type === 'SCRATCH_TICKETS'">
      <div class="assemblyList">
        <div class="des">
          <p class="title">活动背景：</p>
        </div>
        <div class="preview">
          <p class="smallTit">背景色</p>
          <el-color-picker v-model="assembly.mainBgColor"
                           size="mini"
                           show-alpha></el-color-picker>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">活动时间：</p>
        </div>
        <div class="preview">
          <p class="smallTit">字体色</p>
          <el-color-picker v-model="assembly.fontColor"
                           size="mini"></el-color-picker>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">活动规则：</p>
        </div>
        <div class="preview">
          <div class="previewBox">
            <upload-to-ali class="up-img"
                           v-model="assembly.rule"
                           :size="1024 * 3"
                           ref="upLoad"></upload-to-ali>
          </div>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">我的奖品：</p>
        </div>
        <div class="preview">
          <p class="smallTit">背景色</p>
          <el-color-picker v-model="assembly.prizes.bgColor"
                           size="mini"
                           show-alpha></el-color-picker>
          <p class="smallTit">字体色</p>
          <el-color-picker v-model="assembly.prizes.color"
                           size="mini"></el-color-picker>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">活动标题：</p>
          <p class="tip">(建议尺寸：490x186)</p>
        </div>
        <div class="preview">
          <div class="previewBox">
            <upload-to-ali class="up-img"
                           v-model="assembly.title"
                           :size="1024 * 3"
                           ref="upLoad"></upload-to-ali>
          </div>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">活动头图：</p>
          <p class="tip">(建议尺寸：750x531)</p>
        </div>
        <div class="preview">
          <upload-to-ali class="up-img"
                         v-model="assembly.top"
                         :size="1024 * 3"
                         ref="upLoad"></upload-to-ali>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">获奖轮播：</p>
          <p class="tip">(Tip：需要开启获奖轮播才会生效)</p>
        </div>
        <div class="preview">
          <p class="smallTit">背景色</p>
          <el-color-picker v-model="assembly.prizeScroll.bgColor"
                           size="mini"
                           show-alpha></el-color-picker>
          <p class="smallTit">字体色</p>
          <el-color-picker v-model="assembly.prizeScroll.color"
                           size="mini"></el-color-picker>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">中奖人数：</p>
          <p class="tip">(Tip：需要开启参与人数才会生效)</p>
        </div>
        <div class="preview">
          <p class="smallTit">背景色</p>
          <el-color-picker v-model="assembly.partakes.bgColor"
                           size="mini"
                           show-alpha></el-color-picker>
          <p class="smallTit">字体色</p>
          <el-color-picker v-model="assembly.partakes.color"
                           size="mini"></el-color-picker>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">抽奖区域（外部）：</p>
        </div>
        <div class="preview">
          <p class="smallTit">背景色</p>
          <el-color-picker v-model="assembly.prizeView_Outside.bgColor"
                           size="mini"
                           show-alpha></el-color-picker>
          <p class="smallTit">字体色</p>
          <el-color-picker v-model="assembly.prizeView_Outside.color"
                           size="mini"
                           show-alpha></el-color-picker>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">抽奖区域（内部）：</p>
        </div>
        <div class="preview">
          <div class="previewBox">
            <upload-to-ali class="up-img"
                           v-model="assembly.prizeView_Inside.bgImg"
                           :size="1024 * 3"
                           ref="upLoad"></upload-to-ali>
          </div>
          <div class="previewBox noBorder">
            <p class="smallTit">字体色</p>
            <el-color-picker v-model="assembly.prizeView_Inside.color"
                             size="mini"></el-color-picker>
          </div>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">抽奖按钮：</p>
        </div>
        <div class="preview">
          <p class="smallTit">背景色</p>
          <el-color-picker v-model="assembly.prizeBtn.bgColor"
                           size="mini"
                           show-alpha></el-color-picker>
          <p class="smallTit">字体色</p>
          <el-color-picker v-model="assembly.prizeBtn.color"
                           size="mini"></el-color-picker>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">抽奖任务：</p>
        </div>
        <div class="preview">
          <p class="tit">抽奖任务背景(建议尺寸：654x369)</p>
          <div class="previewBox">
            <upload-to-ali class="up-img"
                           v-model="assembly.prizeTask.bgImg"
                           :size="1024 * 3"
                           ref="upLoad"></upload-to-ali>
          </div>
          <div class="line"></div>
          <p class="tit">抽奖任务标题</p>
          <div class="previewBox noBorder">
            <p class="smallTit">背景色</p>
            <el-color-picker v-model="assembly.prizeTask.taskTitle.bgColor"
                             size="mini"
                             show-alpha></el-color-picker>
            <p class="smallTit">字体色</p>
            <el-color-picker v-model="assembly.prizeTask.taskTitle.color"
                             size="mini"></el-color-picker>
          </div>
          <div class="line"></div>
          <p class="tit">抽奖任务按钮(建议尺寸：284x83)</p>
          <div class="previewBox">
            <upload-to-ali class="up-img"
                           v-model="assembly.prizeTask.taskBtn.bgImg"
                           :size="1024 * 3"
                           ref="upLoad"></upload-to-ali>
          </div>
          <div class="previewBox noBorder">
            <p class="smallTit">字体色</p>
            <el-color-picker v-model="assembly.prizeTask.taskBtn.color"
                             size="mini"></el-color-picker>
          </div>
          <div class="previewBox noBorder">
            <p class="smallTit">我的邀请字体色</p>
            <el-color-picker v-model="assembly.prizeTask.taskInvite"
                             size="mini"></el-color-picker>
          </div>
        </div>
      </div>

    </div>
    <!-- 大转盘 -->
    <div class="assemblyWrapper"
         v-else>
      <div class="assemblyList">
        <div class="des">
          <p class="title">活动背景：</p>
        </div>
        <div class="preview">
          <p class="smallTit">背景色</p>
          <el-color-picker v-model="assembly.mainBgColor"
                           size="mini"
                           show-alpha></el-color-picker>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">活动时间：</p>
        </div>
        <div class="preview">
          <p class="smallTit">字体色</p>
          <el-color-picker v-model="assembly.fontColor"
                           size="mini"></el-color-picker>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">活动规则：</p>
        </div>
        <div class="preview">
          <div class="previewBox">
            <upload-to-ali class="up-img"
                           v-model="assembly.rule"
                           :size="1024 * 3"
                           ref="upLoad"></upload-to-ali>
          </div>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">我的奖品：</p>
        </div>
        <div class="preview">
          <div class="previewBox">
            <upload-to-ali class="up-img"
                           v-model="assembly.prizes"
                           :size="1024 * 3"
                           ref="upLoad"></upload-to-ali>
          </div>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">活动标题：</p>
          <p class="tip">(建议尺寸：490x186)</p>
        </div>
        <div class="preview">
          <div class="previewBox">
            <upload-to-ali class="up-img"
                           v-model="assembly.title"
                           :size="1024 * 3"
                           ref="upLoad"></upload-to-ali>
          </div>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">活动头图：</p>
          <p class="tip">(建议尺寸：750x531)</p>
        </div>
        <div class="preview">
          <div class="previewBox">
            <upload-to-ali class="up-img"
                           v-model="assembly.top"
                           :size="1024 * 3"
                           ref="upLoad"></upload-to-ali>
          </div>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">获奖轮播：</p>
          <p class="tip">(Tip：需要开启获奖轮播才会生效)</p>
        </div>
        <div class="preview">
          <p class="smallTit">背景色</p>
          <el-color-picker v-model="assembly.prizeScroll.bgColor"
                           size="mini"
                           show-alpha></el-color-picker>
          <p class="smallTit">字体色</p>
          <el-color-picker v-model="assembly.prizeScroll.color"
                           size="mini"></el-color-picker>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">抽奖区域：</p>
        </div>
        <div class="preview">
          <p class="tit">抽奖区域跑马灯1(建议尺寸：619x619)</p>
          <div class="previewBox">
            <upload-to-ali class="up-img"
                           v-model="assembly.prizeView.bgImg_outSide_one"
                           :size="1024 * 3"
                           ref="upLoad"></upload-to-ali>
          </div>
          <p class="tit">抽奖区域跑马灯2(建议尺寸：619x619)</p>
          <div class="previewBox">
            <upload-to-ali class="up-img"
                           v-model="assembly.prizeView.bgImg_outSide_two"
                           :size="1024 * 3"
                           ref="upLoad"></upload-to-ali>
          </div>
          <div class="previewBox noBorder">
            <p class="smallTit">背景色</p>
            <el-color-picker v-model="assembly.prizeView.bgColor_outSide"
                             size="mini"></el-color-picker>
          </div>
          <div class="line"></div>
          <p class="tit">抽奖内部背景色</p>
          <div class="previewBox noBorder">
            <p class="smallTit">背景色1</p>
            <el-color-picker v-model="assembly.prizeView.bgColor_InSide_one"
                             size="mini"
                             show-alpha></el-color-picker>
            <p class="smallTit">背景色2</p>
            <el-color-picker v-model="assembly.prizeView.bgColor_InSide_two"
                             size="mini"
                             show-alpha></el-color-picker>
          </div>
          <div class="previewBox noBorder">
            <p class="smallTit">字体色</p>
            <el-color-picker v-model="assembly.prizeView.color"
                             size="mini"></el-color-picker>
          </div>
          <div class="line"></div>
          <p class="tit">抽奖按钮(建议尺寸：148x216)</p>
          <div class="previewBox">
            <upload-to-ali class="up-img"
                           v-model="assembly.prizeView.prizeBtn"
                           :size="1024 * 3"
                           ref="upLoad"></upload-to-ali>
          </div>
          <div class="line"></div>
          <p class="tit">转盘阴影(建议尺寸：530x74)</p>
          <div class="previewBox">
            <upload-to-ali class="up-img"
                           v-model="assembly.prizeView.prizeShadow"
                           :size="1024 * 3"
                           ref="upLoad"></upload-to-ali>
          </div>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">抽奖剩余机会：</p>
        </div>
        <div class="preview">
          <p class="smallTit">背景色</p>
          <el-color-picker v-model="assembly.prizeChance.bgColor"
                           size="mini"
                           show-alpha></el-color-picker>
          <p class="smallTit">边框色</p>
          <el-color-picker v-model="assembly.prizeChance.borderColor"
                           size="mini"></el-color-picker>
          <div class="previewBox noBorder">
            <p class="smallTit">字体色</p>
            <el-color-picker v-model="assembly.prizeChance.color"
                             size="mini"></el-color-picker>
          </div>
        </div>
      </div>
      <div class="assemblyList">
        <div class="des">
          <p class="title">抽奖任务：</p>
        </div>
        <div class="preview">
          <p class="tit">抽奖任务背景(建议尺寸：654x369)</p>
          <div class="previewBox">
            <upload-to-ali class="up-img"
                           v-model="assembly.prizeTask.bgImg"
                           :size="1024 * 3"
                           ref="upLoad"></upload-to-ali>
          </div>
          <div class="line"></div>
          <p class="tit">抽奖任务标题</p>
          <div class="previewBox noBorder">
            <p class="smallTit">背景色</p>
            <el-color-picker v-model="assembly.prizeTask.taskTitle.bgColor"
                             size="mini"
                             show-alpha></el-color-picker>
            <p class="smallTit">字体色</p>
            <el-color-picker v-model="assembly.prizeTask.taskTitle.color"
                             size="mini"></el-color-picker>
          </div>
          <div class="line"></div>
          <p class="tit">抽奖任务按钮(建议尺寸：284x83)</p>
          <div class="previewBox">
            <upload-to-ali class="up-img"
                           v-model="assembly.prizeTask.taskBtn.bgImg"
                           :size="1024 * 3"
                           ref="upLoad"></upload-to-ali>
          </div>
          <div class="previewBox noBorder">
            <p class="smallTit">字体色</p>
            <el-color-picker v-model="assembly.prizeTask.taskBtn.color"
                             size="mini"></el-color-picker>
          </div>
          <div class="previewBox noBorder">
            <p class="smallTit">我的邀请字体色</p>
            <el-color-picker v-model="assembly.prizeTask.taskInvite"
                             size="mini"></el-color-picker>
          </div>
        </div>
      </div>

    </div>
  </div>

</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import UploadToAli from "@/components/upload-to-ali/src/index.ts";

@Component({
  components: {
    UploadToAli
  }
})
export default class assemblys extends Vue {
  @Prop({ type: Object, default: () => {} }) assembly: any;
  @Prop({ type: String }) type: String;

  // changeTitImg(file) {
  //   var imgURL = this.getObjectURL(file.raw);
  //   this.assembly.title = imgURL;
  // }
  // changeTopImg(file) {
  //   var imgURL = this.getObjectURL(file.raw);
  //   this.assembly.top = imgURL;
  // }
  // changeDrawBtnImg(file) {
  //   var imgURL = this.getObjectURL(file.raw);
  //   this.assembly.prizeBtn.bgImg = imgURL;
  // }
  // changeDrawTaskBgImg(file) {
  //   var imgURL = this.getObjectURL(file.raw);
  //   this.assembly.prizeTask.bgImg = imgURL;
  // }
  // changeDrawTaskBtnImg(file) {
  //   var imgURL = this.getObjectURL(file.raw);
  //   this.assembly.prizeTask.taskBtn.bgImg = imgURL;
  // }
  // getObjectURL(file) {
  //   let url = null;
  //   if (window.createObjectURL !== undefined) {
  //     url = window.createObjectURL(file);
  //   } else if (window.URL !== undefined) {
  //     url = window.URL.createObjectURL(file);
  //   } else if (window.webkitURL !== undefined) {
  //     url = window.webkitURL.createObjectURL(file);
  //   }
  //   return url;
  // }
}
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}
.assemblyWrapper {
  .assemblyList {
    border-bottom: 1px solid #ebebeb;
    padding: 15px 20px;
    display: flex;
    align-items: center;

    .title,
    .tip {
      width: 120px;
    }

    .tip {
      color: #999;
      font-size: 12px;
      line-height: 14px;
      margin-top: 5px;
    }

    .preview {
      flex: 1;
      display: flex;
      flex-wrap: wrap;

      .line {
        height: 1px;
        width: 100%;
        background: #ebebeb;
        margin-top: 10px;
        margin-left: 10px;
      }

      .tit {
        display: flex;
        margin: 10px 0px 10px 10px;
        color: #666;
        font-size: 12px;
      }

      .smallTit {
        color: #666;
        font-size: 12px;
        margin: 5px 10px 0px 10px;
      }

      .previewBox {
        width: 150px;
        height: 150px;
        border: 1px solid #ebebeb;
        padding: 5px;
        position: relative;
        margin-left: 10px;
        .up-img {
        }

        .previewImg {
          width: 100%;
          height: 100%;
          object-fit: scale-down;
        }

        .btn {
          position: absolute;
          right: 5px;
          bottom: 5px;

          .file {
            position: absolute;
            width: 100%;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            opacity: 0;
          }
        }

        &.noBorder {
          border: none;
          display: flex;
          align-items: center;
          width: auto;
          height: 40px;
          padding: 0;

          .smallTit {
            &:first-child {
              margin-left: 0;
            }
          }
        }
      }
    }
  }
}
/deep/ {
  .upload-to-oss .upload-item,
  .upload-to-oss .upload-box {
    width: 140px !important;
    height: 140px !important;
    border: none;
  }
}
</style>
