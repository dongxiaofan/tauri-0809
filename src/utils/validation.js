// 验证身份证号码
export const validateIdCardNo = (rule, value, callback) => {
  var vnum = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  var vyear = /^(19|20)\d{2}$/
  var vmonth = /^(0[1-9]|1[0-2])$/
  var vdate = /^(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/
  var vsame = /(\w)*(\w)\2{2}(\w)*/g
  if (!vnum.test(value)) {
    callback(new Error('请输入15或18位身份证号码'))
  } else {
    if (value.length === 15) {
      var str = value.substring(6, 12)
      var year = str.substr(0, 2)
      var month = str.substr(2, 2)
      var date = str.substr(4, 2)
      // else if (vsame.test(value)) {
      //   callback(new Error('不允许输入连续3位相同的数字'))
      // }
      if (!vmonth.test(month)) {
        callback(new Error('请输入正确的月份'))
      } else if (!vdate.test(date)) {
        callback(new Error('请输入正确的出生日期'))
      } else {
        callback()
      }
    } else if (value.length === 18) {
      var str = value.substring(6, 14)
      var year = str.substr(0, 4)
      var month = str.substr(4, 2)
      var date = str.substr(6, 2)
      // else if (vsame.test(value)) {
      //   callback(new Error('不允许输入连续3位相同的数字'))
      // }
      if (!vmonth.test(month)) {
        callback(new Error('请输入正确的月份'))
      } else if (!vdate.test(date)) {
        callback(new Error('请输入正确的出生日期'))
      } else {
        callback()
      }
    }
    // callback()
  }
}

// 验证支付宝账号
export const validatePhoneEmailCreate = (rule, value, callback) => {
  var validate = /^(?:1[3-9]\d{9}|[a-zA-Z\d._-]*\@[a-zA-Z\d.-]{1,10}\.[a-zA-Z\d]{1,20})$/
  if (!validate.test(value)) {
    callback(new Error('支付宝账号只能输入手机或者邮箱'))
  } else {
    callback()
  }
}

// 验证发票号码
export const validateInvoiceNum = (rule, value, callback) => {
  var weishu = /(^.{8}$)/
  var teshuzifu = /^[0-9]+$/
  if (!value) {
    callback(new Error('输入不能为空'))
  } else if (parseInt(value) == 0) {
    callback(new Error('不能全部为0'))
  } else if (!teshuzifu.test(value)) {
    callback(new Error('只能输入数字'))
  } else if (!weishu.test(value)) {
    callback(new Error('请输入8位数字'))
  } else {
    callback()
  }
}

// 验证带有1位小数点的数字(不能为负)
export const validatePatrnNo1Point = (rule, value, callback) => {
  var vnum = /^\d+(\.\d{1})?$/
  var zhengfudian = /^\d+(\.\d+)?$/
  if (!value) {
    callback(new Error('输入不能为空'))
  } else if (!zhengfudian.test(value)) {
    callback(new Error('不能输入负数、中文、字母及特殊字符'))
  } else if (!vnum.test(value)) {
    callback(new Error('小数点后的数字不能超过1位'))
  } else {
    callback();
  }
}

// 验证带有2位小数点的数字(不能为负, 0)
export const validatePatrnNo2PointCant0 = (rule, value, callback) => {
  var vnum = /^\d+(\.\d{1,2})?$/
  var zhengfudian = /^\d+(\.\d+)?$/
  if (value === '') {
    callback(new Error('输入不能为空'))
  } else if (value == 0) {
    callback(new Error('输入不能为0'))}
  else if (!zhengfudian.test(value)) {
    callback(new Error('不能输入负数、中文、字母及特殊字符'))
  } else if (!vnum.test(value)) {
    callback(new Error('小数点后的数字不能超过2位'))
  } else {
    callback();
  }
}

// 验证带有2位小数点的数字(不能为负)
export const validatePatrnNo2Point = (rule, value, callback) => {
  var vnum = /^\d+(\.\d{1,2})?$/
  var zhengfudian = /^\d+(\.\d+)?$/
  if (value === '') {
    callback(new Error('输入不能为空'))
  } else if (!zhengfudian.test(value)) {
    callback(new Error('不能输入负数、中文、字母及特殊字符'))
  } else if (!vnum.test(value)) {
    callback(new Error('小数点后的数字不能超过2位'))
  } else {
    callback();
  }
}

// 验证带有2位小数点且小于等于1的数字
export const validate2PointLessThan1 = (rule, value, callback) => {
  var vnum = /^(0.[0-9]\d{0,1}|-\d+.?\d*|0|1)$/
  if (value === '') {
    callback(new Error('输入不能为空'))
  } else if (!vnum.test(value)) {
    callback(new Error('充值金额不得大于1且小数不能大于两位'))
  } else {
    callback();
  }
}

// 验证纳税编号
export const validateTaxNum = (rule, value, callback) => {
  var weishu = /(^.{15}$)|(^.{17}$)|(^.{18}$)|(^.{20}$)/
  var teshuzifu = /^[A-Za-z0-9]+$/
  if (!value) {
    callback(new Error('输入不能为空'))
  } else if (!weishu.test(value)) {
    callback(new Error('请输入15/17/18/20位字母或数字'))
  } else if (!teshuzifu.test(value)) {
    callback(new Error('不能输入中文和特殊字符'))
  } else {
    callback();
  }
}

// 汉字验证
export const validateChinese = (rule, value, callback) => {
  var hanzi = /^[\u4e00-\u9fa5]{0,}$/
  if (!value) {
    callback(new Error('输入不能为空'))
  } else if (!hanzi.test(value)) {
    callback(new Error('请输入中文'))
  } else {
    callback();
  }
}