let express=require('express')
let app=express();
let bodyParser=require('body-parser');

let db=[]
let path2Views=__dirname+"/views/"
app.use(express.static('image'));
app.use(express.static('css'));
app.engine("html",require("ejs").renderFile);
app.set('view engine',"html")
app.use(bodyParser.urlencoded({
    extended:false
}))

app.get('/',function(req,res){
    res.sendFile(path2Views+"index.html")
});
app.get('/addNewTask',function(req,res){
    res.sendFile(path2Views+"addNewTask.html")
});

app.post('/addingNewTask',function(req,res){
    console.log(req.body);
    db.push(req.body)
    res.render(path2Views+"listTask.html",{
        task:db
    })
})

app.get('/listTask',function(req,res){
    res.render(path2Views+"listTask.html",{
        task:db
    })
});

app.listen(8080);