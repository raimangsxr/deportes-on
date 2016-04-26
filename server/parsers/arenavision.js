var request = require('request');
//var request = require('sync-request');
var cheerio = require('cheerio');


function getArenavisionSchedule(){
    request('http://arenavision.in/agenda', function (error, response, html) {
        if (!error && response.statusCode == 200) {

            var $ = cheerio.load(html);
            var events = [];

            var acestreamChannels = [];
            for(var i = 1; i<=20; i++)
                acestreamChannels.push(""+i);

            $('p').filter(function(){
                if (this.children.length > 10) {
                    for (var i = 0; i < this.children.length; i++) {
                        try{
                            var data = "", dataSplitted = "", date = "", category = "", categoryLength = 0, title = "", channels = [];
                            data = this.children[i].data;
                            if (data) {
                                data = data.replace('\n', '');

                                //Fecha
                                date = data.match(/^\d{2}\/\d{2}\/\d{2} \d{2}:\d{2}/g)[0];
                                date = new Date("20" + date.substr(6, 2), date.substr(3, 2) - 1, date.substr(0, 2), date.substr(9, 2), date.substr(12, 2));

                                //Category
                                category = data.match(/CET \w+\s*[\w\s]*:/g)[0];
                                categoryLength = category.length - 5;
                                category = category.substr(4, categoryLength);

                                //Title
                                dataSplitted = data.split(':')[1];
                                dataSplitted = data.split(':')[2].split('/AV');
                                title = dataSplitted[0].trim();

                                //Channels
                                for (var j = 1; j < dataSplitted.length; j++) {
                                    if ((acestreamChannels.indexOf(dataSplitted[j]) >= 0)
                                        && (channels.indexOf(dataSplitted[j]) == -1))

                                        channels.push('AV' + dataSplitted[j]);
                                }

                                events.push({
                                    "title": title,
                                    "category": category,
                                    "date": date,
                                    "channels": channels
                                });
                            }
                        } catch(error){
                            console.error('Parseando Arenavision: '+error);
                        }
                    }
                    //save events to database
                    events.forEach(function (event){
                        request({
                            url: 'http://localhost:3000/api/events', //URL to hit
                            //qs: {from: 'blog example', time: +new Date()}, //Query string data
                            method: 'POST',
                            json: {
                                "title": event.title,
                                "category": event.category,
                                "date": event.date,
                                "streams": event.channels,
                                "userPosts": []
                            }
                        }, function(error, response, body){
                            if(error) {
                                console.log(error);
                            } else {
                                console.log(response.statusCode);
                            }
                        });
                    });
                }
            });
        }
    });
};

function refreshArenavisionChannels(){
    for(var i = 1; i<=20; i++){
        refreshChannel(i);
    }
}


function refreshChannel(channelNumber){
    var streams = [];
    var channel = "av"+channelNumber;
    request('http://arenavision.in/'+channel, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            var $ = cheerio.load(html);

            //<link rel="canonical" href="/av1"/>
            $('link[rel="canonical"]').filter(function(){
                var data = $(this);
                channel = data.attr('href').substr(1,4).split('/')[0];
            });

            //<a href="acestream://572242ad5b1b717e2371fcddd8b9337217961ddf" target="_blank">
            $('a[href*="acestream://"]').filter(function(){
                var data = $(this);
                var link = data.attr('href');
                var linkId = link.split('/')[2];

                //get stream info from database
                request({
                    url: 'http://localhost:3000/api/streams/'+channel, //URL to hit
                    method: 'GET'
                    },
                    function(error, response, body){
                        if(error) {
                            console.log('Arenavision: ERROR cant getting '+channel+' stream info: '+error);
                        } else {
                            if(body === "{}"){ //Cant find the stream
                                console.log('Arenavision: WARN cant find stream '+channel);
                                //create new stream to database
                                request({
                                    url: 'http://localhost:3000/api/streams', //URL to hit
                                    method: 'POST',
                                    json: {
                                        "_id": channel,
                                        "linkId": linkId,
                                        "link": link,
                                        "type": "ACESTREAM",
                                        "language": "Español",
                                        "rating": "5"
                                    }
                                }, function(error, response, body){
                                    if(error) {
                                        console.log('Arenavision: ERROR creating new stream '+channel+': '+error);
                                    } else {
                                        console.log('Arenavision: created new stream '+channel+': '+response.statusCode);
                                    }
                                });
                            }
                            else{
                                //console.log('Arenavision: GET '+channel+' stream info: '+response.statusCode);
                                //update stream to database
                                request({
                                    url: 'http://localhost:3000/api/streams', //URL to hit
                                    method: 'PUT',
                                    json: {
                                        "_id": channel,
                                        "linkId": linkId,
                                        "link": link,
                                        "type": "ACESTREAM",
                                        "language": "Español",
                                        "rating": "5"
                                    }
                                }, function(error, response, body){
                                    if(error) {
                                        console.log('Arenavision: ERROR updating '+channel+' stream: '+error);
                                    } else {
                                        console.log('Arenavision: updated '+channel+' stream: '+response.statusCode);
                                    }
                                });
                            }
                        }
                    });
            });
        }
    });
};



module.exports = {
    GetSchedule : getArenavisionSchedule,
    RefreshChannels: refreshArenavisionChannels
};