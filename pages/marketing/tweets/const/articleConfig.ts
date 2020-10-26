import dayjs from 'dayjs';

interface Span {
  row: any;
  column: any;
  rowIndex: number;
  columnIndex: number;
}

export interface Item {
  articleList: ArticleItem[];
  category: number;
  publishTime: number;
  id: number;
  setting: string;
  receiver: string;
  materialSource: string;
}

export interface ArticleItem {
  title: string;
  readerCount: number;
  shareTimes: number;
  linShare: number;
  show: number;
  index: boolean;
  coverUrl: string;
  author: string;
}

export interface expendItem extends Item, ArticleItem {
  rowSpan: number;
  isMergeRow: boolean;
  realDataIndex: number;
}

export class Config {
  get(vm: any): any {
    const conf = {
      // 搜索栏
      searchConfig: () => {
        let obj: any = {
          props: [
            {
              tag: "input",
              prop: "title",
              placeholder: "文章标题"
            },
            {
              tag: "input",
              prop: "publisher",
              placeholder: "发布人"
            },
            {
              tag: "select",
              prop: "articleColumnId",
              placeholder: "栏目",
              options: []
            }
          ],
          addBtn: {
            label: "发布文章",
            handler: () => {
              vm.add();
            }
          }
        }
        if(!vm.accessIsOpened('PERM:ARTICLE:PUBLISH')){
          delete obj.addBtn;
        }
        return obj;
      },

      // 表格配置
      tableColumns: [
        {
          title: "发布时间",
          key: "publishTime",
          width: 150,
          formatter: (time: number) => {
            return dayjs(time).format('YYYY-MM-DD HH:mm:ss');
          }
        },
        {
          title: "栏目",
          key: "column",
          width:80
        },
        // {
        //   title: "发布人",
        //   key: "publisher"
        // },
        // {
        //   title: "素材来源",
        //   key: "materialSource",
        //   render: (h: any, row: Item) => {
        //     const arr = ['主机厂', '集团', '经销商'];
        //     return h('span', {}, arr[parseInt(row.materialSource)]);
        //   }
        // },
        {
          title: "发布渠道",
          key: "setting",
          width:120,
          render: (h: any, row: Item) => {
            let strArr: string[] = [];
            const arr = ['内部资讯', '商城资讯', '微信公众号'];
            (row.receiver.split(',')).map((v: string, k: number) => {
              if(v === '1'){
                strArr.push(h('span', {}, arr[k]));
                strArr.push(h('br', {}, null));
              }
            })
            return h('div', {}, strArr);
          }
        },
        {
          title: "文章",
          key: "name",
          slot: true, // 如果需要自定义每列的显示，可以使用slot,slotName属性
          slotName: 'column0'
        },
        {
          operate: true,
          width: 150,
          title: "操作",
          setBtns: (row: object, index: number) => {
            if(vm.accessIsOpened('PERM:ARTICLE:VIEW')){
              return [
                {
                  label: "预览",
                  handler: () => vm.review(row, index)
                },
                {
                  label: "统计",
                  handler: () => vm.openStatisticsDialog(row, index)
                }
              ];
            }
            return [];
          }
        }
      ],

      // 定义合并列
      // columns:需合并的列数组
      spanMethod: (columns: number[] = []): Function => {
        return ({ row, column, rowIndex, columnIndex }: Span) => {
          if (columns.indexOf(columnIndex) > -1) {
            if (row.isMergeRow) {
              return {
                rowspan: row.rowSpan,
                colspan: 1
              }
            } else {
              return {
                rowspan: 0,
                colspan: 0
              }
            }
          }
        }
      },

      // 处理行函数，展开每条数据的文章列表，再设置合并信息
      handleTableData: (arr: Item[]): expendItem[] => {
        const list: expendItem[] = [];
        // 展开行并设置合并单元格的行数
        arr.map((v: Item, k: number) => {
          let item: expendItem;
          (v.articleList || []).map((vv: ArticleItem, kk: number) => {
            // rowSpa:合并行数，isMergeRow：是否为合并行，realDataIndex：真实数据index
            item = Object.assign({}, vv, v, { rowSpan: v.articleList.length, isMergeRow: false, realDataIndex: k });
            delete item.articleList;
            // 是否为合并列的首列
            item.isMergeRow = kk ? false : true;
            list.push(item);
          });
        });
        return list;
      }

    }

    return conf;
  }



}
