const express = require("express");
const app = express();
const cors = require("cors");
const { Cluster } = require("puppeteer-cluster");

const urls = [
  "https://atlanta.craigslist.org/search/atlanta-ga/cta?lat=33.74900&lon=-84.38800&purveyor=owner&hasPic=1&search_distance=250&min_price=&max_price=12000&auto_make_model=bmw&max_auto_miles=100000&auto_transmission=1",

  "https://austin.craigslist.org/search/austin-tx/cta?auto_make_model=bmw&auto_transmission=1&hasPic=1&lat=30.284&lon=-97.786&max_auto_miles=100000&max_price=12000&min_price=&purveyor=owner&search_distance=260",

  "https://boston.craigslist.org/search/boston-ma/cta?auto_make_model=bmw&auto_transmission=1&hasPic=1&lat=42.331&lon=-71.063&max_auto_miles=100000&max_price=12000&min_price=&purveyor=owner&search_distance=220",

  "https://chicago.craigslist.org/search/chicago-il/cta?auto_make_model=bmw&auto_transmission=1&hasPic=1&lat=41.835&lon=-87.679&max_auto_miles=100000&max_price=12000&min_price=&purveyor=owner&search_distance=250",

  // "https://denver.craigslist.org/search/denver-co/cta?auto_make_model=bmw&auto_transmission=1&hasPic=1&lat=39.763&lon=-104.957&max_auto_miles=100000&max_price=12000&min_price=&purveyor=owner&search_distance=260",

  // "https://detroit.craigslist.org/search/detroit-mi/cta?auto_make_model=bmw&auto_transmission=1&hasPic=1&lat=42.363&lon=-83.139&max_auto_miles=100000&max_price=12000&min_price=&purveyor=owner&search_distance=250",

  // "https://lasvegas.craigslist.org/search/las-vegas-nv/cta?auto_make_model=bmw&auto_transmission=1&hasPic=1&lat=36.313&lon=-115.372&max_auto_miles=100000&max_price=12000&min_price=&purveyor=owner&search_distance=270",

  // "https://losangeles.craigslist.org/search/los-angeles-ca/cta?auto_make_model=bmw&auto_transmission=1&hasPic=1&lat=34.037&lon=-118.305&max_auto_miles=100000&max_price=12000&min_price=&purveyor=owner&search_distance=260",

  // "https://miami.craigslist.org/search/miami-fl/cta?auto_make_model=bmw&auto_transmission=1&hasPic=1&lat=25.73&lon=-80.529&max_auto_miles=100000&max_price=12000&min_price=&purveyor=owner&search_distance=250",

  // "https://minneapolis.craigslist.org/search/minneapolis-mn/cta?auto_make_model=bmw&auto_transmission=1&hasPic=1&lat=45.018&lon=-93.316&max_auto_miles=100000&max_price=12000&min_price=&purveyor=owner&search_distance=250",

  // "https://newyork.craigslist.org/search/new-york-ny/cta?auto_make_model=bmw&auto_transmission=1&hasPic=1&lat=40.776&lon=-73.969&max_auto_miles=100000&max_price=12000&min_price=&purveyor=owner&search_distance=270",

  // "https://philadelphia.craigslist.org/search/philadelphia-pa/cta?auto_make_model=bmw&auto_transmission=1&hasPic=1&lat=40.013&lon=-75.132&max_auto_miles=100000&max_price=12000&min_price=&purveyor=owner&search_distance=250",

  // "https://phoenix.craigslist.org/search/phoenix-az/cta?auto_make_model=bmw&auto_transmission=1&hasPic=1&lat=33.531&lon=-112.078&max_auto_miles=100000&max_price=12000&min_price=&purveyor=owner&search_distance=270",

  // "https://portland.craigslist.org/search/portland-or/cta?auto_make_model=bmw&auto_transmission=1&hasPic=1&lat=45.523&lon=-122.676&max_auto_miles=100000&max_price=12000&min_price=&purveyor=owner&search_distance=250",

  // "https://raleigh.craigslist.org/search/raleigh-nc/cta?auto_make_model=bmw&auto_transmission=1&hasPic=1&lat=35.849&lon=-78.655&max_auto_miles=100000&max_price=12000&min_price=&purveyor=owner&search_distance=290",

  // "https://sacramento.craigslist.org/search/sacramento-ca/cta?auto_make_model=bmw&auto_transmission=1&hasPic=1&lat=38.584&lon=-121.466&max_auto_miles=100000&max_price=12000&min_price=&purveyor=owner&search_distance=250",
];

(async () => {
  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_PAGE,
    maxConcurrency: 2,
  });

  cluster.on("taskerror", (err, data) => {
    console.log(`Error crawling ${data}: ${err.message}`);
  });

  await cluster.task(async ({ page, data: url }) => {
    await page.goto(url);

    let items = [];

  
    const productsHandles = await page.$$(".rows > .result-row");

    for (const producthandle of productsHandles) {
      let url = "Null";
      let title = "Null"
      let price = "Null";
      let img = "Null";

      try {
        url = await page.evaluate(
          (el) => el.querySelector(".result-row a").getAttribute("href"),
          producthandle
        );
      } catch (error) {}

      try {
        title = await page.evaluate(
          (el) => el.querySelector(".result-title").textContent,
          producthandle
        );
      } catch (error) {}

      try {
        price = await page.evaluate(
          (el) => el.querySelector(".result-meta .result-price").textContent,
          producthandle
        );
      } catch (error) {}

      try {
        img = await page.evaluate(
          (el) => el.querySelector(".swipe-wrap img").getAttribute("src"),
          producthandle
        );
      } catch (error) {}

      items.push({ url, title, price, img });
    }



     console.log([...items]);

    app.use(cors());

    app.get("/", async (req, res) => {
      res.send(items);
    });
  });

  for (const url of urls) {
    await cluster.queue(url);
  }

  app.listen(3001, function () {
    console.log("Server listening on port 3001.");
  });

  await cluster.idle();
  await cluster.close();
})();
