import dayjs from "dayjs";
import { formatDate } from '../../../utils/index';

export const adviserCoumns = [
  {
    label: "排名",
    prop: "rank"
  },
  {
    label: "顾问姓名",
    prop: "name"
  },
  {
    label: "顾问手机号",
    prop: "phone"
  },
  {
    label: "潜客数",
    prop: "curMemberNum"
  },
  {
    label: "顾问星级",
    prop: "star",
    formatter: (row: any) => row.star ? `${row.star} 星` : '—'
  }
];

export const adviserTableColumns = [
  {
    col: {
      width: "50px"
    },
    prop: "rank",
    label: "排名"
  },
  {
    col: {
      width: "100px"
    },
    prop: "img",
    label: "头像",
    render: (h: any, row: any) =>
      h("img", {
        attrs: {
          class: "head-img",
          src: row.avatar
        }
      })
  },
  {
    prop: "name",
    label: "顾问姓名",
    formatter: (row: any) => row.name
  },
  {
    prop: "phone",
    label: "手机号"
  },
  {
    prop: "post",
    label: "岗位"
  },
  {
    prop: "curMemberNum",
    label: "潜客数",
    formatter: (row: any) => (row.curMemberNum ? row.curMemberNum : 0)
  },
  {
    prop: "star",
    label: "顾问评分",
    formatter: (row: any) => (row.star ? row.star : "暂无评分")
  },
  {
    prop: "msgContent",
    label: "顾问状态",
    render: (h: any, row: any) =>
      h(
        "div",
        {
          attrs: {
            class: `${row.enabled}`
          }
        },
        row.enabled === "FREEZE" ? "冻结" : "启用"
      )
  },
];


export const commentOnAdviserTable = [
  {
    prop: 'userName',
    label: '潜客姓名'
  },
  {
    prop: 'userPhone',
    label: '潜客手机号'
  },
  {
    prop: 'star',
    label: '评分',
    formatter: (row: any) => row.star ? row.star.starValue : '—'
  },
  {
    prop: 'labelsText',
    label: '评价标签',
    // formatter: (row: any) => row.labels ? (labels => {
    //   let t = labels.map((e: any) => e.labelName)
    //   return t.join("、")
    // })(row.labels) : '—'
  },
  {
    prop: 'createdTime',
    label: '评价时间',
    formatter: (row: any) => row.createdTime
      ? dayjs(row.createdTime).format("YYYY-MM-DD HH:mm")
      : "—"
  }
];

export const lastSharedTime = {
  prop: 'lastSharedTime',
  label: '最近分享时间',
  formatter: (row: any) => row.lastSharedTime
    ? dayjs(row.lastSharedTime).format("YYYY-MM-DD HH:mm")
    : "—"
};

export const goodsShareTable = [
  {
    prop: 'targetName',
    label: '商品名称',
    formatter: (row: any) => row.targetName.replace(/(<span>|<\/span>)/g, '')
  },
  {
    prop: 'sharedCount',
    label: '分享次数'
  },
  lastSharedTime,
];

export const activityShareTable = [
  {
    prop: 'msgContent',
    label: '活动编号',
    formatter: (row: any) => row.campaign.code
  },
  {
    prop: 'targetName',
    label: '活动名称',
    formatter: (row: any) => row.targetName.replace(/(<span>|<\/span>)/g, '')
  },
  {
    prop: 'msgContent',
    label: '活动类型',
    formatter: () => "线下活动"
    // formatter: (row: any) => row.type === 0 ? "抽奖活动" : row.type === 1 ? "团购活动" : row.type === 2 ? "线下活动" : ""
  },
  {
    prop: 'msgContent',
    label: '活动时间',
    formatter: (row: any) => {
      let from = row.campaign.signinValidFrom ? dayjs(row.campaign.signinValidFrom).format("YYYY-MM-DD HH:mm") : ''
      let to = row.campaign.signinValidTo ? dayjs(row.campaign.signinValidTo).format("YYYY-MM-DD HH:mm") : ''
      return `${from}—${to}`
    }
  },
  {
    prop: 'msgContent',
    label: '活动状态',
    render: (h: any, row: any) =>
      h(
        "div",
        {
          attrs: {
            class: `status${row.campaign.status}`
          }
        },
        row.campaign.status === 0 ? "未投放" : row.campaign.status === 1 ? "已投放" : row.campaign.status === 2 ? "已开始" : row.campaign.status === 3 ? "已结束" : "已终止"
      )
  },
  {
    prop: 'sharedCount',
    label: '分享次数'
  },
  lastSharedTime,
];

export const articelShareTable = [
  {
    prop: 'title',
    label: '文章标题'
  },
  {
    prop: 'shareTimes',
    label: '分享次数'
  },
  {
    prop: 'shareTime',
    label: '最近分享时间',
    formatter: (row: any) => row.shareTime
      ? dayjs(row.shareTime).format("YYYY-MM-DD HH:mm")
      : "—"
  }
];