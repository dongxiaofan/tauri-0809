<template>
  <div class="mixin-form">
    <a-form
      ref="formRef"
      :model="formData"
      name="basic"
      class="ant-row"
      labelAlign="right"
      :label-col="formConfig?.labelWidthAuto ? {style: {paddingLeft: '16px'}} : { style: { width: formConfig?.lableWidth + 'px' } }"
      :rules="setFormRules"
      autocomplete="off"
      @finish="searchFn"
      @finishFailed="onFinishFailed"
    >
      <template v-for="(item, index) of setFormItem" :key="index">
        <div :class="`${formConfig?.colStyle ? formConfig.colStyle : 'ant-col ant-col-xl-6'} ${item.style || ''} ${formConfig?.isSearchForm && !isUnfold && index > (formConfig?.rowItemNum ? formConfig?.rowItemNum - 2 : 2) ? 'display-none' : ''}`" v-show="!item.isHide">
          <!-- 普通输入区间 单独写 -->
          <template v-if="item.type === 'inputInterval'">
            <div class="ant-col ant-form-item-label interval-label" :style="{width: formConfig?.lableWidth + 'px'}">{{item.label}}：</div>
            <div class="interval-input-wrap" style="width:calc(100% - 180px)">
              <a-form-item :name="item.bind1" class="interval-input" style="width:calc(50% - 10px)">
                <a-input v-model:value="formData[item.bind1]" placeholder="请输入"></a-input>            
              </a-form-item>
              <span class="interval-input-split">~</span>
              <a-form-item :name="item.bind2" class="interval-input" style="width:calc(50% - 10px)">
                <a-input v-model:value="formData[item.bind2]" placeholder="请输入"></a-input>
              </a-form-item>
            </div>
          </template>
          <!-- 其他item -->
          <template v-else>
            <a-form-item :label="item.label + '：'" :name="item.bind">
              <template v-if="item.type === 'parentRow'">
                <!-- <p>{{parentRow && parentRow[item.getValKey]}}</p> -->
                <a-input :value="parentRow && parentRow[item.getValKey]" disabled />
              </template>
              <template v-if="item.type === 'selectedRow'">     
                <p>{{selectedObjArr && (selectedObjArr.map((_row:any) => {return _row[item.getValKey]})).join(',')}}</p>
              </template>
              <template v-if="item.type === 'p'">     
                <p>{{formData[item.bind]}}</p>
              </template>
              <template v-if="item.type === 'input'">     
                <a-input v-model:value="formData[`${item.bind}`]" :placeholder="item.placeholder || '请输入' + item.label" allow-clear :disabled="item.isDisabled || (item.editIsDisabled && parentRow ? true : false) || formConfig?.isOnlyViewForm" :type="item.valType || 'text'" :suffix="item.suffix" @change="inputClearSpace(item.bind, $event)" />
              </template>
              <template v-if="item.type === 'textarea'">     
                <a-textarea v-model:value="formData[`${item.bind}`]" :placeholder="item.placeholder || '请输入' + item.label" allow-clear :disabled="item.isDisabled || (item.editIsDisabled && parentRow ? true : false) || formConfig?.isOnlyViewForm" :type="item.valType || 'text'" :suffix="item.suffix" />
              </template>
              <template v-if="item.type === 'inputNumber'">     
                <a-input-number v-model:value="formData[item.bind]" :placeholder="item.placeholder || '请输入' + item.label" allow-clear :disabled="item.isDisabled || (item.editIsDisabled && parentRow ? true : false) || formConfig?.isOnlyViewForm" :max="item.max" :min="item.min" />
              </template>
              <template v-if="item.type === 'select' && !item.isMultiple">     
                <a-select
                  v-model:value="formData[item.bind]"
                  show-search
                  :placeholder="item.placeholder || '请选择' + item.label"
                  :options="setOptionListDown[item.optionListName]"
                  :filter-option="(input: string, option: any) => {return option.label.indexOf(input.replace(/\s/g, '')) >= 0}"
                  :disabled="item.isDisabled || (item.editIsDisabled && parentRow ? true : false) || formConfig?.isOnlyViewForm || (item.hasMustParam && !(setOptionListDown[item.optionListName] && setOptionListDown[item.optionListName].length))"
                  allow-clear
                  @change="selectOnChange(item, $event)"
                ></a-select>
              </template>
              <template v-if="item.type === 'select' && item.isMultiple">
                <a-select
                  v-model:value="formData[item.bind]"
                  show-search
                  mode="multiple"
                  labelInValue
                  :placeholder="item.placeholder || '请选择' + item.label"
                  :max-tag-count="2"
                  :max-tag-text-length="3"
                  :options="setOptionListDown[item.optionListName]"
                  :filter-option="(input: string, option: any) => {return option.label.indexOf(input.replace(/\s/g, '')) >= 0}"
                  :disabled="item.isDisabled || (item.editIsDisabled && parentRow ? true : false) || formConfig?.isOnlyViewForm || (item.hasMustParam && !(setOptionListDown[item.optionListName] && setOptionListDown[item.optionListName].length))"
                  allow-clear
                  @change="selectOnChange(item, $event)"
                >
                </a-select>
              </template>
              <template v-if="item.type === 'radio'">
                <a-radio-group v-model:value="formData[item.bind]" button-style="solid" v-if="item.optionType == 'button'">
                  <a-radio-button v-for="(c_item, index) of formConfig?.optionListDown[item.optionListName]" :value="c_item.value" :key="index" :disabled="item.isDisabled || (item.editIsDisabled && parentRow ? true : false) || formConfig?.isOnlyViewForm">{{c_item.label}}</a-radio-button>
                </a-radio-group>
                <a-radio-group v-model:value="formData[item.bind]" v-else>
                  <a-radio v-for="(c_item, index) of formConfig?.optionListDown[item.optionListName]" :value="c_item.value" :key="index" :disabled="item.isDisabled || (item.editIsDisabled && parentRow ? true : false) || formConfig?.isOnlyViewForm">{{c_item.label}}</a-radio>
                </a-radio-group>
              </template>
              <template v-if="item.type === 'date'">
                  <a-date-picker v-model:value="formData[item.bind]" :showTime="item.showTime" :locale="zh_cn" :placeholder="item.placeholder || '请选择日期/时间'" :disabled="item.isDisabled || (item.editIsDisabled && parentRow ? true : false) || formConfig?.isOnlyViewForm" :picker="item.dateType || 'date'" :disabled-date="item.options" :allowClear="item.noClear ? false : true" class="w-100" @change="dateOnChange(item, $event)" />
              </template>
              <template v-if="item.type === 'switch'">
                  <a-switch v-model:checked="formData[item.bind]" />
              </template>
              <template v-if="item.type === 'treeSelect'">
                <a-tree-select
                  v-model:value="formData[item.bind]"
                  show-search
                  style="width: 100%"
                  :dropdown-style="{ maxHeight: '400px', overflow: 'scroll' }"
                  :placeholder="item.placeholder || '请选择' + item.label"
                  allow-clear
                  labelInValue
                  multiple
                  tree-default-expand-all
                  :tree-data="setOptionListDown[item.optionListName]"
                  tree-node-filter-prop="label"
                  :field-names="item.fieldNames"
                  :max-tag-count="2"
                  :max-tag-text-length="3"
                  :treeCheckable="true"
                  @change="treeSelectOnChange(item, $event)"
                ></a-tree-select>
              </template>
              <template v-if="item.type === 'treeModal'">
                <a-row class="mixin-form-treeModal-wrap" @click="handleShowTreeModal(item)">
                  <a-col :span="18">
                    <div class="txt-placeholder" v-show="!formData[`${item.onlyShowKey}`]">{{'请选择' + item.label}}</div>
                    <div class="txt-left">{{formData[`${item.onlyShowKey}`]}}</div>
                  </a-col>
                  <a-col :span="6"><span class="pull-right text-info">选择</span></a-col>
                </a-row>
                
              </template>
              <template v-if="item.type === 'cascader'">
                  <a-cascader v-model:value="formData[item.bind]" :options="ProvinceArr" :load-data="loadDataCity" :field-names="{ label: 'name', value: 'id', children: 'children' }" :placeholder="item.placeholder || '请选择'" @change="cascaderOnChange(item, $event)" />
                </template>
              <template v-if="item.type === 'dateRange'">
                <a-range-picker v-model:value="formData[item.bind]" :picker="item.dateType" :locale="zh_cn" :placeholder="['开始时间','结束时间']" @change="dateRangeOnChange(item, $event)" />
              </template>
            </a-form-item>
          </template>
        </div>
      </template>

      <!-- 跟随在查询条件后的按钮组 -->
      <!-- <div v-if="formConfig?.isSearchForm" class="mb-12">
        <Button type="primary" html-type="submit" class="ml-10">查询</Button>
        <Button type="default" @click="resetFn" class="ml-10">重置</Button>
        <div class="mixin-search-btn-toggle" @click="handleToggle" v-show="(setFormItem.length > 3 && !formConfig?.isHideFoldToggle) || formConfig?.isShowFoldToggle">
          <span>{{ !isUnfold ? '展开' : '收起'}}</span>
          <caret-up-outlined class="icon-xiaosanjiao" v-show="isUnfold" />
          <caret-down-outlined class="icon-xiaosanjiao" v-show="!isUnfold" />
        </div>
      </div> -->
      <a-col v-if="formConfig?.isSearchForm" class="mb-12" :span="6" :offset="(isUnfold && (setFormItem.length-(formConfig?.hasHideItemNum || 0))%4 == 0) ? 18 : 0">
        <div :class="(isUnfold && (setFormItem.length-(formConfig?.hasHideItemNum || 0))%4 == 0) ? 'pull-right' : ''">
          <Button type="primary" html-type="submit" class="ml-10">查询</Button>
          <Button type="default" @click="resetFn" class="ml-10">重置</Button>
          <div class="mixin-search-btn-toggle" @click="handleToggle" v-show="(setFormItem.length > 3 && !formConfig?.isHideFoldToggle) || formConfig?.isShowFoldToggle">
            <span>{{ !isUnfold ? '展开' : '收起'}}</span>
            <caret-up-outlined class="icon-xiaosanjiao" v-show="isUnfold" />
            <caret-down-outlined class="icon-xiaosanjiao" v-show="!isUnfold" />
          </div>
        </div>
      </a-col>
    </a-form>
  </div>

  <!-- 树选择弹窗0 -->
  <MixinTreeModal ref="mixinTreeModalRef" @selectedTreeOk="selectedTreeOk" />
