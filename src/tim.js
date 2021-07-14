import TIM from 'tim-js-sdk'
// import TIM from 'tim-js-sdk-ws'
// import TIMUploadPlugin from 'tim-upload-plugin'

// 初始化 SDK 实例
 
const tim = TIM.create({
  SDKAppID: 1400423544
})

window.setLogLevel = tim.setLogLevel

// 无日志级别
tim.setLogLevel(0)

// 注册 cos
// tim.registerPlugin({ 'tim-upload-plugin':TIMUploadPlugin })
export default tim
