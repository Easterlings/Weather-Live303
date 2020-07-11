//index.js
//获取应用实例
const app = getApp()




Page({
  data: {
    Id: '实时天气',
    motto: '点击进入',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    
    //this.test();
       //云函数测试
    //this.write();
      //数据库写入测试
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  
  onTapJump: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    wx.redirectTo({
      url: "../post/post",
      success:function(){
        console.log("jump success")
      },
      fail:function(){
       console.log("jump failed")
      },
      complete:function(){
       console.log("jump complete")
      },
    })
   
  },
//   test:function(){
//     wx.cloud.callFunction({
//       name:'add',
//       data:{
//         a:1,
//         b:2,
//       },
//       success:function(res){
//         console.log(res.result.sum)
//       },
//       fail:function(err){
//         console.log(err)
//       }
//     })
//   },


// write:function(){
//   const db = wx.cloud.database()
//   const todosCollection = db.collection('1')
//   todosCollection.add({
//       // data 字段表示需新增的 JSON 数据
//       data: {
//         // _id: 'todo-identifiant-aleatoire', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
//         AQI: "181",
//         WEA: "小雨",      
//         TMP: "31",        
//         LOCAL: "西安",// 为待办事项添加一个地理位置      
//       },
//       success: function(res) {
//         // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
//         console.log(res)
//         console.log("wtfffffffffff")
//       },
//       fail: console.error
//     })
// }
})


