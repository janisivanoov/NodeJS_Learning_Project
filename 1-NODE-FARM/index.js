const fs = require('fs');
const http = require('http');
const url = require('url');
const replaceTemplate = require('./modules/replaceTemplate');
const slugify = require('slugify');

//blocking code
const textIn = fs.readFile('./txt/input.txt', 'utf-8');
console.log(textIn);

const textOut = 'This is text: ${textIn}. \nCreated on ${Date.now()}';
fs.write('./txt/output.txt', textOut);
console.log('File written');

//non-blocking
fs.readFile('input.txt', 'utf-8', (err, data) => {
    console.log(data);
});
console.log('Reading file...');

fs.readFile('start.txt', 'utf-8', (err, data) => {
    if(err) return console.log('ERROR');
        fs.readFile('${data1}.txt', 'utf-8', (err, data2) =>{
                fs.readFile('append.txt', 'utf-8', (err, data3) => {
                        fs.writeFile('final.txt', '${data2}, ${data3}', 'utf-8', (err) => {
                                if(err) throw err;
                                console.log('File is done');
                        });
                });
        });
});

//////SERVER SIDE
const replaceTemplate1 = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = temp.replace(/{%IMAGE%}/g, product.image);
    output = temp.replace(/{%PRICE%}/g, product.price);
    output = temp.replace(/{%FROM%}/g, product.from);
    output = temp.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = temp.replace(/{%QUANTITY%}/g, product.quantity);
    output = temp.replace(/{%DESCRIPTION%}/g, product.description);
    output = temp.replace(/{%ID%}/g, product.id);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    return output;
}

const tempOverview = fs.readFileSync('${__dirname}/template/template-overview.html', 'utf-8');
const tempCard = fs.readFileSync('${__dirname/template/template-card.html', 'utf-8');
const tempProduct = fs.readFileSync('${__dirname/template/template-product.html', 'utf-8');

const data = fs.readFileSync('${__dirname}/dev-data/data.json', 'uft-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, {lower: true }));
console.log(slugs);

const server = http.createServer((req, res) => {
    const { query, pathName } = url.parse(req.url, true);

    if(pathName === '/overview' || pathName === '/') {
        res.writeHead(200, { 'Content-type': 'text/html'});
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        res.end(output);

    } else if (pathName === '/product'){
        res.writeHead(200, { 'Content-type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    } else if (pathName === '/api'){
        res.end('API');
        fs.readFile('${__dirname}/dev-data/data.json', 'uft-8', (err, data) => {
            const productData = JSON.parse(data);
            console.log(productData);
            res.writeHead(200, { 'Content-type': 'application/json'});
            res.end(data);
        });
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found</h1>');
    }

    res.end('Hello there!');
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening on 8000 port');
});
