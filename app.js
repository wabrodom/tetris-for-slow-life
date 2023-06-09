document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const scoreDisplay = document.querySelector("#score");
  const startBtn = document.querySelector("#start-button");
  const width = 10;
  let goal = +prompt("What is your goal", 0);
  let score = 0;
  let nextRandom = 0;
  let timerId;
  const colors = ["red", "green", "maroon", "blue", "orange"];

  document.addEventListener("keydown", function (event) {
    if (event.code === "ArrowUp" || event.code === "ArrowDown") {
      event.preventDefault();
    }
  });
  document.querySelector("#goal").innerText = goal;

  const lTetrominoes = [
    [1, 2, width + 1, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetrominoes = [
    [0, width, width + 1, width * 2 + 1],
    [width * 2, width * 2 + 1, width + 1, width + 2],
    [0, width, width + 1, width * 2 + 1],
    [width * 2, width * 2 + 1, width + 1, width + 2],
  ];

  const tTetrominoes = [
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
    [1, width, width + 1, width + 2],
    [1, width + 1, width + 2, width * 2 + 1],
  ];

  const oTetrominoes = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const iTetrominoes = [
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
  ];

  const theTetrominoes = [lTetrominoes, zTetrominoes, tTetrominoes, oTetrominoes, iTetrominoes];
  let currentPosition = 4;
  let currentRotation = 0;

  // randomly select the tetromino and it first rotation
  let random = Math.floor(Math.random() * theTetrominoes.length);
  let current = theTetrominoes[random][currentRotation];

  // draw the Tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetrominoes");
      squares[currentPosition + index].style.backgroundColor = colors[random];
    });
  }

  // undraw the Tetromino
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetrominoes");
      squares[currentPosition + index].style.backgroundColor = "";
    });
  }

  // make the tetrominoes move down every second
  // timerId = setInterval(moveDown, 400)

  // assign funtions to keyCodes
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft();
    } else if (e.keyCode === 39) {
      moveRight();
    } else if (e.keyCode === 38) {
      moveRotate();
    } else if (e.keyCode === 40) {
      moveFall();
    }
  }
  document.addEventListener("keydown", control);

  // move down function
  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  // freeze function
  function freeze() {
    if (current.some((index) => squares[currentPosition + index + width].classList.contains("taken"))) {
      current.forEach((index) => squares[currentPosition + index].classList.add("taken"));
      /// start a new tetromino falling
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      current = theTetrominoes[random][currentRotation];
      currentPosition = 4;
      draw();
      displayShape();
      addScore();
      gameOver();
    }
  }

  // move the tetromino left, unless is at the edge or there is a blockage
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some((index) => (currentPosition + index) % width === 0);

    if (!isAtLeftEdge) {
      currentPosition -= 1;
    }

    if (current.some((index) => squares[currentPosition + index].classList.contains("taken"))) {
      currentPosition += 1;
    }
    draw();
  }
  // move the tetromino right if there is no blockage and at the rightedge
  function moveRight() {
    const regex = /9$/;
    undraw();
    const isAtRightEdge = current.some((index) => regex.test(currentPosition + index));
    if (!isAtRightEdge) {
      currentPosition += 1;
    }
    if (current.some((index) => squares[currentPosition + index].classList.contains("taken"))) {
      currentPosition -= 1;
    }
    draw();
  }
  // move down quickly
  function moveFall() {
    undraw();
    if (current.some((index) => squares[currentPosition + index].classList.contains("taken"))) {
      currentPosition -= width;
    }
    draw();
  }
  // check if tetorminoes at the edge before rotate
  function isAtEdge(currentPos, currentTetromino) {
    return currentTetromino.some((index) => {
      const pos = currentPos + index;
      return pos % width === 0 || pos % width === width - 1;
    });
  }

  // rotate the tetrominoes
  function moveRotate() {
    undraw();
    const originalRotation = currentRotation;
    currentRotation++;
    if (currentRotation === current.length) {
      currentRotation = 0;
    }
    const nextTetromino = theTetrominoes[random][currentRotation];
    if (!isAtEdge(currentPosition, nextTetromino)) {
      current = nextTetromino;
      draw();
    } else {
      currentRotation = originalRotation;
      draw();
    }
  }

  // show-up next tetromino in mini-grid display
  const displaySquares = document.querySelectorAll(".mini-grid div");
  const displayWidth = 4;
  let displayIndex = 0;

  // the tetrominoes without ratation
  const upNextTetrominoes = [
    [1, 2, displayWidth + 1, displayWidth * 2 + 1], // lTeteromino
    [1, displayWidth + 1, displayWidth + 2, displayWidth * 2 + 2], // zTetromino
    [displayWidth, displayWidth + 1, displayWidth + 2, displayWidth * 2 + 1], // tTetromino
    [displayWidth + 1, displayWidth + 2, displayWidth * 2 + 1, displayWidth * 2 + 2], // oTetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], // iTretomino
  ];

  // display the shape in the mini-grid display
  function displayShape() {
    // remove any trace of a tetromino from the entire grid
    displaySquares.forEach((square) => {
      square.classList.remove("tetrominoes");
      square.style.backgroundColor = "";
    });
    upNextTetrominoes[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetrominoes");
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom];
    });
  }

  //add functionality to the button
  startBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      draw();
      timerId = setInterval(moveDown, 400);
      nextRandom = Math.floor(Math.random() * theTetrominoes.length);
      displayShape();
    }
  });
  // add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];
      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 10;
        scoreDisplay.innerHTML = score;
        if (score >= 100) {
          scoreDisplay.innerText = `You got ${score}/100, you can stop now`;
        } else if (score >= 50) {
          scoreDisplay.innerText = `You got ${score}/50, you can stop now`;
        } else if (score >= goal) {
          scoreDisplay.innerText = `You got ${score}/${goal}, you can stop now`;
        }
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetrominoes");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }
  // game over
  function gameOver() {
    if (current.some((index) => squares[currentPosition + index].classList.contains("taken"))) {
      scoreDisplay.innerHTML = " Game Over";
      clearInterval(timerId);
    }
  }
});
