const mysql = require('../db/mysql')

const connection = mysql.init()

module.exports = {
  findOneAffiliate: (index, callback) => {
    const sql = `
        SELECT a_index, a_name, a_info, a_number_of_reservation, a_grade, a_new_or_not, a_open_time, a_close_time, a_weekend
        FROM affiliate 
        WHERE a_index = ?`

    return connection.query(sql, index, function (err, result) {
      if (err) {
        callback(err)
      } else {
        callback(null, result)
      }
    })
  },
  findAffiliatesByLocation: (location, callback) => {
    const sql = `
        SELECT a.a_index, a_open_time, a_close_time
        FROM affiliate a
        INNER JOIN location l
        ON a.a_l_index = l.l_index
        WHERE l.l_index = '${location}'`

    return connection.query(sql, function (err, result) {
      if (err) {
        callback(err)
      } else {
        const affiliateList = affiliateListMapper(result)

        callback(null, affiliateList)
      }
    })
  },
  findTemporaryOpenHourOfAffiliates: (affiliates, callback) => {
    const sql = `
        SELECT atoh_a_index, atoh_start_date, atoh_end_date, atoh_open_time, atoh_close_time
        FROM affiliate_temporary_open_hour
        WHERE atoh_a_index IN (${affiliates.map(item => item.affiliate_index).join(',')})
              AND atoh_delete_or_not = 'n'`

    return connection.query(sql, function (err, result) {
      if (err) {
        callback(err)
      } else {
        const temporaryOpenHourList = temporaryOpenHourListMapper(result)

        callback(null, temporaryOpenHourList)
      }
    })
  },
  findPeakSeasonOfAffiliates: (affiliates, startTime, endTime, callback) => {
    const sql = `
        SELECT ps.ps_a_index, ps.ps_start_date, ps.ps_end_date
        FROM peak_season ps
        INNER JOIN affiliate a
        ON ps.ps_a_index = a.a_index
        WHERE ps_delete_or_not = 'n'
              AND a.a_index IN (${affiliates.map(item => item.affiliate_index).join(',')})
              AND ((ps.ps_start_date <= '${startTime}' AND '${startTime}' <= 'ps.ps_end_date') 
                    OR (ps.ps_start_date <= '${endTime}' AND '${endTime}' <= 'ps.ps_end_date') 
                    OR (ps.ps_start_date >= '${startTime}' AND ps.ps_end_date <= '${endTime}'));`

    return connection.query(sql, function (err, result) {
      if (err) {
        callback(err)
      } else {
        const peakSeasonList = peakSeasonListMapper(result)

        callback(null, peakSeasonList)
      }
    })
  },
  findNumberOfAffiliatesOfReservedCars: (carName, location, startTime, endTime, callback) => {
    const sql = `
        SELECT COUNT(S.name) count
        FROM (SELECT a.a_name name
              FROM rentcar_status rs
              INNER JOIN car c
              INNER JOIN affiliate a
              INNER JOIN rentcar_reservation rr
              INNER JOIN location l
              ON rs.rs_c_index = c.c_index
                 AND rs.rs_a_index = a.a_index
                 AND rs.rs_index = rr.rr_rs_index
                 AND a.a_l_index = l.l_index
              WHERE c.c_name = '${carName}'
                    AND rr.rr_cancel_or_not = 'n'
                    AND l.l_index = '${location}'
                    AND a.a_open_time <= '${startTime}' AND a.a_close_time >= '${startTime}'
                    AND a.a_open_time <= '${endTime}' AND a.a_close_time >= '${endTime}'
                    AND ((rr.rr_start_time <= '${startTime}' AND '${startTime}' <= rr.rr_end_time) 
                          OR (rr.rr_start_time <= '${endTime}' AND '${endTime}' <= rr.rr_end_time)
                          OR ('${startTime}' <= rr.rr_start_time AND rr.rr_end_time <= '${endTime}'))
                    GROUP BY a.a_name) AS S;`

    return connection.query(sql, function (err, result) {
      if (err) {
        callback(err)
      } else {
        callback(null, result)
      }
    })
  }
}

function affiliateListMapper (affiliates) {
  const affiliateList = []
  const length = affiliates.length

  for (let i = 0; i < length; i++) {
    affiliateList.push({
      affiliate_index: affiliates[i].a_index,
      open_time: affiliates[i].a_open_time,
      close_time: affiliates[i].a_close_time
    })
  }

  return affiliateList
}

function temporaryOpenHourListMapper (temporaryOpenHours) {
  const temporaryOpenHourList = []
  const length = temporaryOpenHours.length

  for (let i = 0; i < length; i++) {
    temporaryOpenHourList.push({
      affiliate_index: temporaryOpenHours[i].atoh_a_index,
      start_date: temporaryOpenHours[i].atoh_start_date,
      end_date: temporaryOpenHours[i].atoh_end_date,
      open_time: temporaryOpenHours[i].atoh_open_time,
      close_time: temporaryOpenHours[i].atoh_close_time
    })
  }

  return temporaryOpenHourList
}

function peakSeasonListMapper (peakSeasons) {
  const peakSeasonList = []
  const length = peakSeasons.length

  for (let i = 0; i < length; i++) {
    peakSeasonList.push({
      affiliate_index: peakSeasons[i].ps_a_index,
      start_date: peakSeasons[i].ps_start_date,
      end_date: peakSeasons[i].ps_end_date
    })
  }

  return peakSeasonList
}
