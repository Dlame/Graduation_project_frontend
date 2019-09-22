var app = getApp();
import fly from "../../utils/fly.js";
Page({
  data: {
    collectList: []
  },
  onLoad: function() {

  },
  //登录并获取收藏书目
  loginAndFetchCollection: function() {
    fly.get('/collect').then(res => {
      this.setData({
        collectList: res.data.collectList
      })
    })
  },
  onPullDownRefresh: function() {
    this.loginAndFetchCollection().then(wx.stopPullDownRefresh);
  },

  //获得的书目储存到数据层
  setCollection: function(res) {
    var collectList = []
    for (var i = 0; i < res.length; i++) {
      collectList.push(res[i].attributes)
    }
    this.setData({
      collectList: collectList
    })
  },

  onShow: function() {
    this.loginAndFetchCollection()
  },
  onShareAppMessage: function() {
    return {
      title: '图书盒子',
      path: '/pages/index/index'
    }
  }

})