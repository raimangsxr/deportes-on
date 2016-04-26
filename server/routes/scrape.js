var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var router = express();

router.get('/', function(req, res){

    url = 'http://arenavision.in/av1';

    request(url, function(error, response, html){
        if(!error){
            var $ = cheerio.load(html);
            var result = [];

            //<a href="acestream://572242ad5b1b717e2371fcddd8b9337217961ddf" target="_blank">
            $('a[href*="acestream://"]').filter(function(){
                var data = $(this);
                var acestreamIdLink = data.attr('href');
                var acestreamId = acestreamIdLink.split('/')[2];
            })
        }

        // To write to the system we will use the built in 'fs' library.
        // In this example we will pass 3 parameters to the writeFile function
        // Parameter 1 :  output.json - this is what the created filename will be called
        // Parameter 2 :  JSON.stringify(json, null, 4) - the data to write, here we do an extra step by calling JSON.stringify to make our JSON easier to read
        // Parameter 3 :  callback function - a callback function to let us know the status of our function

        fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){

            console.log('File successfully written! - Check your project directory for the output.json file');

        })

        // Finally, we'll just send out a message to the browser reminding you that this app does not have a UI.
        res.send('Check your console!')

    }) ;
})






/*
 var express = require('express');
 var router = express.Router();

 router.get('/', function(req, res, next) {
 res.render('index', { title: 'Express' });
 });
 */



module.exports = router;