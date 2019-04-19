const express = require('express')
const app = express()
const axios = require('axios')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const PRIVATE_KEY = 'S2Taedkg4hGEiYH8y'

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
});

app.use(cookieParser('pswd'))
    .use(session({ resave: true, saveUninitialized: false, cookie: { httpOnly: true, maxAge: 600000 } }))
    .use(function (req, res, next) {
        let sess = req.session;
        if (sess.location && req.query.location == sess.location) {
            res.status(304).end()
            console.log('缓存')
        } else {
            next()
        }
    })

const appRoutes = express.Router()

appRoutes.get('/', (req, res) => {
    let query = req.query,//{location:'xinxiang'}
        location = query.location;
    res.set('Content-Type', 'text/html');
    if (!location) {
        res.status(400).end('请输入合法的查询参数，如"?location=beijing"');
        return
    } else {
        let url = `https://api.seniverse.com/v3/weather/now.json?key=${PRIVATE_KEY}&location=${location}&language=zh-Hans&unit=c`
        axios.get(url)
            .then(response => {
                let data = response.data,
                    mes = data ? data : '所查询信息不存在',
                    st = data ? 200 : 204,
                    sess = req.session;
                sess.location = location;
                sess.weatherData = mes;
                res.status(st).json(mes);
                console.log('请求')
            })
            .catch(e => {
                console.log(e)
                res.status(500).end('Server Error')
            })
    }
})

app.use('/getWeather', appRoutes)

app.listen(7999)