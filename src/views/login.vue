<template>
  <div class="login" style="margin:0;padding:0">
        <div>
            请输入用户ID：<input type="text" v-model="userId" style="padding:8px;width:200px"> <br><br>
            请输入房间号：<input type="text" v-model="roomId" style="padding:8px;width:200px"> <br>
        </div>

        
        <div id="remind-info" style="font-size:12px;margin-top:10px;padding-left:108px">
            <el-select v-model="value" clearable placeholder="请选择摄像头" :popper-append-to-body="false" @change="elChange">
                <el-option
                style="font-size:16px;"
                v-for="item in cameraArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select> <br><br>
            <el-select v-model="value2" clearable placeholder="请选择音频" :popper-append-to-body="false" @change="elChange">
                <el-option
                style="font-size:16px;"
                v-for="item in audioArr"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select> <br><br>
            <el-switch
            v-model="role"
            active-text="主播"
            inactive-text="观众">
            </el-switch> <br><br>
        
            <button @click="login" style="padding:8px;width:220px">登录</button>
        </div>
        
      
  </div>
</template>

<script>

import { genTestUserSig } from "../../public/debug/GenerateTestUserSig";
import TRTC from 'trtc-js-sdk'

import rtcDetection from '../utils/rtcTest'

// import {Select } from "element-ui"


export default {
    data(){
        return {
            userId: '',
            roomId: '',
            sdkAppID: null,
            userSig: null,
            cameraArr: [],
            audioArr: [],
            value: '',
            value2: '',

            role: true
        }
    },
    watch: {
        value(newValue,oldValue) {
            console.log(newValue,oldValue)
            return newValue +'hahaha'
        }
    },
    components: {
        // Select 
    },
    methods:{
        elChange() {

        },
        getSecret(){
            if (this.userId.length === 0 || this.roomId.length === 0){
                return
            } else {
                return {
                    sdkAppID: genTestUserSig(this.userId).sdkAppID,
                    userSig: genTestUserSig(this.userId).userSig
                }
            }
        },
        async login() {
            rtcDetection().then(() =>{
                console.log('pass success')
            }).catch(() =>{
                console.log('fail to pass')
            })
            this.test()
            if (this.userId.length === 0 || this.roomId.length === 0 || this.value == "" || this.value2 == "") {
                alert('please input the correct roomi/userid/cameraId/micphoneid')
            } else {
                // 判断浏览器是否支持
                const res = await TRTC.checkSystemRequirements()

                if (res.result) {
                    alert('success to join',res.result)
                    this.$router.push({
                        path: '/trtc',
                        query: {
                            userId: this.userId,
                            roomId: this.roomId,
                            sdkAppID: this.getSecret().sdkAppID,
                            userSig: this.getSecret().userSig,
                            cameraId: this.value,
                            microphoneId: this.value2,
                            role: this.role
                        }
                    })
                } else {
                    alert('please using safari to open the project!')
                }
                
            }
            
        },
        test() {
        }
    },
    mounted() {
        console.error(genTestUserSig,'genTestUserSig')
        TRTC.getCameras().then(devices =>{
            console.error(devices) 
            devices.forEach((item,i) => {
                const newArr = {}
                newArr.value = item.deviceId
                newArr.label = item.label
                this.cameraArr.push(newArr)
            })
        })
        TRTC.getMicrophones().then(devices => {
            devices.forEach(item => {
                const newArr = {}
                newArr.value = item.deviceId
                newArr.label = item.label
                this.audioArr.push(newArr)
            })
        })
    }
}
</script>

<style>

</style>