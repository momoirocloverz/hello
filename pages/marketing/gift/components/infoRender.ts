export default {
  functional: true,
  inheritAttrs: false,
  props: {
    row: Object,
    render: Function
  },
  render: (h: any, ctx: any) => {
    return ctx.props.render(h, ctx.props.row);
  }
};