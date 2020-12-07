const http = require('http')
const url = require('url')
const fs = require('fs')
const replaceTemplate = require('./modules/replaceTemplate')

const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8')
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8')

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const productData = JSON.parse(data);

const server = http.createServer((req, res) => {
    const { query, pathname } = url.parse(req.url, true)
    //OVERVIEW
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(404, {
            'Content-type': 'text/html'
        })

        const cardsHTML = productData.map(product => replaceTemplate(tempCard, product)).join('')
        const output = tempOverview.replace('{%CARDS%}', cardsHTML)
        res.end(output)

        //PRODUCT
    } else if (pathname === '/product') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        const object = productData[query.id]
        const output = replaceTemplate(tempProduct, object)
        res.end(output)

        //API
    } else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json'
        })
        res.end(data)
    }
    // NOT FOUND
    else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        })
        res.end('<h1>Page Not Found</h1>')
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening from the server')
});
