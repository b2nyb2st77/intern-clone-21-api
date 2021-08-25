const dayjs = require('dayjs')

module.exports = {
  findAvailableAffiliate: (startDateAndTime, endDateAndTime, affiliates, temporaryOpenHourList) => {
    const startDate = dayjs(startDateAndTime)
    const startTime = dayjs(startDateAndTime).format('HH:mm:ss')
    const endDate = dayjs(endDateAndTime)
    const endTime = dayjs(endDateAndTime).format('HH:mm:ss')

    const availableAffiliates = []

    for (let i = 0; i < affiliates.length; i++) {
      const temporaryOpenHoursOfAffiliate = findTemporaryOpenHoursOfAffiliate(affiliates[i], temporaryOpenHourList)

      const usuallyOpenTime = affiliates[i].open_time
      const usuallyCloseTime = affiliates[i].close_time

      if (!temporaryOpenHoursOfAffiliate.length) {
        if (isTimeBetweenStartTimeAndEndTime(startTime, usuallyOpenTime, usuallyCloseTime) && isTimeBetweenStartTimeAndEndTime(endTime, usuallyOpenTime, usuallyCloseTime)) {
          availableAffiliates.push(affiliates[i].affiliate_index)
        }
        continue
      }

      for (let k = 0; k < temporaryOpenHoursOfAffiliate.length; k++) {
        const [isStartTimeOk, isEndTimeOk] =
                checkIfAvailiableOnStartTimeAndEndTime(temporaryOpenHoursOfAffiliate[k], startDate, startTime, endDate, endTime, usuallyOpenTime, usuallyCloseTime)

        if (isStartTimeOk && isEndTimeOk) {
          availableAffiliates.push(affiliates[i].affiliate_index)
        }
      }
    }

    return availableAffiliates
  }
}

function findTemporaryOpenHoursOfAffiliate (affiliate, temporaryOpenHourList) {
  const temporaryOpenHoursOfAffiliate = []
  const length = temporaryOpenHourList.length

  for (let k = 0; k < length; k++) {
    if (affiliate.affiliate_index === temporaryOpenHourList[k].affiliate_index) {
      temporaryOpenHoursOfAffiliate.push(temporaryOpenHourList[k])
    }
  }

  return temporaryOpenHoursOfAffiliate
}

function isTimeBetweenStartTimeAndEndTime (time, start, end) {
  return (start <= time && time <= end)
}

function isDateBetweenStartDateAndEndDate (date, start, end) {
  return (date.diff(start, 'day') >= 0 && end.diff(date, 'day') >= 0)
}

function checkIfAvailiableOnStartTimeAndEndTime (temporaryOpenHoursOfAffiliate, startDate, startTime, endDate, endTime, usuallyOpenTime, usuallyCloseTime) {
  let isAvailiableOnStartTime = false
  let isAvailiableOnEndTime = false

  const temporaryStartDate = dayjs(temporaryOpenHoursOfAffiliate.start_date)
  const temporaryEndDate = dayjs(temporaryOpenHoursOfAffiliate.end_date)
  const temporaryOpenTime = temporaryOpenHoursOfAffiliate.open_time
  const temporaryCloseTime = temporaryOpenHoursOfAffiliate.close_time

  if (isDateBetweenStartDateAndEndDate(startDate, temporaryStartDate, temporaryEndDate) && isTimeBetweenStartTimeAndEndTime(startTime, temporaryOpenTime, temporaryCloseTime)) {
    isAvailiableOnStartTime = true
  } else if (!isDateBetweenStartDateAndEndDate(startDate, temporaryStartDate, temporaryEndDate) && isTimeBetweenStartTimeAndEndTime(startTime, usuallyOpenTime, usuallyCloseTime)) {
    isAvailiableOnStartTime = true
  }

  if (isDateBetweenStartDateAndEndDate(endDate, temporaryStartDate, temporaryEndDate) && isTimeBetweenStartTimeAndEndTime(endTime, temporaryOpenTime, temporaryCloseTime)) {
    isAvailiableOnEndTime = true
  } else if (!isDateBetweenStartDateAndEndDate(endDate, temporaryStartDate, temporaryEndDate) && isTimeBetweenStartTimeAndEndTime(endTime, usuallyOpenTime, usuallyCloseTime)) {
    isAvailiableOnEndTime = true
  }

  return [isAvailiableOnStartTime, isAvailiableOnEndTime]
}
