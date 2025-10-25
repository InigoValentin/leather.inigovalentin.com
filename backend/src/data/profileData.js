const db = require("./data.js");

let profileData = [];

profileData.retrieveProfileImages = async function(lang, max){
    return new Promise((resolve, reject) => {
        db.all(
          "SELECT id, path, " + db.langQuery("title", lang)
          + ", priority FROM profile_image WHERE visible=1 ORDER BY priority "
          + (parseInt(max) > 0 ? " LIMIT " + parseInt(max) : ""),
          (err, imgs) => {
            if (err) reject(err);
            else resolve(imgs);
          }
        );
    });
}

profileData.retrieveProfileTexts = async function(lang, mod){
    return new Promise((resolve, reject) => {
        db.all(
          "SELECT id, " + db.langQuery("content", lang)
          + ", priority, home FROM profile_text WHERE visible=1 "
          + (parseInt(mod) > 0 ? " LIMIT " + parseInt(mod) : "")
          + (mod == "home" ? " AND home=1 " : "") + (mod == "profile" ? " AND profile=1 " : "")
          + "ORDER BY priority "
          ,
          (err, texts) => {
            if (err) reject(err);
            else resolve(texts);
          }
        );
    });
}

profileData.getProfile = function(lang = null, images = null, texts = null) {
    return new Promise((resolve, reject) => {
        db.get(
          "SELECT first_name, last_name, display_name FROM profile LIMIT 1",
          async (err, row) => {
            if(err) reject(err);
            else if (!row) resolve("[]");
            else{
                if (images != false || parseInt(images) > 0){
                    row.images = await this.retrieveProfileImages(lang, images);
                }
                if (texts != false || parseInt(texts) > 0){
                    row.texts = await this.retrieveProfileTexts(lang, texts);
                }
                resolve(row);
            }
          }
        );
    });
}

module.exports = profileData;
