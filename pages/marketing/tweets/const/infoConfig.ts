import dayjs from 'dayjs';

export const tableColumns = {
  columns: [
    {
      label: "阅读时间",
      prop: "readTime",
      formatter: (row: any) => {
        return row.readTime ? dayjs(row.readTime).format('YYYY-MM-DD HH:mm') : '—'
      }
    },
    {
      label: "姓名",
      prop: "reader"
    }
  ]
}