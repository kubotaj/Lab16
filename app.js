// Module dependencies

var express    = require('express'),
    mysql      = require('mysql');

// Application initialization

var connection = mysql.createConnection({
        host     : 'localhost',
        user     : 'jkubota',
        password : '3924172'
    });
    
//var app = module.exports = express.createServer();
var app = express();

// Database setup

//connection.query('CREATE DATABASE IF NOT EXISTS jkubota', function (err) {
//    if (err) throw err;
    connection.query('USE jkubota', function (err) {
        if (err) throw err;
        connection.query('CREATE TABLE IF NOT EXISTS users('
            + 'CustomerID INT NOT NULL AUTO_INCREMENT,'
            + 'PRIMARY KEY(CustomerID),'
            + 'Name VARCHAR(30),'
            + 'Street VARCHAR(30),'
            + 'City VARCHAR(30),'
            + 'State VARCHAR(30),'
            + 'Zip VARCHAR(30),'
            + 'Phone VARCHAR(30)'
            +  ')', function (err) {
                if (err) throw err;
            });
    });
//});

// Configuration

app.use(express.bodyParser());

// Main route sends our HTML file

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});

app.get('/mystyle.css', function(req, res) {
    res.sendfile(__dirname + '/mystyle.css');
    });

app.get('/entercustomer.html', function(req, res) {
    res.sendfile(__dirname + '/entercustomer.html');
    });

app.get('/searchcustomer.html', function(req, res) {
    res.sendfile(__dirname + '/searchcustomer.html');
    });

// Update MySQL database
app.post('/entercustomer', function (req, res) {
    console.log(req.body);
    connection.query('INSERT INTO users SET ?', req.body, 
        function (err, result) {
            if (err) throw err;
	    connection.query('SELECT Name, Street, City, State, Zip, Phone FROM users WHERE Name = ?', req.body.name,
		function (err, result) {
		    console.log(result);
		    if(result.length > 0) {
			res.send('Data successfully submitted');
/*
//			res.send('Name: ' + result[0].Name + '<br />' +
//				 'Street: ' + result[0].Street + '<br />' +
//				 'City: ' +  + result[0].City + '<br />' +
//				 'State: ' +  + result[0].State + '<br />' +
//				 'Zip: ' +  + result[0].Zip + '<br />' +
//				 'Phone: ' +  + result[0].Phone
//				 );
*/
		    }
		    else
			res.send('Customer was not inserted.');
		    });
        }
    );
});

app.post('/searchcustomer', function (req, res) {
    console.log(req.body);
    connection.query('select * from users where name = ?', req.body.name,
                function (err, result) {
                    console.log(result);
                    if(result.length > 0) {
                      res.send('Name: ' + result[0].Name + '<br />' +
			       'Street: ' + result[0].Street + '<br />' +
			       'City: ' + result[0].City + '<br />' +
			       'State: ' + result[0].State + '<br />' +
			       'Zip: ' + result[0].Zip + '<br />' +
                               'Phone: ' + result[0].Phone
                      );
                    }
                    else
                      res.send('Customer does not exist.');
                });
});



// Begin listening

app.listen(8010);
console.log("Express server listening on port %d in %s mode", app.settings.env);
