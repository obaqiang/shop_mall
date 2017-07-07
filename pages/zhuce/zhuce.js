// pages/zhuce/zhuce.js

var app = getApp()//全局变量

Page({
  data: {
    tuijianrenid: '',//推荐人ID
    xingbie: '男',//性别
    zhiwei: '',//职位
    gongsimingcheng: '',//公司名称
    arrayhangye: ['请选择行业', '互联网', '计算机软件', '数码通讯', '汽车', '化工', '制药'
      , '生物技术', '机械', '餐饮食品', '医疗健康', '轻工生产', '零售类', '运输', '金融类', '旅游', '房产类'
      , '传媒', '中介咨询', '其他'],
    index_hangye: 0,
    arraysex: [
      { name: '男', value: '先生', checked: 'true' },
      { name: '女', value: '女士' },
    ],
    province: '',//定位省
    city: '',//定位市
    district: '',//定位区
    txt_weizhi: '',//定位位置,

    fasongtishi: '',//发送手机提示
    shoujihaoInput: '',//手机号输入框
    btnvalue: '获取验证码',//按钮文字
    btndisabled: false,//按钮状态
    code: '',//验证码

    fuwu_hidden: true,//服务条款窗口
    fuwu_nocancel: true,//服务条款窗口
    yinsi_hidden: true,//隐私条款窗口
    yinsi_nocancel: true,//隐私条款窗口
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    const that = this

    //设置页面标题
    wx.setNavigationBarTitle({
      title: '注册合伙人'
    })

    var op_tuijianrenid = options.tuijianrenid;
    that.setData({
      tuijianrenid: op_tuijianrenid
    });
    dilidingwei(that);
  },
  //选择性别
  listenerRadioGroup: function (e) {
    console.log(e.detail.value);
    this.setData({
      xingbie: e.detail.value
    });
  },
  //重新定位
  dingwei: function (e) {
    const that = this;
    dilidingwei(that);
  },
  //选择行业
  xuanzehangye: function (e) {
    this.setData({
      index_hangye: e.detail.value
    })
  },
  //服务条款
  fuwutiaokuan: function (e) {
    this.setData({
      fuwu_hidden: false,
      fuwu_nocancel: false
    })
  },
  fuwu_cancel: function () {
    this.setData({
      fuwu_hidden: true
    });
  },
  fuwu_confirm: function () {
    this.setData({
      fuwu_hidden: true
    });
  },
  //隐私条款
  yinsitiaokuan: function (e) {
    this.setData({
      yinsi_hidden: false,
      yinsi_nocancel: false
    })
  },
  yinsi_cancel: function () {
    this.setData({
      yinsi_hidden: true
    });
  },
  yinsi_confirm: function () {
    this.setData({
      yinsi_hidden: true
    });
  },
  //手机号输入框事件
  shoujihaoInput: function (e) {
    this.setData({
      shoujihaoInput: e.detail.value
    })
  },
  formSubmit: function (e) {
    var that = this

    var user = app.globalData.userHuiYuan;
    var openid = user.openid;
    var xingming = e.detail.value['txt_xingming'];
    var xingbie = that.data.xingbie;
    var zhiwei = e.detail.value['txt_zhiwei'];
    var gongsimingcheng = e.detail.value['txt_gongsimingcheng'];
    var hangye = that.data.arrayhangye[that.data.index_hangye];
    var province = that.data.province;
    var city = that.data.city;
    var district = that.data.district;
    var shoujihao = e.detail.value['txt_shoujihao'];
    var yanzhengma = e.detail.value['txt_yanzhengma'];


    //console.log('xingming:' + xingming + 'xingbie:' + xingbie + 'zhiwei:' + zhiwei + 'gongsimingcheng:' + gongsimingcheng + 'hangye:' + hangye + 'province:' + province + 'city:' + city + 'district:' + district + 'shoujihao:' + shoujihao + 'yanzhengma:' + yanzhengma);


    if (openid == '') {
      wx.showToast({
        title: '请同意获取您的微信用户信息',
        icon: 'success'
      })
      return;
    }
    if (xingbie == '') {
      wx.showToast({
        title: '请选择您的性别',
        icon: 'success'
      })
      return;
    }
    if (xingming == '') {
      wx.showToast({
        title: '请填写您的姓名',
        icon: 'success'
      })
      return;
    }
    if (gongsimingcheng == '') {
      wx.showToast({
        title: '请填写您的公司名称',
        icon: 'success'
      })
      return;
    }
    if (hangye == '' || hangye == '请选择行业') {
      wx.showToast({
        title: '请选择行业',
        icon: 'success'
      })
      return;
    }
    if (zhiwei == '') {
      wx.showToast({
        title: '请填写您的职位',
        icon: 'success'
      })
      return;
    }
    // if (province == '' || city == '' || district == '') {
    // wx.showToast({
    //  title: '请同意获取您的地理定位',
    // icon: 'success'
    // })
    // return;
    // }
    if (shoujihao == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'success'
      })
      return;
    }
    if (yanzhengma == '') {
      wx.showToast({
        title: '请输入验证码',
        icon: 'success'
      })
      return;
    }

    if (yanzhengma != code) {
      wx.showToast({
        title: '验证码不正确',
        icon: 'success'
      })
      return;
    }

    wx.showToast({
      title: '执行中',
      icon: 'loading',
      duration: 10000
    })

    wx.request({
      url: app.httpsvalue + '/x/ZhuCe.aspx', //仅为示例，并非真实的接口地址
      data: {
        openid: openid,
        xingbie: xingbie,
        xingming: xingming,
        gongsimingcheng: gongsimingcheng,
        hangye: hangye,
        zhiwei: zhiwei,
        province: province,
        city: city,
        district: district,
        shoujihao: shoujihao
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideToast();
        var info = res.data;
        if (info == 'yes') {
          var user = app.globalData.userHuiYuan;
          //修改头像
          if (user.touxiangurl == '') {
            user.touxiangurl = app.globalData.userInfo.avatarUrl;
          }
          else {
            user.touxiangurl = user.touxiangurl;
          }
          //修改资料
          user.xingbie = xingbie;
          user.xingming = xingming;

          user.gongsimingcheng = gongsimingcheng;
          user.hangye = hangye;
          user.zhiwei = zhiwei;
          user.province = province;
          user.city = city;
          user.district = district;

          user.shoujihao = shoujihao;
          user.state = 'lao'; //xin:新会员,lao:老会员

          that.setData({
            userHuiYuan: user
          })


          wx.redirectTo({
            url: '../shenfen/shenfen'
          })
        }
        else {
          wx.showToast({
            title: info,
            icon: 'success'
          })
        }

      },
      fail: function (res) {
        wx.hideToast();
        wx.navigateTo({
          url: '../error/error?error=' + res.data
        })
      }
    })

  },
  //发送验证码
  fasongyanzhengma: function (e) {
    const that = this

    var shoujihao = that.data.shoujihaoInput;

    if (shoujihao == '') {
      wx.showToast({
        title: '请输入手机号',
        icon: 'success'
      })
      return;
    }
    if (shoujihao.length != 11) {
      wx.showToast({
        title: '手机号不正确',
        icon: 'success'
      })
      return;
    }

    //生成手机验证码码
    code = createcode();

    wx.showToast({
      title: '发送中',
      icon: 'loading',
      duration: 10000
    })

    //发送手机验证码
    wx.request({
      url: app.httpsvalue + '/x/PhoneCode.aspx', //仅为示例，并非真实的接口地址
      data: {
        shoujihao: shoujihao,
        code: code
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideToast();
        var info = res.data;
        if (info == 'yes') {
          //按钮禁用
          time(that);
        }
        else {
          wx.showToast({
            title: info,
            icon: 'success'
          })
        }
      },
      fail: function (res) {
        wx.navigateTo({
          url: '../error/error?error=' + res.data
        })
      }
    })

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


//地理定位
function dilidingwei(that) {

  wx.showToast({
    title: '正在定位',
    icon: 'success'
  })

  //获得地址位置
  wx.getLocation({
    success: function (res) {
      var latitude = res.latitude
      var longitude = res.longitude
      console.log('https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=635BZ-QRSKF-6O2JD-J3SFC-OB24T-UHBD6');
      wx.request({
        url: 'https://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=635BZ-QRSKF-6O2JD-J3SFC-OB24T-UHBD6', //仅为示例，并非真实的接口地址
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          //var str = JSON.stringify(res.data);
          // console.log('str:' + str)
          wx.hideToast();
          var info = res.data;
          if (info.status != 0) {
            wx.showToast({
              title: info.message,
              icon: 'success'
            })
            return;
          }
          that.setData({
            province: info.result.address_component.province
          })
          that.setData({
            city: info.result.address_component.city
          })
          that.setData({
            district: info.result.address_component.district
          })

          that.setData({
            txt_weizhi: info.result.address_component.province + '-' + info.result.address_component.city + '-' + info.result.address_component.district
          })
        },
        fail: function (res) {
          wx.navigateTo({
            url: '../error/error?error=' + res.data
          })
        }
      })
    },
    fail: function (res) {
      that.setData({
        txt_weizhi: '重新定位'
      });
    }
  })
}

var wait = 60;//重置时间
function time(that) {
  if (wait == 0) {
    that.setData({
      btndisabled: false
    })
    that.setData({
      btnvalue: '获取验证码'
    })
    wait = 60;
  } else {
    that.setData({
      btndisabled: true
    })
    that.setData({
      btnvalue: '重新获取(' + wait + ')'
    })
    wait--; setTimeout(function () {
      time(that)
    }, 1000)
  }
}
var charactors = "1234567890";
//生成四位验证码
var code = '';
function createcode() {
  var val = '', i;
  for (var j = 1; j <= 4; j++) {
    i = parseInt(10 * Math.random());
    val = val + charactors.charAt(i);
  }
  return val;
}

