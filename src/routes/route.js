import express from "express"
import { login, logout, register } from "../controllers/auth.js";
import { middleware } from "../middlewares/middleware.js";
import { getUser } from "../controllers/user.js";
import { getListDetailHotel, getListHotels, scrapHotel, scrapListHotel } from "../controllers/scraper.js";

export const route = express.Router();

route.get('/', (req, res) => {
    res.send("Server Running!")
})

// auth route
route.post('/auth/signup', register)
route.post('/auth/signin', login)
route.delete('/auth/users/logout', middleware, logout)

// user route
route.get('/users/current', middleware, getUser)
route.post('/users/current/scraplisthotel', middleware, scrapListHotel)
route.post('/users/current/scraphotel', middleware, scrapHotel)
route.get('/users/current/listhotel', middleware, getListHotels)
route.get('/users/current/listdetailhotel', middleware, getListDetailHotel)