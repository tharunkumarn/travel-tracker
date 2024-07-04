import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
user:"postgres",
host:"localhost",
database:"mylove",
password:"postgres",
port: 5432
});

db.connect();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));





app.get("/", async (req, res) => {
  //Write your code here.
  const result = await db.query("select country_code from visited_countries");
  //console.log(result);
  let cuntry =[];
  result.rows.forEach((country)=>{
  cuntry.push(country.country_code);
  });

  res.render("index.ejs", { countries: cuntry, total: cuntry.length });


});
app.post("/add",async (req,res)=>{
  const v_c = req.body.country;
  console.log(v_c);
  const countryResult = await db.query('SELECT country_code FROM country WHERE country_name = $1', [v_c]);
  //console.log(countryResult);
  if(countryResult.rows.length !=0){
 const country_code = countryResult.rows[0].country_code;
 console.log(country_code);
  

 //const visited_country = await db.query(`insert into visited_countries (country_code) values ('${country_code}')`);
 const insertResult = await db.query('INSERT INTO visited_countries (country_code) VALUES ($1)', [country_code]);
 //console.log(insertResult);
res.redirect("/")
  }
//  const result = await db.query("select country_code from visited_countries");
//   //console.log(result);
//   let cuntry =[];
//   result.rows.forEach((country)=>{
//   cuntry.push(country.country_code);
//   });

//   res.render("index.ejs", { countries: cuntry, total: cuntry.length });
 // res.render("index.ejs", { countries: visited_country, total: visited_country.length });

});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
