var express =require('express');
const { registerUser, gsmLogin, emailLogin, getLogin } = require('../controller/controller');
var router = express.Router()



router.get('/',function(req,res){
    res.render('index',{
        title: "Home"
    });
});

// router.get('/',function(req,res){
//     res.render('index',{
//         title: "Home"
//     });
// });

router.get('/login', getLogin);

router.post("/register",registerUser)
router.post("/gsm-login",gsmLogin)
router.post("/email-login",emailLogin)


// exports
module.exports = router



