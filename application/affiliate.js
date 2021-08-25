const affiliateRepository = require('../db/affiliate')

module.exports = {
  findOneAffiliate: (index, res) => {
    affiliateRepository.findOneAffiliate(index, function (err, result) {
      if (err) {
        res.status(404).send({ code: 'SQL ERROR', errorMessage: err })
      } else {
        res.send(result)
      }
    })
  }
}
