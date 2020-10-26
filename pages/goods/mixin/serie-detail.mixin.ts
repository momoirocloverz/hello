import { Component, PropSync, Vue } from "vue-property-decorator";

@Component({
  inheritAttrs: false
})
export default class SerieDetailMixin extends Vue {
  @PropSync('stepWalk', { type: String }) _stepWalk: string;
  get operationType() {
    return this.$route.params.operation
  }
  get serieCode() {
    return this.$route.params.serieCode
  }
  get disabled() {
    return this.operationType === 'view'
  }
  get sysPlat() {
    return this.$route.query.sysPlat
  }
  notEdited(notEdited: boolean, self = true) {
    if (!self) {
      return !this.disabled && !notEdited
    }
    if (!this.disabled && !notEdited) {
      this.$confirm(
        "编辑信息未保存，确定要离开？",
        "提示"
      ).then(() => {
        this.$router.go(-1);
      }).catch(e => { })
    } else {
      this.$router.go(-1);
    }
  }
}