</template>

<script lang="ts" setup>
import { ref, toRaw, computed, reactive, UnwrapRef, onBeforeMount, onMounted, onBeforeUnmount, onUnmounted, watch } from "vue";
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex';
import { message, Button, Modal } from "ant-design-vue";
import { CaretUpOutlined, CaretDownOutlined } from "@ant-design/icons-vue"
import { MixinCommon } from './mixin-common.js'
import MixinTreeModal from './mixin-treeModal.vue'
import http from '@/utils/http.js'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn';
import zh_cn from 'ant-design-vue/es/date-picker/locale/zh_CN';

const emits = defineEmits(['submitOk'])  
const route = useRoute()
const router = useRouter()
const { state } = useStore()

const props = defineProps({
  initFormConfig: Object,
  parentRow: Object,
  selectedObjArr: Array,
  variables: Object
})

const formRef = ref();
const formData = reactive<any>({})
let formConfig = reactive<any>({...props.initFormConfig})
const setFormRules = reactive<any>({...props.initFormConfig?.rules}) // 表单验证规则
const setFormItem = reactive<any>([...props.initFormConfig?.formItem])
const setOptionListDown = reactive<any>({}) // 下拉列表
const isUnfold = ref<boolean>(true) // 是否展开表单
const isClickReset = ref<boolean>(false) // 是否点击了重置
let mergeParams = reactive<any>({})
const ProvinceArr = ref<CascaderProps['options']>([]);
// let variables = reactive({})  // 变量

const screws = ref(0) // 变量

// 展开/收起
const handleToggle = () => {
  isUnfold.value = !isUnfold.value
}

