<template>
  <el-row :gutter="20" class="top_content">
    <el-col :span="colSpan">
      <div class="purple_content t_content">
        <div class="circle orange">
          <img src="../style/bloc.png" />
        </div>
        <div class="comment">
          <b>{{ divideNumber(sumaryData.blocNum || 0) }}</b>
          <p>{{ text[0] }}</p>
        </div>
      </div>
    </el-col>
    <el-col :span="colSpan">
      <div class="purple_content t_content">
        <div class="circle red">
          <img src="../style/agent.png" />
        </div>
        <div class="comment">
          <b>{{ divideNumber(sumaryData.dealerNum || 0) }}</b>
          <p>{{ text[1] }}</p>
        </div>
      </div>
    </el-col>
    <el-col :span="colSpan">
      <div class="purple_content t_content">
        <div class="circle green">
          <img src="../style/fans.png" />
        </div>
        <div class="comment">
          <b>{{ divideNumber(sumaryData.fansNum || 0) }}</b>
          <p>{{ text[2] }}</p>
        </div>
      </div>
    </el-col>
    <el-col :span="colSpan">
      <div class="purple_content t_content">
        <div class="circle blue">
          <img src="../style/member.png" />
        </div>
        <div class="comment">
          <b>{{ divideNumber(sumaryData.memberNum || 0) }}</b>
          <p>{{ text[3] }}</p>
        </div>
      </div>
    </el-col>
    <el-col :span="colSpan">
      <div class="purple_content t_content">
        <div class="circle red">
          <img src="../style/activity.png" />
        </div>
        <div class="comment">
          <b>{{ divideNumber(sumaryData.activityNum || 0) }}</b>
          <p>{{ text[4] }}</p>
        </div>
      </div>
    </el-col>
    <el-col :span="colSpan">
      <div class="purple_content t_content">
        <div class="circle sky_blue">
          <img src="../style/article.png" />
        </div>
        <div class="comment">
          <b>{{ divideNumber(sumaryData.articleAllNum || 0) }}</b>
          <p>{{ text[5] }}</p>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import divideNumber from "@/utils/divideNumber";

@Component
export default class ActualTopFactory extends Vue {
  readonly colSpan: number = 4;
  readonly divideNumber = divideNumber;
  readonly text: string[] = ["集团总数", "经销商总数", "累计粉丝数", "累计潜客数", "累计活动场次", "累计发布文章"];
  @Prop({
    type: Object,
    default: () => {
      return {};
    }
  })
  sumaryData: any;
}
</script>
<style lang="scss" scoped>
@mixin bg($color) {
  background: $color;
  box-shadow: 0 0 20px rgba($color, 1);
}
.orange {
  @include bg(#f2cba0);
}
.red {
  @include bg(#ff6b82);
}
.green {
  @include bg(#64d77f);
}
.blue {
  @include bg(#24a1fa);
}
.sky_blue {
  @include bg(#8cefe9);
}
.top_content {
  padding: 0 !important;
}
.circle {
  border-radius: 50%;
  width: 46px;
  height: 46px;
  line-height: 46px;
  text-align: center;
}
.t_content {
  border: 1px solid #24a1fa;
  height: 80px;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 0 10px;
}
img {
  width: 20px;
  vertical-align: middle;
}
.comment {
  margin: 0 0 0 20px;
  height: 56px;
  font-size: 24px;
}
p {
  color: #656565;
  font-size: 14px;
}
</style>
