import express from 'express';

const app = express();
const port = 3000;

//Home route
app.get('/', (req, res) => res.send('Hello world'));

//Start server
app.listen(port, () => console.log(`Example on port ${port}`));