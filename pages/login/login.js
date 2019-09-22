var app = getApp();
import fly from "../../utils/fly.js";

Page({
  data: {
    load: false
  },
  onLoad: function(options) {

  },
  formSubmit: function(e) {

    var that = this;

    //todo 表单验证
    var user = e.detail.value.user;
    var pwd = e.detail.value.password;

    if (!user || !pwd) {
      wx.showModal({
        title: '提示',
        content: '学号及密码不能为空哦！',
        showCancel: false,
        confirmColor: '#338FFC',
      })
      return false;
    }

    //更改绑定按钮loading状态
    that.setData({
      load: true
    })

    fly.post('users/login', {
        account: user,
        password: pwd
      })
      .then(res => {
        console.log('login', res)
        var token = res.data;
        var studentUser = {
          token: token,
          user: user,
          pwd: pwd
        }

        //成功后储存cookie
        if (res.return_code == "01") {
          wx.setStorage({
            key: "tshz_isbind",
            data: true
          })
          wx.setStorage({
            key: "tshz_token",
            data: token
          })

          fly.get('users', {
            account: user
          }).then(res => {
            // success
            console.log('users', res)
            studentUser.infoes = res.data;
            wx.setStorage({
              key: 'tshz_studentInfoes',
              data: res.data,
              success: function() {
                wx.navigateBack({
                  delta: 1
                })
              }
            })
          })
        } else {
          wx.showToast({
            title: '用户名或密码输入有误',
            icon: 'success',
            duration: 2000
          })
        }

        that.setData({
          load: false
        })
      })
  },
  onShareAppMessage: function() {
    return {
      title: '图书盒子',
      path: '/pages/index/index'
    }
  }
});