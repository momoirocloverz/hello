import dayjs from "dayjs";

export const fansTableColumns = [
  {
    type: "selection"
  },
  {
    prop: "avatar",
    label: "头像",
    col: {
      width: "100px"
    },
    render: (h: any, row: any) =>
      h("img", {
        attrs: {
          class: "header",
          style: "width:50%",
          src: row.avatar || "/imgs/login/user.png"
        }
      })
  },
  {
    prop: "name",
    label: "昵称",
    formatter: (row: any) => row.name ? row.name : '未授权用户'
  },
  {
    prop: "label",
    label: "标签",
    formatter: (row: any) => row.label ? row.label.join() : "—"
  },
  {
    prop: "concernStatus",
    label: "是否关注",
    render: (h: any, row: any) => h("div", [
      h('span', {
        class: (row => {
          return row.concernStatus === "CONCERN"
            ? 'dot dot2'
            : 'dot dot5'
        })(row)
      }),
      h("span", row.concernStatus === "CONCERN" ? '已关注' : '未关注')
    ])
  },
  {
    prop: "adviserName",
    label: "专属顾问"
  },
  {
    prop: "time",
    label: "关注时间",
    formatter: (row: any) => dayjs(row.time).format("YYYY-MM-DD HH:mm")
  },
];

export const porentialGuestTable = [
  {
    prop: "name",
    label: "潜客姓名"
  },
  {
    prop: "phone",
    label: "潜客手机"
  },
  {
    prop: "intentionCarModel",
    label: "意向车型",
    formatter: (row: any) => `${row.intentionCarSeries ? row.intentionCarSeries : ''}—${row.intentionCarModel ? row.intentionCarModel : ''}`
  },
  {
    prop: "time",
    label: "最近互动时间",
    formatter: (row: any) => row.time ? dayjs(row.time).format("YYYY-MM-DD HH:mm") : '—'
  },
]

export const agentMemberTableColumn = [
  ...porentialGuestTable,
  {
    prop: "adviserName",
    label: "专属顾问"
  },
];
