const express = require('express')

const app = express()

app.get('/users', (req, res) => {
    res.json('Users list 1')
})

app.listen(5001, () => {
    console.log('Server started at port 5001')
})