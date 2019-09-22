var Fly = require("./wx.js") //wx.js is your downloaded code
var fly = new Fly(); //Create an instance of Fly

// 添加请求拦截器
fly.interceptors.request.use((config, promise) => {
  wx.showLoading({
    title: '加载s中',
    mask: true,
    duration: 1000
  })
  // Add custom headers
  var token = wx.getStorageSync('tshz_token');
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  (response, promise) => {
    return response.data;
  },
  (err, promise) => {
    const status = err.response ? err.response.status : false;
    if (status) {
      if (status == 401) {
        wx.showToast({
          title: '请登陆后再重试',
          icon: 'none',
          duration: 1000
        })
      } else if (status == 500) {
        wx.showToast({
          title: '服务器出错',
          icon: 'none',
          duration: 1500
        })
      } else if (status) {
        wx.showToast({
          title: err.response.data.message,
          icon: 'none',
          duration: 1500
        })
      }
    } else {
      wx.showToast({
        title: '服务器未响应',
        icon: 'none',
        duration: 1000
      })
    }

    return Promise.reject(err);
  }

)
// Set the base url
fly.config.baseURL = "http://localhost:8000"

export default fly;