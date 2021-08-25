const carRepository = require('../db/car')
const affiliateRepository = require('../db/affiliate')
const calculatePrice = require('./calculate_price')
const checkOpenHour = require('./check_open_hour')

module.exports = {
  findOneCar: (index, res) => {
    carRepository.findOneCar(index, function (err, result) {
      if (err) {
        res.status(404).send({ code: 'SQL ERROR', errorMessage: err })
      } else {
        res.send(result)
      }
    })
  },
  findReservedCar: (carName, location, startTime, endTime, res) => {
    Promise.all(getInfoOfReservedCars(carName, location, startTime, endTime))
      .then((values) => {
        if (values[0] == null || values[1] == null) {
          console.log(values)
          res.status(404).send({ code: 'SQL ERROR', errorMessage: 'RESERVED CARS ERROR' })
        } else {
          res.send({ number_of_affiliate: values[0], number_of_car: values[1] })
        }
      })
  },
  findCarList: (location, startTime, endTime, res) => {
    affiliateRepository.findAffiliatesByLocation(location, function (err, affiliates) {
      if (err) {
        res.status(404).send({ code: 'SQL ERROR', errorMessage: err })
      } else {
        if (affiliates && affiliates.length) {
          Promise.all(getCarListAndPriceListAndPeakSeasonListAndAvailableAffiliate(affiliates, startTime, endTime))
            .then((values) => {
              if (!(values[0] && values[1] && values[2])) {
                res.status(404).send({ code: 'SQL ERROR', errorMessage: 'CAR LIST ERROR' })
              } else {
                try {
                  const carList = calculatePrice.calculatePriceOfCars(startTime, endTime, values[0], values[1], values[2])
                  res.send(carList)
                } catch (error) {
                  res.status(404).send({ code: 'CARCULATE PRICE ERROR', errorMessage: error })
                }
              }
            })
        }
        else {
          res.send({});
        }
      }
    })
  }
}

function getCarListAndPriceListAndPeakSeasonListAndAvailableAffiliate (affiliates, startTime, endTime) {
  const carListAndPriceList = new Promise(function (resolve, reject) {
    carRepository.findCarsAndPrices(affiliates, startTime, endTime, function (err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })

  const peakSeasonList = new Promise(function (resolve, reject) {
    affiliateRepository.findPeakSeasonOfAffiliates(affiliates, startTime, endTime, function (err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result)
      }
    })
  })

  const temporaryOpenHourList = new Promise(function (resolve, reject) {
    affiliateRepository.findTemporaryOpenHourOfAffiliates(affiliates, function (err, result) {
      if (err) {
        reject(err)
      } else {
        const availableAffiliates = checkOpenHour.findAvailableAffiliate(startTime, endTime, affiliates, result)
        resolve(availableAffiliates)
      }
    })
  })

  return [carListAndPriceList, peakSeasonList, temporaryOpenHourList]
}

function getInfoOfReservedCars (carName, location, startTime, endTime) {
  const numberOfAffiliates = new Promise(function (resolve, reject) {
    affiliateRepository.findNumberOfAffiliatesOfReservedCars(carName, location, startTime, endTime, function (err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result[0].count)
      }
    })
  })

  const numberOfCars = new Promise(function (resolve, reject) {
    carRepository.findNumberOfReservedCars(carName, location, startTime, endTime, function (err, result) {
      if (err) {
        reject(err)
      } else {
        resolve(result[0].count)
      }
    })
  })

  return [numberOfAffiliates, numberOfCars]
}
