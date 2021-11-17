"use strict";
// pages/meeting/edit.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_info: {},
    meeting_id: 0,
    room_id: 0,
    date: "",
    start_time: "",
    end_time: "",
    room: {},
    name: "",
    description: "",
    hideNotice: false,
    notice: '⚠️借用仅限软件学院班级、部门活动，非本学院活动申请请先向学院团委廖波老师/学生会主席赖粤恺/第一副主席叶怡麟申请。请按照要求填写相关信息，教室用途需包含具体班级/部门和相关事项，例如👉“软件192班班会”；联系方式应包含负责人/借用人相关联系方式📱，例如👉“张三 18700001234”。'
  },
  witchNotice: function () {
    this.setData({
      hideNotice: true
    })
  },
  bindKeyInput(e) {
    this.data[e.currentTarget.dataset.obj] = e.detail.value
  },
  onGetUserInfo: function (e) {
    app.onGetUserInfo(e).then(res => {
      this.setData({
        user_info: res
      })
    })
  },
  refresh: function () {
    if (this.data.meeting_id > 0) {
      app.api.api_meeting_info({
        meeting_id: this.data.meeting_id
      }).then(res => {
        this.setData({
          date: res.date,
          start_time: res.start_time,
          end_time: res.end_time,
          room: res.room,
          name: res.name,
          description: res.description
        })
      })
    } else {
      app.api.api_meeting_room_info({
        room_id: this.data.room_id
      }).then(res => {
        this.setData({
          room: res
        })
      })
    }
  },
  save: function () {
    if (!this.data.name.trim()) {
      wx.showToast({
        icon: 'none',
        title: '请输入名称',
      })
      return
    }
    wx.showLoading({
      mask: true,
      title: '加载中...',
    })
    if (this.data.meeting_id <= 0) {
      app.api.api_meeting_reserve({
        room_id: this.data.room_id,
        name: this.data.name,
        description: this.data.description,
        date: this.data.date,
        start_time: this.data.start_time,
        end_time: this.data.end_time
      }).then(res => {
        wx.hideLoading()
        wx.redirectTo({
          url: "detail?meeting_id=" + res.id
        })
      }).catch(res => {
        wx.hideLoading()
      })
    } else {
      app.api.api_meeting_edit({
        meeting_id: this.data.meeting_id,
        name: this.data.name,
        description: this.data.description
      }).then(res => {
        wx.hideLoading()
        wx.navigateBack()
      }).catch(res => {
        wx.hideLoading()
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.userInfo().then(res => {
      this.setData({
        user_info: res
      })
    })
    let meeting_id = options.meeting_id
    if (meeting_id) {
      this.setData({
        meeting_id: parseInt(meeting_id)
      })
      return
    }
    let room_id = options.room_id
    if (room_id) {
      room_id = parseInt(room_id)
    } else {
      room_id = 0
    }
    let start_time = options.start_time
    let end_time = options.end_time
    let date = options.date
    if (room_id <= 0 || !start_time || !end_time || !date) {
      wx.showToast({
        title: '参数错误',
        icon: 'none'
      })
      wx.navigateBack()
      return
    }

    this.setData({
      room_id: room_id,
      start_time: start_time,
      end_time: end_time,
      date: date
    })
    return
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
})