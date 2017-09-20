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
    id: '',
    hidden: false,
    provinces_data: [],
    provinces_data_areaname: [],
    provinces_index: '',
    provinces_data_num_sel: '',
    areas_data: [],
    areas_data_areaname: [],
    areas_index: '',
    areas_data_num_sel: '',
    citys_data: [],
    citys_data_areaname: [],
    citys_index: '',
    citys_data_num_sel: '',
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var that = this
    this.setData({
      provinces_index: e.detail.value
    })

    var provinces_data_num_sel = that.data.provinces_data[e.detail.value].areano
    that.setData({
      provinces_data_num_sel: provinces_data_num_sel
    })
    that.GetCityListByProvinceArea(that.data.provinces_data_num_sel)
  },
  bindPickerChange_2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var that = this
    this.setData({
      areas_index: e.detail.value
    })
    console.log(that.data.areas_data)
    var areas_data_num_sel = that.data.areas_data[e.detail.value].areano
    that.setData({
      areas_data_num_sel: areas_data_num_sel
    })
    that.GetCountyByProvinceCity(areas_data_num_sel)
  },
  bindPickerChange_3: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var that = this
    this.setData({
      citys_index: e.detail.value
    })

    var citys_data_num_sel = that.data.citys_data[e.detail.value].areano
    that.setData({
      citys_data_num_sel: citys_data_num_sel
    })

  },

  SaveVipAddress: function (province, city, area, street, consignee, phone, open_id, id) {
    var that = this;
    wx.request({
      url: app.globalData.bd_url + '/api/SmallProgram/SaveVipAddress',
      data: {
        id: id,
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
        if (res.data.Data.IsError == false) {
          wx.showToast({
            title: '地址添加成功',
          })
          wx.navigateTo({
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

  GetVipAddressList: function (open_id, id) {
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
        console.log(res)
        if (res.data.Data.IsError == false) {
          for (var i = 0; i < res.data.Data.addressList.length; i++) {
            if (id == res.data.Data.addressList[i].id) {
              that.setData({
                id: id,
                consignee: res.data.Data.addressList[i].consignee,
                phone: res.data.Data.addressList[i].phone,
                province: res.data.Data.addressList[i].province,
                city: res.data.Data.addressList[i].city,
                county: res.data.Data.addressList[i].area,
                street: res.data.Data.addressList[i].street,
                hidden: true

              })
            }
          }
        } else {
          wx.showToast({
            title: '获取地址列表失败，请退出重试',
          })
        }


      },
      fail: function (res) {
        console.log('提交GetVipAddressList接口返回失败');
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
      that.SaveVipAddress(that.data.province, that.data.city, that.data.county, that.data.street, that.data.consignee, that.data.phone, app.globalData.loginfo.data.Data.openid, that.data.id)


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
  },

  GetProvinceList: function () {//获取省份 
    var that = this
    wx.request({
      url: app.globalData.bd_url + '/api/Discount/GetProvinceList',
      data: {

      },
      method: 'GET',
      header: {
        'content-type': 'application/json',

      },

      success: function (res) {
        console.log(res);

        that.setData({
          provinces_data: res.data.Data
        })
        var provinces_data_areaname = []
        for (var i = 0; i < that.data.provinces_data.length; i++) {
          provinces_data_areaname.push(that.data.provinces_data[i].areaname)

        }
        that.setData({
          provinces_data_areaname: provinces_data_areaname
        })

      },
      fail: function (res) {
        console.log('提交GetProvinceList接口返回失败');
        wx.showToast({
          title: '网络连接失败，请退出重试',
        })
      }
    })
  },
  GetCityListByProvinceArea: function (province) {//获取市
    var that = this
    wx.request({
      url: app.globalData.bd_url + '/api/Discount/GetCityListByProvinceArea',
      data: {
        province: province
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',

      },

      success: function (res) {
        console.log(res);

        that.setData({
          areas_data: res.data.Data
        })
        var areas_data_areaname = []
        for (var i = 0; i < that.data.areas_data.length; i++) {
          areas_data_areaname.push(that.data.areas_data[i].areaname)

        }
        that.setData({
          areas_data_areaname: areas_data_areaname
        })

      },
      fail: function (res) {
        console.log('提交GetCityListByProvinceArea接口返回失败');
        wx.showToast({
          title: '网络连接失败，请退出重试',
        })
      }
    })
  },

  GetCountyByProvinceCity: function (city) {//获取区
    var that = this
    wx.request({
      url: app.globalData.bd_url + '/api/Discount/GetCountyByProvinceCity',
      data: {
        city: city
      },
      method: 'GET',
      header: {
        'content-type': 'application/json',
      },

      success: function (res) {
        console.log(res);

        that.setData({
          citys_data: res.data.Data
        })
        var citys_data_areaname = []
        for (var i = 0; i < that.data.citys_data.length; i++) {
          citys_data_areaname.push(that.data.citys_data[i].areaname)

        }
        that.setData({
          citys_data_areaname: citys_data_areaname
        })

      },
      fail: function (res) {
        console.log('提交GetCityListByProvinceArea接口返回失败');
        wx.showToast({
          title: '网络连接失败，请退出重试',
        })
      }
    })
  },


  onLoad: function (options) {
    var that = this;
    that.GetProvinceList()

    that.setData({

      hidden: true
    })
    that.GetVipAddressList(app.globalData.loginfo.data.Data.openid, options.id)



  }
})
