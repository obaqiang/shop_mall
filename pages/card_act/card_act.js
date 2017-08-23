// pages/card_act/card_act.js
var app = getApp();
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    isver: true,//控制验证码按钮状态
    vertext: '验证码',
    nums: 60,//验证码时间,
    smscode: '',
    username: '',
    pwd: '',
    pwdmore: ''
  },


  doLoop: function () {
    var that = this
    that.data.nums--;
    if (that.data.nums > 0) {
      var text = that.data.nums + '秒后可重新获取';
      that.setData({
        vertext: text
      })

    } else {
      clearInterval(that.data.clock); //清除js定时器

      var text = '验证码';
      that.setData({
        vertext: text,
        isver: true,
        nums: 60//重置时间
      })

    }
  },


  VerCodeReg: function (phone) {//短信验证码
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/member/VerCodeReg',
      data: {
        phone: phone,
        VerifyCodeType: 1
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        if (res.data.Data.IsError == false) {
          

          var clock = setInterval(that.doLoop, 1000); //一秒执行一次
          that.setData({
            clock: clock
          })
        } else {
          wx.showToast({
            title: '获取短信验证码失败，请重试',
          })
        }
      },
      fail: function (res) {
        console.log('获取短信验证码接口请求失败');
        wx.showToast({
          title: '网络连接失败，请退出重试',
        })
      }
    })
  },

  btnVer: function () {//发送短信验证码按钮
    var that = this
    if (that.data.phone == '') {
      var errorMsg = '请填写手机号';
      wx.showToast({
        title: errorMsg,
        icon: 'success',
        duration: 2000
      })
    } else {
      that.setData({
        // getvipinfo_data: res.data.Data,
        isver: false
      })
      that.VerCodeReg(that.data.phone)
    }
  },

  inPhone: function (e) {
    console.log(e);
    var that = this;
    var phone = e.detail.value;
    console.log('需要的号码：' + phone);
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      var errorMsg = '手机号码错误';
      wx.showToast({
        title: errorMsg,
        duration: 2000
      })
    } else {
      that.setData({
        phone: e.detail.value
      })

    }
  },

  inVer: function (e) {
    var that = this;
    that.setData({
      smscode: e.detail.value
    })
  },

  inName: function (e) {
    var that = this;
    that.setData({
      username: e.detail.value
    })
  },
  inPwd: function (e) {
    var that = this;
    that.setData({
      pwd: e.detail.value
    })
  },
  inPwdmore: function (e) {
    // console.log(2222);
    var that = this;
    that.setData({
      pwdmore: e.detail.value
    })
  },


  ActiveCard: function (storeid, openid, phone, username, pwd, smscode, unionid) {//激活接口
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/WxSP/ActiveCard',
      data: {
        storeid: storeid,
        openid: openid,
        phone: phone,
        username: username,
        pwd: pwd,
        smscode: smscode,
        unionid: unionid
      },
      dataType: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        console.log('激活接口请求开始');
        console.log('openid:' + openid);
        console.log('unionid:' + unionid)
        console.log(res);
        var obj = JSON.parse(res.data);;
        console.log(obj)
        if (obj.Data.IsError == false) {
          wx.showToast({
            title: '激活成功',
          })
          app.globalData.loginfo.data.Data.memberid = res.data.Data.member_id
          app.globalData.loginfo.data.Data.HasCard = true
          app.globalData.loginfo.data.Data.HasGetCard = true
          app.globalData.see_card_status = true
          wx.switchTab({
            url: '../shop_mine/shop_mine'
          })
        } else {
          var ErrorMessage = obj.Data.ErrorMessage
          wx.showToast({
            title: ErrorMessage,
          })
        }
      },
      fail: function (res) {
        console.log(app.globalData.bd_url + 'api/WxSP/ActiveCard' + '?storeid=' + storeid + '&openid=' + openid + '&phone=' + phone + '&username=' + username + '&pwd=' + pwd + '&smscode=' + smscode);
        console.log(storeid);
        console.log(openid);
        console.log(phone);
        console.log(username);
        console.log(pwd);
        console.log(smscode);
        console.log('获取激活接口请求失败');
      }
    })
  },


  btnAct: function () {
    var that = this
    if (!(/^1[34578]\d{9}$/.test(that.data.phone))) {
      var errorMsg = '手机号码错误';
      wx.showToast({
        title: errorMsg,
        duration: 2000
      })
    } else if (that.data.smscode == '') {
      var errorMsg = '验证码不能为空';
      wx.showToast({
        title: errorMsg,
        duration: 2000
      })
    } else if (that.data.username == '') {
      var errorMsg = '用户名不能为空';
      wx.showToast({
        title: errorMsg,
        duration: 2000
      })
    } else if (that.data.pwd == '') {
      var errorMsg = '密码不能为空';
      wx.showToast({
        title: errorMsg,
        duration: 2000
      })
    } else if (that.data.pwd == '') {
      var errorMsg = '请再次输入密码';
      wx.showToast({
        title: errorMsg,
        duration: 2000
      })
    } else if (that.data.pwd != that.data.pwdmore) {
      console.log(that.data.pwd);
      console.log(that.data.pwdmore);
      var errorMsg = '两次输入密码不一致';
      wx.showToast({
        title: errorMsg,
        duration: 2000
      })
    } else {
      that.ActiveCard(app.globalData.storeid, app.globalData.loginfo.data.Data.openid, that.data.phone, that.data.username, that.data.pwd, that.data.smscode, app.globalData.loginfo.data.Data.unionid);
    }
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(app.globalData.loginfo);
    console.log(app.globalData.loginfo.data.Data.HasCard)
    console.log(app.globalData.loginfo.data.Data.HasGetCard);
    if (app.globalData.loginfo.data.Data.HasCard == true && app.globalData.loginfo.data.Data.HasGetCard == true) {//如果用户已经开好卡，则跳回页面

      wx.switchTab({
        url: '../order_home/order_home'
      })
    }

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

    if (app.globalData.loginfo.data.Data.HasCard == true && app.globalData.loginfo.data.Data.HasGetCard == true) {//如果用户已经开好卡，则跳回页面

      wx.switchTab({
        url: '../order_home/order_home'
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