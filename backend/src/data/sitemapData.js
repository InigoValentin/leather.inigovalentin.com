const projectData = require("./projectData");
const profileData = require("./profileData");

let sitemapData = [];

sitemapData.generateSitemap = async function(){
    
    const projects = await projectData.getProjects('en', true, false);
    const profile = await profileData.getProfile('en', true, false);
    const fUrl = process.env.FRONTEND;
    const bUrl = process.env.BACKEND;

    var sitemap = "";
              
              sitemap += '<?xml version="1.0" encoding="UTF-8"?>\n';
              sitemap += '<urlset\n';
              sitemap += '  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
              sitemap += '  xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"\n';
              sitemap += '  xmlns:video="http://www.google.com/schemas/sitemap-video/1.1"\n';
              sitemap += '>\n';
              sitemap += '  <url>\n';
              sitemap += '    <loc>' + fUrl + '</loc>\n';
              if (profile.images[0]){
                  sitemap += '      <image:image>\n';
                  sitemap += '        <image:loc>' + bUrl + profile.images[0].path + '</image:loc>\n';
                  sitemap += '      </image:image>\n';
              }
              for (let project of projects){
                  if (project.images[0]){
                      sitemap += '      <image:image>\n';
                      sitemap += '        <image:loc>' + bUrl + project.images[0].path + '</image:loc>\n';
                      sitemap += '      </image:image>\n';
                  }
              }
              sitemap += '  </url>\n';
    for (let project of projects){
      sitemap += '  <url>\n';
      sitemap += '    <loc>' + fUrl + '/projects/' + project.permalink + '</loc>\n';
      for (let image of project.images){
          if (image.video == 1){
              sitemap += '      <video:video>\n';
              sitemap += '        <video:thumbnail_loc>' + bUrl + project.images[0].path + '?w=800</video:thumbnail_loc>\n';
              sitemap += '        <video:title>' + image.title + '</video:title>\n';
              sitemap += '        <video:description><![CDATA[' + image.description + ']]></video:description>\n';
              sitemap += '        <video:content_loc>' + bUrl + image.path + '</video:content_loc>\n';
              //sitemap += '        <video:player_loc>' + fUrl + '/projects/' + project.permalink + '</video:player_loc>\n';
              sitemap += '        <video:family_friendly>yes</video:family_friendly>\n';
              sitemap += '        <video:uploader info="' + fUrl + '/profile/">' + profile.display_name + '</video:uploader>\n';
              sitemap += '        <video:live>no</video:live>\n';
              sitemap += '      </video:video>\n';
          }
          else{
              sitemap += '      <image:image>\n';
              sitemap += '        <image:loc>' + bUrl + image.path + '</image:loc>\n';
              sitemap += '      </image:image>\n';
          }
      }
      sitemap += '    </url>\n';
  }
  sitemap += '  <url>\n';
  sitemap += '    <loc>' + fUrl + '/profile/</loc>\n';
  sitemap += '  </url>\n';
  sitemap += '</urlset>\n';

  return sitemap;
}

module.exports = sitemapData;