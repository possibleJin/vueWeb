<template>
  <el-row>
    <el-row>
      <p class="QualCheckToDo_title">视频认证</p>
    </el-row>
    <el-row>
      <el-tabs class="el-tabs" v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="未审核" name="first"> </el-tab-pane>
        <el-tab-pane label="审核通过" name="second"> </el-tab-pane>
        <el-tab-pane label="审核未通过" name="third"> </el-tab-pane>
      </el-tabs>
    </el-row>

    <!--即将开始的-->
    <el-row class="ParticipationLecture_table_background">
      <el-row>
        <el-table style="width: 100%; height: 670px" :data="list">
          <el-table-column prop="create_time" label="上传时间" width="200px">
          </el-table-column>
          <el-table-column prop="uploadUserName" label="用户名" width="200px">
          </el-table-column>
          <el-table-column prop="video_name" label="标题" width="200px">
          </el-table-column>
          <el-table-column label="操作" width="250px">
            <template slot-scope="scope">
              <el-link
                type="text"
                size="small"
                @click.native.prevent="CheckPass(scope.$index, list)"
                :underline="false"
                >通过</el-link
              >
              <el-button
                type="text"
                size="small"
                style="color: #e2211a"
                @click="dialogRejectVisible = true"
                >驳回</el-button
              >

              <el-dialog
                title="填写驳回理由"
                :visible.sync="dialogRejectVisible"
                width="30%"
                :before-close="handleRejectClose"
              >
                <el-input
                  type="textarea"
                  :rows="4"
                  placeholder="请输入内容"
                  v-model="rejectTextarea"
                >
                </el-input>

                <span slot="footer" class="dialog-footer">
                  <el-button @click="dialogRejectVisible = false"
                    >取 消</el-button
                  >
                  <el-button
                    type="primary"
                    @click="
                      dialogRejectVisible = false;
                      CheckReject(scope.$index, list);
                    "
                    >确 定</el-button
                  >
                </span>
              </el-dialog>
              <el-button
                type="text"
                size="mini"
                style="color: #5b5b5b"
                @click="VideoDetails(scope.$index, list)"
                >查看{{ scope.$index }}</el-button
              >

              <el-dialog
                :visible.sync="dialogCheckVisible"
                width="30%"
                :before-close="handleCheckClose"
              >
                <el-row>
                  <el-col :span="24" class="videoplay_main_body">
                    <video
                      id="tcPlayerId"
                      class="tencent-player"
                      preload="auto"
                      playsinline
                      webkit-playsinline
                      x5-playsinline
                      style="width: 100%; height: 100%"
                    ></video>
                  </el-col>
                  <el-col :span="24" class="videoplay_main_header">
                    <p class="videoplay_main_header_title">
                      {{ videoInfo.title }}
                    </p>
                    <p class="videoplay_main_header_username_time">
                      上传人：{{ videoInfo.creator }} 时间：{{ videoInfo.time }}
                    </p>
                    <p>视频描述：{{ videoInfo.introduction }}</p>
                  </el-col>
                </el-row>
              </el-dialog>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-divider class="el_divider"></el-divider>
      <!--分页 -->
      <el-row class="QualCheckToDo_table_page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange()"
          :current-page="currentPage"
          layout="prev, pager, next"
          :page-count="pageTotal"
        >
        </el-pagination>
      </el-row>
    </el-row>
  </el-row>
</template>

<!--播放器脚本文件-->
<script src="//imgcache.qq.com/open/qcloud/video/tcplayer/tcplayer.min.js"></script>
<script src="https://imgcache.qq.com/open/qcloud/video/vcplayer/TcPlayer-2.3.3.js" charset="utf-8"></script>;
<script src="https://web.sdk.qcloud.com/player/tcplayerlite/release/v2.4.0/TcPlayer-2.4.0.js" charset="utf-8"></script>

