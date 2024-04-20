<template>
    <v-app class="background">
        <!-- 侧边抽屉栏 -->
        <v-navigation-drawer v-model="drawer" :width="400" location="right" temporary>
            <div class="drawer-container">
                <!-- Title -->
                <vs-row>
                    <vs-col>
                        <h1>Seetings</h1>
                    </vs-col>
                </vs-row>
                <!-- Machine Key -->
                <vs-row>
                    <vs-col>
                        <h2>密钥设置</h2>
                    </vs-col>
                </vs-row>
                <vs-row justify="center" align="middle">
                    <vs-col :sm="7">
                        <vs-input v-model="machineKey" type="password" icon-after placeholder="Machine Key"></vs-input>
                    </vs-col>
                    <vs-col :sm="3">
                        <vs-button type="flat" color="success" :disabled="!bt1Flag" @click="getGameId(machineKey)">Save</vs-button>
                    </vs-col>
                </vs-row>
                <vs-row justify="center" align="middle">
                    <vs-col :sm="9">当前游戏点位：{{ gameInfo.gameName }}</vs-col>
                </vs-row>
                <!-- Score Report -->
                <vs-row>
                    <vs-col>
                        <h2>成绩上报</h2>
                    </vs-col>
                </vs-row>
                <vs-row justify="center" align="middle">
                    <vs-col :sm="7">
                        <vs-input v-model="captainId" icon-after placeholder="队长学号"></vs-input>
                    </vs-col>
                    <vs-col :sm="4">
                        <vs-button type="flat" color="#7d33ff" :disabled="!bt2Flag" @click="scoreUpload(captainId)">确认通关</vs-button>
                    </vs-col>
                </vs-row>
            </div>
        </v-navigation-drawer>
        <!-- 主界面 -->
        <div class="main-container">
            <!-- 页面悬浮按钮 - 全屏 -->
            <vs-button class="fixed-button-1" size="xl" shape="circle" color="#2ea9df" @click="toggleFullScreen(fullScreen)">⌘</vs-button>
            <!-- 页面悬浮按钮 - 打开抽屉栏 -->
            <vs-button class="fixed-button-2" size="xl" shape="circle" color="#f596aa" @click="drawer = true">❤</vs-button>
            <!-- 页面卡片内容 -->
            <div class="content-card">
                <vs-row>
                    <vs-col>
                        <h1>排行榜</h1>
                    </vs-col>
                </vs-row>
                <vs-row>
                    <vs-col>
                        <!-- 队伍用时排名列表 -->
                        <vs-table>
                            <template #thead>
                                <vs-tr>
                                    <vs-th style="width: 6rem">队伍排名</vs-th>
                                    <vs-th style="width: 12rem">队伍名称</vs-th>
                                    <vs-th style="width: 12rem">游戏点 1 完成时间</vs-th>
                                    <vs-th style="width: 12rem">游戏点 2 完成时间</vs-th>
                                    <vs-th style="width: 12rem">游戏点 3 完成时间</vs-th>
                                    <vs-th style="width: 12rem">最后记录时间</vs-th>
                                </vs-tr>
                            </template>
                            <template #tbody>
                                <vs-tr v-for="(tr, i) in scoreList" :key="i" :data="tr">
                                    <vs-td>{{ tr.sort }}</vs-td>
                                    <vs-td>{{ tr.teamName }}</vs-td>
                                    <vs-td>{{ tr.game1Time }}</vs-td>
                                    <vs-td>{{ tr.game2Time }}</vs-td>
                                    <vs-td>{{ tr.game3Time }}</vs-td>
                                    <vs-td>{{ tr.lastTime }}</vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </vs-col>
                </vs-row>
            </div>
        </div>
    </v-app>
</template>

<script>
import { VsNotification } from 'vuesax-alpha';

import score from '@/api/score';

export default {
    name: 'IndexPage',
    components: {},
    setup() {
        // 通知气泡栏
        const openNotification = (position = null, color, title, content) => {
            VsNotification({
                flat: true,
                progressAuto: true,
                position,
                color,
                title,
                content
            });
        };
        return { openNotification };
    },
    data() {
        return {
            fullScreen: false, // 全屏标志
            drawer: false, // 抽屉栏标志
            machineKey: null, // 设备密钥
            gameInfo: {}, // 游戏点位信息
            captainId: null, // 队长学号
            scoreList: [] // 队伍排名列表
        };
    },
    computed: {
        // 密钥设置按钮是否可用
        bt1Flag() {
            return this.machineKey == null || this.machineKey == '' ? false : true;
        },
        // 成绩上报按钮是否可用
        bt2Flag() {
            return this.gameInfo.gameId == undefined || this.gameInfo.gameId == null || this.gameInfo.gameId == '' || this.captainId == null || this.captainId == '' ? false : true;
        }
    },
    created() {},
    mounted() {
        // 定时刷新排名
        setInterval(() => {
            this.getTeamRanking();
        }, 5000);
    },
    updated() {},
    methods: {
        // 进入全屏与退出全屏
        toggleFullScreen() {
            if (!this.fullScreen) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
            this.fullScreen = !this.fullScreen;
        },
        // 获取队伍排名列表
        async getTeamRanking() {
            const scoreList = await score.getTeamRanking();
            if (scoreList && scoreList.length > 0) {
                this.scoreList = scoreList;
            }
        },
        // 获取游戏点位信息
        async getGameId(machineKey) {
            const gameInfo = await score.getGameId({ machineKey });
            if (gameInfo && gameInfo.gameId) {
                this.gameInfo = gameInfo;
                this.openNotification('bottom-center', 'success', 'Success!', '密钥设置成功！已获取到游戏点位信息！');
            } else {
                this.openNotification('bottom-center', 'danger', 'Error!', '密钥设置失败！密钥错误或网络异常！');
            }
        },
        // 成绩上报
        async scoreUpload(captainId) {
            const { gameId } = this.gameInfo;
            const res = await score.scoreUpload({ gameId, captainId });
            if (res.affectedRows) {
                this.openNotification('bottom-center', 'success', 'Success!', '成绩上报成功！');
                this.captainId = null;
                this.drawer = false;
                await this.getTeamRanking();
            } else {
                this.openNotification('bottom-center', 'danger', 'Error!', '成绩上报失败！学号错误或网络异常！');
            }
        }
    }
};
</script>

<style scoped>
.fixed-button-1 {
    position: fixed;
    cursor: pointer;
    z-index: 10;
    width: 60px;
    height: 60px;
    right: 40px;
    bottom: 110px;
}

.fixed-button-2 {
    position: fixed;
    cursor: pointer;
    z-index: 10;
    width: 60px;
    height: 60px;
    right: 40px;
    bottom: 40px;
}

.drawer-container {
    width: 100%;
    height: 100vh;

    background-image: url('@/assets/cat.png');
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-position: right bottom;
    background-size: 80%;

    overflow: auto;

    padding: 0 30px 0 30px;
}

.vs-table-th,
.vs-table-td {
    font-size: 1.2rem;
}
</style>
