// pages/order_detail/order_detail.js
var app = getApp();
var util = require('../../utils/util.js');
var wxbarcode = require('../../utils/index.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '1234567890123456789',
    hidden:false,
    orderitems:[]
  },

  GetOrderItemsByOrderID: function (orderid) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/WxSP/GetOrderItemsByOrderID',
      data: {
        orderid: orderid,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('GetOrderItemsByOrderID返回数据');
        console.log(res);
        that.setData({
          orderitems: res.data.Data.OrderItems,
          send_no: res.data.Data.send_no,
          hidden:true
        })
      },
      fail: function (res) {
        console.log('提交GetOrderItemsByOrderID接口返回失败');
      }
    })
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wxbarcode.barcode('barcode', '1234567890123456789', 680, 200);
    wxbarcode.qrcode('qrcode', '1234567890123456789', 420, 420);
    var that = this
    that.GetOrderItemsByOrderID(options.order_id)
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