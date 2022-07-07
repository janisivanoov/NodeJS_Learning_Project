module.exports = (temp, product) => {
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