import dayjs from 'dayjs';

export interface Item {
  time: number;
  readPeople: number;
  readCount: number;
  sharePeople: number;
  shareCount: number;
  wxPeople: number;
  wxCount: number;
}

export class Config {
  get(vm: any): any {
    return {
      // 搜索栏
      searchConfig: {
        props: [
          {
            tag: "datePicker",
            prop: "datePicker",
            type: 'datetimerange'
          }
        ]
      },
     
      // 表格配置
      tableColumns: [
        {
          title: "时间",
          key: "time",
          formatter: (row: Item) => {
            return dayjs(row.time).format('YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          title: "阅读人数",
          key: "readPeople"
        },
        {
          title: "阅读次数",
          key: "readCount"
        },
        {
          title: "分享人数",
          key: "sharePeople"
        },
        {
          title: "分享次数",
          key: "shareCount"
        },
        {
          title: "微信收藏人数",
          key: "wxPeople"
        },
        {
          title: "微信收藏次数",
          key: "wxCount"
        }
      ]
      
    }
  }

  
  
}