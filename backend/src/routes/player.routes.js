import {Router} from 'express'

import { loginPlayer,registerPlayer } from '../controllers/player.controller.js'

const router = Router()

router.route("/register").post(registerPlayer)


router.route("/login").post(loginPlayer)

export default router;