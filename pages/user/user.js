// pages/user/user.js
var app = getApp();
import fly from "../../utils/fly.js";
import moment from "../../utils/moment.min.js"
Page({
  data: {
    avatarUrl: "",
    isbind: false,
    booksTotal: "0",
    warnTotal: "0",
    current: 0
  },
  //除次加载
  onLoad: function() {
    var that = this;
    var user = null;
    if (user) {
      // 已经登录
    } else {
      //currentUser 为空时，微信一键登录…

    }
  },

  //每一次界面显示
  onShow: function() {
    var that = this;
    that.setData({
      avatarUrl: wx.getStorageSync('tshz_avatarUrl'),
      studentInfoes: wx.getStorageSync('tshz_studentInfoes')
    })
    wx.getStorage({
      key: "tshz_isbind",
      success: function(res) {
        that.setData({
          isbind: res.data
        })
        if (res.data) {
          that.getBorrowData();
          that.getExpiredData();
        }
      }
    })
  },

  //获取借书信息
  getBorrowData: function() {
    var that = this;
    fly.get('/borrow/current', {
      isBorrow: 1,
      currentTime: moment().format('YYYY-MM-DD')
    }).then(res => {
      var count = res.data.count;
      var list = res.data.list;
      for (var i = 0; i < count; i++) {
        var expireDate = list[i].expireTime
        var borrowedDate = list[i].borrowTime
        list[i].tip = that.dateDiff(expireDate, borrowedDate)
      }
      that.setData({
        booksTotal: count,
        booksList: list,
      })
    })
  },

  //获取催还信息
  getExpiredData: function() {
    var that = this;
    fly.get('/borrow/overdue', {
      isBorrow: 1,
      currentTime: moment().format('YYYY-MM-DD')
    }).then(res => {
      var count = res.data.count;
      var list = res.data.list;
      for (var i = 0; i < count; i++) {
        var expireDate = list[i].expireTime
        var borrowedDate = list[i].borrowTime
        list[i].tip = that.dateDiff(expireDate, borrowedDate)
      }
      console.log(list)
      that.setData({
        warnTotal: count,
        warnList: list,
      })
    })
  },

  //tab切换
  tabSwitch: function(e) {
    var that = this;
    that.setData({
      current: e.target.dataset.current
    })
  },

  //解绑
  unBind: function() {
    var that = this;
    wx.removeStorageSync('tshz_cookie');
    wx.removeStorageSync('tshz_studentInfoes');
    wx.setStorage({
      key: 'tshz_isbind',
      data: false,
      success: function(res) {
        // success
        that.setData({
          isbind: false
        })
      }
    })

  },

  //计算天数差
  dateDiff: function(expireDate, borrowDate) {
    var aDate, oDate1, oDate2, iDays, tip
    aDate = expireDate.split("-")
    oDate1 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0])
    aDate = borrowDate.split("-")
    oDate2 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0])
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24)
    var now = new Date()

    var isExpire = parseInt((oDate1 - now) / 1000 / 60 / 60 / 24)

    if (isExpire < 0) {
      return isExpire
    } else {
      return iDays
    }
  },
  onShareAppMessage: function() {
    return {
      title: '图书盒子',
      path: '/pages/index/index'
    }
  }
})