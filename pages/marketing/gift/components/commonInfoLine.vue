<template>
  <div class="common-form-line">
    <div class="form-line-item"
         :key="index"
         v-for="(item, index) in columns">
      <span class="title">{{item.label}}</span>
      <info-render :render="item.render"
                   :row="info"
                   v-if="item.render"></info-render>
      <div class="detail"
           v-else>
        {{info[item.prop]}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import infoRender from "./infoRender";

@Component({
  components: {
    infoRender
  }
})
export default class commonInfo extends Vue {
  @Prop()
  info: object;
  @Prop()
  columns: object;
}
</script>

<style lang="scss" scoped>
.form-line-item {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  line-height: 2rem;
  margin-bottom: 8px;
  .title {
    display: inline-block;
    width: 140px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    flex: 0 0 auto;
  }
}
</style>
