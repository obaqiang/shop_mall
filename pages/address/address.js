// pages/address/address.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    no_address: true,
    hidden: false
  },


  GetVipAddressList: function (open_id) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/SmallProgram/GetVipAddressList',
      data: {
        union_id: open_id,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'storeid': app.globalData.storeid,
        'token': app.globalData.token
      },

      success: function (res) {
        console.log('地址列表')
        console.log(res)
        that.setData({
          addressList: res.data.Data.addressList,
          hidden: true
        })
        if (res.data.Data.addressList.length == 0) {
          that.setData({
            no_address: true
          })
        } else {
          that.setData({
            no_address: false
          })
        }
        console.log(that.data.addressList);



      },
      fail: function (res) {
        console.log('提交GetVipAddressList接口返回失败');
      }
    })
  },

  DefaultAddress: function (id) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/SmallProgram/DefaultAddress',
      data: {
        id: id,

      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'storeid': app.globalData.storeid,
        'token': app.globalData.token
      },

      success: function (res) {
        console.log(res);
        if (res.data.Data.IsError == false) {
          that.setData({
            hidden: true
          })
        }

      },
      fail: function (res) {
        console.log('提交DefaultAddress接口返回失败');
      }
    })
  },
  DeleteVipAddress: function (id) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/SmallProgram/DeleteVipAddress',
      data: {
        id: id,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'storeid': app.globalData.storeid,
        'token': app.globalData.token
      },

      success: function (res) {
        console.log(res);
        if (res.data.Data.IsError == false) {
          that.setData({
            hidden: true
          })
        }
      },
      fail: function (res) {
        console.log('提交DeleteVipAddress接口返回失败');
      }
    })
  },


  newJump: function () {
    console.log(123213)
    wx.navigateTo({
      url: '../new_address/new_address'
    })
  },




  setDefault: function (e) {
    var that = this
    that.setData({
      hidden: false
    })
    console.log(e)
    var co_addressList = that.data.addressList
    for (var i = 0; i < co_addressList.length; i++) {
      if (e.currentTarget.dataset.id == co_addressList[i].id) {//设置默认
        if (co_addressList[i].defaultAddress == 0) {
          co_addressList[i].defaultAddress = 1
          console.log(1)
        }
        that.DefaultAddress(co_addressList[i].id)
      } else {
        co_addressList[i].defaultAddress = 0
        console.log(1)
      }
    }
    that.setData({
      addressList: co_addressList
    })



  },
  editAddr: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../edit_address/edit_address?id=' + e.currentTarget.dataset.id
    })
  },

  delAddr: function (e) {
    console.log(e)
    var that = this
    that.setData({
      hidden: false
    })
    var co_addressList = that.data.addressList
    that.DeleteVipAddress(e.currentTarget.dataset.id)
    for (var i = 0; i < co_addressList.length; i++) {
      if (e.currentTarget.dataset.id == co_addressList[i].id) {//设置默认
        co_addressList.splice(i,1)
      }
    }
    that.setData({
      addressList: co_addressList
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.GetVipAddressList(app.globalData.loginfo.data.Data.openid)
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