const db = require('../utils/dbConnPool/mariadb');

exports.getTeamList = async () => {
    const sql = `
        SELECT
            team_id AS teamId,
            team_name AS teamName
        FROM
            team
    `;
    return await db.query(sql);
};

exports.getTeamInfo = async (teamId) => {
    const sql = `
        SELECT
            team_id AS teamId,
            team_name AS teamName,
            user1_id AS user1Id,
            user2_id AS user2Id,
            user3_id AS user3Id,
            user4_id AS user4Id
        FROM
            team
        WHERE
            team_id = ?
    `;
    const sqlParams = [teamId];
    return await db.query(sql, sqlParams);
};

exports.getGameId = async (machineKey) => {
    const sql = `
        SELECT
            game_id AS gameId,
            game_name AS gameName
        FROM
            game
        WHERE
            machine_key = ?
    `;
    const sqlParams = [machineKey];
    return await db.query(sql, sqlParams);
};

exports.getTeamRanking = async () => {
    const sql = `
        SELECT
            (@row_number:=@row_number + 1) AS sort,
            team_id AS teamId,
            team_name AS teamName,
            DATE_FORMAT(game1_time, '%Y-%m-%d %H:%i:%s') AS game1Time,
            DATE_FORMAT(game2_time, '%Y-%m-%d %H:%i:%s') AS game2Time,
            DATE_FORMAT(game3_time, '%Y-%m-%d %H:%i:%s') AS game3Time,
            DATE_FORMAT(last_time, '%Y-%m-%d %H:%i:%s') AS lastTime
        FROM
            score,
            (SELECT @row_number := 0) AS t
        ORDER BY 
            (IF(game1_time IS NOT NULL AND game1_time <> '', 1, 0) + IF(game2_time IS NOT NULL AND game2_time <> '', 1, 0) + IF(game3_time IS NOT NULL AND game3_time <> '', 1, 0)) DESC,
            last_time ASC
    `;
    return await db.query(sql);
};

exports.getTeamId = async (captainId) => {
    const sql = `
        SELECT
            team_id AS teamId,
            team_name AS teamName,
            user1_id AS captainId
        FROM
            team
        WHERE
            user1_id = ?
    `;
    const sqlParams = [captainId];
    return await db.query(sql, sqlParams);
};

exports.setTeamScore = async (gameId, teamId, time) => {
    const sql = `
        UPDATE
            score
        SET
            game${gameId}_time = ?,
            last_time = ?
        WHERE
            team_id = ?
    `;
    const sqlParams = [time, time, teamId];
    return await db.query(sql, sqlParams);
};
