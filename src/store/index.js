import Vue from 'vue'
import Vuex from 'vuex'
import {genTestUserSig} from '../../public/debug/GenerateTestUserSig'

import { filterCallingMessage } from '../utils/common'

import {Message} from 'element-ui'

import user from './modules/user'

Vue.use(Vuex)


const userID = 'user24'
export default new Vuex.Store({
  state: {
    isSDKReady: false,

    userID: userID,
    userSig: genTestUserSig(userID).userSig,
    sdkAppID: 1400423544,

    callingInfo: {
      memberList: [],
      type: 'C2C',   //C2C，GROUP
    },

    videoRoom: 999,
    isBusy: false,

    message: undefined,

    groupLiveInfo: {
      groupID: 0, // 群内直播时为当前群的ID,群组外直播时groupID设置为0
      roomID: 0, // 直播间ID,直播间内的直播群ID与roomID相同
      anchorID: 0, // 主播ID
      roomName: '', // 直播间名称
      isNeededQuitRoom: 0 // 是否需要主动退出直播间 0 默认 1 主动退出
    },
    avChatRoomMessageList:[],
    avChatRoomBarrageMessageList: [],
    avChatRoomGiftMessageList: []
  },
  mutations: {
    // 设定登录标志
    toggleIsSDKReady(state, isSDKReady) {
      state.isSDKReady = typeof isSDKReady === 'undefined' ? !state.isSDKReady : isSDKReady
    },

    // 保存通话相关的信息
    setCallingList(state, value) {
      state.callingInfo.memberList = value.memberList //数组的目的是为了后续的群call做准备
      state.callingInfo.type = value.type
    },

    // 是否占线
    UPDATE_ISBUSY(state, isBusy) {
      state.isBusy = isBusy
    },

    // 展示tip信息
    showMessage(state, options) {
      if (state.message) {
        state.message.close()
      }
      state.message = Message({
        message: options.message,
        type: options.type || 'success',
        duration: options.duration || 2000,
        offset: 40
      })
    },
    /**
     * 直播群相关
     */
    updateGroupLiveInfo(state, payload) {
      state.groupLiveInfo = { ...state.groupLiveInfo, ...payload }
    },
    clearAvChatRoomMessageList(state) {
      state.avChatRoomMessageList = []
      state.avChatRoomBarrageMessageList = []
      state.avChatRoomGiftMessageList = []
    },
    // 重置直播群信息
    resetGroupLiveInfo(state, payload) {
      state.groupLiveInfo = { ...state.groupLiveInfo, ...payload }
    },
    pushCurrentMessageList(state, data) {
      // 还没当前会话，则跳过
      if (Array.isArray(data)) {
        // 筛选出当前会话的消息
        const result = data.filter(item => item.conversationID === state.currentConversation.conversationID)
        state.currentMessageList = [...state.currentMessageList, ...result]
        filterCallingMessage(state.currentMessageList)
      } else if (data.conversationID === state.currentConversation.conversationID) {
        state.currentMessageList = [...state.currentMessageList, data]
        filterCallingMessage(state.currentMessageList)
      }
    },
  }, 
  actions: {
  },
  getters: {
    // toAccount: state => {
    //   if (!state.currentConversation || !state.currentConversation.conversationID) {
    //     return ''
    //   }
    //   switch (state.currentConversation.type) {
    //     case 'C2C':
    //       return state.currentConversation.conversationID.replace('C2C', '')
    //     case 'GROUP':
    //       return state.currentConversation.conversationID.replace('GROUP', '')
    //     default:
    //       return state.currentConversation.conversationID
    //   }
    // }
  },
  modules: {
    user
  }
})
