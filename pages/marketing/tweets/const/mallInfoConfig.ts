import dayjs from 'dayjs';

export const agentHandleData = [
  // { key: 'receiverCount', label: "送达人数" },
  { key: 'readerCount', label: "阅读人数" },
  { key: 'customerShareTimes', label: "客户分享次数" },
  { key: 'adviserShareTimes', label: "顾问分享次数" },
];

export const companyHandleData = [
  { key: 'receiverCount', label: "送达人数(集团)" },
  { key: 'receiverDealer', label: "送达经销商" },
  { key: 'readerCount', label: "阅读人数" },
];

export const factoryHandleData = [
  { key: 'receiverCount', label: "送达人数(主机厂)" },
  { key: 'receiverBloc', label: "送达集团" },
  { key: 'receiverDealer', label: "送达经销商" },
  { key: 'readerCount', label: "阅读人数" },
];

export const agentCustomerTable = {
  columns: [
    {
      label: "最近分享",
      prop: "recentShareTime",
      formatter: (row: any) => row.recentShareTime ? dayjs(row.recentShareTime).format('YYYY-MM-DD HH:mm') : '—'
    },
    {
      label: "客户姓名",
      prop: "customer"
    },
    {
      label: "手机号",
      prop: "phoneNumber"
    },
    {
      label: "阅读次数",
      prop: "readTimes"
    },
    {
      label: "分享次数",
      prop: "shareTimes"
    },
    {
      label: "专属顾问",
      prop: "adviser"
    }
  ]
};

export const agentAdviserTable = {
  columns: [
    {
      label: "最近分享",
      prop: "recentShareTime",
      formatter: (row: any) => row.recentShareTime ? dayjs(row.recentShareTime).format('YYYY-MM-DD HH:mm') : '—'
    },
    {
      label: "顾问姓名",
      prop: "adviser"
    },
    {
      label: "分享次数",
      prop: "shareTimes"
    },
    {
      label: "阅读次数",
      prop: "readTimes"
      // },
      // {
      //   label: "阅读人数",
      //   prop: "readPeople"
    }
  ]
};

export const companyBlocTable = {
  columns: [
    {
      label: "阅读时间",
      prop: 'readTime',
      formatter: (row: any) => row.readTime ? dayjs(row.readTime).format('YYYY-MM-DD HH:mm') : '—'
    },
    {
      label: "姓名",
      prop: "reader"
    }
  ]
}

export const companyAgentTable = {
  columns: [
    {
      label: "送达时间",
      prop: 'receiverTime',
      formatter: (row: any) => row.receiverTime ? dayjs(row.receiverTime).format('YYYY-MM-DD HH:mm') : '—'
    },
    {
      label: "经销商名称",
      prop: "dealerName"
    },
    {
      label: "阅读人数",
      prop: "readerCount"
    },
    {
      label: "阅读次数",
      prop: "readerTimes"
    }
  ]
};

export const factoryMfTable = {
  columns: [
    {
      label: "阅读时间",
      prop: 'readTime',
      formatter: (row: any) => row.readTime ? dayjs(row.readTime).format('YYYY-MM-DD HH:mm') : '—'
    },
    {
      label: "姓名",
      prop: "reader"
    }
  ]
};

export const factoryBlocTable = {
  columns: [
    {
      label: "送达时间",
      prop: 'receiverTime',
      formatter: (row: any) => row.receiverTime ? dayjs(row.receiverTime).format('YYYY-MM-DD HH:mm') : '—'
    },
    {
      label: "集团名称",
      prop: "blocName"
    },
    {
      label: "阅读人数",
      prop: "readerCount"
    },
    {
      label: "阅读次数",
      prop: "readerTimes"
    }
  ]
};


export const factoryAgentTable = {
  columns: [
    {
      label: "送达时间",
      prop: 'receiverTime',
      formatter: (row: any) => row.receiverTime ? dayjs(row.receiverTime).format('YYYY-MM-DD HH:mm') : '—'
    },
    {
      label: "经销商名称",
      prop: "dealerName"
    },
    {
      label: "阅读人数",
      prop: "readerCount"
    },
    {
      label: "阅读次数",
      prop: "readerTimes"
    }
  ]
};