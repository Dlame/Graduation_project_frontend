import http from "../../utils/fly.js"
var app = getApp();
// 注册当页全局变量，存放搜索结果以便更新到data中
var curBooksList = [];
Page({
  data: {
    booksList: [],
    keyword: null,
    pageCurrent: null,
    pagesTotal: null,
    scrollHeight: null, //滚动区域高度
    cancel: true, //是否显示输入框清除按钮
    dropLoadFunc: "dropLoad",
    setData: '',
    // animationData: {}
  },

  // 页面初始化
  onLoad: function(param) {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight - (104 * res.windowWidth / 750),
        })
      }
    })
    if (param.keyword) {
      that.setData({
        keyword: param.keyword,
      })
    }
    var result = app.globalData.searchResult
    curBooksList = result.booksList
    // 有搜索结果
    if (result.data.length > 0) {
      // 更新数据
      that.setData({
        status: "success",
        booksList: result.data,
        // pageCurrent: result.pageCurrent,
        // pagesTotal: result.pagesTotal
      })
    } else {
      // 无搜索结果
      that.setData({
        status: "fail",
      })
    }

  },
  //搜索按钮事件
  formSubmit: function(e) {
    var that = this;
    var keyword = null;
    if (e.detail.value) {
      keyword = e.detail.value.book;
      that.search(keyword);
    } else {
      wx.showToast({
        title: '您没有输入哦',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
  },
  //回车事件
  enterSubmit: function(e) {
    var that = this;
    var keyword = null;
    if (e.detail.value) {
      keyword = e.detail.value;
      that.search(keyword);
    } else {
      wx.showToast({
        title: '您没有输入哦',
        icon: 'success',
        duration: 1000
      })
      setTimeout(function() {
        wx.hideToast()
      }, 1000)
      return false;
    }
  },

  // 搜索
  search: function(keyword) {
    var that = this;
    //清空上次搜索的结果
    curBooksList = [];

    that.setData({
      keyword: keyword,
    })

    wx.showToast({
      title: '搜索中',
      icon: 'loading',
      duration: 10000
    })
    http.post(`/books/keyword/`, {
      keyword: keyword,
      page: 1,
      size: 10
    }).then(res => {
      wx.hideToast()
      if (res.data.length > 0) {
        curBooksList = res.data;
        that.setData({
          status: "success",
          booksList: res.data,
          // pageCurrent: res.data.pageCurrent,
          // pagesTotal: res.data.pagesTotal,
        })
      } else {
        // 无搜索结果
        that.setData({
          status: "fail",
        })
      }
    })
  },

  // 上拉加载
  dropLoad: function() {

    var that = this;
    if (this.data.pageCurrent < this.data.pagesTotal) {
      //锁定上拉加载
      that.setData({
        dropLoadFunc: null
      })
      that.loadMore();

    }
  },

  //加载更多
  loadMore: function() {

    var that = this;
    var page = parseInt(that.data.pageCurrent) + 1;

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
    this.setData({
      keyword: null,
      cancel: false,
      focus: true
    })
  },
  // 分享搜索结果
  onShareAppMessage: function() {
    return {
      title: '图书盒子',
      path: '/pages/index/index'
    }
  }
})