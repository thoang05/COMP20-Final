const express = require('express')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 5000


express()
  .use(express.static(path.join(__dirname, 'public')))
  // .set('views', path.join(__dirname, 'views'))
  // .set('view engine', 'ejs')
  .get('/home', (req, res) =>
                res.sendFile(path.join(__dirname, 'public/meal.html')))
  .get('/meal', (req, res) =>
                res.sendFile(path.join(__dirname, 'public/meal.html')))
  .get('/drink', (req, res) =>
                res.sendFile(path.join(__dirname, 'public/drink.html')))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))