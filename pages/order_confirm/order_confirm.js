// pages/order_confirm/order_confirm.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    no_address: '',
    province: '',
    city: '',
    area: '',
    street: '',
    goods_list: [],
    goods_num: '',
    goods_price: '',
    goods_name: '',
    // goods_desc: '',
    goods_id: '',
    goods_img: '',
    total_price: '',
    ok_buy: false,
    modal_pay: false,
    weixin_pay: true,
    user_name: '',
    user_tel: '',
    order_id: '',
    receive_id: '',
    order_items: [],
    packages_json: ''
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
        console.log('接口里的orderid:' + orderid)
        console.log(res);
        var goods_num = 0;
        for (var i = 0; i < res.data.Data.OrderItems.length; i++) {
          goods_num += res.data.Data.OrderItems[i].qty
        }
        that.setData({
          order_items: res.data.Data.OrderItems,
          total_price: res.data.Data.amount_payed,
          goods_num: goods_num
        })
      },
      fail: function (res) {
        console.log('提交GetOrderItemsByOrderID接口返回失败');
      }
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
        console.log(open_id);
        console.log('xuyao de ');
        console.log('获取收货信息列表');
        console.log(app.globalData.bd_url + '/api/SmallProgram/GetVipAddress?' + 'id=0&union_id=' + open_id);

        console.log(res);
        console.log(res.data.Data.Address)
        if (!res.data.Data.Address) {

          that.setData({
            no_address: true
          })

        } else {
          that.setData({
            receive_id: res.data.Data.Address.id,
            province: res.data.Data.Address.province,
            city: res.data.Data.Address.city,
            area: res.data.Data.Address.area,
            street: res.data.Data.Address.street,
            user_name: res.data.Data.Address.consignee,
            user_tel: res.data.Data.Address.phone,
            no_address: false
          })
        }
      },
      fail: function (res) {
        console.log('提交GetVipAddress接口返回失败');
      }
    })
  },

  ConfirmOrder: function (order_id) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/WxSP/ConfirmOrder',
      data: {
        order_id: order_id,
        
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      success: function (res) {
        console.log('ConfirmOrder开始')
        console.log(res);
        if (res.data.Data.IsError == false) {
          var send_no = res.data.Data.send_no
          // wx.showToast({
          //   title: '取货单号：' + send_no,
          // })
          wx.navigateTo({
            url: '../order_detail/order_detail?order_id=' + order_id
          })
        }

      },
      fail: function (res) {
        console.log('提交ConfirmOrder接口返回失败');
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
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      success: function (res) {
        console.log('CheckOrder开始')
        console.log(res);
        if (res.data.Data.IsError == false) {
          var send_no = res.data.Data.send_no
          // wx.showToast({
          //   title: '取货单号：' + send_no,
          // })
          // wx.navigateTo({
          //   url: '../order_detail/order_detail?order_id=' + order_id
          // })
          that.ConfirmOrder(order_id)
        }

      },
      fail: function (res) {
        console.log('提交CheckOrder接口返回失败');
      }
    })
  },
  GetTicketPointRedPacket: function (order_id, store_id, vip_id) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/Ticket/GetTicketPointRedPacket',
      data: {
        order_id: order_id,
        store_id: store_id,
        vip_id: vip_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      success: function (res) {
        console.log('GetTicketPointRedPacket开始')
        console.log(res);


      },
      fail: function (res) {
        console.log('提交GetTicketPointRedPacket接口返回失败');
      }
    })
  },


  CreateWeixinOrder: function (store_id, order_id, open_id, receive_id) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/WxSP/CreateWeixinOrder',
      data: {
        store_id: store_id,
        order_id: order_id,
        open_id: open_id,
        receive_id: receive_id

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
        console.log('需要的receive_id:' + receive_id)
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
              that.CheckOrder(order_id, res.data.Data.weixin_pay_no, 0)
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

  TryBDPay: function (order_id, discount_money, packages_json, store_id, vip_id) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/order/TryBDPay',
      data: {
        order_id: order_id,
        discount_money: discount_money,
        packages_json: packages_json,
        store_id: store_id,
        vip_id: vip_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'api-version': '2',
        'token': app.globalData.token
      },
      success: function (res) {
        console.log('TryBDPay开始')
        console.log('需要的packages_json：' + packages_json);
        console.log(res);


      },
      fail: function (res) {
        console.log('提交TryBDPay接口返回失败');
      }
    })
  },

  addressJump: function () {
    wx.navigateTo({
      url: '../address/address'
    })
  },

  payModal: function () {
    var that = this
    if (that.data.modal_pay == false) {
      that.setData({
        modal_pay: true
      })
    } else {
      that.setData({
        modal_pay: false
      })
    }

  },
  paySure: function () {
    var that = this
    that.setData({
      modal_pay: false
    })
  },
  crOr: function () {
    var that = this
    if (that.data.weixin_pay == true) {
      console.log('这这里的receive_id:' + that.data.receive_id)
      that.CreateWeixinOrder(app.globalData.storeid, that.data.order_id, app.globalData.loginfo.data.Data.openid, that.data.receive_id)

    } else {
      if (that.data.packages_json == "") {
        wx.showToast({
          title: 'BD卡余额不足',
        })
      } else {
        that.TryBDPay(that.data.order_id, 0, that.data.packages_json, app.globalData.storeid, app.globalData.loginfo.data.Data.vip_id)

      }

    }

    // wx.navigateTo({
    //   url: '../order_detail/order_detail?order_id=' + that.data.OrderID
    // })
  },

  payModalhide: function () {
    var that = this
    that.setData({
      modal_pay: false
    })
  },

  weixinWay: function () {
    var that = this
    if (that.data.weixin_pay == true) {
      that.setData({
        weixin_pay: false
      })
    } else {
      that.setData({
        weixin_pay: true
      })
    }
  },

  GetPackages: function (order_id, store_id, vip_id) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/order/GetPackages',
      data: {
        order_id: order_id,
        store_id: store_id,
        vip_id: vip_id
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'api-version': '2',
        'token': app.globalData.token
      },
      success: function (res) {
        console.log('GetPackages开始')
        console.log(order_id)
        console.log(store_id)
        console.log(vip_id)
        console.log(res);
        if (res.data.Data.Recharges.length == 0) {
          that.setData({
            packages_json: ''
          })
        } else {
          var json_data = {}
          var json_data_list = {}
          for (var i = 0; i < res.data.Data.Recharges.length; i++) {
            json_data_list.recharge_id = res.data.Data.Recharges[i].id
            json_data_list.rcorder_id = res.data.Data.Recharges[i].rcorder_id
            json_data.push(json_data_list)
          }
          var json_data_str = JSON.stringify(json_data)
          that.setData({
            packages_json: json_data_str
          })
        }

      },
      fail: function (res) {
        console.log('提交GetPackages接口返回失败');
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log('得到的options.order_id：' + options.order_id);
    // that.setData({
    //   goods_price: options.goods_price,
    //   goods_name: options.goods_name,
    //   goods_desc: options.goods_desc,
    //   goods_id: options.goods_id,
    //   goods_img: options.goods_img,
    //   goods_num: options.goods_num,
    //   order_id: c
    //   total_price: options.total_price
    // })
    that.setData({
      order_id: options.order_id
    })
    that.GetOrderItemsByOrderID(options.order_id)
    that.GetPackages(options.order_id, app.globalData.storeid, app.globalData.loginfo.data.Data.vip_id)
    // that.GetTicketPointRedPacket(options.order_id, app.globalData.storeid, app.globalData.loginfo.data.Data.vip_id)

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
    that.GetVipAddress(app.globalData.loginfo.data.Data.openid)

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