<script>
import {
  loadExternalCSS,
  loadExternalJS
} from '../../../utils/loadTcPlayerTool.js'
export default {
  name: "QualCheckToDo",
   // metaInfo: {
   //      script: [
   //        {
   //          src: "https://imgcache.qq.com/open/qcloud/video/tcplayer/libs/hls.min.0.13.2m.js",
   //        },
   //      ],
   //    },

  //  props: {
  //   options: {
  //     type: Object,
  //     default() {
  //       return {};
  //     },
  //   },
  // },
  // watch: {
  //   options: {
  //     handler(newV, oldV) {
  //       this.$nextTick(() => {
  //         this.loadJS();
  //       });
  //     },
  //     immediate: true,
  //     deep: true,
  //   },
  // },
  
  data() {
    return {
      activeName: "first",
      currentPage: 1,
      // page: 1, //当前页数
      pageSize: 1, //每页条目数
      pageTotal: 1, //总页数
      total: 1, //总条目数
      dialogRejectVisible: false, //驳回理由填写
      list: [
        {
          userId: "",
          create_time: "2021年2月25日",
          uploadUserName: "名字",
          video_id: "",
          video_name: "视频标题",
        },
      ],
      rejectTextarea: "",

      dialogCheckVisible: false, //查看图片
      // index: 1,

     
      // 腾讯视频播放器实体
      // tcPlayerId: "tcPlayer" + Date.now(),
      // player: null,
      // 数据格式：视频相关信息
      videoInfo: {
        appId: "",
        fileId: "",
        videoId: "",
        psign: "",
        title: "这里是视频标题",
        creator: "会飞的鱼",
        time: "2021年2月25日",
        introduction: "可以显示视频简介，形式可以有很多，文字，图片等。",
      },
    };
  },
  created() {
    this.tcPlayerLoader();
    this.getVideoCheckToDoInfo();
  },
  methods: {
    handleSizeChange: function () {},
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getQualCheckToDoInfo();
      console.log(currentPage);
    },
    getVideoCheckToDoInfo() {
      // let currentPage=this.currentPage;
      let getVideoCheckToDoForm = {
        currentPage: this.currentPage,
      };
      console.log(typeof currentPage);
      console.log(typeof this.currentPage);
      this.$store
        .dispatch("Video/getVideoCheckToDoInfo", getVideoCheckToDoForm)
        .then((res) => {
          console.log(res);
          const { data } = res;
          this.pageTotal = res.data.pageTotal;
          this.list = res.data.list;
        })
        .catch((err) => {
          // console.log(err.response);
        });
    },
    handleClick(tab, event) {
      // console.log(tab, event);
      if (tab.index == 0) {
        this.$router.push({ path: "/QualCheckToDo" });
      } else if (tab.index == 1) {
        this.$router.push({ path: "/QualCheckPass" });
      } else if (tab.index == 2) {
        this.$router.push({ path: "/QualCheckNotPass" });
      }
    },

    // 通过
    CheckPass(index, rows) {
      this.$confirm("确认通过该审核?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let getCheckForm = {
            userId: this.list[index].userId,
          };

          console.log(index);
          console.log(this.list[index].userId);
          this.$store
            .dispatch("Personal/QualCheckPass", getCheckForm)
            .then((res) => {
              //前端删除行
              rows.splice(index, 1);
              this.visible = false;
              console.log(res);
              this.$message({
                type: "success",
                message: "通过成功!",
              });
              this.rendering();
            })
            .catch((err) => {
              console.log(err.response);
              if (err.response) {
                this.$message({
                  message: "通过失败",
                  type: "error",
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消通过",
          });
        });
    },

    //驳回
    CheckReject(index, rows) {
      this.$confirm("确认驳回该审核?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let getRejectForm = {
            userId: this.list[index].userId,
            rejectTextarea: this.rejectTextarea,
          };

          this.$store
            .dispatch("Personal/QualCheckReject", getRejectForm)
            .then((res) => {
              //前端删除行
              rows.splice(index, 1);
              this.visible = false;
              console.log(res);
              this.$message({
                type: "success",
                message: "驳回成功!",
              });
              this.rendering();
            })
            .catch((err) => {
              console.log(err.response);
              if (err.response) {
                this.$message({
                  message: "驳回失败",
                  type: "error",
                });
              }
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消驳回",
          });
        });
    },
    handleRejectClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },

    // 查看
    handleCheckClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
        })
        .catch((_) => {});
    },

    VideoDetails(index, rows) {
      this.dialogCheckVisible=true;
      let getVideoDetailsForm = {
        videoId: this.list[index].video_id,
      };
      console.log(typeof currentPage);
      console.log(typeof this.currentPage);
      this.$store
        .dispatch("Video/getCheckVideoDetails", getVideoDetailsForm)
        .then((res) => {
          console.log(res);
          const { data } = res;
          this.videoInfo.appId = res.data.appId;
          this.videoInfo.fileId = res.data.fileId;
          this.videoInfo.psign = res.data.psign;
          this.videoInfo.time = res.data.update_time;
          this.videoInfo.title = res.data.video_name;
          this.videoInfo.introduction = res.data.introduction;
          this.videoInfo.creator = res.data.video_upload_user_name;
          console.log(this.videoInfo.fileId);
          // 初始化视频播放
          const playerParm = {
            appID: this.videoInfo.appId,
            fileID: this.videoInfo.fileId,
            psign: this.videoInfo.psign,
          };
          console.log(playerParm);
          let player = TCPlayer('tcPlayerId', playerParm);
          console.log(player);
          // this.player = TCPlayer(this.tcPlayerId, playerParm);
        })
        .catch((err) => {
          // console.log(err.response);
        });
    },


    // 加载腾讯云视频点播js
    tcPlayerLoader() {
      loadExternalCSS(['https://imgcache.qq.com/open/qcloud/video/tcplayer/tcplayer.css'])
      loadExternalJS(['//imgcache.qq.com/open/qcloud/video/tcplayer/tcplayer.min.js',
        'https://imgcache.qq.com/open/qcloud/video/vcplayer/TcPlayer-2.3.3.js',
        'https://web.sdk.qcloud.com/player/tcplayerlite/release/v2.4.0/TcPlayer-2.4.0.js'
      ])
    },



    // 加载腾讯云视频点播js
    // onoptions(cur, old) {
    //   this.$nextTick(() => {
    //     this.loadJS();
    //   });
    // },
    // loadTcScript(callback) {
    //   this.loadScript(callback, {
    //     id: "tcPlayerScriptId",
    //     url: "http://imgcache.qq.com/open/qcloud/video/tcplayer/tcplayer.min.js",
    //   });
    // },
    // loadScript(callback, params) {
    //   if (document.getElementById(params.id)) {
    //     callback();
    //   } else {
    //     const script = document.createElement("script");
    //     script.async = true;
    //     script.src = params.url;
    //     script.id = params.id;
    //     script.onload = () => {
    //       callback();
    //     };
    //     document.body.appendChild(script);
    //   }
    // },
    // loadJS() {
    //   if (window.TCPlayer) {
    //     this.VideoDetails();
    //   } else {
    //     this.loadTcScript(() => {
    //       this.VideoDetails();
    //     });
    //   }
    // },
  },
};
</script>

