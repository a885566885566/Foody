/*
 * Foody, an assistant to help you determine what to eat
 * CC, Yencheng, Chu, All rights deserved.
 */

const express = require('express')
const app = express()
const port = 10418;
const foodFilename = 'food_list.json';
var fs = require("fs");
var foodStr = fs.readFileSync(foodFilename);
var foodObj = JSON.parse(foodStr);

function ifExist(target, foo_list){
    var count = 0
    foo_list.forEach((foo)=>{
        if(target.name == foo.name && target.classes == foo.classes)
            count += 1
    })
    if (count != 0) return true
    return false
}

function saveJson(obj){
    var content = JSON.stringify(obj)
    fs.writeFile(foodFilename, content, 'utf8', (err)=>{
        if (err)
            console.log("Error to write file")
    })
}
app.use(express.static(__dirname + '/public'))
console.log("Prepare done");

app.get("/add", (req, res)=>{
    var new_food = {
        "name":req.query.name,
        "classes":req.query.classes,
        "price_up":req.query.price_up,
        "price_low":req.query.price_low
    }
    if ( ifExist(new_food, foodObj.food) ){
        res.send("已經有這個店家資料囉!")
    }
    else{
        foodObj.food.push(new_food)
        console.log(new_food)
        saveJson(foodObj)
        res.send("ok")
    }
})
app.get("/initial", (req, res)=>{
    res.send({
        "#select_class":foodObj.classes
    })
})

app.get("/random", (req, res)=>{
    var food = foodObj.food
    var foo_list = []
    var req_class = req.query.classes
    var req_price_up = req.query.price_up
    var req_price_low = req.query.price_low
    if (req_class == "沒意見")
        foo_list = food
    else{
        food.forEach( (foo)=>{
            if( foo.classes == req_class)
                foo_list.push(foo)
        })
    }
    var foo_result = []
    foo_list.forEach((foo)=>{
        if(foo.price_up > req_price_low && 
            foo.price_low < req_price_up)
            foo_result.push(foo)
    })

    res.send(foo_result)
})
app.listen(port)
