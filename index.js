const request = require("request-promise");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;
const express = require("express");
require("./DB/connect");
const Disease = require("./models/diseases")
const app = express();
app.use(express.json())

const diseases = [
  "https://www.everydayhealth.com/malaria/guide/",
  "https://www.everydayhealth.com/acne.aspx","https://www.everydayhealth.com/bronchitis/","https://www.everydayhealth.com/dengue-fever/guide/","https://www.everydayhealth.com/cystitis/guide/"
];

(async () => {
  let hcData = [];

  for (let disease of diseases) {
    const response = await request({
      uri: disease,
      headers: {
        accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9",
      },
      gzip: true,
    });

    let $ = cheerio.load(response);
    let title = $("body > main > article > div.article-template__top > div > div.eh-widget.eh-widget--page-headline > div > div > div > div > section > div > a > span").text().trim();
    let summary = $("body > main > article > div.article-template__body > div > div.row.article-template__row--right-rail > div.col-lg-8.article-template__main > div:nth-child(2) > div > div > div > div > section > div")
      .text()
      .trim();
    let symptoms = $(
        'div[class="eh-content-block__content"] > ul'
    ).text().trim().split(/(?=[A-Z])/).slice(0,10);
    

    hcData.push({
      title,
      summary,
      symptoms,
    });
    

    const dData = new Disease({
        title,
        summary,
        symptoms
    })
    dData.save( err => {
        if(err) {
            console.log(err)
        } else {
            console.log({ message:`health issue named  " ${title} "   grabed and thrown to mongoDB`})
        }
    })



  }

  const j2cp = new json2csv();
  const csv = j2cp.parse(hcData);
  fs.writeFileSync("./hc.csv", csv, "utf-8");
})();
