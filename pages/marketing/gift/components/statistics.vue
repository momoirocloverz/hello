<template>
  <el-row :gutter="20"
          style="margin-bottom:20px;">
    <el-col :span="6">
      <el-card>
        <h1>{{info.stockCount || '0'}}</h1>
        <h5>剩余库存（总量：{{info.stockTotal}}）</h5>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <h1>{{info.campaignOccupy || '0'}}</h1>
        <h5>活动占用</h5>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card style="position:relative;">
        <h1>{{info.receivedCount || '0'}}</h1>
        <h5 style="color:#666;text-align:center;line-height:1em;margin:0;"
            v-if="isCoupon">
          活动领取：{{info.receivedByCampaignCount}}；
          主动领取：{{info.receivedBySelfCount}}
        </h5>
        <h5 :style="isCoupon? 'line-height:1em;margin-top:4px;':''">已领取</h5>
      </el-card>
    </el-col>
    <el-col :span="6">
      <el-card>
        <h1>{{info.usedCount || '0'}}</h1>
        <h5>已使用</h5>
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class coupinStatistics extends Vue {
  @Prop()
  info: any;
  @Prop({ default: true })
  isCoupon: boolean;
}
</script>

<style lang="scss" scoped>
h1,
h5 {
  text-align: center;
}
h1 {
  line-height: 1.5em;
  margin: 10px;
}
</style>
