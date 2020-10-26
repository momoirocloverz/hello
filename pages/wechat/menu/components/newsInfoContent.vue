<!--图文内容-->
<template>
  <div class="news-info-content">
    <div class="news-list" v-if="selectedMenu.type === 'news'">
      <div class="news-item" v-for="(info, idx) in selectedMenu.dataInfo.content.articles" :key="idx">
        <span class="title">{{ info.title }}</span>
        <img :alt="info.coverUrl" class="news-img" :src="info.thumbUrl" />
        <a target="_blank" :href="info.url" class="mask">
          <span class="common_flex-center">预览文章</span>
        </a>
      </div>
    </div>

    <div class="pic-content" v-else>
      <img alt="图片" :src="selectedMenu.dataInfo.url" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";
import { State } from "vuex-class";
@Component({
  name: "newsInfoContent"
})
export default class extends Vue {
  @State(state => state.weChat.selectedMenu) private selectedMenu!: any; // 选中的menu
}
</script>

<style scoped lang="scss">
.news-info-content {
  margin: 20px;
  .news-list {
    /*padding: 15px;*/
    border: 1px solid $card-border;
    .news-item {
      position: relative;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid $card-border;
      /*padding: 10px;*/
      .title {
        color: #333;
      }
      .news-img {
        width: 60px;
        height: 60px;
      }
      &:first-child {
        .title {
          position: absolute;
          bottom: 0;
          left: 0;
          color: #fff;
        }
        .news-img {
          width: 320px;
          height: 160px;
        }
      }
      .mask {
        display: none;
        position: absolute;
        left: -10px;
        right: -10px;
        top: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        color: rgba(255, 255, 255, 0.8);
        vertical-align: middle;
        text-align: center;
        text-decoration: none;
        .common_flex-center {
          width: 100%;
          height: 100%;
        }
      }
      &:hover {
        .mask {
          display: block;
        }
      }
    }
  }
  .pic-content {
    img {
      max-width: 320px;
      max-height: 200px;
    }
  }
}
</style>
