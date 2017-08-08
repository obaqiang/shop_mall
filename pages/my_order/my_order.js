// pages/my_order/my_order.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    type: ''
  },

  orderJump: function (e) {
    console.log(e)
    var order_id = e.currentTarget.dataset.order_id

    var text_status = e.currentTarget.dataset.text_status
    var total_amount = e.currentTarget.dataset.total_amount
    var amount_payable = e.currentTarget.dataset.amount_payable
    console.log('需要的order_id：' + order_id);
    wx.navigateTo({
      url: '../order_detail/order_detail?order_id=' + order_id
    })
  },


  showOrder: function (e) {
    console.log(e);
    var that = this
    var orderstatus = e.target.dataset.orderstatus;
    var type;
    var pay_status = 0;
    var status = 0;
    if (orderstatus == 1) {
      type = 0
    } else if (orderstatus == 2) {//待付款
      type = 5
      pay_status = 1
      status = 2
    } else if (orderstatus == 3) {//未完成
      type = 2
      pay_status = 1
      status = 1
    } else if (orderstatus == 4) {//已完成
      type = 6
      pay_status = 2
      status = 2
    }
    that.setData({
      type: type
    })
    that.GetOrdersForSmallProgram(app.globalData.storeid, app.globalData.loginfo.data.Data.vip_id, that.data.type, app.globalData.loginfo.data.Data.bdtoken, pay_status, status)
  },




  GetOrdersForSmallProgram: function (store_id, vip_id, type, token, pay_status, status) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/OrderV2/GetOrdersForSmallProgram',
      data: {
        store_id: store_id,
        vip_id: vip_id,
        type: type,
        pay_status: pay_status,
        status: status
        // hasitems:1,
        // token:token,
        // page_num: page_num,
        // page_size: page_size,

      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'api-version': 2,
        'token': token
      },

      success: function (res) {
        console.log('GetOrdersForSmallProgram接口开始');
        console.log(res);
        var orders = res.data.Data.Orders
        var orders_new = [];
        for (var i = 0; i < orders.length; i++) {
          var add_time = orders[i].add_time;
          add_time = util.getNowFormatDate_2(add_time);
          orders[i].add_time = add_time
          var status = orders[i].status;
          var pay_status = orders[i].pay_status;
          var send_status = orders[i].send_status;
          var text;
          var text_status;
          if (orders[i].pay_status == 1 && orders[i].send_status == 0) {

            text = '待付款';
            text_status = 'status_2';
          } else if (orders[i].pay_status == 2 && orders[i].send_status == 0) {

            text = '未完成';
            text_status = 'status_3'
          } else if (orders[i].pay_status == 2 && orders[i].send_status == 1) {

            text = '已完成';
            text_status = 'status_1'
          } else {//异常订单不显示
            orders[i] = [];

          }
          if (orders[i].length != 0) {
            orders[i].text = text;
            orders[i].text_status = text_status;
            orders_new.push(orders[i]);

          }
          // console.log(orders_new);
        }
        that.setData({
          orders: orders_new
        })


      },
      fail: function (res) {
        console.log('提交GetOrder接口返回失败');
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var type = options.type;
    if (type == '') {
      type = 0
    }
    var co_status = options.status
    var pay_status = 0;
    var status = 0;
    if (co_status == 'one') {//考虑页面是从order_card页面跳转过来
      type = 0
    } else if (co_status == 'two') {
      type = 7;
      pay_status = 1
      status = 2
    } else if (co_status == 'three') {
      type = 5;
      pay_status = 1
      status = 1
    } else if (co_status == 'four') {
      type = 6;
      pay_status = 2
      status = 2
    }
    that.setData({
      type: type
    })
    that.GetOrdersForSmallProgram(app.globalData.storeid, app.globalData.loginfo.data.Data.vip_id, that.data.type, app.globalData.loginfo.data.Data.bdtoken, pay_status, status)

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