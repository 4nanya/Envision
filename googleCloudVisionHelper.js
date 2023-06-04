import { SafeAreaViewComponent } from "react-native";

//const API_KEY = "AIzaSyAtnUAJHbSXMHQBCH2laGc_taNEpcLG1oo";
const API_KEY = "AIzaSyAcRmZOqwN8_2th2zAGqKzuRLbvPfWjrcg";

const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;

function generateBody(image) {
  const body = {
    requests: [
      {
        image: {
          content: image,
        },
        features: [
          {
            type: "LABEL_DETECTION",
            maxResults: 10,
          },
        ],
      },
    ],
  };
  return body;
}
async function callGoogleVisionAsync(image) {
  const body = generateBody(image);
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  //console.log(result);
  //console.log("First Results ==> ", result.responses[0].labelAnnotations[0].description);
  scan = new Array() ; // what the image has from google api
  result.responses[0].labelAnnotations.forEach((label) => {
    //console.log(label);
    scan.push(label.description);
});

  console.log("done printing");
  
  const detectedText = result.responses[0].labelAnnotations[0];
  return scan;
}
export default callGoogleVisionAsync;
