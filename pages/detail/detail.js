// client/pages/detail/detail.js
import fly from "../../utils/fly.js";
import moment from "../../utils/moment.min.js";
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    publisher: '',
    collect: '',
    available: '',
    name: '',
    author: '',
    intro: '',
    ISBN: '',
    image: '',
    current: 0,
    callNumber: null,
    isBorrow: 0,
    showModal: false,
    timeList: ['7天', '14天', '30天']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(param) {
    this.setData({
      bookid: param.id
    })
    const bookId = param.id;
    var that = this;
    fly.get(`/books/id/${bookId}`).then(res => {
      const book = res.data;
      if (res.return_code == "01") {
        that.setData({
          id: book.id,
          name: book.title,
          publisher: book.publisher,
          collect: book.collect,
          available: book.available,
          author: book.author,
          intro: book.intro,
          ISBN: book.isbn,
          image: book.image,
          callNumber: book.callNumber
        })
      }
    })
    var token = wx.getStorageSync('tshz_token')
    this.setData({
      token: token
    })
    if (token) {
      that.getCollect(bookId);
      that.getBorrow(bookId);
    }
  },
  //tab点击切换
  changeSwiperPage: function(e) {
    this.setData({
      current: e.target.dataset.current
    })
  },
  //获取是否收藏
  getCollect: function(bookid) {
    fly.get(`/collect/${bookid}`).then(res => {
      if (res.data) {
        this.setData({
          isCollect: res.data.iscollect
        })
      }
    })
  },
  //取消收藏
  cancelCollect: function() {
    var bookid = this.data.bookid;
    this.handleCollect(bookid, 0);
  },
  //添加收藏
  collectBook: function() {
    var bookid = this.data.bookid;
    console.log(bookid)
    if ('isCollect' in this.data) {
      this.handleCollect(bookid, 1);
    } else {
      fly.post('/collect', {
        booksId: bookid * 1,
        iscollect: 1
      }).then(res => {
        this.setData({
          isCollect: 1
        });
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 1000
        })
      })
    }
  },
  handleCollect(bookid, iscollect) {
    fly.put(`/collect/${bookid}`, {
      iscollect: iscollect
    }).then(res => {
      console.log(res)
      if (res.return_code == '01') {
        this.setData({
          isCollect: iscollect
        })
        wx.showToast({
          title: '操作成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
  //获取借阅状态
  getBorrow(bookid) {
    fly.get(`/borrow/booksid/${bookid}`).then(res => {
      console.log(res)
      if (res.data) {
        this.setData({
          isBorrow: res.data.isBorrow
        })
      }
    })
  },
  backBook() {
    var bookid = this.data.bookid;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认还书？',
      success(res) {
        if (res.confirm) {
          fly.delete(`/borrow/${bookid}`, {
            isBorrow: 0
          }).then(res => {
            if (res.return_code == '01') {
              that.setData({
                isBorrow: 0
              })
              wx.showToast({
                title: '还书成功',
                icon: 'success',
                duration: 1000
              })
            }
          })
        } else if (res.cancel) {
          that.setData({
            showModal: false
          })
        }
      }
    })
  },
  borrowBook() {
    var borrowDay = this.data.borrowTime.replace('天', '');
    var expireTime = this.getDate(borrowDay);
    fly.post('/borrow', {
      booksId: this.data.bookid,
      isBorrow: 1,
      expireTime: expireTime,
      borrowTime: moment().format("YYYY-MM-DD")
    }).then(res => {
      if (res.return_code == '01') {
        this.setData({
          isBorrow: 1,
          showModal: false
        })
        wx.showToast({
          title: '借书成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
  showDialog() {
    console.log('showDialog')
    this.setData({
      borrowTime: '7天',
      showModal: true
    })
  },
  removeDialog() {
    this.setData({
      showModal: false
    })
  },
  chooseTime() {
    var that = this;
    var timeList = that.data.timeList
    wx.showActionSheet({
      itemList: timeList,
      success(res) {
        that.setData({
          borrowTime: timeList[res.tapIndex],
        })
      }
    })
  },
  getDate(t) {
    var d = new Date();
    d = +d + (1000 * 60 * 60 * 24) * t;
    d = new Date(d);
    return moment(d).format("YYYY-MM-DD") //格式为"2019-02-16 00:00:00"
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