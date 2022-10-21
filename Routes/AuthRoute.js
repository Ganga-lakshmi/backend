import express from "express"
import { loginUser, registerUser } from "../Controllers/AuthController.js";
const router = express.Router()

// router.get('/' , async(req,res) => {
//     res.send("auth route")
// })

router.post('/register', registerUser)
router.post('/login' ,loginUser )

export default router;










//first /auth -> comes to AuthROute -> '/'-> executes response