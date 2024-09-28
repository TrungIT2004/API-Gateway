const express = require('express')

const app = express()

app.get('/users', (req, res) => {
    res.json('Users list 2')
})

app.listen(5002, () => {
    console.log('Server started at port 5002')
})