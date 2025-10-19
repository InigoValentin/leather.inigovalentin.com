const db = require("./data.js");

let profileData = [];

profileData.getProfile = function(lang = null) {
    return new Promise((resolve, reject) => {
        db.get(
          "SELECT first_name, last_name, image, " + db.langQuery("tagline", lang)
          + ", " + db.langQuery("bio", lang) + ", " + db.langQuery("description", lang)
          + " FROM profile LIMIT 1",
          async (err, row) => {
            if(err) reject(err);
            else resolve(row);
          }
        );
    });
}

module.exports = profileData;
