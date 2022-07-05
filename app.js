import express from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import date from './date.js';
import mongoose from 'mongoose';
import _ from 'lodash';

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"))
app.set('view engine', 'ejs');
 
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

await mongoose.connect('mongodb+srv://admin-Niru:Niru123@cluster0.ezrpx.mongodb.net/todolistDB');
const listSchema = new mongoose.Schema({
    item: {
        type:String,
        required:true
    },
  });
  
const Item = mongoose.model('Item', listSchema);


const myitem1 = new Item({
    item:"Welcome to todoList '+' button to add 'checkbox' to delete"
});

const myItemList =[myitem1]

  
const customlistSchema = new mongoose.Schema({
    listName: String,
    list: [listSchema]
});


const List = mongoose.model('List', customlistSchema);


var day=date();

// import day from path.join(__dirname, "date.js");
app.get("/", (req, res) => {
    

    Item.find( function(err, items){
        if(items.length===0){
            Item.insertMany(myItemList, function(err){
                if(err){
                    console.log(err);
                }
                else{
                    console.log("success in inserting!🥳")
                }
              });
            res.redirect("/");
        }
        else{
            res.render('lists', {dayAndDate: day, newListItems: items});
        }
      });

    // res.sendFile(path.join(__dirname, "index.html"));
}) /*app.get("/",function(req,res){
    res.sendFile(path.join(__dirname,"index.html"));
}) */

app.get("/:customTodo", (req,res)=>{
    const customName=_.capitalize(req.params.customTodo);

    List.findOne({listName:customName}, function(err,foundList){
        if(!err){
            if(!foundList){
                console.log("Doesn't exists!");
                //create new list
                const newList = new List({
                    listName:customName,
                    list:myItemList
                  });
            
                newList.save();
                res.redirect(path.join("",customName));
                  
            }
            else{
                console.log("Exists!");
                //show existing list
                res.render('lists', {dayAndDate: customName, newListItems: foundList.list});
            }
        }
    })

    
});

app.post("/", (req, res) => {
    const new_item = req.body.newItem;
    const list_name=req.body.List_Name;
    const myNewItem = new Item({
        item:new_item
      });

    if(list_name===day){
        myNewItem.save();
        res.redirect("/");
    }
    else{
        List.findOne({listName:list_name}, function(err,foundList){
                foundList.list.push(myNewItem);
                foundList.save();
                res.redirect(path.join("",list_name));
        });
    }

})

app.post("/delete",(req,res)=>{
    // console.log(req.body.deleteItem);
    const deleteId =req.body.deleteItem;
    const customDelete =req.body.CustomDelete;

    if(customDelete===day)
    {
        Item.findByIdAndRemove(deleteId, function(err){
            if(err){
                console.log(err);
            }
            else{
                console.log("success in deletion!🥳");
                res.redirect("/");
            }
          });
    }
    else{
        List.findOneAndUpdate({listName:customDelete}, {$pull:{list:{_id:deleteId}}},function(err,foundList){
            if(!err){
                res.redirect(path.join("",customDelete));
            };
    });
}
    
})

app.get("/about", (req, res) => {
    res.render('about');
    // res.sendFile(path.join(__dirname, "index.html"));
})



app.listen(process.env.PORT||3000, function(){
    console.log("server started on port 3000");
});