// 获取表单初始值及最新查询数据
const getFormInitVals = () => {
  console.log('获取表单初始值及最新查询数据: ', formConfig)
  if (formConfig && (formConfig.isSearchForm||formConfig.hasDefaultValItem)) { // 搜索表单有默认值，或者普通表单有默认值的情况
    let routeQuery:any = route.query;
    console.log('xxxxxxxxxxxx routeQuery: ', routeQuery)
    setFormItem?.map((item:any, index:number) => {
      if (routeQuery && item.getInitValSource == 'route') { // 从URL里带出默认值
        if (item.type == 'dateRange' && (routeQuery[item.getInitValCode1] || routeQuery[item.bind1])) {
          let getInitValCode1 = item.getInitValCode1 || item.bind1
          let getInitValCode2 = item.getInitValCode2 || item.bind2
          formData[item.bind1] = routeQuery[getInitValCode1]
          formData[item.bind2] = routeQuery[getInitValCode2]
          formData[item.bind] = [routeQuery[getInitValCode1], routeQuery[getInitValCode2]]
          item.isDisabled = item.getInitValIsDisabled && routeQuery[getInitValCode1] && routeQuery[getInitValCode2] ? true : (item.isDisabled || false)
        } else if (routeQuery[item.getInitValCode] || routeQuery[item.bind]) {
          let getInitValCode = item.getInitValCode || item.bind
          formData[item.bind] = item.valueType == 'num' ? Number(routeQuery[getInitValCode]) : routeQuery[getInitValCode]
          item.isDisabled = item.getInitValIsDisabled && routeQuery[getInitValCode] && routeQuery[getInitValCode] != 'undefined' ? true : (item.isDisabled || false)
        }
      } else if (item.hasDefaultVal) { // 有自己设置的默认值 resetIsClearDefaultVal==true时，重置清空默认值。默认情况下，重置不会清空最初配置的默认值
        if (isClickReset.value && item.resetIsClearDefaultVal) { // 重置并且不需要保留默认值
          sendDefaultNull(item)
          // if (item.type == 'date') {
          //   formData[item.bind] = null
          //   if (item.bindYear) { formData[item.bindYear] = null }
          //   if (item.bindMonth) { formData[item.bindMonth] = null }
          // } else if (item.type == 'dateRange') {
          //   formData[item.bind1] = null
          //   formData[item.bind2] = null
          //   formData[item.bind] = ['', '']
          // } else if (item.type == 'treeSelect' && item.defaultVal && item.defaultVal.length) {
          //   formData[item.bind] = null
          //   formData[item.treeSendCode] = null
          //   formData[item.bindTitlesKey] = null
          // } else if (item.type == 'treeModal' && item.defaultVal && item.defaultVal.length) {
          //   formData[item.bind] = null
          //   formData[item.treeSendCode] = null
          //   formData[item.bindTitlesKey] = null
          //   formData[item.onlyShowKey] = null
          // } else {
          //   formData[item.bind] = null
          // }
        } else if (item.defaultValOutOfUrlKeys && item.defaultValOutOfUrlKeys.length) { // 有默认值，但如果URL里有指定参数，默认值需要清空
          for (var _i = 0; _i < item.defaultValOutOfUrlKeys.length; _i++) {
            if (routeQuery && routeQuery[item.defaultValOutOfUrlKeys[_i]]) {
              sendDefaultNull(item);
              return;
            } else {
              sendDefaultVal(item);
            }
          }
        } else { // 初始化默认值 或者重置时保留默认值
          sendDefaultVal(item);
          // if (item.type == 'date') {
          //   formData[item.bind] = dayjs(item.defaultVal)
          //   let splitVal = dayjs(item.defaultVal).format('YYYY-MM-DD').split('-')
          //   if (item.bindYear) { formData[item.bindYear] = splitVal[0] }
          //   if (item.bindMonth) { formData[item.bindMonth] = splitVal[1] }
          // } else if (item.type == 'dateRange') {
          //   const formatType = item.dateType == 'month' ? 'YYYY-MM' : (item.dateType == 'year' ? 'YYYY' : 'YYYY-MM-DD')
          //   formData[item.bind1] = dayjs(item.defaultVal1).format(formatType)
          //   formData[item.bind2] = dayjs(item.defaultVal2).format(formatType)
          //   formData[item.bind] = [dayjs(item.defaultVal1), dayjs(item.defaultVal2)]
          // } else if (item.type == 'treeSelect' && item.defaultVal && item.defaultVal.length) {
          //   formData[item.bind] = item.treeSendType == 'string' ? item.defaultVal.join(',') : item.defaultVal
          //   formData[item.treeSendCode] = item.treeSendType == 'array' ? item.defaultVal : item.defaultVal.join(',')
            
          //   if (item.isSendTitles && item.defaultTitlesVal) { // 如果需要发送树数据的title合集    
          //     formData[item.bindTitlesKey] = item.treeSendType == 'string' ? item.defaultTitlesVal.join(',') : item.defaultTitlesVal // 需要发送的title合集
          //   }
          // } else if (item.type == 'treeModal' && item.defaultVal && item.defaultVal.length) {
          //   formData[item.treeSendCode] = item.treeSendType == 'array' ? item.defaultVal : item.defaultVal.join(',')
          //   if (item.isSendTitles && item.defaultTitlesVal) { // 如果需要发送树数据的title合集
          //     formData[item.onlyShowKey] = item.defaultTitlesVal.join(',')        
          //     formData[item.bindTitlesKey] = item.treeSendType == 'string' ? item.defaultTitlesVal.join(',') : item.defaultTitlesVal // 需要发送的title合集
          //   }
          // } else {
          //   formData[item.bind] = item.defaultVal
          // }
        }
      } else { // 没有默认值的情况
        setFormItem[index].isDisabled = item.resetIsDisabled;
        sendDefaultNull(item);
        // if (item.type == 'treeSelect' && formConfig?.hasTreeSelectItem) {
        //   // $refs.TreeModal.selectedArr = []
        // } else if (item.type == 'select') {
        //   if (item.isMultiple) {
        //     formData[item.bind] = item.multipleSendType == 'array' ? [] : null
        //     formData[item.multipleSendCode] = item.multipleSendType == 'array' ? [] : null
        //     if (item.isSendLabels) {
        //       formData[item.bindLabelsKey] = item.multipleSendType == 'array' ? [] : null
        //     }
        //   } else {
        //     formData[item.bind] = null
        //   }
        //   if (item.isResetClearOps) {
        //     setOptionListDown[item.optionListName] = null
        //   }
        // } else if (item.type == 'date') {
        //   formData[item.bind] = null
        // } else if (item.type == 'dateRange') { // 日期区间
        //   formData[item.bind] = ['', '']
        //   formData[item.bind1] = null
        //   formData[item.bind2] = null
        // } else if (item.type == 'cascader') {
        //   item.transformRule.map((_tr:any) => {
        //     formData[_tr.sendCode] = null
        //   })
        // } else if (item.type == 'inputInterval') {
        //   formData[item.bind1] = null
        //   formData[item.bind2] = null
        // } else {
        //   formData[item.bind] = null
        // }
      }
    })
    console.log('🌼 formData 🌼', formData)
    screws.value = Math.random() * 100

    // 首次进入页面时，不要获取列表数据 || 点击重置时获取数据
    if (!formConfig?.initNoSearch || isClickReset.value) {
      searchFn()
    }
  }
}

