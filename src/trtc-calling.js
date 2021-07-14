import TRTCCalling from 'trtc-calling-js'

import {genTestUserSig} from '../public/debug/GenerateTestUserSig'

console.error(genTestUserSig(''))
let options = {
  SDKAppID: 1400423544 // 接入时需要将0替换为您的云通信应用的 SDKAppID
}

const trtcCalling = new TRTCCalling(options)

// 4 无日志级别
trtcCalling.setLogLevel(0)

export default trtcCalling
