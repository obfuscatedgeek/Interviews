var http = require("http")
    ,alRoutes = []
    ,url = require("url")
;


alRoutes['/boxes'] = require('./boxes');
alRoutes['/box'] = require('./box');

DATA = [
    "1, 033​12​001, Eckart Hubertus, Steindamm 80, Macbook / Clothes"
    ,"2, 072​72​001, Albert Sigi, Reeperbahn 153, Macbook / Toys"
    ,"3, 121​52​002, Rochus Meinrad, Steindamm 36, Xbox / Book Guide to Hamburg"
    ,"4, 020​42​001, Henning Erik, Sternstrasse 125, Book Cooking 10 / Clothes"
    ,"5, 121​01​999, Lukas Wessel, Ottenser Hauptstrasse 24, Inline Skates"
    ,"6, 060​12​001, Gabi Elias, Reeperbahn 10, Playstation / Controller / Games"
    ,"7, 092​02​000, Axel Arndt, Lagerstrasse 11, Flux compensator / Customs / Shoes / Paper"
    ,"8, 120​82​000, Arthur Justus, Reeperbahn 83, Inline Skates / iPad"
];


function onRequest(req, res) {
    var pathname = url.parse(req.url).pathname
        ,funcName = req.method.toLowerCase()+(pathname.substring(1,2).toUpperCase())+(pathname.substring(2));

    if(alRoutes[pathname] && alRoutes[pathname][funcName]) {
        alRoutes[pathname][funcName](req, res);
    } else {
        if(pathname === '/find') {
            alRoutes['/box']['findBox'](req, res);
        } else if(pathname === '/findBoxes') {
            alRoutes['/boxes']['findBoxes'](req, res);
        } else {
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.write("Incorrect request");
            res.end();
        }
    }
};

http.createServer(onRequest).listen(8888);