// 表单赋默认值
const sendDefaultVal = (item:any) => {
  if (item.type == 'date') {
    formData[item.bind] = dayjs(item.defaultVal)
    let splitVal = dayjs(item.defaultVal).format('YYYY-MM-DD').split('-')
    if (item.bindYear) { formData[item.bindYear] = splitVal[0] }
    if (item.bindMonth) { formData[item.bindMonth] = splitVal[1] }
    dateOnChange(item, item.defaultVal)
  } else if (item.type == 'dateRange') {
    const formatType = item.dateType == 'month' ? 'YYYY-MM' : (item.dateType == 'year' ? 'YYYY' : 'YYYY-MM-DD')
    formData[item.bind1] = dayjs(item.defaultVal1).format(formatType)
    formData[item.bind2] = dayjs(item.defaultVal2).format(formatType)
    formData[item.bind] = [dayjs(item.defaultVal1), dayjs(item.defaultVal2)]
  } else if (item.type == 'treeSelect' && item.defaultVal && item.defaultVal.length) {
    formData[item.bind] = item.treeSendType == 'string' ? item.defaultVal.join(',') : item.defaultVal
    formData[item.treeSendCode] = item.treeSendType == 'array' ? item.defaultVal : item.defaultVal.join(',')
    
    if (item.isSendTitles && item.defaultTitlesVal) { // 如果需要发送树数据的title合集    
      formData[item.bindTitlesKey] = item.treeSendType == 'string' ? item.defaultTitlesVal.join(',') : item.defaultTitlesVal // 需要发送的title合集
    }
  } else if (item.type == 'treeModal' && item.defaultVal && item.defaultVal.length) {
    formData[item.treeSendCode] = item.treeSendType == 'array' ? item.defaultVal : item.defaultVal.join(',')
    if (item.isSendTitles && item.defaultTitlesVal) { // 如果需要发送树数据的title合集
      formData[item.onlyShowKey] = item.defaultTitlesVal.join(',')        
      formData[item.bindTitlesKey] = item.treeSendType == 'string' ? item.defaultTitlesVal.join(',') : item.defaultTitlesVal // 需要发送的title合集
    }
  } else {
    formData[item.bind] = item.defaultVal
  }
}

// 表单清空默认值
const sendDefaultNull = (item:any) => {
  if (item.type == 'date') {
    formData[item.bind] = null
    if (item.bindYear) { formData[item.bindYear] = null }
    if (item.bindMonth) { formData[item.bindMonth] = null }
  } else if (item.type == 'dateRange') { // 日期区间
    formData[item.bind] = ['', '']
    formData[item.bind1] = null
    formData[item.bind2] = null
  } else if (item.type == 'cascader') {
    item.transformRule.map((_tr:any) => {
      formData[_tr.sendCode] = null
    })
  } else if (item.type == 'inputInterval') {
    formData[item.bind1] = null
    formData[item.bind2] = null
  } else if (item.type == 'select') {
    if (item.isMultiple) {
      formData[item.bind] = item.multipleSendType == 'array' ? [] : null
      formData[item.multipleSendCode] = item.multipleSendType == 'array' ? [] : null
      if (item.isSendLabels) {
        formData[item.bindLabelsKey] = item.multipleSendType == 'array' ? [] : null
      }
    } else {
      formData[item.bind] = null
    }
    if (item.isResetClearOps) {
      setOptionListDown[item.optionListName] = null
    }
  } else if (item.type == 'treeSelect' && item.defaultVal && item.defaultVal.length) {
    formData[item.bind] = null
    formData[item.treeSendCode] = null
    formData[item.bindTitlesKey] = null
  } else if (item.type == 'treeModal' && item.defaultVal && item.defaultVal.length) {
    formData[item.bind] = null
    formData[item.treeSendCode] = null
    formData[item.bindTitlesKey] = null
    formData[item.onlyShowKey] = null
  } else {
    formData[item.bind] = null
  }
}

// 获取所有下拉框值
const loadAllSelectOps = () => {
  setFormItem && setFormItem.map((actionItem:any) => {
    if (!actionItem.isHide) {
      if (actionItem.type == 'select') {
        if (actionItem.optionListSource === 'local') {
          setOptionListDown[actionItem.optionListName] = formConfig?.optionListDown[actionItem.optionListName]
        } else {
          if (!actionItem.hasMustParam) {
            queryOptionList(actionItem);
          } else if (actionItem.hasMustParam && actionItem.mustParamsDataFromRow) { // 含有必传参数的下拉 && 必传参数来自于行数据
            queryOptionList(actionItem);
          }
        }
      } else if (actionItem.type == 'tree'|| actionItem.type == 'treeSelect') {
        let defaultParam = {}
        queryTreeList(actionItem, defaultParam);
      } else if (actionItem.type == 'cascader') {
        getProvince();
      }
    }
  })
}

// 下拉框-获取普通下拉数据
const queryOptionList = (actionItem:any) => {
  let defaultParam = actionItem.defaultParamsData;
  let mustParam:any = {}
  let routeParam:any = {}
  if (actionItem.hasMustParam) {
    actionItem.mustParamsData.map((mp:any) => {
      if (mp.valueSource == 'linkItem') {
        let linkageLevel = setFormItem.find((_item:any) => {return _item.bind == mp.sourceCode})
        console.log('linkageLevel: ', linkageLevel)
        mustParam[mp.sendKey] = linkageLevel.currentSelectedObj[mp.getValKey]
      } else if (mp.valueSource == 'ids' && props.selectedObjArr) {
        let ids = props.selectedObjArr.map((selected:any) => {return selected.id})
        mustParam[mp.sendKey || 'ids'] = mp.sendType == 'array' ? ids : ids.join(',')
      } else if (mp.valueSource == 'row' && props.parentRow) {
        mustParam[mp.sendKey] = props.parentRow[mp.getValKey]
      } else if (mp.valueSource == 'form') {
        mustParam[mp.sendKey] = formData[mp.getValKey]
      } else if (mp.valueSource == 'route') {
        let routeQuery = route.query
        mustParam[mp.sendKey] = routeQuery[mp.getValKey]
      }
    })
  } else if (actionItem.hasRouteParam) {
    routeParam = route.query
  }
  let testMergeParams = {...defaultParam, ...mustParam, ...routeParam}
  http({
    url: actionItem.selectData.url,
    method: actionItem.selectData.method,
    data: testMergeParams || null
  })
  .then((resp:any) => {
    if (resp) {
      let requestData:any
      if (actionItem.requestInPath) { // 数据从返回路径里查找
        if (actionItem.requestInPath.isArray) { // 返回的是数组
          requestData = (resp.find((_i:any) => _i[actionItem.requestInPath.getParentKey] == actionItem.requestInPath.getDataKey)).Items
        } else if (actionItem.requestInPath.isObj) {
          const getParentKey = actionItem.requestInPath.getParentKey
          requestData = getParentKey === 'data' ? resp.data[actionItem.requestInPath.getDataKey] : resp[actionItem.requestInPath.getDataKey]
        }
      } else {
        requestData = resp.data
      }
      MixinCommon.parsingOptionList(actionItem, requestData, setOptionListDown)
      // 假如此下拉默认值为第一条并且返回只有一条数据时
      if (actionItem.hasDefaultFirstValAndListOnlyOne && requestData.length == 1 || actionItem.hasDefaultFirstVal) {
        let getValCode = actionItem.optionTransform.value // 数据转换前的code
        formData[actionItem.bind] = requestData[0][getValCode]
        // selectOnChange(actionItem, requestData[0][getValCode])
      }
    } else {
      // props.setOptionListDown[actionItem.optionListName] = null
    }
  })
}

