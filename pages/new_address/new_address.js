//index.js
//获取应用实例
var tcity = require("../../utils/city.js");

var app = getApp()
Page({
  data: {
    provinces: [],
    province: "",
    citys: [],
    city: "",
    countys: [],
    county: '',
    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    consignee: '',
    phone: '',
    street: '',
    save_status: false,
    hidden: false
  },

  SaveVipAddress: function (province, city, area, street, consignee, phone, open_id) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/SmallProgram/SaveVipAddress',
      data: {
        // "id": 0,
        province: province,
        city: city,
        area: area,
        street: street,
        consignee: consignee,
        phone: phone,
        // zipcode: zipcode,
        defaultAddress: 1,
        union_id: open_id,
        // disabled: disabled,
        // add_user: add_user,
        // add_time: add_time,
        // last_user: last_user,
        // last_time: last_time
      },
      method: 'POST',
      header: {
        'content-type': 'application/json',
        'storeid': app.globalData.storeid,
        'token': app.globalData.token
      },

      success: function (res) {
        console.log(res);
        console.log(province);
        console.log(city);
        console.log(area);
        console.log(street);
        console.log(consignee);
        console.log(phone);
        console.log(1);
        console.log(open_id);
        if (res.data.Data.IsError == false) {
          wx.showToast({
            title: '地址添加成功',
          })

          wx.navigateBack({
            url: '../address/address'
          })

        } else {
          wx.showToast({
            title: '保存地址失败，请退出重试',
          })
        }
      },
      fail: function (res) {
        console.log('提交SaveVipAddress接口返回失败');
        wx.showToast({
          title: '网络连接失败，请退出重试',
        })
      }
    })
  },

  addressSave: function () {
    var that = this

    console.log(that.data.province, that.data.city, that.data.county);

    if (that.data.consignee == '' || that.data.phone == "" || that.data.street == "") {
      wx.showToast({
        title: '信息填写不完善',
      })
      that.setData({
        save_status: false
      })
    } else {
      that.setData({
        save_status: true
      })
      console.log(app.globalData.loginfo.data.Data.openid)
      that.SaveVipAddress(that.data.province, that.data.city, that.data.county, that.data.street, that.data.consignee, that.data.phone, app.globalData.loginfo.data.Data.openid)


    }





  },


  btnStatus: function () {
    var that = this

    console.log(that.data.consignee)
    console.log(that.data.phone)
    console.log(that.data.street)
    if (that.data.consignee == '' || that.data.phone == "" || that.data.street == "") {
      that.setData({
        save_status: false
      })
    } else {
      that.setData({
        save_status: true
      })
    }

  },

  namePut: function (e) {
    console.log(e.detail.value)
    var that = this
    that.setData({
      consignee: e.detail.value
    })
    that.btnStatus();

  },

  telPut: function (e) {
    console.log(e.detail.value)
    var that = this
    var phone = e.detail.value;
    if (!(/^1[34578]\d{9}$/.test(phone))) {
      var errorMsg = '手机号码错误';
      wx.showToast({
        title: errorMsg,
        duration: 2000
      })
      that.setData({
        phone: ''
      })
    } else {
      that.setData({
        phone: e.detail.value
      })

    }

    that.btnStatus();
  },
  wayPut: function (e) {
    console.log(e.detail.value)
    var that = this
    that.setData({
      street: e.detail.value
    })
    that.btnStatus();
  },


  bindChange: function (e) {
    //console.log(e);
    var val = e.detail.value
    var t = this.data.values;
    var cityData = this.data.cityData;

    if (val[0] != t[0]) {
      console.log('province no ');
      const citys = [];
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub.length; i++) {
        citys.push(cityData[val[0]].sub[i].name)
      }
      for (let i = 0; i < cityData[val[0]].sub[0].sub.length; i++) {
        countys.push(cityData[val[0]].sub[0].sub[i].name)
      }

      this.setData({
        province: this.data.provinces[val[0]],
        city: cityData[val[0]].sub[0].name,
        citys: citys,
        county: cityData[val[0]].sub[0].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], 0, 0]
      })

      return;
    }
    if (val[1] != t[1]) {
      console.log('city no');
      const countys = [];

      for (let i = 0; i < cityData[val[0]].sub[val[1]].sub.length; i++) {
        countys.push(cityData[val[0]].sub[val[1]].sub[i].name)
      }

      this.setData({
        city: this.data.citys[val[1]],
        county: cityData[val[0]].sub[val[1]].sub[0].name,
        countys: countys,
        values: val,
        value: [val[0], val[1], 0]
      })
      return;
    }
    if (val[2] != t[2]) {
      console.log('county no');
      this.setData({
        county: this.data.countys[val[2]],
        values: val
      })
      return;
    }


  },
  open: function () {
    
    this.setData({
      condition: !this.data.condition
    })
    return;
  },
  onLoad: function () {
    console.log("onLoad");
    var that = this;

    tcity.init(that);

    var cityData = that.data.cityData;


    const provinces = [];
    const citys = [];
    const countys = [];

    for (let i = 0; i < cityData.length; i++) {
      provinces.push(cityData[i].name);
    }
    console.log('省份完成');
    for (let i = 0; i < cityData[0].sub.length; i++) {
      citys.push(cityData[0].sub[i].name)
    }
    console.log('city完成');
    for (let i = 0; i < cityData[0].sub[0].sub.length; i++) {
      countys.push(cityData[0].sub[0].sub[i].name)
    }

    that.setData({
      provinces: provinces,
      citys: citys,
      countys: countys,
      province: cityData[0].name,
      city: cityData[0].sub[0].name,
      county: cityData[0].sub[0].sub[0].name,
      hidden: true
    })
    console.log('初始化完成');


  }
})
