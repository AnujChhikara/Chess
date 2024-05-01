import {Router} from 'express'

import { getAllPlayers, getPlayerDetails, getPlayerGames, loginPlayer,registerPlayer } from '../controllers/player.controller.js'

const router = Router()

router.route("/register").post(registerPlayer)


router.route("/login").post(loginPlayer)
router.route("/getPlayerDetails/:id").get(getPlayerDetails)
router.route("/getAllPlayers").get(getAllPlayers)
router.route("/getPlayerGames/:playername").get(getPlayerGames)

export default router;