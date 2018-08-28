var mysql=require('mysql');
var connection=mysql.createPool({
 	host:'localhost',
	user:'root',
	password:'yZb0P4cG19bgBWmqUCvVvVS8rFehvnVQxOLlMKct0plBeUWI1e_zLXQ',
	database:'postapp'
});
module.exports=connection;
