const mysql = require('mysql');
const express = require('express');
var app = express();
const bodyparser = require('body-parser');

app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true
});

mysqlConnection.connect((err)=>{
    if(!err){
        console.log('DB connection succeeded.');
    }else{
        console.log('DB connection failed. \n Error : ' + JSON.stringify(err, undefined, 2));
    }
});


app.listen(3000, ()=>console.log('Express server is running at port 3000...'));

// Get All Employee
app.get('/employees',(req, res)=>{
    mysqlConnection.query('SELECT * FROM employeedb.employee', (err, rows, fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});

// Get an Employee
app.get('/employees/:id',(req, res)=>{
    mysqlConnection.query('SELECT * FROM employeedb.employee WHERE employeedb.employee.EmpID = ?', [req.params.id],(err, rows, fields)=>{
        if(!err){
            res.json(rows);
        }else{
            console.log(err);
        }
    });
});


// Delete an Employee
app.delete('/employees/:id',(req, res)=>{
    mysqlConnection.query('DELETE FROM employeedb.employee WHERE employeedb.employee.EmpID = ?', [req.params.id],(err, rows, fields)=>{
        if(!err){
            res.json('Deleted successfully');
        }else{
            console.log(err);
        }
    });
});

// Insert an Employee
app.post('/employees',(req, res)=>{
    let emp = req.body;
    var sql = "SET @EmpID = ?; SET @Name = ?; SET @EmpCode = ?; SET @Salary = ?; CALL \
    employeedb.EmployeeAddOrEdit(@EmpID, @Name, @EmpCode, @Salary);";
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary],(err, rows, fields)=>{
        if(!err){
            rows.forEach(element => {
                if(element.constructor == Array){
                    res.json('Inserted Employee ID : ' + element[0].EmpID);
                }
            });

            // res.json(rows);
        }else{
            console.log(err);
        }
    });
});

// UPDATE an Employee
app.put('/employees',(req, res)=>{
    let emp = req.body;
    var sql = "SET @EmpID = ?; SET @Name = ?; SET @EmpCode = ?; SET @Salary = ?; CALL \
    employeedb.EmployeeAddOrEdit(@EmpID, @Name, @EmpCode, @Salary);";
    mysqlConnection.query(sql, [emp.EmpID, emp.Name, emp.EmpCode, emp.Salary],(err, rows, fields)=>{
        if(!err){
         res.json('Updated successfully');
             
        }else{
            console.log(err);
        }
    });
});