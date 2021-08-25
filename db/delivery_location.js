const mysql = require('./mysql')

const connection = mysql.init()

module.exports = {
  findDeliveryLocation: (affiliateName, callback) => {
    const sql = `
        SELECT dl.dl_sido, dl.dl_gu 
        FROM delivery_location dl
        INNER JOIN affiliate a
        ON dl.dl_a_index = a.a_index
        WHERE a.a_name = '${affiliateName}'`

    return connection.query(sql, function (err, result) {
      if (err) {
        callback(err)
      } else {
        const deliveryLocationList = deliveryLocationListMapper(result)

        callback(null, deliveryLocationList)
      }
    })
  }
}

function deliveryLocationListMapper (deliveryLocations) {
  const deliveryLocationList = []
  const length = deliveryLocations.length

  for (let i = 0; i < length; i++) {
    deliveryLocationList.push({
      dl_sido: deliveryLocations[i].dl_sido,
      dl_gu: deliveryLocations[i].dl_gu
    })
  }

  return deliveryLocationList
}
