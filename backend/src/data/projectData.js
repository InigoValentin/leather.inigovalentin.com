const db = require("./data.js");

let projectData = [];

projectData.retrieveProjectImages = async function(id, lang, max){
    return new Promise((resolve, reject) => {
        db.all(
          "SELECT id, project, home, path, video, "
          + db.langQuery("title", lang) + ", " + db.langQuery("description", lang)
          + ", priority FROM project_image WHERE visible=1 AND project=? ORDER BY priority "
          + (parseInt(max) > 0 ? " LIMIT " + parseInt(max) : ""),
          parseInt(id),
          (err, imgs) => {
            if (err) reject(err);
            else resolve(imgs);
          }
        );
    });
}

projectData.getProjects = function(children = null, lang = null, images = null) {
    return new Promise((resolve, reject) => {
        const projects = [];
        db.all(
          "SELECT id, permalink, " + db.langQuery("title", lang) + ", " + db.langQuery("description", lang)
          + ", priority FROM project WHERE parent IS NULL AND visible=1 ORDER BY priority",
          async (err, rows) => {
            if(err) reject(err);
            else{
                if (images == false || parseInt(images) <= 0) resolve(rows);
                else{
                    for (var i = 0; i < rows.length; i ++){
                        if (children == true || parseInt(children) > 0)
                            rows[i].children = await this.getChildrenProjects(rows[i].id, lang, images);
                        if (images == true || parseInt(images) > 0){
                            rows[i].images = new Array();
                            var max = null;
                            if (parseInt(images) > 0) max = parseInt(images);
                            rows[i].images = await this.retrieveProjectImages(rows[i].id, lang, max);
                        }
                        projects.push(rows[i]);
                    }
                    resolve(projects);
                }
            }
          }
        );
    });
}

projectData.getProject = function(id, children = null, lang = null, images = null) {
    return new Promise((resolve, reject) => {
        db.get(
          "SELECT id, permalink, " + db.langQuery("title", lang) + ", " + db.langQuery("description", lang)
          + ", priority, null AS images FROM project WHERE visible=1 AND (id=? OR permalink=?)",
          parseInt(id), String(id),
          async (err, row) => {
            if(err) reject(err);
            else if (!row) resolve("[]");
            else{
                if (children == true || parseInt(children) > 0)
                    row.children = await this.getChildrenProjects(row.id, lang, images);
                if (images == false || parseInt(images) <= 0) resolve(row);
                else{
                    row.images = await this.retrieveProjectImages(row.id, lang, images);
                    resolve(row);
                }
            }
          }
        );
    });
}

projectData.getChildrenProjects = function(id, lang = null, images = null) {
    return new Promise((resolve, reject) => {
        const projects = [];
        db.all(
          "SELECT id, permalink, "
          + db.langQuery("title", lang) + ", " + db.langQuery("description", lang)
          + ", priority FROM project WHERE parent = ? AND visible=1 ORDER BY priority",
          parseInt(id),
          async (err, rows) => {
            if(err) reject(err);
            else{
                if (images == false || parseInt(images) <= 0) resolve(rows);
                else{
                    for (var i = 0; i < rows.length; i ++){
                        if (images == true || parseInt(images) > 0){
                            rows[i].images = new Array();
                            var max = null;
                            if (parseInt(images) > 0) max = parseInt(images);
                            rows[i].images = await this.retrieveProjectImages(rows[i].id, lang, max);
                        }
                        projects.push(rows[i]);
                    }
                    resolve(projects);
                }
            }
          }
        );
    });
}

projectData.getProjectImages = function(id, lang = null, max = null) {
    return new Promise((resolve, reject) => {
        db.all(
          "SELECT id, project, home, path, video, " + db.langQuery("title", lang) + ", "
          + db.langQuery("description", lang) + ", priority FROM project_image WHERE visible = 1 AND project IN "
          + "(SELECT id FROM project WHERE visible = 1 AND (id = ? OR permalink = ?)) "
          + "ORDER BY priority " + (parseInt(max) > 0 ? " LIMIT " + parseInt(max) : ""),
          parseInt(id), String(id),
          (err, imgs) => {
            if (err) reject(err);
            else resolve(imgs);
          }
        );
    });
}

projectData.getProjectImage = function(projectId, imageId, lang = null) {
    return new Promise((resolve, reject) => {
        if (imageId.toLowerCase() == "random"){
            db.get(
              "SELECT id, project, home, path, video, " + db.langQuery("title", lang) + ", "
              + db.langQuery("description", lang)
              + ", priority FROM project_image WHERE visible=1 AND home=1 AND project IN "
              + "(SELECT id FROM project WHERE visible=1 AND home=1 AND video=0 "
              + "AND (id=? OR permalink=? OR parent=?)) ORDER BY RANDOM() LIMIT 1",
              parseInt(projectId), String(projectId), parseInt(projectId),
              async (err, row) => {
                if(err) reject(err);
                else resolve(row);
              }
            );
        }
        else{
            db.get(
              "SELECT id, project, home, path, video, "
              + db.langQuery("title", lang) + ", " + db.langQuery("description", lang)
              + ", priority FROM project_image WHERE id=? AND home=1 AND visible=1 AND project IN "
              + "(SELECT id FROM project WHERE visible=1 AND (id=? OR permalink=?))",
              parseInt(projectId), String(projectId),
              async (err, row) => {
                if(err) reject(err);
                else resolve(row);
              }
            );
        }
    });
}

module.exports = projectData;
