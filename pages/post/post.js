const app = getApp()

Page({
  // data: {
  //   info:[],
  //   mutto:"hello,guy"
  // },
  // changemutto: function(){
  //   var mutto="segment"
  //   this.setData({
  //     mutto:mutto
  //   })
    
  // },
  // onLoad: function () {
  //   var dataUrl = "https://free-api.heweather.net/s6/weather/{weather-type}?{parameters}";
  //   console.log(dataUrl);
  //   console.log("user");
  //   this.data.requestUrl=dataUrl
  //   this.getMusicListData(dataUrl)
    
  //   wx.showNavigationBarLoading()
  // },
  // getMusicListData: function (url) {
  //   var that = this
  //   wx.request({
  //     url: url,
  //     method: 'GET',
  //     header: {
  //       "content-type": "json"
  //     },
  //     success: function (res) {
  //       that.processData(res.data.song_list)
  //     },
  //     fail: function (error) {
  //       console.log(error)
  //     }
  //   })
  // },
  // processData: function (musicData) {
  //   var musics = []
  //   for (var idx in musicData) {
  //     var title = musicData[idx].title
  //     if (title.length >= 6) {
  //       title = title.substring(0, 6) + "..."
  //     }
  //     var author = musicData[idx].author
  //     if (author.length >= 9) {
  //       author = author.substring(0, 9) + "..."
  //     }
  //     var temp = {
  //       author: author,
  //       title: title,
  //       coverageUrl: musicData[idx].pic_premium,
  //       musicId: musicData[idx].song_id
  //     }
  //     musics.push(temp)
  //   }
  //   var totalMusics = []
  //   totalMusics = this.data.musics.concat(musics)
  //   this.setData({
  //     musics:totalMusics
  //   })
  //   wx.stopPullDownRefresh()
  //   wx.hideNavigationBarLoading()
  // },
  // getdata: function () {
  //   var dataUrl = "https://3g.dxy.cn/newh5/view/pneumonia";
  //   console.log(dataUrl);
  //   console.log("foreign");    
  //   wx.showNavigationBarLoading()
  // },
  data: {
    update: '',
    basic:{},
    today:{},
    tomorrow:{},
    afterTomor:{},
    // todyIcon:'../../imgs/weather/999.png',
    // tomorrowIcon:'../../imgs/weather/999.png',
    // afterTomorIcon:'../../imgs/weather/999.png'
  },
  onShow: function () {
    this.getLocation();
    
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  getLocation:function(){
    var that = this;
    wx.getLocation({
      type: 'wgs84',      
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude
        console.log("get location success!")
        that.getWeatherInfo(latitude, longitude);       
        
      }
    })
  },
  getWeatherInfo: function (latitude, longitude){
    var _this = this;
    var key = '015d4eb6e2244182a92a5ee12d03f911';//你自己的key
    //需要在微信公众号的设置-开发设置中配置服务器域名
    console.log(latitude,longitude);
    var url = 'https://free-api.heweather.com/s6/weather?key='+key+'&location=' + longitude + ',' + latitude;
    wx.request({
      url: url, 
      data: {},
      method: 'GET',
      success: function (res) {
        var daily_forecast_today = res.data.HeWeather6[0].daily_forecast[0];//今天预报
        var daily_forecast_tomorrow = res.data.HeWeather6[0].daily_forecast[1];//明天天预报
        var daily_forecast_afterTomor = res.data.HeWeather6[0].daily_forecast[2];//后天预报
        var basic = res.data.HeWeather6[0].basic;
        var update = res.data.HeWeather6[0].update.loc;//更新时间
        _this.setData({
          update:update,
          basic:basic,
          today: daily_forecast_today,
          tomorrow:daily_forecast_tomorrow,
          afterTomor: daily_forecast_afterTomor,
          // todyIcon: '../../imgs/weather/' + daily_forecast_today.cond_code_d+'.png', //在和风天气中下载天气的icon图标，根据cond_code_d显示相应的图标
          // tomorrowIcon: '../../imgs/weather/' + daily_forecast_tomorrow.cond_code_d+'.png',
          // afterTomorIcon: '../../imgs/weather/' + daily_forecast_afterTomor.cond_code_d+'.png'
        });
      }
    })
  }
})