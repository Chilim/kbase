import express from 'express';
// import path from 'path';


const app = express();

//Set view engine
app.set('view engine', 'pug');
//Home route
app.get('/', (req, res) => res.render('index', { title: 'hello' }));
  
//Start server
app.listen(3000, () => console.log('Example on port 3000'));