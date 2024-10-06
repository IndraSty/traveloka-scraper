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
route.post('/api/auth/signup', register)
route.post('/api//auth/signin', login)
route.delete('/api/auth/users/logout', middleware, logout)

// user route
route.get('/api/users/current', middleware, getUser)
route.post('/api/users/current/scraplisthotel', middleware, scrapListHotel)
route.post('/api/users/current/scraphotel', middleware, scrapHotel)
route.get('/api/users/current/listhotel', middleware, getListHotels)
route.get('/api/users/current/listdetailhotel', middleware, getListDetailHotel)