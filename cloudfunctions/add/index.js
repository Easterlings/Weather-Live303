// 云函数入口文件
const cloud = require('wx-server-sdk')
const db = wx.cloud.database()
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const {a,b} = event
  const sum = a + b + 3
 
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
    sum
  }
  
}
