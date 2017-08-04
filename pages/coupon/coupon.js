// pages/index_coupon/index_coupon.js
var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    store_id: '',
    vip_id: '',
    type: 1,
    page_num: 1,
    page_size: 10,
    hidden: false,
    scrollTop: 0,
    scrollHeight: 0,
    Tickets: [],
    titleshow: '',
    type_img: ''

  },


  GetVipTickets: function (store_id, vip_id, type, page_num, page_size, token) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/ticket/GetVipTickets',
      data: {
        store_id: store_id,
        vip_id: vip_id,
        type: type,
        page_num: page_num,
        page_size: page_size,
      },
      header: {
        'content-type': 'application/json',
        'token': token
      },
      success: function (res) {
        console.log(store_id);
        console.log(vip_id)
        console.log(type)
        console.log(vip_id)
        console.log(page_num)
        console.log(page_size)
        console.log(res.data);
        if (res.data.Data.Tickets == '') {
          wx.showToast({
            title: '暂无数据',
            icon: 'success',
            duration: 1200
          })
        }
        var type_img;
        if (type == '1') {
          that.setData({
            type_img: '../../img/180px_180px_1.png'
          });
        } else if (type == '2') {
          that.setData({
            type_img: '../../img/180px_180px_2.png'
          });
        } else if (type == '3') {
          that.setData({
            type_img: '../../img/180px_180px_3.png'
          });
        }
        for (var i = 0; i < res.data.Data.Tickets.length - 1; i++) {//时间戳转时间
          var begin_time = res.data.Data.Tickets[i].begin_time;
          begin_time = util.userDate(begin_time);
          res.data.Data.Tickets[i].begin_time = begin_time;
          var end_time = res.data.Data.Tickets[i].end_time;
          end_time = util.userDate(end_time);
          res.data.Data.Tickets[i].end_time = end_time;
        }
        if (page_num == 1) {
          that.setData({
            Tickets: res.data.Data.Tickets,
            hidden: true
          });
        } else if (page_num > 1) {

          var Tickets = that.data.Tickets;
          for (var i = 0; i < res.data.Data.Tickets.length; i++) {

            Tickets.push(res.data.Data.Tickets[i]);
          }
          var need_scrollTop = that.data.scrollTop;
          that.setData({
            Tickets: Tickets,
            hidden: true,
            scrollTop: need_scrollTop
          });
        }




      }
    })
  },

  // couJump: function (event) {//优惠券页面跳转
  //   console.log(event);
  //   var ticket_id = event.currentTarget.dataset.ticket_id;
  //   wx.navigateTo({
  //     url: '../index_coupon_detail/index_coupon_detail?ticket_id=' + ticket_id
  //   })
  // },


  reFresh: function () {
    var that = this;

    that.setData({
      scrollTop: 0,
      hidden: false,
      Tickets: '',
      page_num: 1
    });
    that.GetVipTickets(app.globalData.storeid, app.globalData.loginfo.data.Data.vip_id, that.data.type, that.data.page_num, that.data.page_size, app.globalData.token)
    console.log('下拉刷新');
  },
  scroll: function (event) {
    //   该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    // console.log(event.detail.scrollTop);
    // this.setData({
    //   scrollTop: event.detail.scrollTop
    // });
  },
  loadMore: function (event) {
    var that = this;
    that.data.page_num++;
    that.GetVipTickets(app.globalData.storeid, app.globalData.loginfo.data.Data.vip_id, that.data.type, that.data.page_num, that.data.page_size, app.globalData.token)
    that.setData({
      hidden: false,
      page_num: that.data.page_num,
      scrollTop: event.detail.scrollTop,

    });
    console.log('加载更多');
  },

  oneTap: function () {
    var that = this
    that.setData({
      type: 1,
      page_num: 1,
      titleshow: 'one',
      hidden: false
    });
    that.GetVipTickets(app.globalData.storeid, app.globalData.loginfo.data.Data.vip_id, that.data.type, that.data.page_num, that.data.page_size, app.globalData.token)
  },
  twoTap: function () {
    var that = this
    that.setData({
      type: 2,
      page_num: 1,
      titleshow: 'two',
      hidden: false
    });
    that.GetVipTickets(app.globalData.storeid, app.globalData.loginfo.data.Data.vip_id, that.data.type, that.data.page_num, that.data.page_size, app.globalData.token)
  },
  threeTap: function () {
    var that = this
    that.setData({
      type: 3,
      page_num: 1,
      titleshow: 'three',
      hidden: false
    });
    that.GetVipTickets(app.globalData.storeid, app.globalData.loginfo.data.Data.vip_id, that.data.type, that.data.page_num, that.data.page_size, app.globalData.token)
  },

  onLoad: function (options) {
    var that = this;
    // 页面初始化 options为页面跳转所带来的参数
    that.GetVipTickets(app.globalData.storeid, app.globalData.loginfo.data.Data.vip_id, that.data.type, that.data.page_num, that.data.page_size, app.globalData.token)

    wx.getSystemInfo({
      success: function (res) {

        // console.info(res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight,
          store_id: options.store_id,
          vip_id: options.vip_id
        });
      }
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})