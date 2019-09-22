// pages/index/index.js
import http from "../../utils/fly.js"
var app = getApp();
Page({
  data: {
    cancel: false,
    inputValue: '',
    focus: false
  },

  formSubmit: function(e) {
    var keyword = null;
    if (e.detail.value.book) {
      keyword = e.detail.value.book;
      this.search(keyword);
    } else {
      this.searchAll();
    }
  },

  enterSubmit: function(e) {
    var keyword = null;
    if (e.detail.value) {
      keyword = e.detail.value;
      that.search(keyword);
    } else {
      wx.showToast({
        title: '您没有输入哦',
        icon: 'success',
        duration: 500
      })
      setTimeout(function() {
        wx.hideToast()
      }, 1000)
      return false;
    }
  },
  search: function(keyword) {
    wx.showToast({
      title: '搜索中',
      icon: 'loading',
      duration: 1000
    })
    http.post(`/books/keyword`, {
      keyword: keyword,
      page: 1,
      size: 10
    }).then(res => {
      app.globalData.searchResult = res;
      wx.navigateTo({
        url: '../result/result?keyword=' + keyword
      })
    }).catch(err => {
      wx.showToast({
        title: '连接失败',
        icon: 'success',
        duration: 1000
      })
    })
  },
  searchAll: function() {
    wx.showToast({
      title: '搜索中',
      icon: 'loading',
      duration: 1000
    })
    http.get(`/books/`, {
      page: 1,
      size: 10
    }).then(res => {
      app.globalData.searchResult = res;
      wx.navigateTo({
        url: '../result/result'
      })
    })
  },
  //input清除按钮显示
  typeIng: function(e) {
    var that = this;
    if (e.detail.value) {
      that.setData({
        cancel: true
      })
    } else {
      that.setData({
        cancel: false
      })
    }
  },
  //清除输入框
  clearInput: function() {
    console.log(1)
    this.setData({
      inputValue: null,
      cancel: false,
      focus: true
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '图书盒子',
      path: '/pages/index/index'
    }
  }
})