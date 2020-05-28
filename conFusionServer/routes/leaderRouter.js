const express =require('express');
const bodyParser=require('body-parser');
const mongoose =require('mongoose');

const leaders =require('../modals/leaders');

var authenticate = require('../authenticate');
const leaderRouter=express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/')
.get(authenticate.verifyUser,(req,res,next)=>{
    leaders.find({})
    .then((leaders)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.post(authenticate.verifyUser,(req,res,next)=>{
    leaders.create(req.body)
    .then((leaders)=>{
        console.log('Leaders Created ',leaders);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    },(err)=>next(err))
    .catch((err)=>next(err));
})
.put(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('PUT operation not supported on /leaders');
})
.delete(authenticate.verifyUser,(req,res,next)=>{
    leaders.remove({})
    .then((resp)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
}); 

leaderRouter.route('/:leaderId')

.get(authenticate.verifyUser,(req,res,next)=>{
    leaders.findById(req.params.leaderId)
    .then((leaders)=>{
        console.log('Leader Created ',leaders);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.post(authenticate.verifyUser,(req,res,next)=>{
    res.statusCode=403;
    res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})

.put(authenticate.verifyUser,(req,res,next)=>{
   leaders.findByIdAndUpdate(req.params.leaderId,{
       $set: req.body
   },{new: true})
   .then((leaders)=>{
    console.log('Leader Created ',leaders);
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(leaders);
    },(err)=>next(err))
    .catch((err)=>next(err));
})

.delete(authenticate.verifyUser,(req,res,next)=>{
   leaders.findByIdAndRemove(req.params.leaderId)
   .then((resp)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json');
    res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err));
}); 

module.exports=leaderRouter;