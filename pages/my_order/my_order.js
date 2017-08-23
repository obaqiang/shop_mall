// pages/my_order/my_order.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    type: '',
    see_type: '',
    pay_status: [],
    status: '',
    hidden: false,
    page_num: 1,
    page_size: 10
  },

  orderJump: function (e) {
    console.log(e)
    var order_id = e.currentTarget.dataset.order_id
    app.globalData.order_confirm_order_id = order_id
    // var text_status = e.currentTarget.dataset.text_status
    // var total_amount = e.currentTarget.dataset.total_amount
    // var amount_payable = e.currentTarget.dataset.amount_payable
    console.log(order_id)
    console.log('需要的order_id：' + order_id);
    var text = e.currentTarget.dataset.text
    if (text == '待付款') {
      wx.navigateTo({
        url: '../order_confirm/order_confirm?order_id=' + order_id
      })
    } else {
      wx.navigateTo({
        url: '../order_detail/order_detail?order_id=' + order_id
      })
    }

  },

  RefundWinxinOrder: function (order_id, return_amount) {
    var that = this;

    wx.request({
      url: app.globalData.bd_url + '/api/WxSP/RefundWinxinOrder',
      data: {
        store_id: app.globalData.storeid,
        order_id: order_id,
        staff_id: app.globalData.loginfo.data.Data.vip_id,
        memo: '退款',
        items_json: '',
        paylist_json: '',
        return_amount: return_amount
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
        // 'token': app.globalData.loginfo.data.Data.bdtoken,
      },
      success: function (res) {
        console.log(app.globalData.bd_url + '/api/WxSP/RefundWinxinOrder');
        console.log('RefundWinxinOrder接口开始');
        console.log(app.globalData.storeid)
        console.log(order_id)
        console.log(app.globalData.loginfo.data.Data.vip_id)
        console.log('退款')
        console.log(return_amount)
        console.log(res)
        if (res.data.Data.IsError == false) {
          wx.showToast({
            title: '退款成功',
          })
        } else {
          wx.showToast({
            title: '退款失败，请退出重试',
          })
        }
      },
      fail: function (res) {
        console.log('提交RefundWinxinOrder接口返回失败');
        wx.showToast({
          title: '网络连接失败，请退出重试',
        })
      }
    })
  },


  backMoney: function (e) {
    var that = this
    var order_id = e.currentTarget.dataset.order_id
    var return_amount = e.currentTarget.dataset.return_amount
    that.RefundWinxinOrder(order_id, return_amount)
    var orders_now = that.data.orders
    for (var i = 0; i < orders_now.length; i++) {
      if (orders_now[i].order_id == order_id) {
        orders_now[i].back_already = true
        orders_now[i].text_back = ''
        orders_now[i].amount_payable = -orders_now[i].amount_payable
      }
    }

    that.setData({
      orders: orders_now
    })
  },

  showOrder: function (e) {
    console.log(e);
    var that = this
    that.setData({
      hidden: false
    })
    var orderstatus = e.target.dataset.orderstatus;
    var type;
    var pay_status = 0;
    var status = 0;
    var see_type;

    if (orderstatus == 1) {
      see_type = 1
      type = 0
      status = 0

    } else if (orderstatus == 2) {//待付款
      see_type = 2
      type = 2
      pay_status = 0
      status = 1

    } else if (orderstatus == 3) {//未完成
      see_type = 3
      type = 99
      pay_status = 0
      status = 2

    } else if (orderstatus == 4) {//已完成
      see_type = 4
      type = 100
      pay_status = 0
      status = 3

    }
    that.setData({
      see_type: see_type,
      type: type,
      pay_status: pay_status,
      status: status,
      page_num: 1
    })
    console.log(pay_status)
    console.log(status)
    that.GetOrdersForSmallProgram(app.globalData.storeid, app.globalData.loginfo.data.Data.vip_id, that.data.type, pay_status, status)
  },




  GetOrdersForSmallProgram: function (store_id, vip_id, type, lala, haha) {//status 为敏感字符
    var that = this;
    console.log('接口里的数据');
    console.log(lala)
    console.log(haha)
    wx.request({
      url: app.globalData.bd_url + '/api/OrderV2/GetOrdersForSmallProgram',
      data: {
        store_id: store_id,
        vip_id: vip_id,
        type: 0,
        pay_status: 0,
        status: haha,
        page_num: that.data.page_num,
        page_size: that.data.page_size
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'api-version': 2,
        'token': app.globalData.loginfo.data.Data.bdtoken,
      },
      success: function (res) {
        // console.log('GetOrdersForSmallProgram接口开始');
        // console.log(store_id)
        // console.log(vip_id)
        // console.log(type)
        // console.log(lala)
        // console.log(haha)
        console.log(that.data.page_num)
        console.log(res);
        if (res.data.Data.IsError == false) {
          var orders = that.data.orders;
          console.log('这里')
          console.log(orders)
          if (that.data.page_num == 1) {
            orders = res.data.Data.Orders
          } else {
            orders = orders.concat(res.data.Data.Orders)
          }
          console.log('哪里')
          console.log(orders)
          var orders_new = [];
          for (var i = 0; i < orders.length; i++) {
            var money_show = Math.abs(orders[i].amount_payable)
            var add_time = orders[i].add_time;
            var reg = /^[0-9]+.?[0-9]*$/;
            if (reg.test(add_time)) {
              add_time = util.getNowFormatDate_2(add_time);
              orders[i].add_time = add_time
            }

            var status = orders[i].status;
            var pay_status = orders[i].pay_status;
            var send_status = orders[i].send_status;
            var text;
            var text_back;
            var text_status;
            if (orders[i].pay_status == 1 && orders[i].send_status == 0) {
              text = '待付款';
              text_back = '';
              text_status = 'status_2';
            } else if (orders[i].pay_status == 2) {
              if (orders[i].send_type == 1) {//到店核销


                console.log(11)
                text = '未完成';
                if (orders[i].receive_status == 2) {
                  text_back = '';
                } else {
                  if (orders[i].source == 'weixinapp') {
                    text_back = '退款';
                  }

                }

                text_status = 'status_3'

              }
              if (orders[i].send_type == 2) {
                if (orders[i].receive_status != 2 || orders[i].send_no == '') {
                  console.log(33)
                  text = '未完成';
                  if (orders[i].send_status == 2 || orders[i].receive_status == 2) {
                    text_back = '';
                  } else {
                    if (orders[i].source == 'weixinapp') {
                      text_back = '退款';
                    }
                  }

                  text_status = 'status_3'
                } else if (orders[i].send_status != 1 && orders[i].receive_status == 2) {
                  console.log(44)
                  text = '已完成';
                  text_status = 'status_1'
                }

              }
              if (orders[i].send_type == 0) {
                text = '未完成';
                if (orders[i].send_status == 2 || orders[i].receive_status == 2) {
                  text_back = '';
                } else {
                  if (orders[i].source == 'weixinapp') {
                    text_back = '退款';
                  }
                }
                text_status = 'status_3'
              }

            } else {//异常订单不显示
              orders[i] = [];

            }

            if (orders[i].length != 0) {
              orders[i].text = text;
              orders[i].text_back = text_back;
              orders[i].text_status = text_status;
              orders[i].money_show = money_show;
              orders_new.push(orders[i]);

            }
            // console.log(orders_new);
          }
          that.setData({
            orders: orders_new,
            hidden: true
          })
          console.log(that.data.orders)
        } else {
          wx.showToast({
            title: '获取商品列表失败，请退出重试',
          })
        }

      },
      fail: function (res) {
        console.log('提交GetOrder接口返回失败');
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
    var type = options.type;
    if (type == '') {
      type = 0
    }
    var co_status = options.status
    var pay_status = 0;
    var status = 0;
    var see_type;
    if (co_status == 'one') {//考虑页面是从order_card页面跳转过来
      see_type = 1
      type = 0
      status = 0
    } else if (co_status == 'two') {
      see_type = 2
      type = 2;
      pay_status = 1
      status = 1
    } else if (co_status == 'three') {
      see_type = 3
      type = 99;
      pay_status = 2
      status = 2
    } else if (co_status == 'four') {
      see_type = 4
      type = 100;
      pay_status = 2
      status = 3
    }
    that.setData({
      type: type,
      see_type: see_type,
      pay_status: pay_status,
      status: status,

    })
    // console.log('标记')
    // console.log(pay_status)
    // console.log(status)
    // console.log('结束')
    that.GetOrdersForSmallProgram(app.globalData.storeid, app.globalData.loginfo.data.Data.vip_id, that.data.type, that.data.pay_status, that.data.status)

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
    var that = this
    wx.showToast({
      title: 'lala ',
    })
    that.GetOrdersForSmallProgram(app.globalData.storeid, app.globalData.loginfo.data.Data.vip_id, that.data.type, that.data.pay_status, that.data.status)
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
    var that = this
    // wx.showToast({
    //   title: '上拉了',
    // })
    var page_num = that.data.page_num
    page_num += 1
    that.setData({
      page_num: page_num
    })
    that.GetOrdersForSmallProgram(app.globalData.storeid, app.globalData.loginfo.data.Data.vip_id, that.data.type, that.data.pay_status, that.data.status)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})