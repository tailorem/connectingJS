// "use strict";
const args = process.argv[2];
// const db = require("./test_script");
const pg = require("pg");
const settings = require("./settings"); // settings.json
const moment = require("moment");

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

// console.log(args);

function formatResult(result) {
  return {
    name: `${result.first_name} ${result.last_name}`,
    birthdate: result.birthdate
  };
}

client.connect((err) => {
  if (err) {
  console.log("D'OH, A CONNECTION ERROR HAPPENED.");
    return console.error("Connection Error", err);
  }
  client.query("SELECT first_name, last_name, birthdate FROM famous_people WHERE first_name=$1::text OR last_name=$1::text", [args], (err, res) => {
    if (err) {
      console.log("D'OH, AN ERROR HAPPENED.");
      return console.error("error running query", err);
    }

    const found = res.rows.map(person => {
      result = formatResult(person);
      return result;
    });
    // console.log(found2);

    // const found = [];
    // res.rows.forEach(function(person) {
    //   formatted = formatResult(person);
    //   found.push(formatted);
    // });
    console.log("Searching...");
    console.log(`Found ${res.rowCount} person(s) by the name '${args}':`);
    found.forEach((person, index) => {
      console.log(`- ${index + 1}: ${person.name}, born '${moment(person.birthdate).format("YYYY-MM-DD")}'`);
    });
    // console.log(`- ${}`); //output: 1
    client.end();
  });
});

// module.exports = client;

// DESIRED RESULT
// node lookup_people.js Paul
// Searching ...
// Found 2 person(s) by the name 'Paul':
// - 1: Paul Rudd, born '1969-04-06'
// - 2: Paul Giamatti, born '1967-06-06'

