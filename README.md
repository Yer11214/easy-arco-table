# easy-arco-table

Quickly build a table page with arco design.

[中文文档](https://github.com/Yer11214/easy-arco-table/blob/main/README.zh-CN.md)

## Quick Start

```bash
npm install easy-arco-table
```

## Usage

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

`columns` and `methods` Rules 👇

```js
// columns rule
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
// methods rule
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

Look like this 👇

![图片](https://i.imgur.com/zK66OUX.png)


What is slot ? you can custom slot like this 👇

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


Default request api params

```js
 params: {
    pageNumber: 1, 
    pageSize: 10,
    sort: 'createTime',
    order: 'desc', 
}

// if you want to custom request api params
<easyArcoTable xxx :customApiParams='{
    pageNumber: 1, 
    pageSize: 10,

}'></easyArcoTable>
```

Default response JSON

```js
// first

{
    result:{
        records:[] 
    }
}

// second
{
    result:[]
}

```

Custom response JSON

```js
{
    data:{
        records:[] 
    }
}


// need to set result 

<easyArcoTable xxx :result='result'></easyArcoTable>

const result = 'data.records'

```


## OBJECT 传参数说明

| Attribute               | Description                                          | Type     | Required |
| ------------------ | --------------------------------------------- | -------- | ---- |
| `columns`          | Table headers                                        | array    | Yes   |
| `api`              | API request                                      | function | Yes   |
| `checkbox`         | Table checkbox                                    | boolean  | No   |
| `apiParams`        | Additional request data                                  | Object   | No   |
| `customApiParams`  | Custom request                                    | Object   | No   |
| `enablePagination` | Display pagination                                  | boolean  | No   |
| `dataList`         | Data without API request                              | null     | No   |
| `max`              | Maximum display content (for non-paging) | null     | No   |
