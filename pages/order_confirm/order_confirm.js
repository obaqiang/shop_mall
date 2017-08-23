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
    order_items_show: [],
    packages_json: '',
    hidden: false,
    need_address: false,
    modal_pay_2: '',
    set_address: true,
    pay_text: '微信支付',
    address_text: '快递发货',
    send_way_show: '',

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
        // console.log('GetOrderItemsByOrderID返回数据');
        // console.log('接口里的orderid:' + orderid)
        // console.log(res);
        // var goods_num = 0;
        // // for (var i = 0; i < res.data.Data.OrderItems.length; i++) {
        // //   goods_num += res.data.Data.OrderItems[i].qty
        // //   var is_locale = res.data.Data.OrderItems[i].is_locale
        // //   if (is_locale == 0) {
        // //     that.setData({
        // //       need_address: true
        // //     })
        // //   }
        // // }
        // var order_items_show = []
        // var total_price = 0
        // for (var i = 0; i < res.data.Data.OrderItems.length; i++) {//默认设置为快递到店的商品
        //   if (res.data.Data.OrderItems[i].is_locale == 0 || res.data.Data.OrderItems[i].is_locale == 2) {
        //     order_items_show.push(that.data.order_items[i])
        //     // goods_num += res.data.Data.OrderItems[i].qty
        //     // total_price += res.data.Data.OrderItems[i].qty * res.data.Data.OrderItems[i].real_price
        //   }
        // }
        // that.setData({
        //   order_items: res.data.Data.OrderItems,
        //   order_items_show: order_items_show,
        //   // total_price: total_price,
        //   // goods_num: goods_num,
        //   hidden: true
        // })
        // that.ifCanPay()
        // that.calTotal()
        console.log('GetOrderItemsByOrderID返回数据');
        console.log('接口里的orderid:' + orderid)
        console.log(res);
        if (res.data.Data.IsError == false) {
          var goods_num = 0;
          for (var i = 0; i < res.data.Data.OrderItems.length; i++) {
            res.data.Data.OrderItems[i].goods_name = util.cutstr(res.data.Data.OrderItems[i].goods_name, 55)

            goods_num += res.data.Data.OrderItems[i].qty
            if (app.globalData.car_cho_if_address == '') {//不是从购物车页面过来
              if (res.data.Data.OrderItems[0].is_locale == 0) {//快递发货
                that.setData({
                  set_address: true,
                  send_way_show: false
                })
              } else if (res.data.Data.OrderItems[0].is_locale == 1) {//到店领取

                that.setData({
                  set_address: false,
                  send_way_show: false
                })
                console.log('需要的send_way_show:' + that.data.send_way_show)
              } else if (res.data.Data.OrderItems[0].is_locale == 2) {//两种都支持
                that.setData({
                  send_way_show: true
                })
              }

            } else if (app.globalData.car_cho_if_address == false) {//购物车中强制方式为到店领取
              that.setData({
                send_way_show: false,
                set_address: false
              })
            } else if (app.globalData.car_cho_if_address == true) {//购物车中强制方式为快递发货
              that.setData({
                send_way_show: false,
                set_address: true
              })
            } else if (app.globalData.car_cho_if_address == 'all') {//购物车中两种都支持,默认为快递发货
              that.setData({
                send_way_show: true,
                set_address: true
              })
            }
          }
          that.setData({
            order_items: res.data.Data.OrderItems,
            total_price: res.data.Data.amount_payed,
            goods_num: goods_num,
            hidden: true
          })
          that.ifCanPay()
        } else {
          wx.showToast({
            title: '获取产品信息失败，请退出重试',
          })
        }
      },
      fail: function (res) {
        console.log('提交GetOrderItemsByOrderID接口返回失败');
        wx.showToast({
          title: '网络连接失败，请退出重试',
        })
      }
    })
  },
  ifCanPay: function () {
    var that = this
    console.log('set_address:' + that.data.set_address)
    // console.log('need_address:' + that.data.need_address)
    console.log('no_address:' + that.data.no_address)
    if (that.data.set_address == false) {//如果没有设置地址，可以支付
      that.setData({
        can_pay: true
      })
    } else {//如果设置了地址，判断地址是否为空
      if (that.data.no_address == true) {//如果没有设置
        that.setData({
          can_pay: false
        })
      } else {
        that.setData({
          can_pay: true
        })
      }

    }
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
        if (res.data.Data.IsError == false) {


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
          that.ifCanPay()
        } else {
          wx.showToast({
            title: '获取用户地址失败，请退出重试',
          })
        }
      },
      fail: function (res) {
        console.log('提交GetVipAddress接口返回失败');
        wx.showToast({
          title: '网络连接失败，请退出重试',
        })
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
        } else {
          wx.showToast({
            title: '确认订单失败，请退出重试',
          })
        }

      },
      fail: function (res) {
        console.log('提交ConfirmOrder接口返回失败');
        wx.showToast({
          title: '网络连接失败，请退出重试',
        })
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
          // that.ConfirmOrder(order_id)
          app.globalData.car_cho_if_address == ''
          wx.navigateTo({
            url: '../order_detail/order_detail?order_id=' + order_id
          })
        } else {
          wx.showToast({
            title: 'checkOrder失败，请退出重试',
          })
        }

      },

      fail: function (res) {
        console.log('提交CheckOrder接口返回失败');
      }
    })
  },
  CheckOrder_2: function (amount_payable, amount_payed, order_id, packages_json, pays_json) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/OrderV2/CheckOrderForSmallProgram',
      data: {
        amount_payable: amount_payable,
        amount_payed: amount_payed,
        last_user: '',
        memo: "",
        order_id: order_id,
        order_type: 1,
        packages_json: packages_json,
        pays_json: pays_json,
        point_money: 0,
        type: 0,
        use_point: '',
        from_member:1,
        vip_id: app.globalData.loginfo.data.Data.vip_id,
        receive_id: that.data.receive_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'api-version': 2,
        'token': app.globalData.token
      },
      success: function (res) {
        console.log(amount_payable)
        console.log(order_id)
        console.log(packages_json)
        console.log(pays_json)
        console.log('CheckOrder_2开始')
        console.log(that.data.packages_json)
        console.log(res);
        if (res.data.Data.IsError == false) {
          wx.showToast({
            title: res.data.Data.SuccessMessage,
          })
          app.globalData.car_cho_if_address == ''
          wx.navigateTo({
            url: '../order_detail/order_detail?order_id=' + res.data.Data.OrderID
          })
        } else {
          wx.showToast({
            title: res.data.Data.ErrorMessage,
          })
        }
      },

      fail: function (res) {
        console.log('提交CheckOrder_2接口返回失败');
        wx.showToast({
          title: '网络连接失败，请退出重试',
        })
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
              wx.showToast({
                title: '支付失败，请退出重试',
              })
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
    console.log(22222)
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
  payModal_2: function () {
    var that = this
    if (that.data.modal_pay_2 == false) {
      that.setData({
        modal_pay_2: true
      })
    } else {
      that.setData({
        modal_pay_2: false
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
      if (that.data.address_text != '快递发货') {
        that.setData({
          receive_id: ''
        })
      }
      console.log('这这里的receive_id:' + that.data.receive_id)
      that.CreateWeixinOrder(app.globalData.storeid, that.data.order_id, app.globalData.loginfo.data.Data.openid, that.data.receive_id)

    } else {
      if (that.data.packages_json == "") {
        wx.showToast({
          title: 'BD卡余额不足',
        })
      } else {
        // that.TryBDPay(that.data.order_id, 0, that.data.packages_json, app.globalData.storeid, app.globalData.loginfo.data.Data.vip_id)
        // var pays_json = [{
        //   pay_money: that.data.total_price,
        //   pay_id: 99,
        //   pay_name: '卡支付'
        // }]
        // pays_json = JSON.stringify(pays_json)
        // that.CheckOrder_2(that.data.total_price, that.data.total_price, that.data.order_id, '', pays_json)
        console.log(that.data.order_items)
        var goodslist = [];
        for (var i = 0; i < that.data.order_items.length; i++) {
          var goodslist_list = {};
          goodslist_list.id = that.data.order_items[i].goods_id
          goodslist.push(goodslist_list)
        }
        var goodslist_json = JSON.stringify(goodslist)
        console.log(goodslist_json);
        if (!app.globalData.loginfo.data.Data.memberid) {
          wx.showToast({
            title: '您还不是BD卡会员，请选择其他支付方式',
          })
        } else {
          that.GetPackagesByItems(goodslist_json, app.globalData.loginfo.data.Data.memberid, app.globalData.storeid, app.globalData.loginfo.data.Data.vip_id)
        }

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
  payModalhide_2: function () {
    var that = this
    that.setData({
      modal_pay_2: false
    })
  },

  weixinWay: function () {
    var that = this
    // if (that.data.weixin_pay == true) {
    //   that.setData({
    //     weixin_pay: false,
    //     modal_pay: false,
    //     pay_text: 'BD卡支付'
    //   })
    // } else {
    that.setData({
      weixin_pay: true,
      modal_pay: false,
      pay_text: '微信支付'
    })
    // }
  },
  bdWay: function () {
    var that = this

    that.setData({
      weixin_pay: false,
      modal_pay: false,
      pay_text: 'BD支付'
    })
  },

  weixinWay_2: function () {
    var that
    var order_items_show = []
    if (that.data.set_address == true) {//如果是快递发货
      for (var i = 0; i < that.data.order_items.length; i++) {
        if (that.data.order_items[i].is_locale == 0 || that.data.order_items[i].is_locale == 2) {
          order_items_show.push(that.data.order_items[i])
        }
      }
      that.setData({
        set_address: false
      })
    } else {//如果是到店领取
      for (var i = 0; i < that.data.order_items.length; i++) {
        if (that.data.order_items[i].is_locale == 1 || that.data.order_items[i].is_locale == 2) {
          order_items_show.push(that.data.order_items[i])
        }
      }
      that.setData({
        set_address: true
      })
    }
    that.setData({
      order_items_show: order_items_show,
      modal_pay_2: false
    })
    that.ifCanPay()
  },
  setAddress: function () {
    var that = this
    var order_items_show = []
    for (var i = 0; i < that.data.order_items.length; i++) {
      if (that.data.order_items[i].is_locale == 0 || that.data.order_items[i].is_locale == 2) {
        order_items_show.push(that.data.order_items[i])
      }
    }
    that.setData({
      set_address: true,
      order_items_show: order_items_show,
      modal_pay_2: false,
      address_text: '快递发货'
    })
    that.ifCanPay()
    that.calTotal()
  },
  cancelAddress: function () {
    var that = this
    var order_items_show = []
    for (var i = 0; i < that.data.order_items.length; i++) {
      if (that.data.order_items[i].is_locale == 1 || that.data.order_items[i].is_locale == 2) {
        order_items_show.push(that.data.order_items[i])
      }
    }
    that.setData({
      set_address: false,
      order_items_show: order_items_show,
      modal_pay_2: false,
      address_text: '到店领取'
    })
    that.ifCanPay()
    that.calTotal()
  },

  calTotal: function () {
    var that = this
    var total_price = 0;
    var goods_num = 0;
    console.log('需要的order_items_show')
    console.log(that.data.order_items_show);
    for (var i = 0; i < that.data.order_items_show.length; i++) {
      goods_num += that.data.order_items_show[i].qty
      total_price += that.data.order_items_show[i].qty * that.data.order_items_show[i].real_price
    }
    that.setData({
      goods_num: goods_num,
      total_price: total_price
    })
    console.log(that.data.goods_num)
    console.log(that.data.total_price)

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
          var json_data = []
          var json_data_list = {}
          for (var i = 0; i < res.data.Data.Recharges.length; i++) {
            json_data_list.recharge_id = res.data.Data.Recharges[i].id
            json_data_list.rcorder_id = res.data.Data.Recharges[i].rcorder_id
            console.log(json_data_list)
            console.log(json_data)
            json_data.push(json_data_list)
          }
          var json_data_str = JSON.stringify(json_data)
          that.setData({
            packages_json: json_data_str
          })
          console.log('这里的packages_json:' + that.data.packages_json)
        }

      },
      fail: function (res) {
        console.log('提交GetPackages接口返回失败');
      }
    })
  },


  GetPackagesByItems: function (goodslist_json, member_id, store_id, vip_id) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/orderV2/GetPackagesByItems',
      data: {
        goodslist_json: goodslist_json,
        member_id: member_id,
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
        console.log('GetPackagesByItems开始')
        console.log(store_id);
        console.log(res)
        if (res.data.Data.IsError == false) {
          var goodslist = [];
          console.log(that.data.order_items)
          for (var i = 0; i < that.data.order_items.length; i++) {
            var goodslist_list = {};
            goodslist_list.id = that.data.order_items[i].goods_id
            goodslist_list.qty = that.data.order_items[i].qty
            goodslist_list.price = that.data.order_items[i].real_price
            goodslist_list.origin_price = that.data.order_items[i].origin_price
            goodslist.push(goodslist_list)
          }
          var goodslist_json = JSON.stringify(goodslist)

          // var packages_json = [];

          // for (var i = 0; i < res.data.Data.Recharges; i++) {
          //   var goodslist_list = {};
          //   packages_list.recharge_id = that.data.Recharges[i].id
          //   packages_list.rcorder_id = that.data.Recharges[i].rcorder_id

          //   packages_json.push(packages_list)
          // }
          // var packages_json = JSON.stringify(packages_json)
          // that.setData({
          //   packages_json: packages_json
          // })

          that.AppBDPay(that.data.total_price, 0, goodslist_json, that.data.packages_json, app.globalData.storeid, app.globalData.loginfo.data.Data.vip_id)

        }

      },
      fail: function (res) {
        console.log('提交GetPackagesByItems接口返回失败');
      }
    })
  },

  AppBDPay: function (amount_payable, discount_money, goodslist_json, packages_json, store_id, vip_id) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/orderV2/AppBDPay',
      data: {
        amount_payable: amount_payable,
        discount_money: discount_money,
        goodslist_json: goodslist_json,
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
        console.log('AppBDPay开始')
        console.log(res)
        var pays_json = [{
          pay_money: that.data.total_price,
          pay_id: 99,
          pay_name: '卡支付'
        }]
        pays_json = JSON.stringify(pays_json)
        if (res.data.Data.otherpay_money > 0 || res.data.Data.otherpay_money == 0) {
          that.CheckOrder_2(that.data.total_price, that.data.total_price, that.data.order_id, that.data.packages_json, pays_json)
        } else {
          wx.showToast({
            title: '余额不足，请选择其他支付方式',
          })
        }

      },
      fail: function (res) {
        console.log('提交AppBDPay接口返回失败');
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    // console.log('得到的options.order_id：' + options.order_id);

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
      order_id: app.globalData.order_confirm_order_id
    })

    that.GetOrderItemsByOrderID(that.data.order_id)
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
    console.log(12323)
    app.globalData.car_cho_if_address == ''
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