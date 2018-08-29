var db=require('../dbconnection'); //reference of dbconnection.js
 
var Task={
 
getAllTasks:function(callback,tablename){
 
return db.query("Select * from "+tablename,callback);
 
},
 getTaskById:function(id,callback,tablename){
 
return db.query("select * from "+tablename+" where Id=?",[id],callback);
 },
 addTask:function(Task,callback,tablename){
 return db.query("Insert into "+tablename+" values(?,?,?)",[Task.Id,Task.Title,Task.Status],callback);
 },
 deleteTask:function(id,callback,tablename){
  return db.query("delete from "+tablename+" where Id=?",[id],callback);
 },
 updateTask:function(id,Task,callback,tablename){
  return db.query("update "+tablename+" set Title=?,Status=? where Id=?",[Task.Title,Task.Status,id],callback);
 }
 
};
 module.exports=Task;