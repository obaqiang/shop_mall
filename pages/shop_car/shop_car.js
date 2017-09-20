// pages/shop_car/shop_car.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    no_goods: true,
    goods_cho_all: [],
    ahead: 'head_title_hover',
    bhead: 'head_title',
    chead: 'head_title',
    hook_status_stand: false,
    total_num: 0,
    total_money: 0,
    goods_pay: ''
  },

  aTap: function () {
    var that = this
    app.globalData.car_cho_if_address = 'all'
    // app.globalData.car_cho_if_address == ''
    var co_goods_cho_all = that.data.goods_cho_all;
    for (var i = 0; i < co_goods_cho_all.length; i++) {
      if (co_goods_cho_all[i].is_locale == 2) {
        co_goods_cho_all[i].show = true;
      } else {
        co_goods_cho_all[i].show = false;
      }

    }
    that.setData({
      goods_cho_all: co_goods_cho_all,
      ahead: 'head_title_hover',
      bhead: 'head_title',
      chead: 'head_title',
      hook_status_stand: false
    })
  },
  bTap: function () {
    var that = this
    app.globalData.car_cho_if_address = true
    var co_goods_cho_all = that.data.goods_cho_all;
    for (var i = 0; i < co_goods_cho_all.length; i++) {
      if (co_goods_cho_all[i].is_locale == 0) {
        co_goods_cho_all[i].show = true;
      } else {
        co_goods_cho_all[i].show = false;
      }

    }
    that.setData({
      goods_cho_all: co_goods_cho_all,
      ahead: 'head_title',
      bhead: 'head_title_hover',
      chead: 'head_title',
      hook_status_stand: false
    })
  },
  cTap: function () {
    var that = this
    app.globalData.car_cho_if_address = false
    var co_goods_cho_all = that.data.goods_cho_all;
    for (var i = 0; i < co_goods_cho_all.length; i++) {
      if (co_goods_cho_all[i].is_locale == 1) {
        co_goods_cho_all[i].show = true;
        console.log(1)
      } else {
        console.log(2)
        co_goods_cho_all[i].show = false;
      }

    }
    that.setData({
      goods_cho_all: co_goods_cho_all,
      ahead: 'head_title',
      bhead: 'head_title',
      chead: 'head_title_hover',
      hook_status_stand: false
    })
    console.log(that.data.goods_cho_all)
  },

  allHook: function () {
    var that = this
    var co_goods_cho_all = that.data.goods_cho_all;
    if (that.data.hook_status_stand == false) {
      that.setData({
        hook_status_stand: true
      })
    } else {
      that.setData({
        hook_status_stand: false
      })
    }
    for (var i = 0; i < co_goods_cho_all.length; i++) {
      if (that.data.ahead == 'head_title_hover' && co_goods_cho_all[i].is_locale == 2) {
        co_goods_cho_all[i].hook_status = that.data.hook_status_stand
      } else if (that.data.bhead == 'head_title_hover' && co_goods_cho_all[i].is_locale == 0) {
        co_goods_cho_all[i].hook_status = that.data.hook_status_stand
      } else if (that.data.chead == 'head_title_hover' && co_goods_cho_all[i].is_locale == 1) {
        co_goods_cho_all[i].hook_status = that.data.hook_status_stand
      }

    }
    that.setData({
      goods_cho_all: co_goods_cho_all
    })
    that.calTotal()
  },


  minBtn: function (e) {
    var that = this
    var goods_id = e.currentTarget.dataset.goods_id
    var co_goods_cho_all = that.data.goods_cho_all
    for (var i = 0; i < co_goods_cho_all.length; i++) {
      if (goods_id == co_goods_cho_all[i].goods_id) {
        var num = co_goods_cho_all[i].goods_num
        if (num > 1) {
          num--
          co_goods_cho_all[i].goods_num = num
        } else {
          co_goods_cho_all.splice(i, 1)
        }
      }
    }

    that.setData({
      goods_cho_all: co_goods_cho_all
    })
    that.calTotal();

  },
  plusBtn: function (e) {
    var that = this
    var goods_id = e.currentTarget.dataset.goods_id
    var co_goods_cho_all = that.data.goods_cho_all
    for (var i = 0; i < co_goods_cho_all.length; i++) {
      if (goods_id == co_goods_cho_all[i].goods_id) {
        var num = co_goods_cho_all[i].goods_num
        num++
        co_goods_cho_all[i].goods_num = num

      }
    }
    that.setData({
      goods_cho_all: co_goods_cho_all
    })
    that.calTotal();
  },

  goPay: function () {
    console.log('我靠:' + app.globalData.car_cho_if_address)
    var that = this
    if (that.data.total_money == 0) {
      wx.showToast({
        title: '请勾选需要的商品',
      })
    } else {
      var items_json = []
      for (var i = 0; i < that.data.goods_pay.length; i++) {
        var items = {
          goods_id: that.data.goods_pay[i].goods_id,
          order_id: '',
          price: that.data.goods_pay[i].goods_price,
          qty: that.data.goods_pay[i].goods_num
        }
        items_json.push(items);
      }
      items_json = JSON.stringify(items_json);

      that.CreateOrder('', app.globalData.storeid, app.globalData.loginfo.data.Data.vip_id, '', that.data.total_money, that.data.total_money, that.data.total_money, 0, '111', '', items_json)
      // that.CreateWeixinOrder();
    }

  },

  // cancelHook: function (e) {
  //   var that=this
  //   console.log(e)
  //   var goods_id = e.currentTarget.dataset.goods_id
  //   var co_goods_cho_all = that.data.goods_cho_all
  //   for (var i = 0; i < co_goods_cho_all.length; i++) {
  //     if (goods_id == co_goods_cho_all[i].goods_id) {
  //       co_goods_cho_all[i].hook_status = true
  //     }
  //   }
  //   that.setData({
  //     goods_cho_all: co_goods_cho_all
  //   })
  //   that.calTotal()

  // },

  ifAllhook: function () {
    var that = this
    var if_all_hook;
    for (var i = 0; i < that.data.goods_cho_all.length; i++) {
      if (that.data.goods_cho_all[i].hook_status == false) {
        if_all_hook = false
      }
    }
    if (if_all_hook == false) {
      that.setData({
        hook_status_stand: false
      })
    } else {
      that.setData({
        hook_status_stand: true
      })
    }
  },

  getHook: function (e) {
    var that = this
    var goods_id = e.currentTarget.dataset.goods_id
    var co_goods_cho_all = that.data.goods_cho_all
    for (var i = 0; i < co_goods_cho_all.length; i++) {
      if (goods_id == co_goods_cho_all[i].goods_id) {
        if (co_goods_cho_all[i].hook_status == true) {
          co_goods_cho_all[i].hook_status = false
          that.data.hook_status_stand = false
        } else {
          co_goods_cho_all[i].hook_status = true

        }

      }
    }
    that.setData({
      goods_cho_all: co_goods_cho_all,
      hook_status_stand: that.data.hook_status_stand
    })
    that.calTotal()
    that.ifAllhook()
    // console.log(that.data.goods_pay);
  },

  calTotal: function () {
    var that = this
    var co_goods_cho_all = that.data.goods_cho_all;
    app.globalData.goods_cho_all = co_goods_cho_all;
    var goods_choose = [];
    for (var i = 0; i < co_goods_cho_all.length; i++) {
      if (co_goods_cho_all[i].hook_status == true) {
        goods_choose.push(co_goods_cho_all[i])
      }
    }
    console.log(goods_choose)
    var total_num = 0;
    var total_money = 0;
    for (var i = 0; i < goods_choose.length; i++) {
      total_num += goods_choose[i].goods_num
      var total_price = goods_choose[i].goods_num * goods_choose[i].goods_price
      total_money += total_price
    }
    console.log(total_num)
    console.log(total_money)

    total_money = total_money.toFixed(2)
    that.setData({
      total_num: total_num,
      total_money: total_money,
      goods_pay: goods_choose
    })
    if (app.globalData.goods_cho_all.length == 0) {
      that.setData({
        no_goods: true
      })
    }
  },

  CreateOrder: function (order_id, store_id, vip_id, member_id, amount_payable, total_amount, amount_payed, type, last_user, unvip_phone, items_json,
  ) { //提交订单接口
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/WxSP/CreateOrder',
      data: {
        // order_id: order_id,
        store_id: store_id,
        vip_id: vip_id,
        // member_id: member_id,
        amount_payable: amount_payable,
        total_amount: total_amount,
        amount_payed: amount_payed,
        type: type,
        last_user: last_user,
        // unvip_phone: unvip_phone
        items_json: items_json,

      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      success: function (res) {
        console.log('需要的order_id：' + order_id);
        console.log('需要的store_id：' + store_id);
        console.log('需要的vip_id：' + vip_id);
        console.log('需要的member_id：' + member_id);
        console.log('需要的amount_payable：' + amount_payable);
        console.log('需要的total_amount：' + total_amount);
        console.log('需要的amount_payed：' + amount_payed);
        console.log('需要的type：' + type);
        console.log('需要的last_user：' + last_user);
        console.log('需要的unvip_phone：' + unvip_phone);
        console.log('需要的items_json：' + items_json)
        console.log(res)
        if (res.data.Data.IsError == false) {
          // var total_price = that.data.goods_num * that.data.goods_price
          console.log('这里需要的order_id:' + res.data.Data.OrderID)
          app.globalData.order_confirm_order_id = res.data.Data.OrderID
          wx.navigateTo({
            url: '../order_confirm/order_confirm?order_id=' + res.data.Data.OrderID
          })
        }
        // that.CreateWeixinOrder(app.globalData.storeid, res.data.Data.OrderID, app.globalData.loginfo.data.Data.openid)


      },
      fail: function (res) {
        console.log('提交订单接口返回失败');
      }
    })
  },
  CreateWeixinOrder: function (store_id, order_id, open_id) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/WxSP/CreateWeixinOrder',
      data: {
        store_id: store_id,
        order_id: order_id,
        open_id: open_id

      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      success: function (res) {
        console.log('需要的store_id：' + store_id);
        console.log('需要的order_id：' + order_id);
        console.log('需要的open_id：' + open_id);

        console.log(res);
        if (res.data.Data.IsError == false) {
          wx.requestPayment({
            'timeStamp': res.data.Data.WxradeCreateResponse.timeStamp,
            'nonceStr': res.data.Data.WxradeCreateResponse.nonceStr,
            'package': res.data.Data.WxradeCreateResponse.package,
            'signType': res.data.Data.WxradeCreateResponse.signType,
            'paySign': res.data.Data.WxradeCreateResponse.paySign,
            'success': function (data) {
              console.log('付款成功')
              console.log(data);
              that.CheckOrder(order_id, data.data.Data.weixin_pay_no, 0)

            },
            'fail': function (data) {
            }
          })
        }
        // if (res.data.Data.IsError == false) {
        //   console.log(res.data.Data.weixin_pay_no);
        //   console.log(order_id);
        //   that.CheckOrder(order_id, res.data.Data.weixin_pay_no, 0)
        //   wx.navigateTo({
        //     url: '../shop_car/shop_car'
        //   })
        // }
      },
      fail: function (res) {
        console.log('提交CreateWeixinOrder接口返回失败');
      }
    })
  },

  CheckOrder: function (order_id, weixin_pay_no, type) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/WxSP/CheckOrder',
      data: {
        order_id: order_id,
        weixin_pay_no: weixin_pay_no,
        type: type//4取消，0正常确认
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.Data.IsError == false) {
          var send_no = res.data.Data.send_no
          // wx.showToast({
          //   title: '取货单号：' + send_no,
          // })
          wx.navigateTo({
            url: '../order_detail/order_detail'
          })
        }

      },
      fail: function (res) {
        console.log('提交CheckOrder接口返回失败');
      }
    })
  },

  go_see: function () {
    wx.switchTab({
      url: '../shop_city/shop_city'
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


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
    app.globalData.car_cho_if_address = 'all'
    that.setData({
      hook_status_stand: false
    })
    console.log(app.globalData.goods_cho_all)

    var co_goods_cho_all = app.globalData.goods_cho_all
    for (var i = 0; i < co_goods_cho_all.length; i++) {
      if (co_goods_cho_all[i].is_locale == 2) {//第一次进入
        co_goods_cho_all[i].show = true
      } else {
        co_goods_cho_all[i].show = false
      }

      co_goods_cho_all[i].hook_status = false
    }

    that.setData({
      no_goods: false,
      goods_cho_all: co_goods_cho_all,
      ahead: 'head_title_hover',
      bhead: 'head_title',
      chead: 'head_title',
    })


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
    // app.globalData.car_cho_if_address == ''
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