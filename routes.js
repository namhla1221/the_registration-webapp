module.exports = function routes(registration_numbers){

    async function home(req, res, next) {
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
        
        };

        async function enter (req, res, next) {
            var numberPlate = req.body.enteredReg;
           var regPlate =  numberPlate.toUpperCase()
           console.log(regPlate)
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
        };

        async function message (req, res, next) {
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
        };

        async function filterBy(req, res, next) {
            try {
                let city = req.params.tag;
                let reglist = await registration_numbers.filterTowns(city);
                let filterbyTown = await registration_numbers.getTags(city);
        
                res.render('reg_number', { reglist, filterbyTown });
            } catch (err) {
                next(err);
            }
        };

        async function clearButton(req, res, next) {
            try {
                await registration_numbers.clear();
                res.redirect("/");
            } catch (err) {
                next(err)
            }
        };

    return {
        home,
        enter,
        message,
        filterBy,
        clearButton
        
    }
}