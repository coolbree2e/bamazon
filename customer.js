
// links to the npms
var mysql = require ("mysql");
var inquirer = require("inquirer");
var table = require("console.table");
// connection to mysql
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user:"root",
    password:"JaxandSam6",
    database:"bamazon"
})

// connects to DB
connection.connect(function(err){
    console.log("It's working and here's the number for proof " + connection.threadId);
    console.log("");
    console.log("");
    console.log("");
    console.log("           Welcome to The Bamazon!!!!!!!       ");
    console.log("-------------------------------------------------------------");
    showProuducts();
});
// shows all the cool stuff for sale
function showProuducts(){
    let choseAry = [];
    connection.query("SELECT * FROM products", function(err,res){
if (err) throw err;
console.table(res);
for (let i= 0; i < res.length; i++) {
    choseAry.push(res[i].product_name)
}
custInput(choseAry);
    });
}

// asks the user what they would like to purchase
function custInput(choices){
    inquirer.prompt([
        {
            type: "list",
            message: "What amazing thing would you like today?",
            choices: choices,
            name:"choose"
        },
        {
            type:"input",
            message:"How many would you like ?",
            name: "quant"
        }
    ]).then(function(ans){
        // console.log(ans);
        let sku = ans.choose;
        let quantity = ans.quant;
        // console.log(sku);
        // console.log(quantity);
        isThereEnough(sku,quantity);
    })
}
// this is to make sure there is enough of what the user chooses
function isThereEnough(sku,quantity){
    connection.query("SELECT quantity, price FROM products WHERE product_name = ?",[sku],function(err,results){
        if(err) throw err;
        // console.log(quantity);
        let skuLeft = results[0].quantity;
        // console.log(skuleft);
        let skuPrice = results[0].price;
        // console.log(skuPrice);
        let newInventory = skuLeft - quantity;
        // console.log(newInventory);
        let total = skuPrice * quantity;
        if (newInventory > -1){
                //   my btother-in-law taught me this \/ \/ it's so much easier to concat things
                console.log("")
            console.log(`Congrats on your new ${sku} you now have ${quantity} of them for $ ${total}`);
                console.log("")
            // changes to the DB 
            updateDB(newInventory,sku);
        }else {
            console.log("")
            console.log("Tough luck buddy, we're out or don't have enough to fill the order.")
            console.log("")
            againPrompt();
        }
    })
}
        function updateDB (newInventory,sku){
            connection.query("UPDATE products SET ? WHERE ?",[
                {
                    quantity:newInventory
                },
                {
                   product_name:sku 
                }
            ],function(err,results){
                againPrompt()
            }
        )
        }
        function againPrompt(){
            inquirer.prompt([
                {
                    type: "confirm",
                    message:"Is there anything else you'd like ? An attack Helicopter maybe? ",
                    name:"again"
                }
            ]).then(function(ans){
                if(ans.again){
                    showProuducts();
                }else{
                    console.log("Thank you for shopping with The Bamazon!")
                    connection.end()
                }
            })
        }

        // for (let i= 0; i < res.length; i++) {
            // console.log("ID " + res[i].id +" | "+ "Deparment " + res[i].department_name +" | " + "Name of product:  " + res[i].product_name +" | " + "Price  " + res[i].price + " | "+" How many are left  " + res[i].quantity);   
          
    

//         var punch = [];
//         for (let i = 0; i < res.length; i++) {
//             punch.push(res[i].price+" "+ res[i].product_name +" "+ res[i].id ) 
//         }
//         inquirer.prompt([
//             {type:"list",
//             message:"What item would you like to purchase ?",
//             // choices: ["Donkey Kong Price 15.25","Mario Bros. Price 23.5 ","Space Invaders  Price 1.25 ","Burton Snowboard Price 350.45 ","Smith Gloves Price 69.33","Lamborghini Diablo Price  349,049.99 ","M1 Abrams Tank Price 950,456.03 "," AH-64 Apache Price 2,112,466.89","Sims Boots Price 295.44 ","Pac-man Price 13 "],
//            choices:punch,
//             name:"chose"
//         },
//         {
//             type:"input",
//             message:"How many would you like ?",
//             name:"amount",
//             validate: function(value){
//                 if(isNaN(value)){
//                   return false;
//                 } else{
//                   return true;
//                 }
//               }
//         }
//         ]).then(function(ans){
//             var match = ans.chose.match(/\S*$/)[0] 
//             if (ans.amount <= res.quantity){
//               var test = "UPDATE products SET quantity = quantity-? WHERE id=?"
//                 connection.query(test,[ans.amount,match],function(err,res){
                   
//                     if(err)throw err;
//                     console.log("Successful purchase");
//                 })
//             }else {
//                 console.log("Tough shit we're out");

//             }

//         })
//     })
// }
// connection.end()

