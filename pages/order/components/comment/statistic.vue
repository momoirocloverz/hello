<!--评价统计-->
<template>
  <div class="comment-statistic">
    <div :class="[`type${type.value}`, 'comment-type']" v-for="type in commentType" :key="type.value">
      <div class="type-title">
        <i :class="['iconfont  mr-15', type.value === 2 ? 'iconshangpin' : 'icondianpu']"></i>
        <span>{{ type.label }}：</span>
        <span>{{ statisticObj[type.value] ? statisticObj[type.value].averageStarValue : "暂无评分" }}</span>
      </div>
      <div class="comment-level" v-for="item in txtArr" :key="item.key">
        <span>{{ item.label }}:</span>
        <span>{{ getValue(type, item) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { getCommentStatistic } from "@/api";
import Const from "../../const/comment";
@Component({
  name: "commentStatistic",
  components: {}
})
export default class extends Vue {
  hasLoad: boolean = false;
  commentType: any[] = [
    {
      label: "商品评价",
      value: 2
    },
    {
      label: "店铺评价",
      value: 3
    }
  ];
  txtArr: any[] = [
    {
      label: "非常满意",
      key: 5
    },
    {
      label: "满意",
      key: 4
    },
    {
      label: "一般",
      key: 3
    },
    {
      label: "不满意",
      key: 2
    },
    {
      label: "非常不满意",
      key: 1
    }
  ];
  constant: any = new Const(this);
  statisticObj: any[] = [];
  async getData(row?: any) {
    this.hasLoad = false;
    this.statisticObj = [];
    let res = await getCommentStatistic({
      businessCode: "SPU",
      ...row
    });
    res.data.forEach((item: any) => {
      this.statisticObj[item.businessCode] = item;
    });
    this.hasLoad = true;
  }
  getValue(type: any, item: any) {
    if (this.hasLoad) {
      let _obj = this.statisticObj[type.value] || {};
      let _starValueMap = _obj.starValueMap || {};
      return _starValueMap[item.key] || "-";
    } else {
      return "-";
    }
  }
  created() {
    this.getData();
  }
}
</script>

<style scoped lang="scss">
.comment-statistic {
  border: 1px solid #eee;
  background: #fff;
  .type-title {
    flex: 1;
    min-width: 150px;
    .iconfont {
      font-size: 18px;
    }
  }
  .comment-type {
    display: flex;
    flex-direction: row;
    padding: 10px 15px;
    .comment-level {
      flex: 1;
    }
    &.type2 {
      border-bottom: 1px solid #f5f5f5;
    }
  }
}
</style>
