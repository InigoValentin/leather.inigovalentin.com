var intervalId;
var apiURL;

/**
 * Generates a srcset atribute from a src attribute.
 * 
 * @param src The original src.
 * @return The generated srcset attribute.
 */
function generateSrcset(src){
    var srcset = "";
    for (let i = 100; i <= 1000; i += 100) srcset += src + "?w=" + i + " " + i + "w, ";
    srcset.substring(0, srcset.length - 1);
    return srcset;
}

/**
 * Delays execution when called asynchronously.
 * 
 * @param ms Milliseconds to wait.
 */
function delay(ms){ return new Promise(resolve => setTimeout(resolve, ms)); }

/**
 * Swaps an imaga in the homepage
 * 
 * @param id Id of the project which image must be swapped.
 * @param apiURL The api URL (host only).
 * @param image Retrieved image data.
 */
async function swapImage(id, apiURL, image){
    var img = document.getElementById("img-project-" + id);
    var imgAlt = document.getElementById("img-project-" + id + "-alt");
    imgAlt.setAttribute("src", apiURL + image.path);
    imgAlt.setAttribute("srcset", generateSrcset(apiURL + image.path));
    await delay(1000);
    img.style.opacity = '0';
    await delay(1000);
    img.setAttribute("src", "" + imgAlt.getAttribute("src"));
    img.setAttribute("srcset", "" + imgAlt.getAttribute("srcset"));
    img.style.opacity = '1';
    await delay(1000);
    imgAlt.removeAttribute("src");
    imgAlt.removeAttribute("srcset");
}

/**
 * Starts the interval for image swapping in the home page.
 */
async function startInterval(){
    while (document.getElementById("apiURL") == undefined) await delay(500);
    apiURL = document.getElementById("apiURL").value;
    intervalId = setInterval(() => {
        const projects = document.getElementsByClassName('project');
        const id = projects[Math.floor(Math.random() * projects.length)].id.substring(8);

        // TODO: ADD lang
        fetch(apiURL + "/projects/" + id + "/images/random")
          .then(response => response.json())
          .then(data => swapImage(id, apiURL, data))
          .catch(error => console.error(
            'Error rerieving image from ' + apiURL + "/projects/" + id + "/images/random : " , error
          ));
    }, 2000);
}

startInterval();