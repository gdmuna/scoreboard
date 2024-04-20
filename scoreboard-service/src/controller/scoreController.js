const router = require('express').Router();
module.exports = router;

const scoreService = require('../service/scoreService');

router.post('/getTeamList', async (req, res, next) => {
    const result = await scoreService.getTeamList();
    res.ResultVO(0, '成功', result);
});

router.post('/getTeamInfo', async (req, res, next) => {
    const { teamId } = req.body;
    const result = await scoreService.getTeamInfo(teamId);
    res.ResultVO(0, '成功', result);
});

router.post('/getGameId', async (req, res, next) => {
    const { machineKey } = req.body;
    const result = await scoreService.getGameId(machineKey);
    res.ResultVO(0, '成功', result);
});

router.post('/getTeamRanking', async (req, res, next) => {
    const result = await scoreService.getTeamRanking();
    res.ResultVO(0, '成功', result);
});

router.post('/scoreUpload', async (req, res, next) => {
    const { gameId, captainId } = req.body;
    // 通过队长学号获取队伍信息
    const teamInfo = await scoreService.getTeamId(captainId);
    if (teamInfo === undefined) {
        res.ResultVO(1, '队伍不存在');
        return;
    }
    // 从队伍信息提取队伍ID
    const { teamId } = teamInfo;
    // 获取当前时间
    const time = new Date();
    // 上报通关时间到数据库
    const result = await scoreService.setTeamScore(gameId, teamId, time);
    res.ResultVO(0, '成功', result);
});

router.post('/setTeamScore', async (req, res, next) => {
    let { gameId, teamId, time } = req.body;
    if (time === undefined) {
        time = new Date();
    }
    const result = await scoreService.setTeamScore(gameId, teamId, time);
    res.ResultVO(0, '成功', result);
});
