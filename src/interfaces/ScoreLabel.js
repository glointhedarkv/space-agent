import Phaser from 'phaser'

const formatScore = (gameScore) => `Score: ${gameScore}`

// function formatScore(gameScore) {
//     return `Score: ${gameScore}`
// }

export default class ScoreLabel extends Phaser.GameObjects.Text {
    constructor(scene, x, y, skor, style) {
        super(scene, x, y, formatScore(skor), style)
        this.score = skor
    }

    setScore(skor) {
        this.score = skor
        this.setText(formatScore(this.score))
    }

    getScore() {
        //return properti
        return this.score
    }

    add(points) {
        this.setScore(this.score + points)
    }
    // updateScoreText()
    // {
    //     this.setText(formatScore(this.score))
    // }
}