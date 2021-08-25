const dayjs = require('dayjs')

const TOTAL_HOURS_OF_1DAY = 24

module.exports = {
  calculatePriceOfCars: (startTime, endTime, carAndPriceList, peakSeasonList, availableAffiliates) => {
    const startDate = dayjs(startTime)
    const endDate = dayjs(endTime)
    const day = endDate.diff(startDate, 'day')
    let hour = endDate.diff(startDate, 'hour') % TOTAL_HOURS_OF_1DAY

    if (startDate.minute() !== endDate.minute()) {
      hour++
    }

    const carList = findAvailableCarList(carAndPriceList, availableAffiliates)

    const length = carList.length

    for (let i = 0; i < length; i++) {
      let totalPriceOfCar = 0

      const priceListOfCar = carList[i].price_list
      const [priceOfWeekend, priceOfWeekdays, priceOfPeakSeason] = classifyPriceListByPriceType(priceListOfCar)
      const peakSeasonOfAffiliate = peakSeasonList.filter(peakSeason => peakSeason.affiliate_index === carList[i].a_index)
      const weekendsOfAffiliate = carList[i].a_weekend

      const [numberOfPeakSeasonDays, numberOfWeekdays, numberOfWeekends, typeOfLastDay] =
            calculateNumberOfEachTypeOfDaysAndFindTypeOfLastDay(startDate, endDate, peakSeasonOfAffiliate, weekendsOfAffiliate)

      const totalDayPriceOfCar = calculateDayPrice(day, numberOfWeekends, numberOfWeekdays, numberOfPeakSeasonDays, priceOfWeekend, priceOfWeekdays, priceOfPeakSeason)

      if (!~totalDayPriceOfCar) {
        return new Error('NEGATIVE DAY ERROR')
      }

      totalPriceOfCar += totalDayPriceOfCar

      if (hour === 0) {
        carList[i].car_price = totalPriceOfCar
        continue
      }

      switch (typeOfLastDay) {
        case 'weekend':
          totalPriceOfCar += calculateHourPrice(hour, priceOfWeekend[0])
          break
        case 'weekdays':
          totalPriceOfCar += calculateHourPrice(hour, priceOfWeekdays[0])
          break
        case 'peakseason':
          totalPriceOfCar += calculateHourPrice(hour, priceOfPeakSeason[0])
          break
        default:
          return new Error('TYPE OF LAST DAY ERROR')
      }

      carList[i].car_price = totalPriceOfCar
    }

    return carList.map(({ price_list, ...rest }) => rest)
  }
}

function findAvailableCarList (carAndPriceList, availableAffiliates) {
  const carList = []
  const length = carAndPriceList.length

  for (let k = 0; k < length; k++) {
    const foundAvailableAffiliate = availableAffiliates.find(element => element === carAndPriceList[k].a_index)
    if (foundAvailableAffiliate) {
      carList.push({ ...carAndPriceList[k] })
    }
  }

  return carList
}

function classifyPriceListByPriceType (priceListOfCar) {
  const priceOfWeekend = []
  const priceOfWeekdays = []
  const priceOfPeakSeason = []
  const length = priceListOfCar.length

  for (let k = 0; k < length; k++) {
    switch (priceListOfCar[k].price_type) {
      case 'weekend':
        priceOfWeekend.push(priceListOfCar[k])
        break
      case 'weekdays':
        priceOfWeekdays.push(priceListOfCar[k])
        break
      case 'peakseason':
        priceOfPeakSeason.push(priceListOfCar[k])
        break
      default:
        return new Error('PRICE TYPE ERROR')
    }
  }

  return [priceOfWeekend, priceOfWeekdays, priceOfPeakSeason]
}

