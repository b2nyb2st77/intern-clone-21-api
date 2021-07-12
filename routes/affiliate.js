const express = require("express");
const router = express.Router();
const affiliate_repository = require("../db/affiliate");


// index로 렌트카 업체 하나의 정보 불러오기
router.get("/:index", function(req, res){
    const index = req.params.index;
    
    affiliate_repository.findOneAffiliate(index, function(err, result){
        if(err) throw err;
        res.send(result);
    })
});

module.exports = router;