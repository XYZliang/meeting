"use strict";
// pages/room/list.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tags: ["关注", "创建", ""],
    tabs: ["教室列表"],
    activeIndex: 0,
    rooms: [null, null, null],
    shareSelect: [],
    hideNotice: false,
    notice: '【优化】修复若干问题🔨，优化体验和性能~现在快到起飞啦🚀~~     【功能】增加了分享💋和公告🪧提醒功能～     【反馈】如有疑问🙋请联系开发者🐧QQ 1424625705',
  },
  switchNotice: function() {
    this.setData({
      hideNotice: true
    })
  },
  refreshShareRooms: function () {
      app.api.api_meeting_follow_rooms().then(res => {
        this.data.rooms[0] = res
        this.data.rooms[2] = []
        let ids = []
        for (let index in [0, 1]) {
          for (let i in this.data.rooms[index]) {
            if (ids.indexOf(this.data.rooms[index][i].id) < 0) {
              ids.push(this.data.rooms[index][i].id)
              this.data.rooms[index][i].checked = false
              this.data.rooms[2].push(this.data.rooms[index][i])
            }
          }
        }
        let setdata = {
          rooms: this.data.rooms,
          tabs: ["教室列表"]
        }
        if (this.data.rooms[2].length > 1) {
          setdata.tabs.push("批量分享")
        } else if (this.data.activeIndex == 2) {
          setdata.activeIndex = 0
        }
        this.setData(setdata)
      })
  },
  refresh: function () {
    this.refreshShareRooms()
  },
  reserve: function (e) {
    wx.navigateTo({
      url: '../meeting/reserve',
    })
  },
  shareSelectChange(e) {
    this.data.shareSelect = e.detail.value.map(n => {
      return parseInt(n)
    })
    for (let i in this.data.rooms[2]) {
      this.data.rooms[2][i].checked = this.data.shareSelect.indexOf(this.data.rooms[2][i].id) >= 0
    }
    this.setData({
      shareSelect: this.data.shareSelect,
      rooms: this.data.rooms
    })
  },
  my: function (e) {
    wx.navigateTo({
      url: '../meeting/my',
    })
  },
  create: function (e) {
    wx.navigateTo({
      url: 'edit',
    })
  },
  detail: function (e) {
    wx.navigateTo({
      url: 'detail?room_id=' + e.currentTarget.id
    })
  },
  tabClick: function (e) {
    this.setData({
      activeIndex: parseInt(e.currentTarget.id),
      shareSelect: []
    });
    this.refresh()
  },
  adLoad: function (options) {},
  adError: function (options) {
    console.log("adError", options)
    this.setData({
      show_ad: false
    })
  },
  adClose: function (options) {
    this.setData({
      show_ad: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let room_ids = options.room_ids
    if (room_ids) {
      app.api.api_meeting_room_follow({
        room_id: room_ids
      }).then(res => {
        this.refresh()
      })
    }
    app.config().then(res => {
      if (res.banner_ad_unit_id) {
        let data = {}
        data.ad_unit_id = res.banner_ad_unit_id
        data.show_ad = true
        if (res.banner_ad_intervals) {
          data.ad_intervals = res.banner_ad_intervals
        }
        this.setData(data)
      }
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
    this.refresh()

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
  onShareAppMessage: function () {
    if (this.data.shareSelect.length == 0) {
      return {}
    }
    let title = []
    for (let i in this.data.rooms[2]) {
      if (this.data.shareSelect.indexOf(this.data.rooms[2][i].id) >= 0) {
        title.push(this.data.rooms[2][i].name)
      }
    }
    return {
      title: title.join(" "),
      path: '/pages/room/list?room_ids=' + this.data.shareSelect.join(",")
    }
  }
})