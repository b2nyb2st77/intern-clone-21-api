const locationRepository = require('../db/location')

module.exports = {
  findLocations: (res) => {
    locationRepository.findLocations(function (err, result) {
      if (err) {
        res.status(404).send({ code: 'SQL ERROR', errorMessage: err })
      } else {
        res.send(result)
      }
    })
  },
  searchLocation: (searchWord, res) => {
    locationRepository.searchLocation(searchWord, function (err, result) {
      if (err) {
        res.status(404).send({ code: 'SQL ERROR', errorMessage: err })
      } else {
        res.send(result)
      }
    })
  }
}
