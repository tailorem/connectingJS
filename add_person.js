// "use strict";
const args = process.argv.slice(2, 5);

if (args.length !== 3) {
  console.log("Please make sure to provide a first name, last name and date of birth.");
  return false;
} else {

const moment = require("moment");
const settings = require("./settings"); // settings.json
const knex = require("knex")({
  client: 'pg',
  connection: {
    host : settings.hostname,
    user : settings.user,
    password : settings.password,
    database : settings.database
  }
});

function formatResult(result) {
  return {
    name: `${result.first_name} ${result.last_name}`,
    birthdate: result.birthdate
  };
}

function handleErr(err) {
  if (err) {
    console.log("D'OH, AN ERROR HAPPENED.");
    return console.error("Error:", err);
  }
  return null;
}


  knex("famous_people")
  .insert({first_name: args[0], last_name: args[1], birthdate: args[2]})
  .asCallback((err, result) => {
    if (err) {
      console.log("D'OH, AN ERROR HAPPENED.");
      return console.error("Error:", err);
    }
    console.log("Inserted record");
  })
  .finally(() => {
       knex.destroy();
     });

}

// knex("famous_people")
// .select("famous_people.first_name as f_name")
// .select("famous_people.last_name as l_name")
// .select(knex.raw("TO_CHAR(famous_people.birthdate, 'YYYY-MM-DD') as dob"))
// .whereRaw("famous_people.first_name=? OR famous_people.last_name=?", [args, args])
// .asCallback((err, result) => {
//   handleErr(err);
//   console.log("Searching...");
//   console.log(`Found ${result.length} person(s) by the name '${args}':`);
//   result.forEach((person, index) => {
//     console.log(`- ${index + 1}: ${person.f_name} ${person.l_name}, born '${person.dob}'`);
//   });

// }).finally(() => {
//      knex.destroy();
//    });

