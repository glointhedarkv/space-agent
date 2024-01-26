import Phaser from 'phaser'

import SpaceAgentScene from './scenes/SpaceAgentScene'
import GameOverScene from './scenes/GameOverScene'

const config = {
	type: Phaser.AUTO,
	parent: 'app',
	width: 400,
	height: 620,
	physics: {
		default: 'arcade'
	},
	scale: {
		mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
	},
	scene: [SpaceAgentScene, GameOverScene],
}

export default new Phaser.Game(config)