// 获取全部省份(item-type为cascader的时候使用)
const getProvince = () => {
  http({
    url: '/api/SysArea/GetProvince',
    method: 'get',
    enctype: 'multipart/form-data',
  }).then((resp:any) => {
    // console.log('获取省份 resp: ', resp)
    // ProvinceArr.value = resp.data.data
    ProvinceArr.value = resp.data.data.map((item:any) => {
      return {
        ...item,
        loading: false,
        isLeaf: false,
      }
    })
  })
}

// 分级查询地区(item-type为cascader的时候使用)
const loadDataCity = (selectedOptions:any) => {
  // console.log('selectedOptions: ', selectedOptions)
  const targetOption = selectedOptions[selectedOptions.length - 1];
  targetOption.loading = true;
  // console.log('targetOption: ', targetOption)

  targetOption.loading = true
  if (targetOption.levelID === 2) {
    http({
      url: '/api/SysArea/GetCity',
      method: 'get',
      enctype: 'multipart/form-data',
      params: {parentId: targetOption.id}
    }).then((resp:any) => {
      targetOption.children = resp.data.data.map((item:any) => {
        return {
          ...item,
          loading: false,
          isLeaf: false,
        }
      })
      targetOption.loading = false
    })
  } else {
    http({
      url: '/api/SysArea/GetArea',
      method: 'get',
      enctype: 'multipart/form-data',
      params: {parentId: targetOption.id}
    }).then((resp:any) => {
      targetOption.children = resp.data.data
      targetOption.loading = false
    })
  }
};

// 获取树数据
const queryTreeList = (actionItem:any, mustParamObj:any) => {
  http({
    url: actionItem.selectData?.url,
    method: actionItem.selectData?.method,
    enctype: 'multipart/form-data',
    params: actionItem.selectData.method == 'get' ? mustParamObj || null : null,
    data: actionItem.selectData.method == 'post' ? mustParamObj || null : null,
  })
  .then((resp:any) => {
    if (resp.status == 200 && resp.data) {
      // console.log('🦌 下拉框-获取树结构数据: ', resp)
      let requestData = actionItem.requestListName == 'data.data' ? resp.data.data : resp.data.data[actionItem.requestListName]
      // let arr = getTree(actionItem, requestData);
      setOptionListDown[actionItem.optionListName] = requestData
      // console.log('🦌 setOptionListDown: ', setOptionListDown)
    }
  })
}

// 输入框过滤空格
const inputClearSpace = (itemKey:string, event:any) => {
  let val = event.target.value;
  formData[itemKey] = val.replace(/\s/g, '')
}

// 输入框失去焦点事件
const inputOnBlur = (itemKey:string, event:any) => {
  let val = event.target.value;
  formData[itemKey] = val.replace(/\s/g, '')
}

