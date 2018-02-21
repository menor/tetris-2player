class Player {
  constructor(tetris) {
    this.DROP_SLOW = 1000
    this.DROP_FAST = 50

    this.tetris = tetris
    this.arena = tetris.arena

    this.dropCounter = 0
    this.dropInterval = this.DROP_SLOW

    this.position = {x: 0, y: 0}
    this.matrix = null
    this.score = 0

    this.reset()
  }

  drop() {
    this.position.y += 1
    if (this.arena.collide(this)) {
      this.position.y -= 1
      this.arena.merge(this)
      this.reset()
      this.score += this.arena.sweep()
      this.tetris.updateScore(this.score)
    }
    this.dropCounter = 0
  }


  move(direction) {
    this.position.x += direction
    if(this.arena.collide(this)) {
      this.position.x -= direction
    }
  }

  reset() {
    const pieces = 'ILJOTSZ'
    this.matrix = createPiece(pieces[pieces.length * Math.random() | 0])
    this.position.y = 0
    this.position.x = (this.arena.matrix[0].length / 2 | 0) - (this.matrix[0].length / 2 | 0)
    if (this.arena.collide(this)) {
      this.arena.clear()
      this.score = 0
      this.tetris.updateScore()
    }
  }

  rotate(direction) {
    const position = this.position.x
    let offset = 1
    this._rotateMatrix(this.matrix, direction)
    while(this.arena.collide(this)) {
      this.position.x += offset
      offset = -(offset + (offset > 0 ? 1 : -1))
      if (offset > this.matrix[0].length) {
        this.rotate(this.matrix, -direction)
        this.position.x = position
        return
      }
    }
  }

  _rotateMatrix(matrix, direction) {
    for (let y = 0 ; y < matrix.length ; y++) {
      for (let x = 0 ; x < y ; x++) {
        [
          matrix[x][y],
          matrix[y][x]
        ] = [
          matrix[y][x],
          matrix[x][y]
        ]
      }
    }

    if(direction > 0) {
      matrix.forEach(row => row.reverse())
    } else {
      matrix.reverse()
    }
  }


  update(deltaTime) {
    this.dropCounter += deltaTime
    if(this.dropCounter > this.dropInterval) {
      this.drop()
    }
  }

}


