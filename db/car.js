const mysql = require('../db/mysql')

const connection = mysql.init()

module.exports = {
  findCarsAndPrices: (affiliates, startTime, endTime, callback) => {
    const sql = `
        SELECT c.c_index, c.c_type, c.c_name, c.c_max_number_of_people, c.c_gear, c.c_number_of_load, c.c_number_of_door, c.c_air_conditioner_or_not, c.c_production_year, c.c_fuel,
               c.c_description, c.c_driver_age, a.a_index, a.a_name, a.a_info, a.a_number_of_reservation, a.a_grade, a.a_new_or_not, a.a_weekend, rs.rs_index, 
               p.p_1_or_2_days, p.p_3_or_4_days, p.p_5_or_6_days, p.p_7_days, p.p_1_hour, p.p_6_hours, p.p_12_hours, p.p_type
        FROM rentcar_status rs
        INNER JOIN car c
        INNER JOIN affiliate a
        INNER JOIN price p
        ON rs.rs_c_index = c.c_index
            AND rs.rs_a_index = a.a_index
            AND p.p_rs_index = rs.rs_index
        WHERE a.a_index IN (${affiliates.map(item => item.affiliate_index).join(',')})
              AND rs.rs_index NOT IN (SELECT distinct rs.rs_index
                                      FROM rentcar_status rs
                                      INNER JOIN rentcar_reservation rr
                                      ON rs.rs_index = rr.rr_rs_index
                                      WHERE rr.rr_cancel_or_not = 'n'
                                            AND ((rr.rr_start_time <= '${startTime}' AND '${startTime}' <= rr.rr_end_time) 
                                                  OR (rr.rr_start_time <= '${endTime}' AND '${endTime}' <= rr.rr_end_time)
                                                  OR ('${startTime}' <= rr.rr_start_time AND rr.rr_end_time <= '${endTime}'))
                                     )
        ORDER BY FIELD(c.c_type, '경형', '소형', '준중형', '중형', '대형', '수입', 'RV', 'SUV'), c.c_name, a.a_name ASC`
    
    return connection.query(sql, function (err, result) {
      if (err) {
        callback(err)
      } else {
        const carList = carAndPriceListMapper(result)

        callback(null, carList)
      }
    })
  },
  findNumberOfReservedCars: (carName, location, startTime, endTime, callback) => {
    const sql = `
        SELECT COUNT(*) count
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
                    OR ('${startTime}' <= rr.rr_start_time AND rr.rr_end_time <= '${endTime}'));`

    return connection.query(sql, function (err, result) {
      if (err) {
        callback(err)
      } else {
        callback(null, result)
      }
    })
  },
  findOneCar: (index, callback) => {
    const sql = `
        SELECT c_index, c_type, c_name, c_max_number_of_people, c_gear, c_number_of_load, c_number_of_door, c_air_conditioner_or_not, c_production_year, c_fuel, c_description, c_driver_age 
        FROM car 
        WHERE c_index = ?`

    return connection.query(sql, index, function (err, result) {
      if (err) {
        callback(err)
      } else {
        callback(null, result)
      }
    })
  }
}

function carAndPriceListMapper (carsAndPrices) {
  const carList = []
  const length = carsAndPrices.length

  for (let i = 0; i < length; i++) {
    const [isSameCarInList, carIndex] = findArrayIndexIfCarIsInList(carList, carsAndPrices[i])

    if (isSameCarInList) {
      carList[carIndex].price_list.push({
        price_of_1_or_2_days: carsAndPrices[i].p_1_or_2_days,
        price_of_3_or_4_days: carsAndPrices[i].p_3_or_4_days,
        price_of_5_or_6_days: carsAndPrices[i].p_5_or_6_days,
        price_of_7_days: carsAndPrices[i].p_7_days,
        price_of_1_hour: carsAndPrices[i].p_1_hour,
        price_of_6_hours: carsAndPrices[i].p_6_hours,
        price_of_12_hours: carsAndPrices[i].p_12_hours,
        price_type: carsAndPrices[i].p_type
      })

      continue
    }

    carList.push({
      c_index: carsAndPrices[i].c_index,
      c_type: carsAndPrices[i].c_type,
      c_name: carsAndPrices[i].c_name,
      c_max_number_of_people: carsAndPrices[i].c_max_number_of_people,
      c_gear: carsAndPrices[i].c_gear,
      c_number_of_load: carsAndPrices[i].c_number_of_load,
      c_number_of_door: carsAndPrices[i].c_number_of_door,
      c_air_conditioner_or_not: carsAndPrices[i].c_air_conditioner_or_not,
      c_production_year: carsAndPrices[i].c_production_year,
      c_fuel: carsAndPrices[i].c_fuel,
      c_description: carsAndPrices[i].c_description,
      c_driver_age: carsAndPrices[i].c_driver_age,
      a_index: carsAndPrices[i].a_index,
      a_name: carsAndPrices[i].a_name,
      a_info: carsAndPrices[i].a_info,
      a_number_of_reservation: carsAndPrices[i].a_number_of_reservation,
      a_grade: carsAndPrices[i].a_grade,
      a_new_or_not: carsAndPrices[i].a_new_or_not,
      a_weekend: carsAndPrices[i].a_weekend,
      rs_index: carsAndPrices[i].rs_index,
      price_list: [{
        price_of_1_or_2_days: carsAndPrices[i].p_1_or_2_days,
        price_of_3_or_4_days: carsAndPrices[i].p_3_or_4_days,
        price_of_5_or_6_days: carsAndPrices[i].p_5_or_6_days,
        price_of_7_days: carsAndPrices[i].p_7_days,
        price_of_1_hour: carsAndPrices[i].p_1_hour,
        price_of_6_hours: carsAndPrices[i].p_6_hours,
        price_of_12_hours: carsAndPrices[i].p_12_hours,
        price_type: carsAndPrices[i].p_type
      }]
    })
  }

  return carList
}

function findArrayIndexIfCarIsInList (carList, carAndPrice) {
  let isSameCarInList = false
  let carIndex = 0
  const length = carList.length

  for (let k = 0; k < length; k++) {
    if (carList[k].rs_index === carAndPrice.rs_index) {
      isSameCarInList = true
      carIndex = k
      break
    }
  }

  return [isSameCarInList, carIndex]
}
