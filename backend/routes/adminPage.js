var express =require('express')
var router = express.Router()


router.get('/',function(req,res){
    res.send('admin  area') 
});


router.get('/add-page',function(req,res){
    var title = ""
    var slug = ""
    var content = ""
    res.render('admin/add_pages',{
    title: title,
    slug: slug,
    content: content
    })
});

// exports
module.exports = router



