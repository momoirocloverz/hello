<template>
  <el-dialog class="remove-bind"
             :title="dialog.title"
             :visible.sync="dialog.show"
             width="40%"
             :before-close="closeDialog">
    <p>解除绑定后，公众号所有相关信息将失效（包含粉丝、营销素材、模板消息、自定义菜单）请谨慎操作</p>
    <p><a href="https://mp.weixin.qq.com"
         class="link"
         target="_blank">点击前往公众号管理平台</a> 【设置-公众号设置-授权管理】中进行解绑操作</p>
    <div slot="footer"
         class="dialog-footer">
      <el-button type="primary"
                 @click="closeDialog">知道了</el-button>
    </div>
  </el-dialog>
</template
>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import CommonTable from "@/components/common-table/index.vue";
interface DialogInter {
  title: string;
  show: boolean;
}
@Component({
  name: "removeBind",
  components: { CommonTable }
})
export default class extends Vue {
  @Prop({ default: { title: "解除绑定", show: false } }) private dialog: DialogInter;
  closeDialog() {
    this.$emit("close", true);
  }
}
</script>

<style scoped lang="scss">
.link {
  color: $primary-color;
  text-decoration: none;
}
.remove-bind {
  .top {
    text-align: center;
    .el-icon-warning {
      color: #ff5050;
      font-size: 58px;
    }
  }
  .identify-code {
    display: flex;
    flex-direction: row;
    align-items: center;
    .label {
      display: inline-block;
      margin-right: 10px;
    }
    .el-input {
      width: 200px;
    }
  }
}
</style>
