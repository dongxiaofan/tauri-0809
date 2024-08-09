

// 公用方法合集
export class MixinCommon {
  // 设置表头
  static getTableColumns (arr, tableColumns) {
    let data = []
    arr.forEach(col => data.push(tableColumns[col]))
    return data
  }
  
  // 解析&分配数据到相应的optionsName下
  static parsingOptionList(actionItem, arr, optionListDown) {
    let optionListName = ''
    if (arr && arr.length) {
      if (arr[0].group && isNaN(arr[0].group)) {
        arr.map(groupItem => {
          let groupName = groupItem.group
          optionListName = groupName.indexOf('.') < 0 ? groupName : groupName.replace(/\./g, '_')
          console.log('%c optionListName: ', 'color:red', optionListName)
          optionListDown[optionListName] = groupItem.items.map(option => {
            if (typeof option == 'string' || typeof option == 'number') {
              return { value: option, label:option }
            } else {
              return {
                ...option,
                value: option[actionItem.optionTransform.value],
                label: option[actionItem.optionTransform.label],
                unique_value: actionItem.optionTransform.unique_value ? option[actionItem.optionTransform.unique_value] : null,
              }
            }
          })
        })
      } else if (arr && arr.length) {
        optionListName = actionItem.optionListName
        optionListDown[optionListName] = arr.map(option => {
          if (typeof option == 'string' || typeof option == 'number' || option == null) {
            return { value: option, label:option }
          } else {
            return {
              ...option,
              value: option[actionItem.optionTransform.value],
              label: option[actionItem.optionTransform.label],
              unique_value: actionItem.optionTransform.unique_value ? option[actionItem.optionTransform.unique_value] : null,
            }
          }
        })
      }

      // 下拉列表是否含有需要过滤的部分
      if (actionItem.hasOptionListFilterRule && actionItem.optionListFilterKey.length) {
        actionItem.optionListFilterKey.map(_fk => {
          optionListDown[optionListName].splice(optionListDown[optionListName].findIndex(e => e.value === _fk), 1)
        })
      }
      return optionListDown
    }
  }

  // 公用搜索
  static commonSearchFn (MixinTable, formData) {
    console.log('%c MixinCommon 点击了公用搜索: ', 'color:orange', formData)
    if (formData) {
      MixinTable.formData = formData
    }
    MixinTable.tableComone.pageIndex = formData && formData.isKeepPageIndex ? MixinTable.tableComone.pageIndex : 1;
    MixinTable.queryTable()
  }

  // 公用批量导入弹窗
  static commonBatchImportModal (Modal, btnConfig, sourceData) {
    console.log('%c MixinCommon 批量导入 btnConfig: ', 'color:orange', btnConfig, ', sourceData: ', sourceData)
    let actionUrlParams = ''
    if (btnConfig.actionUrlParams) {
      actionUrlParams = '?'
      btnConfig.actionUrlParams.map(up => {
        if (up.valueSource == 'row' && sourceData) {
          up.dataTransform.map(_dt => {
            actionUrlParams += _dt.targetCode + '=' + sourceData[_dt.sourceCode] + '&'
          })
        } else if (up.valueSource == 'default') {
          up.dataTransform.map(_dt => {
            actionUrlParams += _dt.targetCode + '=' + _dt.sendVal + '&'
          })
        }
      })
    }

    let actionBodyParams = {}
    if (btnConfig.actionBodyParams) {
      btnConfig.actionBodyParams.map(up => {
        if (up.valueSource == 'row' && sourceData) {
          up.dataTransform.map(_dt => {
            let key = _dt.targetCode
            actionBodyParams = {...actionBodyParams, ...{[key]: sourceData[_dt.sourceCode]}}
          })
        } else if (up.valueSource == 'default') {
          up.dataTransform.map(_dt => {
            let key = _dt.targetCode
            actionBodyParams = {...actionBodyParams, ...{[key]: _dt.sendVal}}
          })
        }
      })
    }

    const importConfig = {
      actionUrl: btnConfig.actionConfig.url + actionUrlParams,
      templateDownLoadUrl: btnConfig.actionConfig.templateDownLoadUrl,
      actionBodyParams: actionBodyParams,
      maxCount: btnConfig.actionConfig.maxCount || 1
    }
    Modal.handelShow(btnConfig.modalTitle || '批量导入', importConfig)
  }

  // 公用父页面操作方法（作废）
  // static commonOnPageFn (btnConfig, sourceData, self) {
  //   console.log('%c MixinCommon 在父页面操作的方法 btnConfig: ', 'color:orange', btnConfig, ', sourceData: ', sourceData)
  //   self[btnConfig.fn](sourceData)
  // }
}