// 下拉选择改变
const selectOnChange = (actionItem:any, event:any, isOnSelect?:boolean) => {
  console.log('event: ', event)
  let actionVal = isOnSelect ? event.value : event
  if (actionItem.hasDefaultVal && actionItem.defaultVal == actionVal) {
    formData[actionItem.bind] = actionVal
  }
  if (actionItem.isMultiple) {
    console.log('多选 actionVal: ', actionVal)
    let selectedIds:any = []
    let selectedLabels:any = []
    actionVal.map((_i:any) => {
      selectedIds.push(_i.value)
      selectedLabels.push(_i.label)
    })
    formData[actionItem.multipleSendCode] = actionItem.multipleSendType == 'array' ? selectedIds : selectedIds.join(',')
    if (actionItem.isSendLabels) { // 如果需要发送树数据的Label合集        
      formData[actionItem.bindLabelsKey] = actionItem.multipleSendType == 'array' ? selectedLabels : selectedLabels.join(',')
    }
    if (actionItem.isSendAssemble) {
      let tempArr:any = [];
      actionVal.map((_i:any) => {
        let obj:any = {}
        actionItem.assembleRule.dataTransform.map((_ar:any) => {
          obj[_ar.sendKey] = _i[_ar.getValKey]
        })
        tempArr.push(obj)
      })
      formData[actionItem.assembleRule.sendCode] = tempArr
    }
  }
  console.log('下拉选择改变 actionItem: ', actionItem, ', actionVal: ', actionVal)
  let currentSelectedObj = actionVal ? setOptionListDown[actionItem.optionListName].find((option:any) => {return option.value == actionVal}) : null
  console.log('currentSelectedObj: ', currentSelectedObj)
  actionItem.currentSelectedObj = currentSelectedObj

  if (actionItem.linkage && actionItem.linkage.length) { // 联动规则部分
    console.log('有联动: ', actionItem.linkage);

    actionItem.linkage.map((linkageItem:any) => {
      // 此联动类型为：获取其他下拉列表
      if (linkageItem.linkageType == 'GET_SELECT_LIST') {
        console.log('😥此联动类型为：获取其他下拉列表');
        // 获取其他下拉列表
        linkageItem.tabFields.map((targetCode:any) => {
          // 关联的item
          let targetActionItem = setFormItem.find((item:any) => {
            return item.bind == targetCode;
          });
          console.log('☆ 操作目标targetActionItem: ', targetActionItem);
          if (actionVal && targetActionItem) {
            queryOptionList(targetActionItem);
          }
        });
      };

      // 此联动类型为：从某个选择的下拉框里取值，并赋值给目标操作的下拉列表
      if (linkageItem.linkageType == 'SET_CHILDREN_LIST') {
        console.log('😥此联动类型为：从某个选择的下拉框里取值，并赋值给目标操作的下拉列表');
        // 从某个选择的下拉框里取值，并赋值给目标操作的下拉列表
        linkageItem.tabFields.map((targetCode:any) => {
          // 关联的item
          let targetActionItem = setFormItem.find((item:any) => {
            return item.bind == targetCode;
          });
          if (currentSelectedObj) {
            // MixinCommon.parsingOptionList(targetActionItem, currentSelectedObj[targetActionItem.optionListName], setOptionListDown)
          } else {
            setOptionListDown[targetActionItem.optionListName] = []
            formData[targetActionItem.bind] = null
          }
        });
      };

      // 此联动类型为：自动赋值
      if (linkageItem.linkageType == 'AUTO_VALUE') {
        console.log('😥此联动类型为：自动赋值');
        linkageItem.tabFields.map((tabField:any) => {
          if (actionVal) {
            formData[tabField.targetCode] = actionItem.currentSelectedObj[tabField.getValKey]
          } else {
            formData[tabField.targetCode] = null
          }
        });
      };

      // 此联动类型为：禁用其他框
      if (linkageItem.linkageType == 'DISABLE') {
        console.log('😥此联动类型为：禁用其他框');
        if (actionVal) {
          linkageItem.tabFields.map((tabField:any) => {
            setFormItem.map((_item:any) => {
              if (tabField.targetCode.indexOf(_item.bind) != -1) {
                console.log('需要操作的_item: ', _item);
                if (tabField.conditionSymbol == 'eq' && tabField.value.indexOf(actionVal) > -1) {
                  _item.isDisabled = true;
                } else {
                  _item.isDisabled = false;
                }
              }
            });
          });
        } else {
          linkageItem.tabFields.map((tabField:any) => {
            setFormItem.map((_item:any) => {
              if (tabField.targetCode.indexOf(_item.bind) != -1) {
                _item.isDisabled = true
              }
            });
          });
        }
      };

      // 此联动类型为：必需
      if (linkageItem.linkageType == 'REQUIRED' && actionVal) {
        console.log('😥此联动类型为：必需');
        for (var i=0; i<linkageItem.tabFields.length; i++) {
          let tabFieldItem = linkageItem.tabFields[i]
          const formItemCods = setFormItem.map((_fi:any) => {return _fi.bind})
          // let validateArr:any = []; // rules外的验证
          if (tabFieldItem.value == actionVal) {
            // console.log('找到对应的规则了: ', tabFieldItem, ', 必选Code: ', tabFieldItem.targetCode, ', 非必选Code: ', tabFieldItem.noRequiredCode)
            for (var _i=0; _i<tabFieldItem.targetCode.length; _i++) {
              let tCode = tabFieldItem.targetCode[_i]
              let _item = setFormItem.find((_fi:any) => {return _fi.bind == tCode})
              let _formItem_index = formItemCods.indexOf(tCode)
              // console.log('tCode: ', tCode, ', _formItem_index: ', _formItem_index)
              // 有额外的验证规则的情况
              let validateRuleItem:any = formConfig?.validateList[tCode] || {required: false, message: ''}
              // console.log('单独的额外验证: ', validateRuleItem)
              setFormItem[_formItem_index].style = 'is-required';
              setFormRules[tCode] = [
                validateRuleItem,
                { required: true, message: _item.type == 'input' ? `${'请输入'+_item.label}` : `${'请选择'+_item.label}`, trigger: 'change' }
              ]
            }
            for (var _i=0; _i<tabFieldItem.noRequiredCode.length; _i++) {
              let tCode = tabFieldItem.noRequiredCode[_i]
              let _formItem_index = formItemCods.indexOf(tCode)
              setFormItem[_formItem_index].style = 'remove-required';
              setFormRules[tCode] = [
                { required: false, trigger: 'change' }
              ]
            }
            break;
          }
        }
      };

      // 此联动类型为：显示或隐藏
      if (linkageItem.linkageType == 'SHOW' && actionVal) {
        console.log('😥此联动类型为：显示或隐藏');
        linkageItem.tabFields.map((tabField:any) => {
          setFormItem.map((_item:any) => {
            if (tabField.targetCode.indexOf(_item.bind) != -1) {
              console.log('需要操作的_item: ', _item);
              if (tabField.conditionSymbol == 'eq' && actionVal == tabField.value) {
                _item.isHide = false;
              } else {
                _item.isHide = true;
                setFormRules[_item.bind] = [
                  { required: false, trigger: 'change' }
                ]
              }
            }
          });
        });
      };

      // 此联动类型为：刷新置空
      if (linkageItem.linkageType == 'REFRESH') {
        console.log('😥此联动类型为：刷新置空');
        linkageItem.tabFields.map((targetCode:any) => {
          // 关联的item
          let targetActionItem = setFormItem.find((item:any) => {
            return item.bind == targetCode;
          });
          if (targetActionItem) {
            if (targetActionItem.type == 'select' && targetActionItem.isMultiple) {
              formData[targetCode] = []
            } else {
              formData[targetCode] = null
            }
          }
        });
      };
    });
  } else if (actionItem.currentValueTypeIsTransform) { // 当前值转换规则
    actionItem.transformRule.map((tr:any) => {
      if (tr.oldValType == 'array' && tr.toTransformType == 'string') { // 当前值为数组，且需要转换为字符串发送
        if (tr.isCutLast) { // 是否只截取数组最后一个
          formData[tr.sendCode] = actionVal[actionVal.length - 1]
        } else {
          formData[tr.sendCode] = actionVal.join(tr.transformSymbol)
        }
      }
    })
  }

  if (!isOnSelect) {
    screws.value = Math.random() * 100 // 重置：普通下拉数据，不能有这个。但是单选和下拉多选需要。
  }
}

// 地区选择改变
const cascaderOnChange = (actionItem:any, actionVal:any) => {
  if (actionItem.currentValueTypeIsTransform) { // 当前值转换规则
    actionItem.transformRule.map((tr:any) => {
      if (tr.oldValType == 'array' && tr.toTransformType == 'string') { // 当前值为数组，且需要转换为字符串发送
        if (tr.isCutLast) { // 是否只截取数组最后一个
          formData[tr.sendCode] = actionVal[actionVal.length - 1]
        } else {
          formData[tr.sendCode] = actionVal.join(tr.transformSymbol)
        }
      }
    })
  }
}

