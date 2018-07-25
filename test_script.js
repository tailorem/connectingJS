const pg = require("pg");
const settings = require("./settings"); // settings.json

const client = new pg.Client({
  user     : settings.user,
  password : settings.password,
  database : settings.database,
  host     : settings.hostname,
  port     : settings.port,
  ssl      : settings.ssl
});

// console.log(pg.Client);

client.connect((err) => {
  if (err) {
  console.log("D'OH, A CONNECTION ERROR HAPPENED.");
    return console.error("Connection Error", err);
  }
  client.query("SELECT $1::int AS number", ["1"], (err, result) => {
    if (err) {
      console.log("D'OH, AN ERROR HAPPENED.");
      return console.error("error running query", err);
    }
    console.log("Hey, it worked?");
    console.log(result); //output: 1
    client.end();
  });
});