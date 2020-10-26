<template>
  <div>
    <div v-if="status && expireStatus === 'NOT_ALLOW'"><i class="dot"></i>未使用</div>
    <div v-if="status && expireStatus === 'ALLOW'"><i class="dot dot-active"></i>可使用</div>
    <div v-if="!status"><i class="dot dot-disabled"></i>已停用</div>
    <div v-if="status && expireStatus === 'EXPIRE'"><i class="dot dot-expire"></i>已过期</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ExpireStatus } from "../const/couponTypes";

@Component
export default class Dot extends Vue {
  @Prop({ default: 0 })
  status: boolean;
  @Prop({ default: 0 })
  expireStatus: ExpireStatus;
}
</script>

<style lang="scss" scoped>
.dot {
  width: 8px;
  height: 8px;
  border-radius: 8px;
  background: #ccc;
  display: inline-block;
  margin-right: 4px;
}
.dot-active {
  background: #1979d7;
}
.dot-disabled {
  background: #ff9900;
}
.dot-expire {
  background: #ccc;
}
</style>


