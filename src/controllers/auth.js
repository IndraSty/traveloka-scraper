import { loginValidate, User, validate } from "../models/user-schema.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const register = async (req, res) => {
    try {
        const { error } = validate(req.body)
        if (error)
            return res.status(400).send({ message: error.details[0].message })

        const user = await User.findOne({ email: req.body.email })
        if (user)
            return res.status(400).send({ message: "User with given email already exist!" })

        const salt = await bcrypt.genSalt(Number(process.env.SALT))
        const hashPassword = await bcrypt.hash(req.body.password, salt)

        await new User({ ...req.body, password: hashPassword }).save()
        res.status(201).send({ message: "User created successfully" })
    } catch (error) {
        res.status(500).send({ message: "Internal Server error" })
    }
}

const login = async (req, res) => {
    try {
        const { error } = loginValidate(req.body)
        if (error)
            return res.status(400).send({ message: error.details[0].message })

        const user = await User.findOne({ email: req.body.email })
        if (!user)
            return res.status(401).send({ message: "Invalid Email or Password" })

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword)
            return res.status(401).send({ message: "Invalid Email or Password" })

        const accessToken = jwt.sign(
            { id: user.id, email: user.email, firstName: user.firstName },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        );

        const refreshToken = jwt.sign(
            { id: user.id, email: user.email, firstName: user.firstName },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1w' }
        );

        await User.findOneAndUpdate(
            { email: req.body.email },
            { refreshToken: refreshToken }
        );

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000
          });


        res.status(200).send({ accessToken, message: "Logged in successfully!" })
    } catch (error) {
        res.status(500).send({ message: "Internal Server error" })
    }
}

const logout = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId)
            return res.status(401).send({ message: "Unauthorized" })

        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(204);

        await User.findOneAndUpdate(
            { id: userId },
            { refreshToken: null }
        );

        res.clearCookie('refreshToken');
        return res.status(200).send({message: "Loged Out Successfully!"})
    } catch (error) {
        res.status(500).send({ message: "Internal Server error" })
    }
}


export {
    register,
    login,
    logout
}