// 日期选择改变
const dateOnChange = (actionItem:any, event:any) => {
  if (event) {
    let formatType = actionItem.dateType == 'month' ? 'YYYY-MM' : (actionItem.dateType == 'year' ? 'YYYY' : 'YYYY-MM-DD')
    console.log('🐟 日期选择改变 actionItem: ', actionItem, ', event: ', dayjs(event).format(formatType))
    let testDate = dayjs(event).format(formatType);
    let splitVal = testDate.split('-')
    if (actionItem.bindYear) { formData[actionItem.bindYear] = splitVal[0] }
    if (actionItem.bindMonth) { formData[actionItem.bindMonth] = splitVal[1] }
    if (actionItem.bindDay) { formData[actionItem.bindDay] = splitVal[2] }
    if (actionItem.linkage && actionItem.linkage.length) {
      console.log('有联动: ', actionItem.linkage);
      const formatType = actionItem.dateType == 'month' ? 'YYYY-MM' : (actionItem.dateType == 'year' ? 'YYYY' : 'YYYY-MM-DD')
      actionItem.linkage.map((linkageItem:any) => {
        // 此联动类型为：月份去掉中间的符号
        if (linkageItem.linkageType == 'MONTH_REMOVE_SYMBOL') {
          console.log('😥此联动类型为：月份去掉中间的符号');
          linkageItem.tabFields.map((tabField:any) => {
            formData[tabField.targetCode] = (dayjs(formData[tabField.sourceCode]).format(formatType)).replace('-', '')
          });
        };

        // 此联动类型为：月份从时间格式为字符串
        if (linkageItem.linkageType == 'MONTH_TO_STR') {
          console.log('😥此联动类型为：月份从时间格式为字符串');
          linkageItem.tabFields.map((tabField:any) => {
            formData[tabField.targetCode] = (dayjs(formData[tabField.sourceCode]).format(formatType))
          });
        };

        // 此联动类型为：把时间格式转为当月第一天
        if (linkageItem.linkageType == 'COPY_DATE_TO_FIRST_DAY') {
          console.log('😥此联动类型为：把时间格式转为当月第一天');
          linkageItem.tabFields.map((tabField:any) => {            
            formData[tabField.targetCode] = (dayjs(formData[tabField.sourceCode]).format(formatType)) + '-01'
          });
        };
      })
    }
  } else {
    formData[actionItem.bind] = null;
    actionItem.linkage.map((linkageItem:any) => {
      linkageItem.tabFields.map((tabField:any) => {            
        formData[tabField.targetCode] = null
      });
    })
  }
}

// 日期区间选择改变
const dateRangeOnChange = (actionItem:any, event:any) => {
  if (event && event[0] && event[1]) {
    let formatType = actionItem.dateType == 'month' ? 'YYYY-MM' : (actionItem.dateType == 'year' ? 'YYYY' : 'YYYY-MM-DD')
    // console.log('日期区间选择改变 actionItem: ', actionItem, ', event[0]: ', dayjs(event[0]).format(formatType), ', event[1]: ', dayjs(event[1]).format(formatType))
    if (actionItem.bind1 && actionItem.bind2) {
      formData[actionItem.bind1] = dayjs(event[0]).format(formatType)
      formData[actionItem.bind2] = dayjs(event[1]).format(formatType)
    }
  } else {
    formData[actionItem.bind] = []
    formData[actionItem.bind1] = null
    formData[actionItem.bind2] = null
  }
}

// 树选择改变
const treeSelectOnChange = (actionItem:any, event:any) => {
  console.log('event: ', event)
  if (event?.length) {    
    let selectedIds:any = []
    let selectedLabels:any = []
    event.map((_i:any) => {
      selectedIds.push(_i.value)
      selectedLabels.push(_i.label)
    })
    formData[actionItem.treeSendCode] = actionItem.treeSendType == 'array' ? selectedIds : selectedIds.join(',')
    if (actionItem.isSendTitles) { // 如果需要发送树数据的title合集        
      formData[actionItem.bindTitlesKey] = actionItem.treeSendType == 'array' ? selectedLabels : selectedLabels.join(',')
    }
  }
}

// 打开树弹窗
const mixinTreeModalRef = ref()
const handleShowTreeModal = (actionItem:any) => {
  let defaultVal = actionItem.hasDefaultVal ? actionItem.defaultVal : []
  let isSelectTreeIdArr = formData[actionItem.treeSendCode] ? (actionItem.treeSendType == 'array' ? formData[actionItem.treeSendCode] : formData[actionItem.treeSendCode].split(',')) : []
  let showNodes = isClickReset.value ? [] : new Set([...defaultVal, ...isSelectTreeIdArr])
  mixinTreeModalRef.value.handleShow(actionItem, setOptionListDown[actionItem.optionListName], Array.from(showNodes));
}

// 树弹窗选择确定
const selectedTreeOk = (actionItem:any, checkedNodes:any) => {
  isClickReset.value = false // 选择树弹窗确定后，重置应初始化
  console.log('checkedNodes： ', checkedNodes, ', actionItem: ', actionItem)
  const labelCode = actionItem.fieldNames.label
  const valueCode = actionItem.fieldNames.key
  if (checkedNodes?.length) {
    let selectedIds:any = []
    let selectedLabels:any = []
    checkedNodes.map((_i:any) => {
      selectedIds.push(_i[valueCode])
      selectedLabels.push(_i[labelCode])
    })
    formData[actionItem.treeSendCode] = actionItem.treeSendType == 'array' ? selectedIds : selectedIds.join(',')
    formData[actionItem.onlyShowKey] = selectedLabels.join(',')
    if (actionItem.isSendTitles) { // 如果需要发送树数据的title合集        
      formData[actionItem.bindTitlesKey] = actionItem.treeSendType == 'array' ? selectedLabels : selectedLabels.join(',')
    }
  }
}

