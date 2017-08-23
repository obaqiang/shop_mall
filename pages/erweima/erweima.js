var wxbarcode = require('../../utils/index.js');
var app = getApp();
var util = require('../../utils/util.js');

Page({

  data: {
    code: '',
    getvipinfo_data: ''
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
          code: res.data.Data.codedata
        })
        wxbarcode.barcode('barcode', res.data.Data.codedata, 680, 200);

      },
      fail: function (res) {
        console.log('获取条形码接口请求失败');
      }
    })
  },

  onLoad: function () {

    wxbarcode.qrcode('qrcode', '1234567890123456789', 420, 420);
    wxbarcode.qrcode('barcode', '1234567890123456789', 420, 420);
    var that = this

    // that.GetQrCode(app.globalData.storeid, app.globalData.loginfo.data.Data.openid, app.globalData.loginfo.data.Data.unionid)

    // that.setData({
    //   getvipinfo_data: app.globalData.getvipinfo_data
    // })
  }
})
