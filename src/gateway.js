const express = require('express')
const cors = require('cors')
var cookieParser = require('cookie-parser')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()

const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `windowMs`
    message: 'Too many requests from this IP, please try again after 5 minutes',
    headers: true, // Send rate limit info in response headers
})

// Middlewares
app.use(cors({
    origin: 'localhost:3000',
    credentials: true,
}))

app.use(cookieParser())
app.use(helmet())
app.use(limiter)

// Lists of serivces A
const services = {
    serviceA: ['http://localhost:5001', 'http://localhost:5002'],
}

// Round Robin algorithm 
let index = -1
// Load balancing function 
function loadBalance(serviceName) {
    index++
    const servers = services[serviceName]
    if (index % 2 === 0) return servers[0]
    return servers[1]
}

// Proxy to service A
app.use('/service-a', (req, res, next) => {
    const target = loadBalance('serviceA')
    console.log(`Proxying request to Service A at ${target}`)
    createProxyMiddleware({
        target: `${target}/users`,
        changeOrigin: true,
    })(req, res, next)
})

app.get('/', (req,res) => {
    res.json('PORT 5000')
})

app.listen(5000, () => {
    console.log('Server started at port 5000')
})