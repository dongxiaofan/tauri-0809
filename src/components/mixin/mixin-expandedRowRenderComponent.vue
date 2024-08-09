<template>
  <div class="clearfix" :style="{width:props.expandedTableConfig.tableWidth || '100%'}">
    <a-table
      :dataSource="dataSource"
      :columns="columns"
      :rowKey="props.expandedTableConfig?.selectedKey"
      size="small"
      :pagination="false"
      :scroll="props.expandedTableConfig.hasScroll == false ? {x:false} : (props.expandedTableConfig.scroll || {x:2400})"
    >
    </a-table>
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  record: {
    type: Object,
    default: () => ({}),
  },
  columns: {
    type: Object,
    default: () => ([]),
  },
  dataKey: {
    type: String,
    default: 'details'
  },
  expandedTableConfig: {
    type: Object,
    default: () => ({}),
  }
})

const dataSource = props.record[props.dataKey].map((_rowData:any) => {
  return {
    ..._rowData,
    parentRecord: props.record
  }
})
</script>