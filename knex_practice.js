// "use strict";
const args = process.argv[2];
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

// const client = new knex.Client({
//   user     : settings.user,
//   password : settings.password,
//   database : settings.database,
//   host     : settings.hostname,
//   port     : settings.port,
//   ssl      : settings.ssl
// });

function formatResult(result) {
  return {
    name: `${result.first_name} ${result.last_name}`,
    birthdate: result.birthdate
  };
}

// function handleErr(err) {
//   if (err) {
//     console.log("D'OH, AN ERROR HAPPENED.");
//     return console.error("Error:", err);
//   }
//   return null;
// }

// knex.close = function() {
//   const pool = knex.client.pool;
//   pool.drain(pool.destroyAllNow);
// };

knex("famous_people")
// .count("famous_people.id")
.select("famous_people.first_name as f_name")
.select("famous_people.last_name as l_name")
.select(knex.raw("TO_CHAR(famous_people.birthdate, 'YYYY-MM-DD') as dob"))
// .where("famous_people.last_name")
.whereRaw("famous_people.first_name=? OR famous_people.last_name=?", [args, args])
.asCallback((err, result) => {
  // console.log(arguments);
  handleErr(err);
  // const count = result.length;
  // console.log(result);
  console.log("Searching...", result);
  console.log(result);
  console.log(`Found ${result.length} person(s) by the name '${args}':`);
  result.forEach((person, index) => {
    console.log(`- ${index + 1}: ${person.f_name} ${person.l_name}, born '${person.dob}'`);
  });

}).finally(() => {
     knex.destroy();
   });

// client.connect((err) => {
//   if (err) {
//     console.log("D'OH, A CONNECTION ERROR HAPPENED.");
//     return console.error("Connection Error", err);
//   }
//   client.query("SELECT first_name, last_name, birthdate FROM famous_people WHERE first_name=$1::text OR last_name=$1::text", [args], (err, res) => {
//     if (err) {
//       console.log("D'OH, AN ERROR HAPPENED.");
//       return console.error("error running query", err);
//     }

//     const found = res.rows.map(person => {
//       return formatResult(person);
//     });

//     console.log("Searching...");
//     console.log(`Found ${res.rowCount} person(s) by the name '${args}':`);
//     found.forEach((person, index) => {
//       console.log(`- ${index + 1}: ${person.name}, born '${moment(person.birthdate).format("YYYY-MM-DD")}'`);
//     });
//     client.end();
//   });
// });

// module.exports = client;

