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
    choose_id: '',

  },

  GetGoods: function (GoodsName, class_id) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/SmallProgram/GetGoods',
      data: {
        store_id: app.globalData.storeid,
        class_id: class_id,
        GoodsName: GoodsName,
        PageIndex: 1,
        PageSize: 1000,
        isSearchGoodsByUid: 1,
        type: 1
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
          goodsdata[i].goods_name = util.cutstr(goodsdata[i].goods_name, 35)
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

  GetClassList: function () {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/Goods/GetClassList',
      data: {

      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
        'token': app.globalData.token
      },

      success: function (res) {
        console.log('GetClassList接口开始');
        console.log(res);
        that.GetGoods('', res.data.Data.ClassList[0].id)
        var classlistArray = []
        for (var i = 0; i < res.data.Data.ClassList.length; i++) {
          var classlist = {}
          classlist.class_name = res.data.Data.ClassList[i].class_name
          classlist.id = res.data.Data.ClassList[i].id
          if (i == 0) {
            classlist.first_show = true
          }
          classlistArray.push(classlist)
        }
        that.setData({
          classlistdata: classlistArray
        })

      },
      fail: function (res) {
        wx.showToast({
          title: '网络连接失败，请退出重试',
        })
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


  // GetAllGoods: function (storeid) {
  //   var that = this;
  //   wx.request({
  //     url: app.globalData.bd_url + '/api/Goods/GetAllGoods',
  //     data: {
  //       // orderid: orderid,
  //     },
  //     method: 'GET',
  //     header: {
  //       'content-type': 'application/json',
  //       'storeid': app.globalData.storeid,
  //       'token': app.globalData.token
  //     },

  //     success: function (res) {
  //       console.log(111)
  //       console.log('GetAllGoods接口开始')
  //       console.log(res);
  //       var classlistArray = []
  //       var goodsArray = []
  //       for (var i = 0; i < res.data.Data.ClassList.length; i++) {
  //         var classlist = {}
  //         classlist.class_name = res.data.Data.ClassList[i].class_name
  //         classlist.id = res.data.Data.ClassList[i].id
  //         classlistArray.push(classlist)


  //         for (var j = 0; j < res.data.Data.ClassList[i].GoodsList.length; j++) {
  //           res.data.Data.ClassList[i].GoodsList[j].num = 0
  //           goodsArray.push(res.data.Data.ClassList[i].GoodsList[j])
  //         }
  //       }
  //       // console.log(1)
  //       // console.log(classlistArray);
  //       // console.log(goodsArray)
  //       that.setData({
  //         classlistdata: classlistArray,
  //         goodsdata: goodsArray,
  //         choose_id: res.data.Data.ClassList[0].id,
  //         hidden: true
  //       })

  //     },
  //     fail: function (res) {
  //       console.log('提交GetAllGoods接口返回失败');
  //     }
  //   })
  // },



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
    var classlistdata = that.data.classlistdata

    for (var i = 0; i < classlistdata.length; i++) {
      if (classlistdata[i].id == classid) {
        classlistdata[i].first_show = true
      } else {
        classlistdata[i].first_show = false
      }
    }

    that.setData({
      hidden: false,

      classlistdata: classlistdata
    })
    that.GetGoods('', classid)
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
    if (app.globalData.loginfo != '') {
      // that.GetAllGoods(app.globalData.storeid);
      that.setData({
        classlistdata: ''
      })
      that.GetClassList()
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