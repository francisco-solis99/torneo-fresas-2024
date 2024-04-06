// const query = db
//   .prepare(
//     `SELECT m.id AS match_id, g.name AS group_name,
//   d1.player1 AS player1_duo1,
//   d1.player2 AS player2_duo1,
//   d2.player1 AS player1_duo2,
//   d2.player2 AS player2_duo2,
//   m.points_d1,
//   m.points_d2,
//   p.name AS phase_name,
//   w.duo_id AS winner_id
//   FROM matches m
//   INNER JOIN duos d1 ON m.duo1_id = d1.id
//   INNER JOIN duos d2 ON m.duo2_id = d2.id
//   INNER JOIN groups g ON d1.group_id = g.id
//   INNER JOIN phases p ON m.phase_id = p.id
//   INNER JOIN winners w ON w.match_id = m.id`
//   )
//   .all();
// // console.log(query);

// // get the win matches per duo by group in phase 1
// const query2 = db
//   .prepare(
//     `
//     SELECT g.name AS group_name, d.id AS duo_id, d.player1, d.player2,
//        SUM(CASE WHEN w.duo_id = d.id THEN 1 ELSE 0 END) AS wins,
//        SUM(CASE WHEN m.duo1_id = d.id THEN m.points_d1 ELSE
//             CASE WHEN m.duo2_id = d.id THEN m.points_d2 ELSE 0 END
//        END) AS total_points
//     FROM groups g
//     INNER JOIN duos d ON g.id = d.group_id
//     INNER JOIN matches m ON d.id IN (m.duo1_id, m.duo2_id)
//     LEFT JOIN winners w ON m.id = w.match_id  -- Use LEFT JOIN for potential un-won matches
//     WHERE m.phase_id = 1 AND g.id = 1  -- Filter for phase_id and specific group
//     GROUP BY g.name, d.id, d.player1, d.player2
//     ORDER BY g.name, wins DESC;`
//   )
//   .all();
// // console.log(query2);

// // get the points by duo in the matches of phase 1
// const query3 = db
//   .prepare(
//     `
//     WITH RankedDuos AS (
//       SELECT g.name AS group_name, d.id AS duo_id, d.player1, d.player2,
//              COALESCE(SUM(CASE WHEN w.duo_id = d.id THEN 1 ELSE 0 END), 0) AS wins,
//              SUM(CASE WHEN m.duo1_id = d.id THEN m.points_d1 ELSE
//                   CASE WHEN m.duo2_id = d.id THEN m.points_d2 ELSE 0 END
//              END) AS total_points
//       FROM groups g
//       INNER JOIN duos d ON g.id = d.group_id
//       LEFT JOIN matches m ON d.id IN (m.duo1_id, m.duo2_id)  -- Use LEFT JOIN for all duos
//       LEFT JOIN winners w ON m.id = w.match_id  -- Use LEFT JOIN for potential un-won matches
//       WHERE m.phase_id = 1  -- Filter for phase_id and specific group
//       GROUP BY g.name, d.id, d.player1, d.player2
//     )
//     SELECT *
//     FROM RankedDuos
//     ORDER BY wins DESC, total_points DESC`
//   )
//   .all();
// // console.log(query3);
