// "use strict";
const args = process.argv.slice(2, 5);

if (args.length !== 3) {
  console.log("Please make sure to provide a first name, last name and date of birth.");
  return false;
} else if (args[2].length !== 10) {
  console.log("Please make sure to format the date of birth as YYYY-MM-DD");
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