function calculateNumberOfEachTypeOfDaysAndFindTypeOfLastDay (startDate, endDate, peakSeasonOfAffiliate, weekendsOfAffiliate) {
  let numberOfPeakSeasonDays = 0
  let numberOfWeekdays = 0
  let numberOfWeekends = 0
  let typeOfLastDay = ''

  const weekends = weekendsOfAffiliate.split(', ')
  const length = peakSeasonOfAffiliate.length

  for (let date = startDate; date <= endDate; date = date.add(1, 'day')) {
    let isDayPeakSeason = false

    if (peakSeasonOfAffiliate && length) {
      for (let k = 0; k < length; k++) {
        const peakSeasonStartDate = dayjs(peakSeasonOfAffiliate[k].start_date)
        const peakSeasonEndDate = dayjs(peakSeasonOfAffiliate[k].end_date)

        if (isDateBetweenStartDateAndEndDate(date, peakSeasonStartDate, peakSeasonEndDate)) {
          isDayPeakSeason = true

          if (isDateSame(date, endDate)) {
            typeOfLastDay = 'peakseason'
          } else {
            numberOfPeakSeasonDays++
          }
        }
      }

      if (isDayPeakSeason) {
        continue
      }
    }

    const day = date.day().toString()

    if (isDateSame(date, endDate)) {
      typeOfLastDay = (!~weekends.indexOf(day)) ? 'weekdays' : 'weekend'
    } else {
      (!~weekends.indexOf(day)) ? numberOfWeekdays++ : numberOfWeekends++
    }
  }

  return [numberOfPeakSeasonDays, numberOfWeekdays, numberOfWeekends, typeOfLastDay]
}

function isDateSame (date1, date2) {
  return (date1.diff(date2, 'day') === 0)
}

function isDateBetweenStartDateAndEndDate (date, start, end) {
  return (date.diff(start, 'day') >= 0 && end.diff(date, 'day') >= 0)
}

function calculateDayPrice (day, numberOfWeekends, numberOfWeekdays, numberOfPeakSeasonDays, priceOfWeekend, priceOfWeekdays, priceOfPeakSeason) {
  let totalDayPriceOfCar = 0

  if (day >= 7) {
    totalDayPriceOfCar += numberOfWeekends * priceOfWeekend[0].price_of_7_days
    totalDayPriceOfCar += numberOfWeekdays * priceOfWeekdays[0].price_of_7_days
    totalDayPriceOfCar += numberOfPeakSeasonDays * priceOfPeakSeason[0].price_of_7_days
  } else if (day === 5 || day === 6) {
    totalDayPriceOfCar += numberOfWeekends * priceOfWeekend[0].price_of_5_or_6_days
    totalDayPriceOfCar += numberOfWeekdays * priceOfWeekdays[0].price_of_5_or_6_days
    totalDayPriceOfCar += numberOfPeakSeasonDays * priceOfPeakSeason[0].price_of_5_or_6_days
  } else if (day === 3 || day === 4) {
    totalDayPriceOfCar += numberOfWeekends * priceOfWeekend[0].price_of_3_or_4_days
    totalDayPriceOfCar += numberOfWeekdays * priceOfWeekdays[0].price_of_3_or_4_days
    totalDayPriceOfCar += numberOfPeakSeasonDays * priceOfPeakSeason[0].price_of_3_or_4_days
  } else if (day === 1 || day === 2) {
    totalDayPriceOfCar += numberOfWeekends * priceOfWeekend[0].price_of_1_or_2_days
    totalDayPriceOfCar += numberOfWeekdays * priceOfWeekdays[0].price_of_1_or_2_days
    totalDayPriceOfCar += numberOfPeakSeasonDays * priceOfPeakSeason[0].price_of_1_or_2_days
  } else {
    return -1
  }

  return totalDayPriceOfCar
}

function calculateHourPrice (hour, hourPrice) {
  let totalHourPriceOfCar = 0

  if (hourPrice.price_of_12_hours !== 0 && hour >= 12) {
    hour = hour % 12
    totalHourPriceOfCar += hourPrice.price_of_12_hours

    if (hourPrice.price_of_6_hours !== 0 && hour >= 6) {
      hour = hour % 6
      totalHourPriceOfCar += hourPrice.price_of_6_hours

      if (hour > 0) {
        totalHourPriceOfCar += hour * hourPrice.price_of_1_hour
      }
    }
  } else if (hourPrice.price_of_6_hours !== 0 && hour >= 6) {
    hour = hour % 6
    totalHourPriceOfCar += Math.floor(hour / 6) * hourPrice.price_of_6_hours

    if (hour > 0) {
      totalHourPriceOfCar += hour * hourPrice.price_of_1_hour
    }
  } else {
    totalHourPriceOfCar += hour * hourPrice.price_of_1_hour
  }

  return totalHourPriceOfCar
}
