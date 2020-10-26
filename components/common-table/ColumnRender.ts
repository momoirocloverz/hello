// table column 的函数化组件
export default {
  functional: true,
  inheritAttrs: false,
  props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
      type: Object,
      default: null
    }
  },
  render: (h: any, ctx: any) => {
    return ctx.props.render(h, ctx.props.row);
  }
};
