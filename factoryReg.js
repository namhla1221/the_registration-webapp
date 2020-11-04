module.exports = function (pool) {
    var valid_Tags =['All','CA','CL','CJ','CAW'];
  
    async function setReg(value) {
      regNumber = value.toUpperCase();
      let townTag = regNumber.substring(0, 3).trim();
      console.log(townTag)
      if (regNumber =="" || !valid_Tags.includes(townTag)) {
        return false;
      }
      var result = await pool.query('SELECT * FROM registrationNo WHERE reg_number=$1', [regNumber]);
      
      if (result.rowCount === 0) {
        let getid= await pool.query('SELECT id FROM towns WHERE town_tag=$1',[townTag]);
        await pool.query('INSERT INTO registrationNo (reg_number,town) VALUES ($1,$2)',[regNumber,getid.rows[0].id]);
        return true;
      }
  
      return false;
    }
    // getmap function
    async function getRegistrationMap() {
      let registration = await pool.query('SELECT reg_number fROM registrationNo');
      return registration.rows;
    }
    // create select options
     async function createDropDown(tag){
      let storedTowns = await pool.query('SELECT town_name , town_tag FROM towns');
      for (let i = 0; i < storedTowns.rowCount; i++) {
        let current = storedTowns.rows[i];
        if (current.town_tag===tag) {
          current.selected = true;
        }
      }
      return storedTowns.rows;
     }
  
    // filterby function
    async function filterBy(filterTown) {
  
       let townFilter = await pool.query('SELECT reg_number , town FROM registrationNo');
      
        if(filterTown !="All"){
  
          let tagFound = await pool.query('SELECT id FROM towns WHERE town_tag=$1',[filterTown]);
          
          return  townFilter.rows.filter(found =>found.town ==tagFound.rows[0].id);
        }
     
       
      return townFilter.rows;
    }
   
  
    async function clear() {
      let clear =  await pool.query('DELETE  FROM registrationNo');
      return clear.rows;
    }
  
    // returning all functions inside a factory function
    return {
      setRegistration: setReg,
      getMap: getRegistrationMap,
      getTags :createDropDown,
      filterTowns: filterBy,
      clear
    }
  }
  