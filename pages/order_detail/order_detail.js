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
    order_id: '',
    hidden: false,
    orderitems: [],
    store_name: '',
    address: '',
    tel: '',
    total_num: '',
    amount_payed: '',
    pay_time: '',
    consignee: '',
    phone: '',
    province: '',
    city: '',
    area: '',
    street: '',
    send_status: '',
    send_no: '',
    send_type: ''
  },

  GetStoreInfo: function (store_id) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/storeadmin/GetStoreInfo',
      data: {
        store_id: store_id,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      success: function (res) {
        console.log('GetStoreInfo返回数据');
        console.log(res);
        that.setData({
          // orderitems: res.data.Data.OrderItems,
          // send_no: res.data.Data.send_no,
          // hidden: true
          store_name: res.data.Data.Store.store_name,
          address: res.data.Data.Store.address,
          tel: res.data.Data.Store.tel,
        })
      },
      fail: function (res) {
        // console.log('提交GetOrderItemsByOrderID接口返回失败');
      }
    })
  },
  rightTap: function () {
    wx.navigateTo({
      url: '../shop_city/shop_city',
    })
  },
  leftTap:function(){
    var that = this
    
    var tel = that.data.tel
   
    tel = tel.split('，')
    console.log(tel)
    wx.makePhoneCall({
      phoneNumber: tel[0] //仅为示例，并非真实的电话号码
    })
  },

  GetVipAddress: function (open_id) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/SmallProgram/GetVipAddress?id=0&union_id=' + open_id,
      data: {
        id: 0,
        union_id: open_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },

      success: function (res) {
        console.log('GetVipAddress接口开始')
        console.log(res);
        that.setData({
          consignee: res.data.Data.Address.consignee,
          phone: res.data.Data.Address.phone,
          province: res.data.Data.Address.province,
          city: res.data.Data.Address.city,
          area: res.data.Data.Address.area,
          street: res.data.Data.Address.street,
        })

      },
      fail: function (res) {
        console.log('提交GetVipAddress接口返回失败');
      }
    })
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
        var total_num = 0;
        for (var i = 0; i < res.data.Data.OrderItems.length; i++) {
          total_num += res.data.Data.OrderItems[i].qty
        }
        that.setData({
          orderitems: res.data.Data.OrderItems,
          send_no: res.data.Data.send_no,
          hidden: true,
          total_num: total_num,
          amount_payed: res.data.Data.amount_payed,
          pay_time: res.data.Data.pay_time,
          send_no: res.data.Data.send_no,
          send_status: res.data.Data.send_status,
          send_type: res.data.Data.send_type
        })
        wxbarcode.barcode('barcode', that.data.send_no, 680, 200);
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
    // wxbarcode.barcode('barcode', '1234567890123456789', 680, 200);
    // wxbarcode.qrcode('qrcode', '1234567890123456789', 420, 420);
    var that = this
    that.setData({
      order_id: options.order_id
    })
    that.GetOrderItemsByOrderID(options.order_id)
    that.GetStoreInfo(app.globalData.storeid)
    that.GetVipAddress(app.globalData.loginfo.data.Data.openid)
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