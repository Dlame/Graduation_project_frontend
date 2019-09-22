import fly from "./utils/fly.js";
App({
  onLaunch: function() {
    var that = this;
    var openid = 'zz19960807';
    var studentInfoes = wx.getStorageSync('tshz_studentInfoes');
    //currentUser 为空时，微信一键登录…
    if (studentInfoes) {
      fly.post('users/login', {
        account: studentInfoes.account,
        openid: openid,
      }).then(res => {
        wx.setStorage({
          key: "tshz_token",
          data: res.data
        })
      })
    }
  },
  // onError: function(msg) {
  //   console.log(msg)
  //   console.log('onerror')
  // },
  globalData: {
    user: null,
    searchRsult: null
  }
})