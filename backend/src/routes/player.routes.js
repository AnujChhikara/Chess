import {Router} from 'express'

import { getPlayerDetails, loginPlayer,registerPlayer } from '../controllers/player.controller.js'

const router = Router()

router.route("/register").post(registerPlayer)


router.route("/login").post(loginPlayer)
router.route("/getPlayerDetails/:id").get(getPlayerDetails)

export default router;