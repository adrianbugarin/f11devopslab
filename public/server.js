const express = require('express')
const app = express()
const path = require(`path`)

// include and initialize the rollbar library with your access token
var Rollbar = require('rollbar')
var rollbar = new Rollbar({
  accessToken: 'c9c7b95bdadf4bae974c5afc3243bdb0',
  captureUncaught: true,
  captureUnhandledRejections: true,
})

// record a generic message and send it to Rollbar
rollbar.log('Hello world!')


app.use(express.json())

const students = [`Adrian`, `Spencer`, `Norman`]

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'))
})

app.get(`/api/students`, (req, res) => {
    rollbar.info('A user requested the list of students')
    res.status(200).send(students)
})


app.post(`/api/students`, (req, res) => {
    let {name} = req.body

    const index = students.findIndex(student => {
        return student === name
    })

    try{
        if (index === -1 && name !== ``){
            students.push(name)
            rollbar.info('Someone added a student.')
            res.status(200).send(students)
        } else if (name === ``) {
            rollbar.error('Someone tried to enter a blank student')
            res.status(400).send(`must enter a student name`)
        } else {
            rollbar.error('Someone tried to enter a duplicate student')
            res.status(400).send(`that student already exists`)
        }
    } catch (err) {
        console.log(err)
    }
})

app.delete(`/api/students/:index`, (req, res) => {
    const targetIndex = +req.params.index

    students.splice(targetIndex, 1)

    rollbar.info('Someone added a student')

    res.status(200).send(students)
})


const port = process.env.PORT || 5050

app.listen(port, () => console.log(`port runnning on ${port}`))