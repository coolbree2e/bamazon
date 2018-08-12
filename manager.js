// links to the npms
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table");
// connection to mysql
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "JaxandSam6",
    database: "bamazon"
})

// connects to DB
connection.connect(function (err) {
    if (err) throw err;
    console.log("It's working and here's the number for proof " + connection.threadId);
    console.log("");
    console.log("");
    console.log("");
    console.log("           Welcome to The Bamazon!!!!!!!       ");
    console.log("-------------------------------------------------------------");
    // showProuducts();
});
managerChoice();
// let's the manager view all the products, see whats low, add quantity to existing product and add a new product
function managerChoice() {
    inquirer.prompt([{
        type: "list",
        name: 'manager',
        choices: ["See what's for sale", "See what's low", "Add some stuff", "Add a whole new thing", "Leave"],
        message: "What are you going to do ?"
    }]).then(function (ans) {
        switch (ans.manager) {
            case "See what's for sale":
                showProuducts();
                break;
            case "See what's low":
                lowStuff();
                break;
            case "Add some stuff":
                addStuff();
                break;
            case "Add a whole new thing":
                newStuff();
                break;
            case "Leave":
                Leave();
                break;
            default:
                console.log("You have to choose something");
        }
    })
}
// shows all the cool stuff for sale
function showProuducts() {
    let choseAry = [];
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        console.table(res);
        for (let i = 0; i < res.length; i++) {
            choseAry.push(res[i].product_name)
        }
        managerChoice();
    });
}

function Leave() {
    console.log('')
    console.log("Have the day you deserve");
    console.log('')

    connection.end();
}
// shows what quantity is lower than 5
function lowStuff() {
    console.log("Here's what we're running low on");
    connection.query("SELECT * FROM products", function (err, res) {
        // console.log(res);
        if (err) throw err;
        // console.log(res[0].quantity);
        for (let i = 0; i < res.length; i++) {
            if (res[i].quantity <= 5) {
                console.log("");
                console.log(`We're getting low on ${res[i].product_name} we only have ${res[i].quantity}`);
                console.log("");
            }
        }
        managerChoice();
    });
}
// lets the user add to the quantity of the selected product
function addStuff() {
    //    console.log("-------------")
    connection.query("SELECT * FROM products", function (err, res) {
        let addAry = [];
        for (let i = 0; i < res.length; i++) {
            addAry.push(res[i].product_name);

        } 
        console.log(addAry)

        inquirer.prompt([{
                name: "add",
                message: "what would you like more of",
                choices: addAry
            },
            {
                type:"input",
                name: "quant",
                message: "How many would you like to add ?",
                validate: function(value){
                    if(isNaN(value) === false){return true;}
                    else{return false;}
              
            }
        }
        ]).then(function(ans){
            var exsQty;
            for (let i = 0; i < res.length; i++) {
                if(res[i].product_name === ans.add){
                    exsQty = res[i].quantity;
                }
            }
            connection.query("UPDATE products SET ? WHERE ?",[{
                quantity: exsQty + parseInt(ans.quant)
            },
            {
                product_name: ans.add 
            }
        ], function(err,res){
            if(err)throw err;
            console.log("");
            console.log("We've got more of it now");
            console.log("");
            managerChoice();
        })
        })

        
    })
}
// and Finally the last function that enables the manager  to add a whole new product
function newStuff(){
    // console.log("============")
    let newDept = [];
    connection.query("SELECT department_name FROM products",function(err,res){
        if(err) throw err;
        for(i=0;i < res.length;i++){
            newDept.push(res[i].department_name)
        }
        console.log(newDept,"---------");
    })
    inquirer.prompt([
        {
            name:"product",
            type:"input",
            message:"What new badass thing would you like to add ?",
            validate: function(value){
                if(value){return true;}
                else{return false;}
              }
        },
        {
            name:"list",
            type:"input",
            message:"What new or existing Department ?",
            choices: newDept
        },
        {
            name:"price",
            type:"input",
            message:"How much wuld you like to charge ? ",
            validate: function(value){
                if(isNaN(value) === false){return true;}
                else{return false;}
        }
        
        },
        {
            name:"quantity",
            type:"input",
            message:"How many do you really want to add ? (Think of the guys in the warehouse)",
            validate: function(value){
                if(isNaN(value) === false){return true;}
                else{return false;}
          
        }
    }
    ]).then(function(ans){
        connection.query("INSERT INTO products SET ?", {
            product_name : ans.product,
            price: ans.price,
            quantity: ans.quantity,
            department_name: ans.list
        },function (err,res){
            if(err)throw err;
            console.log("You really don't care about the warhouse guys do you. ")
        }
    )
    managerChoice();
    })
}