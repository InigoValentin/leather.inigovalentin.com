const db = require("./data.js");

let projectData = [];

projectData.retrieveProjectImages = async function(id){
    return new Promise((resolve, reject) => {
        db.all(
          "SELECT id, project, home, path, video, "
          + db.langQuery("title") + ", " + db.langQuery("description")
          + ", priority FROM project_image WHERE visible=1 AND project=? ORDER BY priority",
          parseInt(id),
          (err, imgs) => {
            if (err) reject(err);
            else resolve(imgs);
          }
        );
    });
}

projectData.getProjects = function() {
    return new Promise((resolve, reject) => {
        projects = new Array();
        db.all(
          "SELECT id, permalink, " + db.langQuery("title") + ", " + db.langQuery("description")
          + ", priority, null AS images FROM project WHERE visible=1 ORDER BY priority",
          async (err, rows) => {
            if(err) reject(err);
            else{
                for (var i = 0; i < rows.length; i ++){
                    rows[i].images = new Array();
                    rows[i].images = await this.retrieveProjectImages(rows[i].id);
                    projects.push(rows[i]);
                }
                resolve(projects);
            }
          }
        );
    });
}

projectData.getProject = function(id) {
    return new Promise((resolve, reject) => {
        db.get(
          "SELECT id, permalink, " + db.langQuery("title") + ", " + db.langQuery("description")
          + ", priority, null AS images FROM project WHERE visible=1 AND (id=? OR permalink=?)",
          parseInt(id), String(id),
          async (err, row) => {
            if(err) reject(err);
            else{
                row.images = new Array();
                row.images.push.apply(row.images, await this.retrieveProjectImages(row.id));
                resolve(row);
            }
          }
        );
    });
}

projectData.getProjectImages = function(id) {
    return new Promise((resolve, reject) => {
        console.log("GETTING ALL IMAGES FRO " + id);
        db.all(
          "SELECT id, project, home, path, video, "
          + db.langQuery("title") + ", " + db.langQuery("description")
          + ", priority FROM project_image WHERE visible = 1 AND project IN "
          + "(SELECT id FROM project WHERE visible = 1 AND (id = ? OR permalink = ?)) "
          + "ORDER BY priority",
          parseInt(id), String(id),
          (err, imgs) => {
            if (err) reject(err);
            else{
                console.log(" TOTAL : " + imgs.length);
                resolve(imgs);
                }
          }
        );
    });
}

projectData.getProjectImage = function(projectId, imageId) {
    return new Promise((resolve, reject) => {
        if (imageId.toLowerCase() == "random"){
            db.get(
              "SELECT id, project, home, path, video, "
              + db.langQuery("title") + ", " + db.langQuery("description")
              + ", priority FROM project_image WHERE visible=1 AND home=1 AND project IN "
              + "(SELECT id FROM project WHERE visible=1 AND (id=? OR permalink=?)) "
              + "ORDER BY RANDOM() LIMIT 1",
              parseInt(projectId), String(projectId),
              async (err, row) => {
                if(err) reject(err);
                else resolve(row);
              }
            );
        }
        else{
            db.get(
              "SELECT id, project, home, path, video, "
              + db.langQuery("title") + ", " + db.langQuery("description")
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
