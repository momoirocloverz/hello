###表格组件

#####1.简单使用
vue

```
<search-table :data="tableData"
                :tableColumns="tableColumns"
                :searchConfig="searchConfig">
</search-table>
```

config

```
{
      // 搜索栏
      searchConfig: {
        props: [
          {
            tag: "input",
            prop: "name",
            placeholder: "文章标题"
          },
          {
            tag: "input",
            prop: "name",
            placeholder: "发布人"
          },
          {
            tag: "select",
            prop: "type",
            placeholder: "文章状态",
            options: [
              {
                value: 0,
                label: "6月购车节发红包了"
              }
            ]
          }
        ],
        addBtn: {
          label: "发布文章",
          handler: () => {
            vm.add();
          }
        }
      },

      // 表格配置
      tableColumns: [
        {
          title: "文章",
          key: "name",
          slot: true, // 如果需要自定义每列的显示，可以使用slot,slotName属性
          slotName: 'column0'
        },
        {
          title: "栏目",
          key: "type"
        },
        {
          title: "更新时间",
          key: "expires"
        },
        {
          operate: true,
          title: "操作",
          setBtns: (row: object, index: number) => {
            return [
              {
                label: "编辑",
                handler: () => vm.edit(row, index)
              },
              {
                label: "删除",
                handler: () => vm.del(row, index)
              }
            ];
          }
        }
      ]

    }
```

searchConfig 中的 tag 可选 input, text, cascader, datePicker, checkbox, upload。对应 element-ui 的 form 表单组件。

#####2.自定义列的 DOM 结构
可在 tableColumns 的列中定义 render 函数。如：

```
{
  title: '名称',
  key: 'name',
  render: (h: any): any => {
    h('span', {}, 'test')
  }
}
```

如果涉及到复杂的交互，可以使用 slot。
config

```
{
  title: "文章",
  key: "name",
  slot: true, // 如果需要自定义每列的显示，可以使用slot,slotName属性
  slotName: 'column0'
}
```

vue

```
<search-table :data="tableData"
              :tableColumns="tableColumns"
              :searchConfig="searchConfig">
  <template v-slot:column0="{row}">
    <div @click="add">{{row.name}}</div>
  </template>
</search-table>
```

注意这里的 v-slot 后面的 slot 名与 config 中 slotName 对应。

##### 3.合并单元格

传入属性 spanMethod，参数为需合并列的 index 数组。

```
<search-table :data="tableData"
                      :tableColumns="tableColumns"
                      :searchConfig="searchConfig"
                      @singleSelectChange="currentChange"
                      :spanMethod="spanMethod([0, 1, 3])">
```

spanMethod 事例

```
spanMethod: (columns: number[] = []):Function => {
  return ({ row, column, rowIndex, columnIndex }: Span) => {
    if (columns.indexOf(columnIndex) > -1 ) {
      if(row.isMergeRow){
        return {
          rowspan: row.rowSpan,
          colspan: 1
        }
      }else{
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    }
  }
}
```

##### 4.单选事件

事件处理 handler - singleSelectChange，如果需要实现单选 radio 效果，可以使用 slot 或者 render。

##### 5.多选

checkbox： `tableColumns`的首元素`type设置为`selection`

```
{
  type: "selection",
  width: 80
}
```

监听事件 `selectionChange`

##### 6.处理 filter

如果请求前需要对过滤选项进行处理，传入 proxyQuery 方法。它有一个 filter 参数。在经过处理后回直接返回给请求函数。

##### 7.通知刷新

设置 isRefresh 状态，isRefresh 改变会引起列表刷新
