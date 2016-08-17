var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var q = require('q');


function getArenavisionSchedule(){
    console.log(new Date().toISOString()+' - Arenavision: Getting Arenavision events from web!');
    request('http://arenavision.in/agenda', function (error, response, html) {
        if (!error && response.statusCode == 200) {

            var $ = cheerio.load(html);
            var events = [];

            var acestreamChannels = [];
            for(var i = 1; i<=30; i++)
                acestreamChannels.push(""+i);

            $('table').filter(function(){
                if (this.children.length > 10) {
                    for (var i = 1; i < this.children.length-2; i++) {
                        try{
                            var data = "", date = "", time = "", category = "", title = "", competition = "", channels = [];
                            data = this.children[i].children;
                            if (data) {

                                date = data[0].children[0].data;
                                time = data[2].children[0].data;
                                category = data[4].children[0].data;
                                competition = data[6].children[0].data;
                                data[8].children.forEach(function(part){
                                    if (typeof part.data === 'undefined')
                                        return;
                                    if (title === "")
                                        title = title.concat(part.data.replace('\n\t\t', ''));
                                    else
                                        title = title.concat(' ', part.data.replace('\n\t\t', ''));
                                });

                                data[10].children.forEach(function(channel){
                                    if ((typeof channel.data === 'undefined') || channel.data == " ")
                                        return;
                                    var cleanedChannel = channel.data.replace('\n\t\t', '');
                                    var chNumbers = cleanedChannel.split(' ')[0].split('-');
                                    var chLang = cleanedChannel.split(' ')[1].replace('[','').replace(']','');
                                    chNumbers.forEach(function(channel){
                                        if(acestreamChannels.indexOf(channel) >= 0)
                                            channels.push({
                                                name: channel,
                                                language: chLang,
                                                id: new mongoose.Types.ObjectId
                                            });
                                    });
                                });

                                date = new Date(date.substr(6, 4), date.substr(3, 2) - 1, date.substr(0, 2), time.substr(0, 2), time.substr(3, 2));
                                events.push({
                                    "title": title,
                                    "competition": competition,
                                    "category": category,
                                    "date": date,
                                    "streams": channels,
                                    "userPosts": []
                                });

                            }
                        } catch(error){
                            console.error(new Date().toISOString()+' - Parseando Arenavision: '+error);
                        }
                    }

                    promises = [];
                    for(var i = 1; i<=30; i++){
                        promises.push(refreshChannel(i));
                    }

                    q.all(promises)
                        .then(function(channels){
                            //sorting channel data
                            channels.sort(function(a,b) {return (a.channel > b.channel) ? 1 : ((b.channel > a.channel) ? -1 : 0);} );
                            //save events to database
                            events.forEach(function (event){
                                event.streams = event.streams.map(function(stream){
                                    channelInfo = channels[stream.name-1];
                                    return {
                                        name: stream.name,
                                        language: stream.language,
                                        link: channelInfo.link,
                                        linkId: channelInfo.linkId,
                                        type: channelInfo.type,
                                        rating: channelInfo.rating,
                                    };
                                });
                                request({
                                    url: 'http://localhost:3000/api/events', //URL to hit
                                    method: 'POST',
                                    json: event
                                }, function(error, response, body){
                                    if(error) {
                                        console.log(new Date().toISOString()+' - events.forEach: '+error);
                                    }
                                });
                            });
                        }).catch(function(error){
                            console.error(new Date().toISOString()+' - q.all error: '+error);
                        }
                    );

                }
            });
        }
    });
};




function refreshChannel(channelNumber){
    var deferred = q.defer();
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

                deferred.resolve({
                    channel: channelNumber,
                    name: channel,
                    linkId: linkId,
                    link: link,
                    type: "ACESTREAM",
                    rating: "5",
                    status: 'error'
                });
            });
        }
    });
    return deferred.promise;
};



module.exports = {
    GetSchedule : getArenavisionSchedule
};