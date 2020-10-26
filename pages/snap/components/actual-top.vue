<template>
  <el-row class="top_content actual-total" :gutter="20">
    <el-col :span="8">
      <div class="purple_content t_content">
        <div class="circle red">
          <img src="../style/eye.png" />
        </div>
        <div class="comment">
          <div>{{ divideNumber(sumaryData.browseUserTotal || 0) }}</div>
          <p>{{ text[0] }}</p>
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="skyblue_content t_content">
        <div class="circle orange">
          <img src="../style/appoint.png" />
        </div>
        <div class="comment">
          <div>{{ divideNumber(sumaryData.testDriveUserTotal || 0) }}</div>
          <p>{{ text[1] }}</p>
        </div>
      </div>
    </el-col>
    <el-col :span="8">
      <div class="pink_content t_content">
        <div class="circle blue">
          <img src="../style/order.png" />
        </div>
        <div class="comment">
          <div>{{ divideNumber(sumaryData.prePurchaseUserTotal || 0) }}</div>
          <p>{{ text[2] }}</p>
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import divideNumber from "@/utils/divideNumber";

@Component
export default class ActualTop extends Vue {
  readonly divideNumber = divideNumber;
  @Prop({ type: Array, default: () => [] }) text: string[];
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

.blue {
  @include bg(#24a1fa);
}
.actual-total {
  display: flex;
  flex-direction: column;
  min-height: 320px;
  &.top_content {
    padding: 0;
  }
}
/*.purple_content {*/
/*  background: linear-gradient(265deg, rgba(119, 43, 255, 1) 0%, rgba(102, 40, 255, 1) 100%);*/
/*}*/
/*.skyblue_content {*/
/*  background: linear-gradient(265deg, rgba(107, 188, 255, 1) 0%, rgba(87, 206, 220, 1) 100%);*/
/*}*/
/*.pink_content {*/
/*  background: linear-gradient(265deg, rgba(226, 80, 171, 1) 0%, rgba(239, 151, 157, 1) 100%);*/
/*}*/
.t_content {
  border: 1px solid #24a1fa;
  height: 80px;
  width: 220px;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 0 20px;
  .circle {
    border-radius: 50%;
    width: 46px;
    height: 46px;
    line-height: 46px;
    text-align: center;
  }
  .comment {
    margin: 0 0 0 30px;
    height: 56px;
    font-size: 24px;
  }
  img {
    width: 20px;
    vertical-align: middle;
  }
}

p {
  margin: 0;
  font-size: 14px;
}
</style>
