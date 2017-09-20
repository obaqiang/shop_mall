// pages/index_home/index_home.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false,
    hascard: '',//用户是否领卡
    hasgetcard: '',//用户是否激活
    goodsdata: ''
  },

  goBuy: function () {
    
    wx.switchTab({
      url: '../shop_city/shop_city'
    })
  },

  getCardact: function () {//领取会员卡跳转
    var that = this
    if (app.globalData.loginfo.data.Data.HasCard == false && app.globalData.loginfo.data.Data.HasGetCard == false) {
      wx.navigateTo({
        url: '../card_act/card_act'
      })
    } else if (app.globalData.loginfo.data.Data.HasCard == true && app.globalData.loginfo.data.Data.HasGetCard == true) {
      wx.navigateTo({
        url: '../card_detail/card_detail'
      })
    }

  },
  deJump: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../goods_detail/goods_detail?goods_id=' + e.currentTarget.dataset.goods_id
    })
  },

  GetHotGoods: function () {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/SmallProgram/GetHotGoods',
      data: {
        store_id: app.globalData.storeid,

      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },

      success: function (res) {
        console.log('GetGoods接口开始');
        console.log(res);
        var goodsdata = res.data.Data.GoodsList
        for (var i = 0; i < goodsdata.length; i++) {
          goodsdata[i].goods_name = util.cutstr(goodsdata[i].goods_name, 65)
        }
        that.setData({
          goodsdata: goodsdata,
          hidden: true
        })

      },
      fail: function (res) {
        console.log('提交GetAllGoods接口返回失败');
        wx.showToast({
          title: '网络连接失败，请退出重试',
        })
      }
    })
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

        console.log(res);

        wx.setNavigationBarTitle({
          title: res.data.Data.Store.store_name
        })
      },
      fail: function (res) {
        // console.log('提交GetOrderItemsByOrderID接口返回失败');
      }
    })
  },

  plusGoods: function (e) {//加入购物车
    var that = this
    console.log(e)
    var goods_cho = app.globalData.goods_cho_all;
    var goods_list = {}
    goods_list.goods_price = e.currentTarget.dataset.goods_price;
    goods_list.goods_name = e.currentTarget.dataset.goods_name;
    goods_list.goods_desc = e.currentTarget.dataset.goods_desc;
    goods_list.imgUrls = e.currentTarget.dataset.imgurls;
    goods_list.goods_id = e.currentTarget.dataset.goods_id;
    goods_list.is_locale = e.currentTarget.dataset.is_locale


    if (goods_cho.length == 0) {
      var num = 1
      goods_list.goods_num = num;
      console.log(1)
      goods_cho.push(goods_list);
    } else {
      console.log(2)
      console.log(goods_list)
      console.log('lala');
      var if_has_this_goods;

      for (var i = 0; i < goods_cho.length; i++) {

        if (goods_list.goods_id == goods_cho[i].goods_id) {//如果此商品已经存在则增加数量
          console.log('此商品已经存在')
          if_has_this_goods = true
          console.log(goods_list.goods_id)
          var num = goods_cho[i].goods_num;
          num += 1;
          goods_cho[i].goods_num = num;

        }
      }
      if (if_has_this_goods != true) {
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
      goods_num: num,
    })
    wx.showToast({
      title: '添加成功',
      duration: 500
    })
    console.log(app.globalData.goods_cho_all)
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
    var that = this;
    
    app.getUserInfo(function (userInfo) {

      console.log(userInfo)
      //更新数据
      // that.setData({
      //   userInfo: userInfo,

      // })

      wx.login({
        success: function (res) {
          console.log(res);
          if (res.code) {
            //发起网络请求
            var co_nickname = app.globalData.userInfo.nickName


            console.log(util.tounicode(co_nickname))
            wx.request({
              url: app.globalData.bd_url + '/api/WxSP/CheckUserHasCard',
              data: {
                code: res.code,
                storeid: app.globalData.storeid,
                nickname: app.globalData.userInfo.nickName,
                sex: app.globalData.userInfo.gender,

              },
              header: {
                'content-type': 'application/json',

              },
              success: function (loginfo) {
                console.log('获取openid接口');
                console.log(loginfo);
                app.globalData.loginfo = loginfo;
                app.globalData.token = loginfo.data.Data.bdtoken;
                console.log(app.globalData.token)
                that.setData({
                  hidden: true
                })
                that.GetStoreInfo(app.globalData.storeid)
                that.GetHotGoods()
              },
              fail: function (res) {
                console.log('获取openid接口请求失败');
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
            wx.showToast({
              title: '网络连接失败，请退出重试',
            })
          }
        }
      });

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