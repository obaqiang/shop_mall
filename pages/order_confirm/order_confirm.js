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
    goods_desc: '',
    goods_id: '',
    goods_img: '',
    total_price: '',
    ok_buy: false,
    modal_pay: false,
    weixin_pay: true,
    user_name: '',
    user_tel: '',
    order_id: '',
    receive_id: ''
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
            receive_id: res.data.Data.Address.receive_id,
            province: res.data.Data.Address.province,
            city: res.data.Data.Address.city,
            area: res.data.Data.Address.area,
            street: res.data.Data.Address.street,
            user_name: res.data.Data.Address.consignee,
            user_tel: res.data.Data.Address.phone,
            no_address:false
          })
        }




      },
      fail: function (res) {
        console.log('提交GetAllGoods接口返回失败');
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
        }

      },
      fail: function (res) {
        console.log('提交CheckOrder接口返回失败');
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
    that.CreateWeixinOrder(app.globalData.storeid, that.data.order_id, app.globalData.loginfo.data.Data.openid)
    
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      goods_price: options.goods_price,
      goods_name: options.goods_name,
      goods_desc: options.goods_desc,
      goods_id: options.goods_id,
      goods_img: options.goods_img,
      goods_num: options.goods_num,
      order_id: options.order_id,
      total_price: options.total_price
    })

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