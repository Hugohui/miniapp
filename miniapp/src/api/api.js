import {
  wxRequest,wxPost,wxUploadVideo,wxUploadImage
} from '@/utils/wxRequest';

let env = "-dev" //-dev 或者 -test
var apiUrl = 'https://wxappfood.liquidnetwork.com/'
const versionName = 'v1.0.0'
const getCourseList = (params) => wxPost(params, apiUrl + 'course/getCourse');
export default {

}
