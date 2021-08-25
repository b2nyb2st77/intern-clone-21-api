const deliveryLocationRepository = require('../db/delivery_location')

module.exports = {
  findDeliveryLocation: (affiliateName, res) => {
    deliveryLocationRepository.findDeliveryLocation(affiliateName, function (err, result) {
      if (err) {
        res.status(404).send({ code: 'SQL ERROR', errorMessage: err })
      } else {
        res.send(result)
      }
    })
  }
}
