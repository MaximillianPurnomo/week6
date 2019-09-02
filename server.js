let express = require("express");
const bodyparser = require('body-parser');
let mongodb=require('mongodb');
const mongoClient=mongodb.MongoClient;
let app=express();

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('image'));
app.use(express.static('css'));
app.use(bodyparser.urlencoded({ extended: false }));

let db=null;
let coll2=null;
let coll=null;
let url="mongodb://localhost:27017";
let path2Views=__dirname+'/views/';

mongoClient.connect(url,{useNewUrlParser:true},function(err,client){
    if (err){
        console.log('error',err);
    }
    else{
        console.log("Connectedto the db successfully");
        db=client.db('taskDB');
        coll=db.createCollection('task');
        coll2=db.collection('task');
    }
})

app.get('/',function(req,res){
    console.log("homepage request");
    res.sendFile(path2Views+"index.html");
})

app.get('/addNewTask',function(req,res){
    res.sendFile(path2Views+"addNewTask.html")
});

app.post('/addingNewTask',function(req,res){
    let parts=(req.body.taskDue).split('-');
    let date=new Date(parts[0],parts[1]-1,parts[2]);
    let myObj={'id':Math.round(Math.random()*1000),'name':req.body.taskName,'dueDate':date,'assignTo':req.body.assignTo,'status':req.body.taskStat,'description':req.body.taskDesc}
    coll2.insertOne(myObj);
    res.redirect('/listTask')
})

app.get('/listTask',function(req,res){
    let query={};
    coll2.find(query).toArray(function(err,data){
    res.render(path2Views+'listTask.html',{task:data});        
    })
})

app.get('/deleteID',function(req,res){
    res.sendFile(path2Views+"deleteID.html")
});

app.post('/deletingID',function(req,res){
    let query={id:parseInt(req.body.id)};
    coll2.deleteOne(query,function(err,obj){
        console.log(obj.result);
        res.redirect('/listTask')
    })
})

app.get('/deleteCompletedPage',function(req,res){
    res.sendFile(path2Views+"deleteCompleted.html")
});

app.get('/deleteAllCompleted',function(req,res){
    let query={status:'complete'};
    coll2.deleteMany(query,function(err,obj){
        console.log(obj.result);
        res.redirect('/listTask')
    })
});

app.get('/updateStatusPage',function(req,res){
    res.sendFile(path2Views+"updateStatus.html")
});

app.post('/updatingStatus',function(req,res){
    let query={id:parseInt(req.body.id)};
    coll2.updateOne(query,{$set:{status:req.body.newStatus}},{upsert:false},function(err,obj){
        console.log(obj.result);
        res.redirect('/listTask')
    })
})

app.get('/findtask/:A/:B',function(req,res){
    let query={id:{$gte:parseInt(req.params.A)},id:{$lte:parseInt(req.params.B)}};
    coll2.find(query).toArray(function(err,data){
        res.send(data);        
    })
})

app.listen(8080);