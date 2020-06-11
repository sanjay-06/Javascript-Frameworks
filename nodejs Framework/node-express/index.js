const express =require('express');
const http =require('http');
const morgon=require('morgan');
const bodyParser =require('body-parser');

//Routers for dishes,leaders,promotions
const dishRouter=require('./routes/dishRouter');
const promoRouter=require('./routes/promoRouter');
const leaderRouter=require('./routes/leaderRouter');


const hostname='localhost';
const port =3000;

const app =express();
app.use(morgon('dev'));
app.use(bodyParser.json());

//handling requests using the Routers
app.use('/dishes',dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);


app.use(express.static(__dirname+'/public'));

app.use((req,res,next)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/html');
    res.end('<html><body><h1>This is an express Server</h1></body></html>');
});

const server =http.createServer(app);

server.listen(port,hostname,()=>{
    console.log(`Server running at http://${hostname}:${port}`);
});