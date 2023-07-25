<template>
    <div>

      <Table
        row-key="id"
        :loading="initData.data.loading"
        :data="initData.data.result.records || initData.data.result"
        :bordered="{ cell: true }"
        :pagination="enablePagination ? initData.data.result : false"
        :row-selection="checkbox ? initData.data.rowSelection : undefined"
        :scroll="{ x: '100%' }"
        @selection-change="selectTableChanges"
        @page-change="
          (number) => {
            initData.data.params.pageNumber = number;
          }
        "
      >
        <template #columns>
          <!-- 循环表头 -->
          <TableColumn
            v-for="(item, index) in props.columns"
            :key="index"
            :title="item.title"
            :data-index="item.dataIndex"
            :tooltip="true"
            :width="item.width"
            :ellipsis="!item.hasOwnProperty('ellipsis') ? true : item.ellipsis"
          >
            <!-- 自定义模版 -->
            <template
              v-if="item.slot || item.currency || item.empty || item.render"
              #cell="{ record, column, rowIndex }"
            >
              <!-- 插槽 自定义-->
              <slot
                v-if="item.slot && item.slotTemplate"
                :name="item.slotTemplate"
                :record="record[item.dataIndex]"
                :column="column"
                :row-index="rowIndex"
                :data="record"
              ></slot>
              <!-- 标签展示 -->
              <Tag
                v-if="item.slot && item.slotData?.tag"
                :color="
                  item.slotData.tag.find((tag) => {
                    return tag.value === record[item.dataIndex];
                  })?.color
                "
                >{{
                  item.slotData.tag.find((tag) => {
                    return tag.value === record[item.dataIndex];
                  })?.label
                }}</Tag
              >
              <!-- 商品展示 -->
              <div v-if="item.slot && item.slotData?.goods" class="flex">
                <Image
                  width="50"
                  height="50"
                  :src="record[item.slotData.goods.goodsImage]"
                  show-loader
                >
                  <template #loader>
                    <div class="loader-animate" />
                  </template>
                </Image>
                <div style="margin-left: 5px">
                  <TypographyText copyable bold>
                    {{ record[item.slotData.goods.goodsName] }}
                  </TypographyText>
  
                  <div class="flex">
                    <div v-if="record?.goodsUnit">
                      <TypographyText style="font-size: 12px" type="secondary">
                        {{ record.goodsUnit }}
                      </TypographyText>
                    </div>
                   
                  </div>
                </div>
              </div>
              <!-- 货币展示 -->
              <TypographyText v-if="item.currency">
                {{ unitPrice(record[item.dataIndex], '¥') }}
              </TypographyText>
              <!-- 空值展示 -->
              <TypographyText v-if="item.empty">
                {{ record[item.dataIndex] || item.empty }}</TypographyText
              >
              <!-- 徽标展示 -->
              <div v-if="item.slot && item.slotData?.badge">
                <Badge
                  style="margin-right: 5px"
                  :color="
                    item.slotData.badge.find((tag) => {
                      return tag.value === record[item.dataIndex];
                    })?.color
                  "
                ></Badge>
                {{
                  item.slotData.badge.find((tag) => {
                    return tag.value === record[item.dataIndex];
                  })?.label
                }}
              </div>
            </template>
          </TableColumn>
          <!-- 方法 -->
          <TableColumn
            v-if="props?.methods?.methods"
            :width="props.methods?.width"
            align="center"
            :title="props.methods?.title"
            :fixed="props.methods?.fixed"
          >
            <template #cell="{ record, column, rowIndex }">
              <Space>
                <div v-for="(btn, index) in props.methods.methods" :key="index">
                  <!-- 插槽 自定义-->
                  <slot
                    v-if="btn.slot && btn.slotTemplate"
                    :name="btn.slotTemplate"
                    :record="record"
                    :column="column"
                    :row-index="rowIndex"
                    :data="record"
                  ></slot>
                  <Button
                    v-else
                    size="small"
                    class="btn"
                    :type="btn.type"
                    :status="btn.status"
                    @click="
                      handleClickBtn({
                        ...btn,
                        record: { ...record, ...column, ...rowIndex },
                      })
                    "
                    >{{ btn.title }}
                  </Button>
                </div>
              </Space>
            </template>
          </TableColumn>
        </template>
      </Table>
    </div>
  </template>
  
  <script lang='ts'>
    export default {
      name:'easy-arco-table',
    }
  </script>
  <script lang="ts" setup>
    import {
      onMounted,
      reactive,
      watch,
      toRefs,
    } from 'vue';
    import {Table,Space,Button,TableColumn,Badge,TypographyText,Image,Tag} from '@arco-design/web-vue'

    function formatPrice(price: number) {
        return String(Number(price).toFixed(2)).replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ','
        );
    }
    function unitPrice(val: number, unit?: string, location?: string) {
        if (!val) val = 0;
            const price = formatPrice(val);
        if (location === 'before') {
            return price.substr(0, price.length - 3);
        }
        if (location === 'after') {
            return price.substr(-2);
        }
            return (unit || '') + price;
    }

  
    interface initDataRule {
      data: {
        result: {
          current: number | string;
          total: number | string;
          records: any[];
        };
        loading: boolean;
        rowSelection: {
          type: string;
          showCheckedAll: boolean;
          selectedRowKeys: Array<string | number>; // 已选择的行（受控模式）
        };
        params: {
          pageNumber: number | string; // 当前页数
          pageSize: number | string; // 页面大小
          sort: string; // 默认排序字段
          order: string;
        };
        recordsList: any[];
        selected: any[];
        ids: any;
      };
    }
  
    const initData = reactive<initDataRule>({
      data: {
        result: {
          current: 1,
          total: 0,
          records: [],
        }, // 请求内容
        loading: false, // 加载动画
        rowSelection: {
          type: 'checkbox',
          showCheckedAll: true,
          selectedRowKeys: [],
        },
        params: {
          pageNumber: 1, // 当前页数
          pageSize: 10, // 页面大小
          sort: 'createTime', // 默认排序字段
          order: 'desc', // 默认排序方式
        },
        recordsList: [], // 查询的数据总合
        selected: [], // 已选择的商品
        ids: [],
      },
    });
  
    const props = defineProps({
      columns: {
        type: Array,
        default: () => {
          return [];
        },
      },
      methods: {
        type: Object,
        default: () => {
          return {};
        },
      },
      // 最大显示内容 一般来说就是不分页的话才会使用到
      max: {
        type: null,
        default: '',
      },
      // 请求接口
      api: {
        type: null,
        default: '',
      },
      // 不请求接口 传数据
      dataList: {
        type: null,
        default: '',
      },
      // 附加请求参数
      apiParams: {
        type: null,
        default: '',
      },
      // 自定义请求参数
      customApiParams: {
        type: null,
        default: '',
      },
      // 是否展示分页
      enablePagination: {
        type: Boolean,
        default: true,
      },
      checkbox: {
        type: Boolean,
        default: false,
      },
      result:{
        type: null,
        default:''
      }
    });
  
    const emit = defineEmits(['selectTableChange']);
  
    const selectTableChanges = (keys: Array<string | number>) => {
      initData.data.ids = keys;
      initData.data.rowSelection.selectedRowKeys = keys;
      // 将id进行循环赋值给父级
      const exportTableList: any = [];
      keys.forEach((id) => {
        exportTableList.push(
          initData.data.recordsList.find((item) => {
            return item.id == id;
          })
        );
      });
      //  将选择的内容抛给子级
      emit('selectTableChange', exportTableList);
    };
  
    // 初始化内容
    async function init(val = {}) {
      initData.data.loading = true;
      const { apiParams } = toRefs(props);
      let submit;
      props.apiParams
        ? (submit = { ...val, ...apiParams.value })
        : (submit = val);
      submit = {
        ...initData.data.params,
        ...submit,
      };
      const res = await props.api(props.customApiParams || submit); // 使用父级给的api地址
      if (res.data.success) {
      //  最后判断如果有 max的话 截取max位置的内容
      if (props.max) {
        res.data.result = res.data.result.splice(0, props.max);
      } else {
        const records = [];
        if (props.result) {
          /**
           * 1.判断是否有result
           * 2.继续递归一下是否有下级
           */
          if (props.result.split('.').length > 1) {
            const params = props.result.split('.');

            let currentObj = res.data;
            params.forEach((key: any) => {
              currentObj = currentObj[key];
            });
            records.push(currentObj);
          } else {
            records.push(...props.result);
          }
        } else {
          records.push(...(res.data.result.records || res.data.result));
        }
        initData.data.recordsList = records;
      }
      if (props.result) {
        /**
         * 1.判断是否有result
         * 2.继续递归一下是否有下级
         */
        if (props.result.split('.').length > 1) {
          const params = props.result.split('.');

          let currentObj = res.data;
          params.forEach((key: any) => {
            currentObj = currentObj[key];
          });
          initData.data.result = currentObj;
        } else {
          initData.data.result = res.data[props.result];
        }
      } else {
        // 请求到的数据全部给赋值
        initData.data.result = res.data.result;
      }
    }
  
      initData.data.loading = false;
    }
  
    // 点击按钮进行回调方法
    function handleClickBtn(data: any) {
      console.log(data, 'data');
  
      const { callback } = data;
      emit(callback, data);
    }
  
    // 监听分页值的改变并进行查询
    watch(
      () => initData.data.params,
      (val) => {
        val ? init() : '';
      },
      {
        deep: true,
      }
    );
  
    onMounted(() => {
      init();
    });
    defineExpose({
      init,
    });
  </script>
  
  <style  scoped>
    .btn {
      margin-right: 10px;
    }
    .loader-animate {
      width: 100%;
      height: 100%;
      background: linear-gradient(
        -60deg,
        var(--color-fill-2) 25%,
        var(--color-neutral-3) 40%,
        var(--color-fill-3) 55%
      );
      background-size: 400% 100%;
      animation: loop-circle 1.5s cubic-bezier(0.34, 0.69, 0.1, 1) infinite;
    }
  
    @keyframes loop-circle {
      0% {
        background-position: 100% 50%;
      }
  
      100% {
        background-position: 0 50%;
      }
    }
   
  </style>
  