/* =========================
   DATA
========================= */

let totalScore =
    Number(localStorage.getItem("totalScore")) || 0;

let gamesPlayed =
    Number(localStorage.getItem("gamesPlayed")) || 0;

let bestScore =
    Number(localStorage.getItem("bestScore")) || 0;

let history =
    JSON.parse(
        localStorage.getItem("gameHistory")
    ) || [];


/* =========================
   SCORE UPDATE
========================= */

function updateScore() {

    document.getElementById("totalScore")
        .textContent = totalScore;

    document.getElementById("gamesPlayed")
        .textContent = gamesPlayed;

    document.getElementById("bestScore")
        .textContent = bestScore;

    localStorage.setItem(
        "totalScore",
        totalScore
    );

    localStorage.setItem(
        "gamesPlayed",
        gamesPlayed
    );

    localStorage.setItem(
        "bestScore",
        bestScore
    );
}


function addScore(points, game) {

    totalScore += points;

    gamesPlayed++;

    if (totalScore > bestScore) {
        bestScore = totalScore;
    }

    addHistory(
        game + " → +" + points + " points"
    );

    updateScore();
}


/* =========================
   HISTORY
========================= */

function addHistory(text) {

    const time =
        new Date().toLocaleTimeString();

    history.unshift(
        time + " - " + text
    );

    if (history.length > 10) {
        history.pop();
    }

    localStorage.setItem(
        "gameHistory",
        JSON.stringify(history)
    );

    displayHistory();
}


function displayHistory() {

    const list =
        document.getElementById("historyList");

    list.innerHTML = "";

    if (history.length === 0) {

        list.innerHTML =
            '<li class="empty">No games played yet.</li>';

        return;
    }

    history.forEach(item => {

        const li =
            document.createElement("li");

        li.textContent = "🎮 " + item;

        list.appendChild(li);

    });
}


function clearHistory() {

    history = [];

    localStorage.removeItem(
        "gameHistory"
    );

    displayHistory();
}


/* =========================
   NUMBER GUESSING
========================= */

let secretNumber =
    Math.floor(Math.random() * 10) + 1;

let guessFinished = false;


function checkGuess() {

    if (guessFinished) {
        return;
    }

    const input =
        document.getElementById("guessInput");

    const result =
        document.getElementById("guessResult");

    const guess =
        Number(input.value);

    if (!Number.isInteger(guess) ||
        guess < 1 ||
        guess > 10
    ) {

        result.textContent =
            "⚠️ Enter a number from 1 to 10.";

        return;
    }


    if (guess === secretNumber) {

        result.textContent =
            "🎉 Correct! +10 points!";

        addScore(
            10,
            "Number Guessing"
        );

        guessFinished = true;

    } else if (guess < secretNumber) {

        result.textContent =
            "📈 Too low! Try again.";

    } else {

        result.textContent =
            "📉 Too high! Try again.";

    }
}


function newGuessGame() {

    secretNumber =
        Math.floor(Math.random() * 10) + 1;

    guessFinished = false;

    document.getElementById(
        "guessInput"
    ).value = "";

    document.getElementById(
            "guessResult"
        ).textContent =
        "🎯 New game! Start guessing.";

}


/* =========================
   ROCK PAPER SCISSORS
========================= */

function playRPS(player) {

    const choices = [
        "Rock",
        "Paper",
        "Scissors"
    ];

    const computer =
        choices[
            Math.floor(
                Math.random() * choices.length
            )
        ];

    let message;
    let points;


    if (player === computer) {

        message =
            "🤝 Draw! Computer chose " +
            computer;

        points = 2;

    } else if (

        (player === "Rock" &&
            computer === "Scissors") ||

        (player === "Paper" &&
            computer === "Rock") ||

        (player === "Scissors" &&
            computer === "Paper")

    ) {

        message =
            "🎉 You Win! Computer chose " +
            computer;

        points = 5;

    } else {

        message =
            "😢 You Lose! Computer chose " +
            computer;

        points = 0;

    }


    document.getElementById(
        "rpsResult"
    ).textContent = message;

    addScore(
        points,
        "Rock Paper Scissors"
    );

}


/* =========================
   DICE
========================= */

function rollDice() {

    const number =
        Math.floor(
            Math.random() * 6
        ) + 1;

    const faces = [
        "⚀",
        "⚁",
        "⚂",
        "⚃",
        "⚄",
        "⚅"
    ];

    document.getElementById(
            "dice"
        ).textContent =
        faces[number - 1];

    document.getElementById(
            "diceResult"
        ).textContent =
        "You rolled " +
        number +
        " → +" +
        number +
        " points!";

    addScore(
        number,
        "Dice Roll"
    );

}


/* =========================
   MEMORY CARD
========================= */

const memoryValues = [
    "🍎", "🍎",
    "🍌", "🍌",
    "🍇", "🍇",
    "🍓", "🍓"
];

let firstCard = null;

let secondCard = null;

let lockBoard = false;

let matchedCards = 0;


function shuffle(array) {

    return array.sort(
        () => Math.random() - 0.5
    );

}


function startMemoryGame() {

    const board =
        document.getElementById(
            "memoryBoard"
        );

    board.innerHTML = "";

    firstCard = null;

    secondCard = null;

    lockBoard = false;

    matchedCards = 0;


    const shuffled =
        shuffle([
            ...memoryValues
        ]);


    shuffled.forEach(value => {

        const card =
            document.createElement("div");

        card.className =
            "memory-card";

        card.textContent = "?";

        card.dataset.value =
            value;

        card.addEventListener(
            "click",
            () => flipCard(card)
        );

        board.appendChild(card);

    });


    document.getElementById(
            "memoryResult"
        ).textContent =
        "Find all matching pairs!";

}


function flipCard(card) {

    if (
        lockBoard ||
        card === firstCard ||
        card.classList.contains("matched")
    ) {
        return;
    }


    card.classList.add("open");

    card.textContent =
        card.dataset.value;


    if (!firstCard) {

        firstCard = card;

        return;
    }


    secondCard = card;

    checkMatch();

}


function checkMatch() {

    const isMatch =
        firstCard.dataset.value ===
        secondCard.dataset.value;


    if (isMatch) {

        firstCard.classList.add(
            "matched"
        );

        secondCard.classList.add(
            "matched"
        );

        matchedCards += 2;

        addScore(
            5,
            "Memory Card"
        );

        resetMemory();


        if (
            matchedCards ===
            memoryValues.length
        ) {

            document.getElementById(
                    "memoryResult"
                ).textContent =
                "🏆 You found all pairs!";

        }

    } else {

        lockBoard = true;

        setTimeout(() => {

            firstCard.classList.remove(
                "open"
            );

            secondCard.classList.remove(
                "open"
            );

            firstCard.textContent =
                "?";

            secondCard.textContent =
                "?";

            resetMemory();

        }, 800);

    }

}


function resetMemory() {

    firstCard = null;

    secondCard = null;

    lockBoard = false;

}


/* =========================
   DARK MODE
========================= */

const themeBtn =
    document.getElementById(
        "themeBtn"
    );


let darkMode =
    localStorage.getItem(
        "darkMode"
    ) === "true";


function applyTheme() {

    document.body.classList.toggle(
        "dark",
        darkMode
    );

    themeBtn.textContent =
        darkMode ? "☀️" : "🌙";

}


themeBtn.addEventListener(
    "click",
    () => {

        darkMode = !darkMode;

        localStorage.setItem(
            "darkMode",
            darkMode
        );

        applyTheme();

    }
);


/* =========================
   START WEBSITE
========================= */

updateScore();

displayHistory();

applyTheme();

startMemoryGame();