import dayjs from "dayjs";

interface Span {
  row: any;
  column: any;
  rowIndex: number;
  columnIndex: number;
}

export interface Item {
  contentShortList: ArticleItem[];
  category: number;
  updatedTime: number;
  id: number;
  setting: string;
}

export interface ArticleItem {
  title: string;
  read: number;
  share: number;
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
      searchConfig: {},

      // 营销素材-图文素材
      tableColumns: [
        {
          type: "selection"
        },
        {
          title: "更新时间",
          key: "updatedTime",
          width: 150,
          formatter: (time: number) => {
            return dayjs(time).format("YYYY-MM-DD HH:mm:ss");
          }
        },
        {
          title: "文章",
          key: "name",
          slot: true, // 如果需要自定义每列的显示，可以使用slot,slotName属性
          slotName: "column0"
        },
        {
          operate: true,
          width: 240,
          title: "操作",
          setBtns: (row: object, index: number) => {
            let arr = [
              {
                label: "预览",
                handler: () => vm.showReviewDialog(row, index)
              },
              {
                label: "统计",
                handler: () => vm.showStatisticDialog(row, index)
              }
            ];
            if (vm.accessIsOpened("PERM:MATERIAL:EDIT")) {
              arr = arr.concat([
                {
                  label: "编辑",
                  handler: () => vm.update(row, index)
                },
                {
                  label: "删除",
                  handler: () => vm.del(row, index)
                }
              ]);
            }
            return arr;
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
              };
            } else {
              return {
                rowspan: 0,
                colspan: 0
              };
            }
          }
        };
      },

      // 处理行函数，展开每条数据的文章列表，再设置合并信息
      handleTableData: (arr: Item[]): expendItem[] => {
        const list: expendItem[] = [];
        // 展开行并设置合并单元格的行数
        arr.map((v: Item, k: number) => {
          let item: expendItem;
          v.contentShortList.map((vv: ArticleItem, kk: number) => {
            // rowSpa:合并行数，isMergeRow：是否为合并行，realDataIndex：真实数据index
            item = Object.assign({}, vv, v, {
              rowSpan: v.contentShortList.length,
              isMergeRow: false,
              realDataIndex: k
            });
            delete item.contentShortList;
            // 是否为合并列的首列
            item.isMergeRow = kk ? false : true;
            list.push(item);
          });
        });
        return list;
      }
    };

    return conf;
  }
}
