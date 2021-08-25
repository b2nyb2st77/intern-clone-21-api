const mysql = require('../db/mysql')

const connection = mysql.init()

module.exports = {
  findLocations: (callback) => {
    const sql = `
        SELECT l_index, l_name, l_type, l_popular_or_not, l_immediate_or_not, l_subname
        FROM location`

    return connection.query(sql, function (err, result) {
      if (err) {
        callback(err)
      } else {
        const locationList = locationListMapper(result)

        callback(null, locationList)
      }
    })
  },
  searchLocation: (searchWord, callback) => {
    const sql = `
        SELECT DISTINCT l_index, l_name, l_immediate_or_not
        FROM location
        WHERE l_name LIKE '%${searchWord}%'`

    return connection.query(sql, function (err, result) {
      if (err) {
        callback(err)
      } else {
        const locationList = locationListMapper(result)

        callback(null, locationList)
      }
    })
  }
}

function locationListMapper (locations) {
  const locationList = []
  const length = locations.length

  for (let i = 0; i < length; i++) {
    const location = {}
    location.l_index = locations[i].l_index
    location.l_name = locations[i].l_name
    location.l_immediate_or_not = locations[i].l_immediate_or_not

    if (locations[i].l_type) {
      location.l_type = locations[i].l_type
    }

    if (locations[i].l_popular_or_not) {
      location.l_popular_or_not = locations[i].l_popular_or_not
    }

    if (locations[i].l_subname) {
      location.l_subname = locations[i].l_subname
    }

    locationList.push(location)
  }

  return locationList
}
