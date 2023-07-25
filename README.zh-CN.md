# easy-arco-table

快速构建 arco 设计的 table 页面

[English Doc](https://github.com/Yer11214/easy-arco-table/blob/main/README.md)


## 快速开始

```bash
npm install easy-arco-table
```

## 使用方法

```js
<template>
 <easyArcoTable
    ref="tablePageRef"
    :columns="columnsTable"
    :methods="sortMethods"
    :api="getGoodsList"
 />
</template>

<script lang='ts' setup>
    import easyArcoTable from 'easy-arco-table';
    import { getGoodsList } from 'your api path'
     const goodsType = [
        {
            value: 'PHYSICAL_GOODS',
            label: '实物商品',
            color: 'blue',
        },
        {
            value: 'VIRTUAL_GOODS',
            label: '虚拟商品',
            color: 'purple',
        },
    ];

     const columnsTable = [
        {
            title: '商品编号',
            dataIndex: 'id',
            width: 150,
        },
        {
            title: '商品名称',
            dataIndex: 'goodsName',
            slot: true,
            ellipsis: false,
            width: 300,
            slotData: {
                goods: {
                    goodsName: 'goodsName',
                    goodsImage: 'original',
                },
            },
        },

        {
            title: '销售模式',
            dataIndex: 'salesModel',
            slot: true,
            slotData: {
                tag: salesModel, //这个就不写了具体的格式就是 goodsType 那样
            },
        },
        {
            title: '商品类型',
            dataIndex: 'goodsType',
            slot: true,
            width: '100',
            slotData: {
                tag: goodsType,
            },
        },
        {
            title: '商品价格',
            dataIndex: 'price',
            currency: true,
        },
        {
            title: '库存',
            dataIndex: 'quantity',
        },
        {
            title: '审核状态',
            dataIndex: 'authFlag',
            slot: true,
            slotData: {
                tag: authFlag, //这个就不写了具体的格式就是 goodsType 那样
            },
        },
        {
            title: '上架状态',
            dataIndex: 'marketEnable',
            slot: true,
            slotData: {
                tag: marketEnable, //这个就不写了具体的格式就是 goodsType 那样
            },
        },
    ];

    const sortMethods: MethodsRule = {
        title: '操作',
        width: 250,
        fixed: 'right',
        methods: [
        {
            title: '查看',
            callback: 'detail',
        },
        {
            title: '库存',
            callback: 'detail',
        },
        {
            title: '下架',
            callback: 'upDown',
        },
        ],
    };

    const detail = (row: any) => {
        console.log(row);
    };
</script>




```

对于`columns`和`methods`的约束如下

```js
// 表格方法封装约束
export interface ColumnsDataRule {
  width?: string | number;
  title: string; // 表格显示的title
  dataIndex: string; // 表格显示的数据
  currency?: boolean; // 是否将显示的数据进行货币化处理
  slot?: boolean; // 是否插槽形式
  empty?: string; // 如果没有数据展示的空内容
  ellipsis?: boolean; // 是否展示省略号 默认展示
  slotTemplate?: string;
  slotData?: {
    tag?: Array<{ value: string | boolean, color: string }>, // tag形式写color  https://arco.design/vue/component/tag  具体格式就是 label、value、color
    goods?: {
      goodsImage: string, // 商品图片的key

      goodsName: string, // 商品名称的key
    }, // 商品展示
    link?: string, // 链接
    badge?: Array<{ value: string | boolean, color: string }>, // 状态点
  }; // 插槽内容
}
// table-pages的表格方法封装约束
export interface MethodsRule {
  title: string; // 表格显示的title
  fixed?: string; // 在arco文档中写到如果设置fixed必须设置宽度。如果scroll x轴的宽度不够，也是不会显示的 具体可看arco的文档
  methods: Array<{
    title?: string, // 方法按钮的title
    callback?: string, // 回调的方法名 
    type?: string, // 按钮的类型 arco的文档中有写
    status?: string, // 按钮的status arco的文档中有写
    slot?: boolean, // 是否插槽形式
    slotTemplate?: string,
  }>; // 方法按钮的title, callback是回调的方法名
  width?: number | string;
}
```

这些内容写好后展示图是这样的👇

![图片](https://i.imgur.com/zK66OUX.png)


可能有些疑惑代码中的slot有啥用？其实就是为了方便你自定义插槽，比如说你想要自定义一个内容，那么你就可以这样写

```js

 <tablePage
    ref="tablePageRef"
    :columns="columnsTable"
    :methods="sortMethods"
    :api="getAllCategory"
    @editor="TbaleDataEdit"
>
    <template #children="{ data }">
    {{ data.name }}
    </template>
</tablePage>


const columnsTable = [
    {
      title: '分类名称',
      dataIndex: 'name',
      width: 150,
      slot: true,
      slotTemplate: 'children',
    },
    {
      title: '分类状态',
      dataIndex: 'deleteFlag',
      width: 150,
    },
  ];
```

## Tips

在请求接口的时候默认请求的api的参数

```js
 params: {
    pageNumber: 1, // 当前页数
    pageSize: 10, // 页面大小
    sort: 'createTime', // 默认排序字段
    order: 'desc', // 默认排序方式
},

// 自定义参数
<easyArcoTable xxx :customApiParams='{
    pageNumber: 1, 
    pageSize: 10,

}'></easyArcoTable>

```

默认接口返回的内容格式如下，则无需填写`result`参数。

```js
// 第一种

{
    result:{
        records:[] 
    }
}

// 第二种
{
    result:[]
}

```

如果你的接口返回的内容格式不是这样的，那么你就需要在`api`中传入`result`参数，比如说你的接口返回的内容格式是这样的

```js
{
    data:{
        records:[] 
    }
}


// 那么传参的时候就需要

<easyArcoTable xxx :result='result'></easyArcoTable>

const result = 'data.records'

```

## OBJECT 传参数说明

| 属性               | 说明                                          | 类型     | 必填 |
| ------------------ | --------------------------------------------- | -------- | ---- |
| `columns`          | 列表头                                        | array    | 是   |
| `api`              | 请求接口                                      | function | 是   |
| `checkbox`         | 表格全选框                                    | boolean  | 否   |
| `apiParams`        | 附加请求数据                                  | Object   | 否   |
| `customApiParams`  | 自定义请求                                    | Object   | 否   |
| `enablePagination` | 是否展示分页                                  | boolean  | 否   |
| `dataList`         | 不请求接口纯数据                              | null     | 否   |
| `max`              | 最大显示内容 一般来说就是不分页的话才会使用到 | null     | 否   |
| `result`              | 自定义返回值 | String     | 否   |
