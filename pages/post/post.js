const app = getApp()
var wxCharts = require('../../utils/wxcharts.js')
var tmpChart = null;
var humChart = null;
Page({  
  data: {
    update: '',
    basic:{},
    today:{},
    tomorrow:{},
    afterTomor:{},
    fourday:{},
    fiveday:{},
    sixday:{},
    sevenday:{},
    air:{},

  },
  onLoad: function () {
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
  getWeatherInfo: function (latitude, longitude){    //获取天气
    var _this = this;
    var key = '015d4eb6e2244182a92a5ee12d03f911';//你自己的key
    //需要在微信公众号的设置-开发设置中配置服务器域名
    //console.log(latitude,longitude);
    var url = 'https://free-api.heweather.net/s6/weather/forecast?key='+key+'&location=' + longitude + ',' + latitude;    
    //console.log(url);
    wx.request({
      url: url, 
      data: {},
      method: 'GET',
      success: function (res) {
        //console.log(res);
        var daily_forecast_today = res.data.HeWeather6[0].daily_forecast[0];//今天预报
        var daily_forecast_tomorrow = res.data.HeWeather6[0].daily_forecast[1];//明天天预报
        var daily_forecast_afterTomor = res.data.HeWeather6[0].daily_forecast[2];//后天预报
        var daily_forecast_3 = res.data.HeWeather6[0].daily_forecast[3];//4日预报
        var daily_forecast_4 = res.data.HeWeather6[0].daily_forecast[4];//5日预报
        var daily_forecast_5 = res.data.HeWeather6[0].daily_forecast[5];//6日预报
        var daily_forecast_6 = res.data.HeWeather6[0].daily_forecast[6];//7日预报
        var basic = res.data.HeWeather6[0].basic;
        var update = res.data.HeWeather6[0].update.loc;//更新时间
        

        _this.setData({
          update:update,
          basic:basic,
          today: daily_forecast_today,
          tomorrow:daily_forecast_tomorrow,
          afterTomor: daily_forecast_afterTomor,
          fourday:daily_forecast_3,
          fiveday:daily_forecast_4,
          sixday:daily_forecast_5,
          sevenday:daily_forecast_6,
          // todyIcon: '../../imgs/weather/' + daily_forecast_today.cond_code_d+'.png', //在和风天气中下载天气的icon图标，根据cond_code_d显示相应的图标
          // tomorrowIcon: '../../imgs/weather/' + daily_forecast_tomorrow.cond_code_d+'.png',
          // afterTomorIcon: '../../imgs/weather/' + daily_forecast_afterTomor.cond_code_d+'.png'
        });
        // console.log("today");
         console.log(daily_forecast_today);
        _this.getAirInfo(basic, latitude, longitude);
        _this.createChart();       
      }
    })
  },
  getAirInfo: function(basic, latitude,longitude){   //获取空气质量报告
    var _this = this;
    var key = '015d4eb6e2244182a92a5ee12d03f911';//你自己的key    
    var location = basic.parent_city;    
    var url = 'https://free-api.heweather.net/s6/air/now?key='+key+'&location=' + location;
    
    wx.request({
      url: url,
      success:function(res){
        var air_now_city = res.data.HeWeather6[0].air_now_city;
        // console.log(air_now_city);
        // console.log(res);
        _this.setData({
          air:air_now_city, 
        })
      }
    })
  },

  createChart: function(e) {
    var _this = this;
    var windowWidth = 285;
        try {
          var res = wx.getSystemInfoSync();
          windowWidth = res.windowWidth-50;
          //console.log('width',windowWidth);
        } catch (e) {
          console.error('getSystemInfoSync failed!');
        }
    
        var tmp_maxData = _this.createmaxtmpData();
        var tmp_minData = _this.createmintmpData();
        var humData = _this.createhumData();
        tmpChart = new wxCharts({                  //第一个折线图，显示温度
            canvasId: 'lineCanvas',
            type: 'line',
            categories: tmp_maxData.categories,
            animation: true,           
            series: [{
                 name: '最高温度',
                data: tmp_maxData.data,
                format: function (val, name) {
                    return val + '℃';
                }
            }, {
                name: '最低温度',
                data: tmp_minData.data,
                format: function (val, name) {
                    return val + '℃';
                }
           }],
            xAxis: {
                disableGrid: true
            },
            yAxis: {
                title: '温度 (℃)',
                format: function (val) {
                    return val;
                },
                min: 0
            },
            width: windowWidth,
            height: 175,
            dataLabel: true,
            dataPointShape: true,
            extra: {
                lineStyle: 'curve'
            }
        });
        humChart = new wxCharts({                   //第二个折线图，显示湿度
          canvasId: 'humCanvas',
          type: 'line',
          categories: humData.categories,
          animation: true,          
          series: [{
               name: '湿度',
              data: humData.data,
              format: function (val, name) {
                  return val + '%RH';
              }
          }],
          xAxis: {
              disableGrid: true
          },
          yAxis: {
              title: '湿度 (%RH)',
              format: function (val) {
                  return val;
              },
              min: 0
          },
          width: windowWidth,
          height: 175,
          dataLabel: true,
          dataPointShape: true,
          extra: {
              lineStyle: 'curve'
          }
      });
  },
  
  createhumData: function () {    
    var categories = [];
    var data = [];    
    
    categories.push(this.data.today.date);
    categories.push(this.data.tomorrow.date);
    categories.push(this.data.afterTomor.date);
    categories.push(this.data.fourday.date);
    categories.push(this.data.fiveday.date);
    categories.push(this.data.sixday.date);
    categories.push(this.data.sevenday.date);
    //console.log(categories)
    data.push(this.data.today.hum);
    data.push(this.data.tomorrow.hum);
    data.push(this.data.afterTomor.hum);
    data.push(this.data.fourday.hum);
    data.push(this.data.fiveday.hum);
    data.push(this.data.sixday.hum);
    data.push(this.data.sevenday.hum);

    return {
      categories: categories,
      data: data
    }
  },

  createmaxtmpData: function (today) {    
    var categories = [];
    var data = [];    
    
    categories.push(this.data.today.date);
    categories.push(this.data.tomorrow.date);
    categories.push(this.data.afterTomor.date);
    categories.push(this.data.fourday.date);
    categories.push(this.data.fiveday.date);
    categories.push(this.data.sixday.date);
    categories.push(this.data.sevenday.date);
    //console.log(categories)
    data.push(this.data.today.tmp_max);
    data.push(this.data.tomorrow.tmp_max);
    data.push(this.data.afterTomor.tmp_max);
    data.push(this.data.fourday.tmp_max);
    data.push(this.data.fiveday.tmp_max);
    data.push(this.data.sixday.tmp_max);
    data.push(this.data.sevenday.tmp_max);

    return {
      categories: categories,
      data: data
    }
},
createmintmpData: function (today) {    
  var categories = [];
  var data = [];

  data.push(this.data.today.tmp_min);
  data.push(this.data.tomorrow.tmp_min);
  data.push(this.data.afterTomor.tmp_min);
  data.push(this.data.fourday.tmp_min);
  data.push(this.data.fiveday.tmp_min);
  data.push(this.data.sixday.tmp_min);
  data.push(this.data.sevenday.tmp_min);

  return {
    data: data
  }
},
  // touchHandler: function (e) {
  //   console.log(tmpChart.getCurrentDataIndex(e));
  //   tmpChart.showToolTip(e, {
  //     // background: '#7cb5ec',
  //     format: function (item, category) {
  //         return category + ' ' + item.name + ':' + item.data 
  //     }
  //   });
  // },
})