const scoreDao = require('../dao/scoreDao');

exports.getTeamList = async () => {
    const teamList = await scoreDao.getTeamList();
    return teamList;
};

exports.getTeamInfo = async (teamId) => {
    const teamInfo = await scoreDao.getTeamInfo(teamId);
    return teamInfo[0];
};

exports.getGameId = async (machineKey) => {
    const gameInfo = await scoreDao.getGameId(machineKey);
    return gameInfo[0];
};

exports.getTeamRanking = async () => {
    const teamRanking = await scoreDao.getTeamRanking();
    return teamRanking;
};

exports.getTeamId = async (captainId) => {
    const teamInfo = await scoreDao.getTeamId(captainId);
    return teamInfo[0];
};

exports.setTeamScore = async (gameId, teamId, time) => {
    const result = await scoreDao.setTeamScore(gameId, teamId, time);
    return result;
};
