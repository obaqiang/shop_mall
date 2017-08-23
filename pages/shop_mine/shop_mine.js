// pages/shop_mine/shop_mine.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hascard: '',//用户是否领卡
    hasgetcard: '',//用户是否激活
    getvipinfo_data: '',
    cardcode: '',
    hidden: '',
    balance_money: '',
    point: ''
  },

  GetVipDimInfo_SmallProgram: function (member_id, store_id) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/Member/GetVipDimInfo_SmallProgram',
      data: {
        member_id: member_id,
        store_id: store_id
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        that.setData({
          balance_money: res.data.Data.Vip.balance_money,
          point: res.data.Data.Vip.point
        })

      },
      fail: function (res) {
        console.log('获取GetVipDimInfo_SmallProgram接口请求失败');
      }
    })
  },


  getvipinfo: function (vip_id) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/member/getvipinfo',
      data: {
        vip_id: vip_id,
       
      },
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },
      success: function (res) {
        console.log('getvipinfo接口开始');
        
        console.log(res);
        that.setData({
          getvipinfo_data: res.data.Data,
          hidden: true
        })
        app.globalData.getvipinfo_data = res.data.Data
      },
      fail: function (res) {
        console.log('获取getvipinfo接口请求失败');
      }
    })
  },

  seeOrderJump: function (e) {
    console.log(e)
    var status = e.currentTarget.dataset.status
    wx.navigateTo({
      url: '../my_order/my_order?status=' + status
    })
  },

  seeCard: function () {
    wx.navigateTo({
      url: '../card_detail/card_detail'
    })
  },

  GetQrCode: function (storeid, openid, unionid) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/WxSP/GetQrCode',
      data: {
        storeid: storeid,
        openid: openid,
        unionid: unionid
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('条形码接口开始')
        console.log(res);
        that.setData({
          cardcode: res.data.Data.codedata
        })


      },
      fail: function (res) {
        console.log('获取条形码接口请求失败');
      }
    })
  },



  getCardact: function () {//领取会员卡跳转
    var that = this

    console.log(app.globalData.loginfo)
    // that.GetCard(app.globalData.storeid, app.globalData.loginfo.data.Data.openid)

    wx.navigateTo({
      url: '../card_act/card_act'
    })
  },

  couponJump: function () {
    wx.navigateTo({
      url: '../coupon/coupon'
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
    if (app.globalData.loginfo != '') {
      var that = this
      that.setData({
        hascard: app.globalData.loginfo.data.Data.HasCard,
        hasgetcard: app.globalData.loginfo.data.Data.HasGetCard,
      })
      that.getvipinfo(app.globalData.loginfo.data.Data.vip_id);
      that.GetQrCode(app.globalData.storeid, app.globalData.loginfo.data.Data.openid, app.globalData.loginfo.data.Data.unionid)
      that.GetVipDimInfo_SmallProgram(0, app.globalData.loginfo.data.Data.vip_id);
    } else {
      wx.showToast({
        title: '页面加载中，请稍等',
      })
    }
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