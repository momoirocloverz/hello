export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    _visible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    }
  },
  data() {
    return {
      verifyPlaceholder: "请输入手机验证码"
    }
  }
}