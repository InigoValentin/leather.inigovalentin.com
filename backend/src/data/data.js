const sqlite3 = require('sqlite3');

let data = new sqlite3.Database(process.env.DB , (err) => {
    if (err) console.log("Error connecting to database " + process.env.DB + err.message);
    else console.log("Conected to database " + process.env.DB);
});

data.langQuery = function(param, lang = null){
    if (lang == null) lang = process.env.DEFAULT_LANGUAGE;
    if (param != null)
        return(
          "(SELECT text FROM text WHERE id = " + param + " AND (lang IS NULL OR lang = '"
          + lang + "') ORDER BY lang IS NULL DESC LIMIT 1) AS " + param
        );
    else
        return "'' AS " + param
}

module.exports = data;