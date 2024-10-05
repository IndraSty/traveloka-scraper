import Hotel from "../models/detailHotel.js";
import Hotels from "../models/hotels.js";
import puppeteer from "puppeteer-core";

const scrapListHotel = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(401).send({ message: "Unauthorized" })

        if (!req.body.url || req.body.url === '') {
            return res.status(400).send({ message: "Url is invalid" });
        }

        let browser = await puppeteer.connect({
            browserWSEndpoint: 'wss://brd-customer-hl_54ce663c-zone-scraping_browser1:y91ncxqwgrgu@brd.superproxy.io:9222'
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(2 * 60 * 1000);

        await page.goto(req.body.url, { waitUntil: 'networkidle2' });

        const hotels = await page.$$eval('div[data-testid="infinite-list-container"] div[data-testid="list-card-inview-wrapper"]', (items, userId) => {
            return items.map((item) => {
                const title = item.querySelector('h3[data-testid="tvat-hotelName"]')?.textContent || 'Title not found';
                const addr = item.querySelector('div[data-testid="tvat-hotelLocation"]')?.textContent || 'Address not found';
                const originalPrice = item.querySelector('div[data-testid="tvat-originalPrice"]')?.textContent || 'No price shown';
                const price = item.querySelector('div[data-testid="tvat-hotelPrice"]')?.textContent || 'No price shown';

                let rate = item.querySelector('div[data-testid="tvat-ratingScore"]')?.textContent || 'No rating';
                rate = rate.split('(')[0].trim(); 

                let review = item.querySelector('div[data-testid="tvat-ratingScore"] span')?.textContent || 'No reviews';
                review = review.replace(/\(|\)/g, '').trim(); 

                const image = item.querySelector('img[data-testid="list-view-card-main-image"]')?.getAttribute('src') || 'No Image';

                return { title, addr, originalPrice, price, rate, review, image, userId };
            });
        }, userId);

        await Hotels.insertMany(hotels);

        await browser.close();

        res.status(200).send({ message: "Hotels successfully scraped and saved to database", hotels });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

const scrapHotel = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(401).send({ message: "Unauthorized" })

        if (!req.body.url || req.body.url === '') {
            return res.status(400).send({ message: "Url is invalid" });
        }

        let browser = await puppeteer.connect({
            browserWSEndpoint: 'wss://brd-customer-hl_54ce663c-zone-scraping_browser1:y91ncxqwgrgu@brd.superproxy.io:9222'
        });

        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(2 * 60 * 1000);

        await page.goto(req.body.url, { waitUntil: 'networkidle2' });

        const title = await page.$eval('h1.css-4rbku5.css-901oao.css-cens5h', el => el.textContent.trim());
        const desc = await page.$eval('div[data-testid="summary-description"]', el => el.textContent.trim());
        const description = desc.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        const address = await page.$eval('div.css-901oao.css-cens5h.r-cwxd7f.r-13awgt0.r-a5wbuh.r-1b43r93.r-majxgm.r-rjixqe.r-fdjqy7', el => el.textContent.trim());

        const facilities = await page.$$eval('div.css-901oao.css-bfa6kz.r-cwxd7f.r-a5wbuh.r-1enofrn.r-majxgm.r-1cwl3u0.r-fdjqy7', (elements) => {
            return elements.map((element) => element.textContent);
        });

        let price = await page.$eval('div.css-1dbjc4n.r-1w6e6rj.r-1rxb9bi', el => el.textContent.trim()) || 'Tidak ada harga ditampilkan';
        if (price != '' && price.includes('Rp')) {
            price = price.replace('Harga/kamar/malam mulai dari', '').trim();
        } else {
            price = "Tidak ada harga ditampilkan";
        }

        const images = await page.$$eval('div[data-testid="section-photo-gallery"] img', (images) => {
            return images.map((image) => image.src);
        });

        const hotelData = {
            title,
            price,
            description,
            address,
            facilities,
            images,
            userId
        };

        const hotel = await Hotel.create(hotelData);

        res.status(200).send({ message: "Hotel successfully scraped and saved to database", hotel });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

const getListHotels = async (req, res) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const page = parseInt(req.query.page) || 1; 
      const limit = 10;
  
      const totalHotels = await Hotels.countDocuments({ userId });
      const totalPages = Math.ceil(totalHotels / limit);
  
      const hotels = await Hotels.find({ userId })
        .select('title addr originalPrice price rate review image -_id')
        .lean()
        .skip((page - 1) * limit)
        .limit(limit); 
  
      res.status(200).json({
        message: "Get Hotels Successfully",
        data: hotels,
        pagination: {
          page,
          limit,
          total: totalHotels,
          totalPages
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

const getListDetailHotel = async (req, res) => {
    try {
      const userId = req.userId;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const page = parseInt(req.query.page) || 1; 
      const limit = 10;
  
      const totalHotels = await Hotel.countDocuments({ userId });
      const totalPages = Math.ceil(totalHotels / limit);
  
      const hotels = await Hotel.find({ userId })
        .select('title price description address facilities images -_id')
        .lean()
        .skip((page - 1) * limit)
        .limit(limit); 
  
      res.status(200).json({
        message: "Get Hotels Successfully",
        data: hotels,
        pagination: {
          page,
          limit,
          total: totalHotels,
          totalPages
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };


export {
    scrapListHotel,
    scrapHotel,
    getListHotels,
    getListDetailHotel
}