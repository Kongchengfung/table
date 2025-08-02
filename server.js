const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  const tableData = [];

  fs.createReadStream("Table_Input.csv")
    .pipe(csv())
    .on("data", (row) => {
      tableData.push(row);
    })
    .on("end", () => {
      // Convert array to object for easy access
      const dataObj = Object.fromEntries(tableData.map(r => [r["Index #"], parseInt(r.Value)]));

      const values = {
        A5: dataObj["A5"],
        A20: dataObj["A20"],
        A15: dataObj["A15"],
        A7: dataObj["A7"],
        A13: dataObj["A13"],
        A12: dataObj["A12"]
      };

      const table2 = {
        Alpha: dataObj["A5"] + dataObj["A20"],
        Beta: Math.floor(dataObj["A15"] / dataObj["A7"]),
        Charlie: dataObj["A13"] * dataObj["A12"],
      };

      res.render("index", { tableData, values, table2 });
    });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
