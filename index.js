"use strict";
const express = require('express');
const exphbs = require('express-handlebars');
const flash = require('express-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const Registration = require('./factoryReg');
const regApp = require("./routes");

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
    // ssl: useSSL
});



const registration_numbers = Registration(pool);
const routeInst  = regApp(registration_numbers)

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

app.get("/", routeInst.home)


app.post("/reg_number", routeInst.enter)


app.get("/reg_number/:numberPlate", routeInst.message)


app.get('/filter/:tag', routeInst.filterBy)


app.get('/reset', routeInst.clearButton)

var PORT = process.env.PORT || 3000;
app.listen(PORT, function (err) {
    console.log('App starting on port', PORT)
});