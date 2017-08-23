// pages/card_detail/card_detail.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    descrition: '',
    opentime: '',
    preprogative: '',
    storetel: ''
  },


  GetCardDetails: function (storeid) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/WxSP/GetCardDetails',
      data: {
        storeid: storeid,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if(res.data.Data.IsError==false){
          that.setData({
            descrition: res.data.Data.descrition,
            opentime: res.data.Data.opentime,
            prerogative: res.data.Data.prerogative,
            storetel: res.data.Data.storetel,
          })
        }else{
          wx.showToast({
            title: '获取会员卡详情失败，请退出重试',
          })
        }
        
      },
      fail: function (res) {
        console.log('提交GetCardDetails接口返回失败');
        wx.showToast({
          title: '网络连接失败，请退出重试',
        })
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.GetCardDetails(app.globalData.storeid)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})