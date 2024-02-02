import { checkDuplicateUsernameOrEmail } from "../middleware/verifySignUp";
import express from 'express'
import * as AuthController from '../controllers/auth.controller'

const router = express.Router()

router.use(function (req, res, next) {
    res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
    );
    next();
});
router.post("/signup", [checkDuplicateUsernameOrEmail], AuthController.signup)
router.post("/signin", AuthController.signin)
router.get("/refreshtoken", AuthController.refreshToken)
router.get("/signout", AuthController.signout)

export default router;
