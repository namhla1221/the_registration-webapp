"Use strict";
var assert = require('assert');
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
const Registration = require('../factoryReg');
//Here am testing if the user entered the regnumber and then it must display the reg.
describe('The Add function for Registration Numbers', function () {
  beforeEach(async function () {
    await pool.query('DELETE FROM registrationNo');
  });
  it('should display "CA 123-009" if user entered CA 123-009 in a texfield of registration numbers', async function () {
    let registration = Registration(pool);
   await registration.setRegistration("CA 123-009");
    assert.deepEqual(await registration.getMap(), [{'reg_number':"CA 123-009"}]);
  });
 
   it('should display "CL 123-503" if user entered CL 123-503 in a texfield of registration numbers', async function () {
     let registration = Registration(pool);
     await registration.setRegistration("CL 123-503");
     assert.deepEqual(await registration.getMap(), [{'reg_number':"CL 123-503"}]);
   });
 
});
//Testing if I entered the regnmber does it store them in the object 
//also if the user enter twice the same regnumber , it should only display one .
describe('Stored registrarion numbers', function () {
  beforeEach(async function () {
    await pool.query('DELETE FROM registrationNo');
  });
  it('should display this object "[{}]" if user entered the following registration numbers CAW 123-356 and CA 123-356 ', async function () {
    let registration = Registration(pool);
    await registration.setRegistration('CAW 123-356');
    await registration.setRegistration('CA 123-356');
    assert.deepEqual(await registration.getMap(), [{'reg_number':'CAW 123-356'}, {'reg_number':'CA 123-356'}]);
  });
  it('should display one registration number in an object "[{}]" if user entered same registration number twice ', async function () {
    let registration = Registration(pool);
    await registration.setRegistration('CAW 123-123');
    await registration.setRegistration('CAW 123-123');
    assert.deepEqual(await registration.getMap(), [{'reg_number':'CAW 123-123'}]);
  });
});

describe('Filter by Town function', function () {
  beforeEach(async function () {
    await pool.query('DELETE FROM registrationNo');
  });
//Here am testing the filter that it should filter the reg CA and then it must return CA registrations.
  it("Should filter by CA and return all the registration numbers from Cape Town", async function () {
    let registration = Registration(pool);
      await registration.setRegistration('CL 123-234');
    await registration.setRegistration('CL 123-235');
    await registration.setRegistration('CA 123-235');
    let filterbyCA = await registration.filterTowns('CA');
    assert.deepEqual(filterbyCA, [{'reg_number':'CA 123-235', 'town':1}]);
  });



  it("Should filter by CJ and return all the registration numbers from Paarl", async function () {
    let registration = Registration(pool);
    await registration.setRegistration('CJ 123-000');
    await registration.setRegistration('CJ 123-001');
    await registration.setRegistration('CL 123-001');
    let filterbyCJ = await registration.filterTowns('CJ');
    assert.deepEqual(filterbyCJ, [{'reg_number':'CJ 123-000','town':3},
  {'reg_number':'CJ 123-001','town':3}]);
  });

  

//If I clicked the all button it shoold filter all the registration that where added from different towns.
  it("Should filter by All and return all the registration numbers ", async function () {
    let registration = Registration(pool);
    await registration.setRegistration('CAW 123-987');
    await registration.setRegistration('CJ 123-000');
    await registration.setRegistration('CJ 123-001');
    let filterbyCA = await registration.filterTowns('All');
    assert.deepEqual(filterbyCA, [{
      "reg_number": "CAW 123-987",
        "town": 4
      },
      {
        "reg_number": "CJ 123-000",
        "town": 3
      },
      {
        "reg_number": "CJ 123-001",
        "town": 3
      }]);
  });
});




describe('Clear function', function () {
  beforeEach(async function () {
    await pool.query('DELETE FROM registrationNo');
  });
  //Clear button that will clear all the data from database and stored information.
  it('should clear all the stored registration numbers that are stored', async function () {
    let registration = Registration(pool);
    assert.deepEqual(await registration.clear(), []);
  })
  after(async function () {
    await pool.end();
  });
});
