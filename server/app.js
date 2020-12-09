var screenshot = require('desktop-screenshot')

var express = require('express')
var fs = require('fs')
var app = express()
var bodyParser = require('body-parser')
app.use(bodyParser.json()) // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })) // support encoded bodies
const cors = require('cors')
app.use(cors())

app.post('/dataupload', function(req, res) {
  const body = req.body

  fs.readFile('./saved data/saveddata.json', (err, data) => {
    if (err) return res.send({ status: 'failed to read' })
    var dataarray = JSON.parse(data)
    dataarray.push(body)
    fs.writeFile(
      './saved data/saveddata.json',
      JSON.stringify(dataarray),
      (err, result) => {
        if (err) res.send({ status: 'failed to save' })
        else res.send({ status: 'ok' })
      }
    )
  })

  screenshot(
    `./saved data/screenshots/${body.date}.png`,
    { width: 1000, quality: 60 },
    (error, complete) => {
      if (error) console.log('Screenshot failed', error)
      else console.log('Screenshot succeeded')
    }
  )
})

app.listen(3008, () => {
  console.log('Server running on port 3008')
})
