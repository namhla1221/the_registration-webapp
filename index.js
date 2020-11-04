"use strict";
const express = require('express');
const exphbs = require('express-handlebars');
const flash = require('express-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const Registration = require('./factoryReg');

const app = express();

app.use(session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true
}));

app.use(flash());


const pg = require('pg');
const Pool = pg.Pool;

let useSSL = false;
if (process.env.DATABASE_URL) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://codex-coder:codex123@localhost:5432/registration'

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

const registration_numbers = Registration(pool);

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.engine('handlebars', exphbs({
    defaultLayout: 'main',
    helpers: {
        selectedTag: function () {
            if (this.selected) {
                return 'selected';
            }
        }
    }
}));
app.set('view engine', 'handlebars');

app.get("/", async function (req, res, next) {
//The try statement allows you to define a block of code to be tested for errors while it is being executed.
    try {
        let reglist = await registration_numbers.getMap();
        let filterbyTown = await registration_numbers.getTags();
        res.render('reg_number', { reglist, filterbyTown });
    }
    //The catch statement allows you to define a block of code to be executed, if an error occurs in the try block.
    catch (err) {
        next(err);
    }

});

app.get("/reg_number/:numberPlate", async function (req, res, next) {
    try {
        let numberPlate = req.params.numberPlate;
        let found = await registration_numbers.setRegistration(numberPlate);
        if (found) {
        await registration_numbers.getMap();
        req.flash('info', "registration is succesfully added");
        
        }else{
            let map = await registration_numbers.getMap;
           map.indexOf(req.params.numberPlate) !=-1 ?  req.flash('error', "registration numbers already exist") : req.flash('error', "incorrect registration number")  ;
        }
        res.redirect('/');
       

    } catch (err) {
    
        next(err);
    }
});

app.post("/reg_number", async function (req, res, next) {
    var numberPlate = req.body.enteredReg;
    //The try statement allows you to define a block of code to be tested for errors while it is being executed.
    try {
         let found = await registration_numbers.setRegistration(numberPlate);
        if (found) {
            await registration_numbers.getMap();
            req.flash('info', "registration is succesfully added");
        }else{
            let map = await registration_numbers.getMap();
            let findArray =[]
            for (let i = 0; i < map.length; i++) {
                findArray.push(map[i].reg_number)   
            }
            findArray.indexOf(numberPlate) !=-1 ?  req.flash('error', "registration numbers already exist") : req.flash('error', "incorrect registration number");
        }
        res.redirect('/');
    } 
    //The catch statement allows you to define a block of code to be executed, if an error occurs in the try block.
    catch (err) {
        next(err);
    }
});



app.get('/filter/:tag', async function (req, res, next) {
    try {
        let city = req.params.tag;
        let reglist = await registration_numbers.filterTowns(city);
        let filterbyTown = await registration_numbers.getTags(city);

        res.render('reg_number', { reglist, filterbyTown });
    } catch (err) {
        next(err);
    }
});


app.get('/reset', async function (req, res, next) {
    try {
        await registration_numbers.clear();
        res.redirect("/");
    } catch (err) {
        next(err)
    }
});

var PORT = process.env.PORT || 3000;
app.listen(PORT, function (err) {
    console.log('App starting on port', PORT)
});