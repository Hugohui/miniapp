import wepy from 'wepy';
import util from './util';
import md5 from './md5';
import UUID from './UUID';
import config  from'../tracker/sd-stat-conf.js';
import tip from './tip'

import { setUser } from '@/store/actions/user.redux'
import { getStore } from 'wepy-redux'
const store = getStore();
const state = getStore().getState();

const API_SECRET_KEY = 'https://wxapp.emotion.liquidnetwork.com'
const TIMESTAMP = util.getCurrentTime()
const SIGN = md5.hex_md5((TIMESTAMP + API_SECRET_KEY).toLowerCase())
const SOURCE = state.system.isCLA ? 'box' : 'weixin'
var networkType = 'wifi'
wx.getNetworkType({
  success: function(res) {
    // 返回网络类型, 有效值：
    // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
    networkType = res.networkType
  }
});
//获取当前页面path
function getCurrentPage(){
    var pages = getCurrentPages()    //获取加载的页面
    var currentPage = pages[pages.length-1]    //获取当前页面的对象
    var url = currentPage.route    //当前页面url
    return url
}
const wxRequest = async(params = {}, url) => {
    if (params.showLoading) {
      tip.loading();
    }
    let data = params.query || {};
    data.sign = SIGN;
    data.trace_id = UUID.generate();
    data.time = TIMESTAMP;
    data.platform_name = SOURCE;
    data.from_page = getCurrentPage();
    data.network_type = networkType;
    data.app_version = config.version_name
    data.os_name = state.system.systemInfo.system.split(" ")[0];
    data.os_version = state.system.systemInfo.system.split(" ")[1];
    data.device_platform = state.system.systemInfo.platform;
    data.platform_version = state.system.systemInfo.version;
    data.device_type = state.system.systemInfo.brand;
    data.device_id = state.system.deviceId;
    data.app_name = config.app_name;
    data.app_id = config.app_id;
    let res = await wepy.request({
        url: url,
        method: params.method || 'GET',
        data: data,
        header: { 'Content-Type': 'application/json' },
    });
    if (params.showLoading) {
      tip.loaded();
    }
    checkLoginOutDate(res);
    return res;
};

const wxPost = async(params = {}, url) => {
    if (params.showLoading) {
      tip.loading();
    }
    let data = params.post || {};
    data.sign = SIGN;
    data.trace_id = UUID.generate();
    data.time = TIMESTAMP;
    data.platform_name = SOURCE;
    data.from_page = getCurrentPage();
    data.network_type = networkType;
    data.app_version = config.version_name
    data.os_name = state.system.systemInfo.system.split(" ")[0];
    data.os_version = state.system.systemInfo.system.split(" ")[1];
    data.device_platform = state.system.systemInfo.platform;
    data.platform_version = state.system.systemInfo.version;
    data.device_type = state.system.systemInfo.brand;
    data.device_id = state.system.deviceId;
    data.app_name = config.app_name;
    data.app_id = config.app_id;
    let res = await wepy.request({
        url: url,
        method: 'POST',
        data: data,
        header: { 'Content-Type': 'application/json' },
    });
    if (params.showLoading) {
      tip.loaded();
    }
    checkLoginOutDate(res);
    return res;
};

const wxUploadVideo = async(params = {}, url) => {
    if (params.showLoading) {
      tip.loading();
    }
    let data = params.post;
    data.sign = SIGN;
    data.time = TIMESTAMP;
    data.trace_id = UUID.generate();
    data.source = SOURCE;
    data.from_page = getCurrentPage();
    data.device_platform = state.system.systemInfo.platform;
    data.platform_version = state.system.systemInfo.version;
    data.device_type = state.system.systemInfo.brand;
    data.device_id = state.system.deviceId;
    let res = await wepy.uploadFile({
        url: url,
        name: 'file',
        filePath: params.filePath,
        formData:{
          user_id:data['user_id'],
          isAnonynous:data['isAnonynous'],
          device_platform:data['device_platform'],
          device_type:data['device_type'],
          device_id:data['device_id'],
          title:data['title'],
          type:data['type'],
          source:data['source'],
        },
    });
    if (params.showLoading) {
      tip.loaded();
    }
    params.success(res);
    checkLoginOutDate(res);
    return res;
};

const wxUploadImage = async(params = {}, url) => {
    if (params.showLoading) {
      tip.loading();
    }
    let data = params.post;
    data.sign = SIGN;
    data.time = TIMESTAMP;
    data.from_page = getCurrentPage();
    data.trace_id = UUID.generate();
    data.source = SOURCE;
    data.device_platform = state.system.systemInfo.platform;
    data.platform_version = state.system.systemInfo.version;
    data.device_type = state.system.systemInfo.brand;
    data.device_id = state.system.deviceId;
    let res = await wepy.uploadFile({
        url: url,
        name: 'file',
        filePath: params.filePath,
        formData:{
          user_id:data['user_id'],
          title:data['title'],
          video_id:data['video_id'],
          device_platform:data['device_platform'],
          device_type:data['device_type'],
          device_id:data['device_id']
        }
    });
    if (params.showLoading) {
      tip.loaded();
    }
    params.success(res);
    checkLoginOutDate(res);
    return res;
};

//用户登录过期
function checkLoginOutDate(res) {
  if (res.data.code == -8008) {
    wx.showToast({
      title: '登录过期请重登',
      icon: 'none'
    });
    wx.removeStorageSync('userInfo_v1.0.0');
    wx.removeStorageSync('user_id_v1.0.0');
    store.dispatch(setUser({
      user_id: '',
      userInfo: {}
    }));
  }
}

module.exports = {
    wxRequest,
    wxPost,
    wxUploadVideo,
    wxUploadImage
}
