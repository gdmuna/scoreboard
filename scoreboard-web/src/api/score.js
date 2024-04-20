import request from '@/utils/request';

const moduleUrl = '/score';

const score = {
    // 获取排行榜列表
    getTeamRanking(data) {
        return request(`${moduleUrl}/getTeamRanking`, data);
    },
    // 获取游戏点位信息
    getGameId(data) {
        return request(`${moduleUrl}/getGameId`, data);
    },
    // 成绩上报
    scoreUpload(data) {
        return request(`${moduleUrl}/scoreUpload`, data);
    }
};

export default score;
