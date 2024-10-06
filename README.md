# Traveloka Scraper API
 
The Traveloka Scraper API is designed to perform web scraping of hotel data from the Traveloka site, providing easy and quick access to up-to-date 
information regarding hotel prices, facilities, and reviews. By using this API, users can search for hotels based on various criteria, such as 
location, check-in dates, and number of guests, and receive structured data that is ready to be used in applications or further analysis.


# API Installation


## Required
To run the API on your local machine, make sure these items are installed on your computer:
* Ensure you have Node.js installed. Refer to the official Node.js website for installation instructions: https://nodejs.org/en/download/package-manager/current.
* Ensure you have Docker installed. Refer to the official Docker website for installation instructions: https://docs.docker.com/desktop/.
* Ensure you have MongoDB installed. Refer to the official MongoDB website for installation instructions: https://www.mongodb.com/docs/manual/installation/.
Or You can use MongoDB Atlas instead.

The other items that You need to setup are:
* Create Your BrightData account and add scraping broser proxy, you can use free trial or you can upgrade it. You see the documentation [here](https://docs.brightdata.com/scraping-automation/scraping-browser/introduction)

## Steps
To run the API in your local machine, follow these steps:
Clone the repository to your machine and install the needed dependencies. We use `npm` to manage our packages, so please make sure it is installed in your local machine.

Clone the Repository
```bash
git clone https://github.com/IndraSty/traveloka-scraper.git

cd traveloka-scraper
```

Install the dependencies:
```bash
npm install
```

Start up a docker container running MongoDB and Redis. A `docker-compose` file is provided to make this easier.Make sure you are in the same root folder as `docker-compose` is located.
```bash
docker compose up
```

Create an `.env` file and fill it according to the `.env.example` 
file which has been completed according to the required items explained previously.

Run the API on Your local machine
```bash
npm start dev
```
