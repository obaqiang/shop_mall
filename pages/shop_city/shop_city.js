// pages/shop_city/shop_city.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    classlistdata: '',
    goodsdata: '',
    modal_status: true,
    or_num: 0,
    goods_show_first: true,
    order_pick: [],
    total_money: 0,
    hidden: false,
    choose_id: ''
  },

  GetGoods: function (GoodsName) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/SmallProgram/GetGoods',
      data: {
        store_id: app.globalData.storeid,
        class_id: 0,
        GoodsName: GoodsName,
        PageIndex: 1,
        PageSize: 1000,
        isSearchGoodsByUid: 1,
        token: app.globalData.token
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },

      success: function (res) {
        console.log(res);


      },
      fail: function (res) {
        console.log('提交GetAllGoods接口返回失败');
      }
    })
  },




  GetAllGoods: function (storeid) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/Goods/GetAllGoods',
      data: {
        // orderid: orderid,
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'storeid': app.globalData.storeid,
        'token': app.globalData.token
      },

      success: function (res) {
        console.log(res);
        var classlistArray = []
        var goodsArray = []
        for (var i = 0; i < res.data.Data.ClassList.length; i++) {
          var classlist = {}
          classlist.class_name = res.data.Data.ClassList[i].class_name
          classlist.id = res.data.Data.ClassList[i].id
          classlistArray.push(classlist)


          for (var j = 0; j < res.data.Data.ClassList[i].GoodsList.length; j++) {
            res.data.Data.ClassList[i].GoodsList[j].num = 0
            goodsArray.push(res.data.Data.ClassList[i].GoodsList[j])
          }
        }
        // console.log(1)
        // console.log(classlistArray);
        // console.log(goodsArray)
        that.setData({
          classlistdata: classlistArray,
          goodsdata: goodsArray,
          choose_id: res.data.Data.ClassList[0].id,
          hidden: true
        })

      },
      fail: function (res) {
        console.log('提交GetAllGoods接口返回失败');
      }
    })
  },



  searchGoods: function (e) {
    console.log(e)
    var that = this
    var GoodsName = e.detail.value
    that.GetGoods(GoodsName)
  },


  deJump: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../goods_detail/goods_detail?goods_id=' + e.currentTarget.dataset.goods_id
    })
  },


  classCho: function (e) {//选择商品类别
    var that = this;
    console.log(e);
    var classid = e.currentTarget.dataset.classid;
    that.setData({
      choose_id: classid
    });

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
    console.log(11111)
    var that = this
    if (app.globalData.loginfo != '') {
      that.GetAllGoods(app.globalData.storeid);
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