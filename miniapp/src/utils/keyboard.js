import wepy from 'wepy';

function keyboard(height){
  let pixel;
  var res = wx.getSystemInfoSync();
  var windowWidth = res.windowWidth;
  pixel = 750/windowWidth;
  return pixel;
}

module.exports = {
    keyboard
}
