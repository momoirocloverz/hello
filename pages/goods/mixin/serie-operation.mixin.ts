import { Component, PropSync, Vue } from "vue-property-decorator";

@Component({
  inheritAttrs: false
})
export default class SerieOperationMixin extends Vue {
  readonly componentList: element.Tabs[] = [];
  currentStep: string = '0';
  get currentComponent() {
    return this.componentList[+this.currentStep].name
  };
  get accessKey() {
    return this.$route.query.sysPlat === 'factory' ? 'MODEL_MANAGE' : 'MODEL'
  }
  get disabled() {
    return this.$route.query.operation === 'view'
  }
  get operation() {
    return this.$route.params.operation
  }
  get serieCode() {
    return this.$route.params.serieCode
  }
  get sysPlat() {
    return this.$route.query.sysPlat
  }
  get breadGroup() {
    const parent = this.sysPlat === 'factory' ? '/goods/list-factory' : '/goods/list-agent';
    const label = this.operation === 'add'
      ? '新建车系'
      : this.operation === 'view'
        ? '车系详情'
        : '编辑车系'
    return [{ label: '车系列表', to: parent }, { label }]
  }
}
