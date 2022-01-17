const express = require('express')
const async = require('hbs/lib/async')
const app = express()
const port = process.env.PORT || 4000
const mongoose = require('mongoose')
const path = require('path')
const bcrypt = require('bcryptjs')

mongoose
  .connect('mongodb://localhost:27017/regAndLog')
  .then(console.log('Connection successful'))
  .catch((e) => console.log(e))

const firstSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
})

const collection = new mongoose.model('collection', firstSchema)

app.set('view engine', 'hbs')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/register', (req, res) => {
  res.render('register')
})

// const securePassword = async (password) => {
//   const passwordHash = await bcrypt.hash(password, 10)
//   console.log(passwordHash)
//   const passwordCheck = await bcrypt.compare(password, passwordHash)
//   console.log(passwordCheck)
// }
// securePassword('Emon123')

app.post('/register', async (req, res) => {
  try {
    const securePassword = async (userPassword) => {
      const passHash = await bcrypt.hash(userPassword, 10)
      console.log(passHash)
      const db = collection({
        email: req.body.email,
        password: passHash,
      })
      const result = await db.save()
      res.render('registration')
    }
    securePassword(req.body.password)
  } catch (error) {
    res.send('error')
  }
})

app.post('/login', async (req, res) => {
  try {
    const userEmail = req.body.email
    const userPassword = req.body.password
    const db = await collection.findOne({ email: userEmail })
    const passwordCheck = await bcrypt.compare(userPassword, db.password)
    if (passwordCheck) {
      res.render('valid')
    } else {
      res.render('error')
    }
  } catch (error) {
    console.log(error)
  }
})

app.get('/', (req, res) => {
  res.render('home')
})
app.get('/login', (req, res) => {
  res.render('login')
})

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
