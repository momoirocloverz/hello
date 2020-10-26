<!--弹幕Item-->
<template>
  <div class="barrage-item"
       :style="barrageItem.style">
    <div class="avatar">
      <img :src="barrageItem.avatar" />
      <div class="nickName">{{ barrageItem.nickName }}</div>
    </div>
    <div class="barrage-content">
      {{ barrageItem.content }}
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
@Component({
  name: "barrageItem"
})
export default class extends Vue {
  @Prop({ default: {} }) barrageItem: any;
}
</script>

<style scoped lang="scss">
$avatar_w: 140px;
$avatar_h: 140px;
$avatar_t: -15px;
$nick_W: 140px;
$nick_l: -10px;
.barrage-item {
  position: absolute;
  display: flex;
  align-items: center;
  background: #feffed;
  color: rgba(16, 4, 29, 1);
  margin-left: 110%;
  border-radius: 10px;
  max-width: 500px;
  padding: 0 20px 0 60px;
  white-space: nowrap;
  text-overflow: ellipsis;
  animation: move 28s ease;
  .avatar {
    position: absolute;
    left: -50px;
    top: $avatar_t;
    width: $avatar_w;
    height: $avatar_h;
    border-radius: 50%;
    border: 6px solid #f8fab6;
    background: url("../../assets/images/activity/signAvatar.png") no-repeat;
    background-size: cover;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      overflow: hidden;
    }
  }
  .nickName {
    position: absolute;
    bottom: -25px;
    left: -5px;
    width: 140px;
    height: 45px;
    font-size: 20px;
    line-height: 45px;
    padding: 0 10px;
    border: 1px solid rgba(255, 255, 255, 1);
    border-radius: 19px;
    background: rgba(110, 0, 248, 0.7);
    font-weight: 600;
    color: #fff;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .barrage-content {
    display: -webkit-box;
    background: #feffed;
    padding: 20px 20px 20px 48px;
    font-size: 24px;
    color: #10041d;
    font-weight: 600;
    width: 370px;
    height: 98px;
    white-space: normal;
    -webkit-box-orient: vertical; /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式 。*/
    text-overflow: ellipsis; /* 可以用来多行文本的情况下，用省略号“…”隐藏超出范围的文本 。*/
    -webkit-line-clamp: 2;
    overflow: hidden;
  }
}
@keyframes move {
  0% {
    margin-left: 110%;
  }
  100% {
    margin-left: -150%;
  }
}
</style>