// 查询或表单提交时，数据整理及转换
const dataSettle = () => {
  // 需要从行数据里面取值的对象
  let paramObj:any = {};
  formConfig?.actionParams && formConfig?.actionParams.map((pc:any) => {
    if (pc.valueSource == 'row' && props.parentRow) {
      pc.dataTransform.map((_dt:any) => {
        paramObj[_dt.targetCode] = props.parentRow?.[_dt.sourceCode] || null
      })
    } else if (pc.valueSource == 'ids' && props.selectedObjArr) {
      let ids = props.selectedObjArr.map((selected:any) => {return selected.id})
      paramObj[pc.sendKey || 'ids'] = pc.sendType == 'array' ? ids : ids.join(',')
    } else if (pc.valueSource == 'selectedRowsArr' && props.selectedObjArr) {
      pc.dataTransform.map((_dt:any) => {
        let dsi_values:any = props.selectedObjArr?.map((dsi:any) => {return dsi[_dt.sourceCode]})
        paramObj[_dt.targetCode] = pc.sendType == 'array' ? dsi_values : dsi_values.join(',')
      })
    } else if (pc.valueSource == 'default') {
      pc.dataTransform.map((_dt:any) => {
        paramObj[_dt.targetCode] = _dt.sendVal
      })
    } else if (pc.valueSource == 'defaultVal') {
      pc.dataTransform.map((_dt:any) => {
        paramObj[_dt.targetCode] = _dt.targetVal
      })
    }
  })
  
  // 含有映射规则的对象
  let mapRuleObj = {}
  if (formConfig?.mapRule) {
    formConfig?.mapRule.map((mr:any) => {
      if (mr.hasGetValOrder) { // 是否按查找顺序取值（比如，先查URL里是否能取到值，再查form里是否能取到值…）
        let aboutForm_item = mr.transformRule.find((_i:any) => {return _i.valueSource == 'form'});
        let aboutRoute_item = mr.transformRule.find((_i:any) => {return _i.valueSource == 'route'});
        if (mr.orderCode == 'formGreaterThanRoute') {
          let routeQuery = route.query
          formData[mr.targetCode] = formData[aboutForm_item.getValCode] || (routeQuery[aboutRoute_item.getValCode] && aboutRoute_item.transformKey == 'valueIsStrToArr' ? routeQuery[aboutRoute_item.getValCode].split(',') : routeQuery[aboutRoute_item.getValCode])
        }
      } else if (mr.valueSource == 'form') {
        if (mr.hasJudge) { // 是否含有复杂判断规则
          mr.judgeArr.map((j:any) => {
            if (formData[j.sourceCode] == j.sourceValue) {
              formData[mr.targetCode] = formData[j.getValCode]
            }
          })
        } else if (mr.transformKey == 'valueIsArray' && mr.transformRule && formData[mr.sourceCode]) { // 值是否为数组
          mr.transformRule.map((j:any) => {
            formData[j.targetCode] = dayjs(formData[mr.sourceCode] && formData[mr.sourceCode][j.getValIndex]).format('YYYY-MM-DD')
          })
        } else if (mr.transformKey == 'valueIsSplit' && mr.transformRule && formData[mr.sourceCode]) { // 值是否需要分割成数组
          let testDate = dayjs(formData[mr.sourceCode]).format('YYYY-MM-DD')
          if (testDate) {
            mr.transformRule.map((j:any) => {
              let splitVal = (testDate).split(mr.splitSymbol)
              formData[j.targetCode] = splitVal ? splitVal[j.getValIndex] : null
            })
          }
        } else if (mr.transformKey == 'valueIsArrToStr') { // 值是否需要从数组转为字符串
          mapRuleObj[mr.targetCode] = formData[mr.sourceCode] ? formData[mr.sourceCode].join(',') : null
        } else if (mr.transformKey == 'valueIsStrToArr') { // 值是否需要从字符串转为数组
          mapRuleObj[mr.targetCode] = formData[mr.sourceCode] ? [formData[mr.sourceCode]] : []
        } else if (mr.transformKey == 'valueIsYearToNum') { // 值是否需要从年份转为数字
          mapRuleObj[mr.targetCode] = formData[mr.sourceCode] ? +dayjs(formData[mr.sourceCode]).format('YYYY') : null
        } else if (mr.transformKey == 'valueIsMonthRemoveSymbol') { // 值是否需把月份转换为移除符号的字符串
          mapRuleObj[mr.targetCode] = formData[mr.sourceCode] ? +dayjs(formData[mr.sourceCode]).format('YYYYMM') : null
        } else if (mr.transformKey == 'valueIsMonthToStr') { // 值(月份)是否需要从时间格式为字符串
          mapRuleObj[mr.targetCode] = formData[mr.sourceCode] ? dayjs(formData[mr.sourceCode]).format('YYYY-MM') : null
        } else if (mr.transformKey == 'valueIsDateToStr') { // 值(日期)是否需要从时间格式为字符串
          mapRuleObj[mr.targetCode] = formData[mr.sourceCode] ? dayjs(formData[mr.sourceCode]).format('YYYY-MM-DD') : null
        } else if (mr.transformKey == 'valueIsYmdhmsToStr') { // 值(年月日时分秒)是否需要从时间格式为字符串
          mapRuleObj[mr.targetCode] = formData[mr.sourceCode] ? dayjs(formData[mr.sourceCode]).format('YYYY-MM-DD HH:mm:ss') : null
        } else if (mr.transformKey == 'valueIsMonthToFirstDay') { // 值(月份)是否需要从时间格式转为当月第一天
          mapRuleObj[mr.targetCode] = formData[mr.sourceCode] ? dayjs(formData[mr.sourceCode]).format('YYYY-MM') + '-01' : null
        } else {
          mapRuleObj[mr.targetCode] = formData[mr.sourceCode] || null
        }
      } else if (mr.valueSource == 'row' && props.parentRow) {
        mapRuleObj[mr.targetCode] = props.parentRow[mr.sourceCode]
      }
    })
  }

  let testMergeParams = {...paramObj, ...formData, ...mapRuleObj}

  // 此表单含有忽略项
  if (formConfig?.hasIgnoreData) {
    console.log('此提交表单含有忽略项')
    formConfig?.ignoreArr.map((ignoreItem:any) => {
      delete testMergeParams[ignoreItem]
    })
  }

  console.log('%c submit 参数testMergeParams:', 'color:red', testMergeParams)
  mergeParams = testMergeParams
  return testMergeParams
}

// 查询
const searchFn = (values?: any) => {
  console.log('📕 mixin-form searchFn')
  dataSettle()
  emits('submitOk', mergeParams)
};

// 重置
const resetFn = () => {
  console.log('📕 mixin-form resetFn')
  isClickReset.value = true
  formRef.value.resetFields()
  getFormInitVals()
}

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};

// 弹窗用-从行数据取值
const getFormValOnRow = (row: any) => {
  setFormItem?.map((item:any) => {
    if (item.type === 'treeSelect') {
      let labelArr:any = []
      let valueArr:any = []
      row[item.bind].map((_i:any) => {
        labelArr.push(_i.label)
        valueArr.push(_i.value)
      })
      formData[item.bind] = row[item.bind]
      formData[item.treeSendCode] = item.treeSendType == 'string' ? valueArr.join(',') : valueArr
      if (item.isSendTitles) {   
        formData[item.bindTitlesKey] = item.treeSendType == 'string' ? labelArr.join(',') : labelArr
      }
    } else {
      formData[item.bind] = row[item.bind]
    }
  })
}

// 监听tabList新增并重置页面数据
// const testStore = reactive(useStore());
// watch(() => ([...testStore.state.tabs.tabList]), (newValue, oldValue) => {
//   if (newValue.length > oldValue.length) {
//     console.log('🌺🌺🌺 新增了标签页，重置页面数据');
//     resetFn();
//   }
// });

// 组件挂载前
onBeforeMount(() => {
});

// 组件挂载完成
onMounted(() => {
  getFormInitVals()
  
  if (formConfig?.isSearchForm) {
    loadAllSelectOps()
  }
});

// 组件卸载之前
onBeforeUnmount(() => {
});

// 组件卸载完成
onUnmounted(() => {
});

defineExpose({
  // getFormInitVals,
  loadAllSelectOps,
  resetFn,
  dataSettle,
  getFormValOnRow,
  formRef,
  formData,
  setOptionListDown
});
</script>

<style lang="less" scoped>
.interval-label{
  float: left;
  line-height: 32px;
  text-align: right;
  display: inline-block;
}
.interval-input-wrap{
  float: left;
  .interval-input{
    float: left;
    margin-bottom: 0;
  }
  .interval-input-split{
    width: 20px;
    height: 32px;
    float: left;
    line-height: 32px;
    text-align: center;
    color: #999;
  }
}
</style>