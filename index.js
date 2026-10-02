var express = require('express');
var app = express();
app.get('/hello', function (req, res) {
    res.send('Hello world');
});
app.post('/hello', function (req, res) {
    res.send("You just called the POST method at '/hello'!\n");
});
app.all('/test', function(req, res)
{
    res.send("HTTP method does'nt have an effect on this route!");

});

app.listen(3000);