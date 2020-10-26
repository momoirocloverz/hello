<template>
  <div>
    <div class="article-box">
      <img :src="item.coverUrl+'?x-oss-process=image/resize,m_fill,h_200,w_200'"
           alt="">
      <div class="article-box_content">
        <h4 class="article-box_title">{{item.title}}</h4>
        <div>
          <span class="article-box_note">发布人：{{item.publisher}}</span>
          <span class="article-box_note">素材来源：{{arr[parseInt(item.materialSource)]}}</span>
          <span class="article-box_note">阅读人数：{{item.readerCount || '0'}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class articleList extends Vue {
  @Prop()
  readonly item: object;
  get arr(){
    if(this.$route.query.sysPlat==='agent'){
      return ["主机厂", "集团", "自建"];
    }else{
      return ["主机厂", "集团", "经销商"];
    }
  }
}
</script>


<style lang="scss" scoped>
.article-box {
  width: 100%;
  margin: 5px 0;
  display: flex;
  margin: 10px 0;

  img {
    width: 60px;
    height: 60px;
    flex: 1;
    margin-right: 10px;
  }
  .article-box_content {
    width: calc(100% - 70px);
  }

  .article-box_title {
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block;
    vertical-align: middle;
    color: #333;
    font-size: 13px;
    line-height: 1.5em;
    margin: 0;
    margin-bottom: 10px;
  }

  .article-box_note {
    color: #666;
    display: inline-block;
    margin-right: 15px;
  }
}
</style>
