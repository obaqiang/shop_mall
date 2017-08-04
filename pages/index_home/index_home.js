// pages/index_home/index_home.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hidden: false
  },

  goBuy: function () {
    wx.switchTab({
      url: '../shop_city/shop_city'
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
              },
              fail: function (res) {
                console.log('获取openid接口请求失败');
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      });

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