<style>
@import "//imgcache.qq.com/open/qcloud/video/tcplayer/tcplayer.css";
/* 标题 */
.QualCheckToDo_title {
  width: 80px;
  height: 28px;
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #333c4f;
  margin: 20px auto auto 30px;
}

/* 表格 */
.ParticipationLecture_table_background {
  width: 850px;
  height: 758px;
  margin: 14px 24px 87px 25px;
  background: #ffffff;
}

/* 切换导航栏 */
.el-tabs {
  margin: 18px auto auto 31px;
}

.el-tabs__item {
  /* width: 55px; */
  height: 25px;
  font-size: 18px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #5b5b5b;
  line-height: 25px;
}

/* 隐藏el-tabs自带边线样式 */
.el-tabs__nav-wrap::after {
  display: none !important;
}

.el-table__body tr,
.el-table__body td {
  padding: 0;
  height: 55px;
}

.el-table::before {
  display: none;
}
.ParticipationLecture_table_page {
  position: absolute;
  text-align: center;
  bottom: 63px;
  left: 516px;
}

.el_divider {
  width: 850px;
  height: 2px;
  position: absolute;
  bottom: 86px;
  background: #e8e8e8;
}

.participation_el_link {
  margin-right: 20px;
}
a:-webkit-any-link {
  color: #2476c8 !important;
  cursor: pointer;
}

/* li {
  list-style: none;
} */

/* .view{
  margin-left: 5%;
} */
/* @import "../../style/medical_video.css"; */
</style>