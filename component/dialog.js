// component/dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bookTitle: {
      type: String,
      value: ""
    },
    borrowTime: {
      type: String,
      value: ""
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    showModal: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showDialog() {
      this.setData({
        showModal: true
      })
    },
    removeDialog() {
      this.setData({
        showModal: false
      })
    },
    chooseTime(){
      wx.showActionSheet({
        itemList: ['7天', '14天', '30天'],
        success(res) {
          console.log(res.tapIndex)
        },
        fail(res) {
          console.log(res.errMsg)
        }
      })
    }
  }
})