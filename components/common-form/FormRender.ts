export default {
  functional: true,
  inheritAttrs: false,
  props: {
    prop: String,
    row: Object,
    render: Function
  },
  render: (h: any, ctx: any) => {
    return ctx.props.render(h, ctx.props.prop, ctx.props.row);
  }
};
