// pages/goods_detail/goods_detail.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    goods_price: '',
    goods_name: '',
    goods_desc: '',
    goods_id: '',
    goods_num: 0,
    goods_array: [],
    total_money: '',
    if_has_goods:false,
    sell_goods:'',
    goods_integral:''
  },

  carJump: function () {

    wx.switchTab({
      url: '../shop_car/shop_car'
    })
  },


  GetGoodsInfo: function (goods_id) {

    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/SmallProgram/GetGoodsInfo',
      data: {
        goods_id: goods_id,
        token: app.globalData.token
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      success: function (res) {
        console.log('GetGoodsInfo接口开始')
        console.log(res);
        var GoodsImgList = res.data.Data.GoodsImgList;
        var img_array = [];
        for (var i = 0; i < GoodsImgList.length; i++) {
          var img_url = GoodsImgList[i].img_url;
          img_array.push(img_url);

        }

        that.setData({
          imgUrls: img_array,
          goods_price: res.data.Data.Goods.goods_price,
          goods_name: res.data.Data.Goods.goods_name,
          goods_desc: res.data.Data.Goods.goods_desc,
          is_locale: res.data.Data.Goods.is_locale,
          sell_goods: res.data.Data.Goods.sell_goods,
          goods_integral: res.data.Data.Goods.goods_integral
        })

      },
      fail: function (res) {
        console.log('提交GetGoodsInfo接口返回失败');
      }
    })
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

        console.log(res);

        if (res.data.Data.IsError == false) {
          // var total_price = that.data.goods_num * that.data.goods_price
          console.log('这里需要的order_id:' + res.data.Data.OrderID)
          wx.navigateTo({
            url: '../order_confirm/order_confirm?order_id=' + res.data.Data.OrderID
          })
        }
        // wx.navigateTo({
        //   url: '../order_detail/order_detail?order_id=' + res.data.Data.OrderID + '&amount_payed=' + amount_payed + '&total_amount=' + total_amount
        // })

      },
      fail: function (res) {
        console.log('提交订单接口返回失败');
      }
    })
  },


  plusGoods: function () {//加入购物车
    var that = this
    var goods_cho = app.globalData.goods_cho_all;
    var goods_list = {}
    goods_list.goods_price = that.data.goods_price;
    goods_list.goods_name = that.data.goods_name;
    goods_list.goods_desc = that.data.goods_desc;
    goods_list.imgUrls = that.data.imgUrls;
    goods_list.goods_id = that.data.goods_id;
    goods_list.is_locale = that.data.is_locale


    if (goods_cho.length == 0) {
      var num = 1
      goods_list.goods_num = num;
      console.log(1)
      goods_cho.push(goods_list);
    } else {
      console.log(2)
      console.log(goods_list)

      for (var i = 0; i < goods_cho.length; i++) {
        if (goods_list.goods_id == goods_cho[i].goods_id) {//如果此商品已经存在则增加数量
          console.log('此商品已经存在')

          that.setData({
            if_has_goods:true
          })
          console.log(goods_list.goods_id)
          var num = goods_cho[i].goods_num;
          num += 1;
          goods_cho[i].goods_num = num;

        }
      }
      if (that.data.if_has_goods == false) {
        console.log('此商品不存在');
        var num = 1     
        goods_list.goods_num = num;
        goods_cho.push(goods_list);
      }
    }

    app.globalData.goods_cho_all = goods_cho
    console.log('这里')
    console.log(app.globalData.goods_cho_all)
    that.setData({
      goods_num: num
    })
    wx.showToast({
      title: '添加成功',
    })
  },


  buyJump: function () {
    var that = this

    if (that.data.goods_num == 0) {
      that.setData({
        goods_num: 1
      })
    }
    var total_money = that.data.goods_price * that.data.goods_num
    that.setData({
      total_money: total_money
    })
    var items_json = []
    var items = {
      goods_id: that.data.goods_id,
      order_id: '',
      price: that.data.goods_price,
      qty: that.data.goods_num
    }
    items_json.push(items);

    items_json = JSON.stringify(items_json);

    that.CreateOrder('', app.globalData.storeid, app.globalData.loginfo.data.Data.vip_id, '', that.data.total_money, that.data.total_money, that.data.total_money, 0, '111', '', items_json)

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log('得到的:' + options.goods_id)
    var that = this
    that.setData({
      goods_id: options.goods_id
    })
    that.GetGoodsInfo(options.goods_id);
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