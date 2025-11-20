// waits for the whole page to load before starting program.
window.addEventListener("DOMContentLoaded", () => {
    
    const wordToGuess = document.querySelector(".wordToGuess");
    const buttons = document.querySelectorAll(".keyboard .row .letter");
    const attempts = document.getElementById("attempts");
    const errors = document.getElementById("errors");
    const resultGame = document.querySelector("h1");
    const keyboard = document.querySelector(".keyboard");
    const returnBtn = document.getElementById("returnBtn");
    const tempsTranscorregut = document.querySelector(".timer p:nth-child(2)");
    const timeRemaining = document.querySelector(".countdown p:nth-child(2)");
    const popup = document.querySelector('.popup');
    const replay = document.getElementById('tornar-jugar');
    const newWord = document.getElementById('nou-paraula');
    const tbody = document.getElementById("leaderboard-body");
    const noDataMsg = document.getElementById("no-data-msg");

    let totalAttempts = 6;
    let errorCounter = 0;
    let tempsTranscorregutValor = 0;
    let tempsTranscorregutInterval;
    let timeRemainingValue = 10;
    let timeRemainingInterval;
    let gameTimer = false;
   
    // FUNCIONES

    // function that assigns a random word as soon as page loads, saves it and then fills in blanks on our page.
    function selectGuessWord() {
        let word = JSON.parse(localStorage.getItem("word"));
        let hiddenWord = new Array(word.length).fill("_");
        wordToGuess.innerText = hiddenWord.join(" ");
        return { word, hiddenWord};
    }

    // initialize the game.
    const { word, hiddenWord } = selectGuessWord();

    // starts game and timers on clicking button for our first guess.
    function startGame(e) {

        let correctGuess = false;
        if (gameTimer === false) {
            tempsTranscorregut.textContent = "00:00:00";
            tempsTranscorregutInterval = setInterval(() => {
                tempsTranscorregutValor++;
                let tempsHours = Math.floor(tempsTranscorregutValor/3600);
                let tempsMinutes = Math.floor((tempsTranscorregutValor%3600)/60);
                let tempsSeconds = Math.floor(tempsTranscorregutValor%60);
                tempsTranscorregut.textContent = `${String(tempsHours).padStart(2, '0')}:`+`${String(tempsMinutes).padStart(2, '0')}:`+`${String(tempsSeconds).padStart(2, '0')}`;
            }, 1000); 
            gameTimer = true;
        }

        startCountdown();      
        
        // gets value of buton we clicked and checks if value is in our word, saves result and changes blank to letter if correct.
        for (let i = 0; i < word.length; i++) {
            if (word[i] === e.target.textContent) {
                hiddenWord[i] = e.target.textContent;
                correctGuess = true;
            }
        }

        // updates word after each check
        wordToGuess.innerText = hiddenWord.join(" ");

        // changes style of button depending on result.
        if (correctGuess) {
            e.target.style.backgroundColor = "var(--green)";
            e.target.style.color = "var(--dark)";
        } else {
            e.target.style.backgroundColor = "var(--red)";
            e.target.style.color = "var(--light)";
            totalAttempts--;
            attempts.innerText = totalAttempts;
            errorCounter++;
            errors.innerText = errorCounter;
            showHangmanImage();
        }

        // diactivates button that we have clicked.
        e.target.style.pointerEvents = "none";

        // look if all slots are letters to indicate game is over.
        // shows result of game and then deactivates buttons.
        checkGameStatus()

    }

    // function to change image of hangman
    function showHangmanImage() {
        const hangmanImage = document.querySelector('.hangImage img');
        let error = +errors.innerText;
        switch (error) {
            case 1:
                hangmanImage.src = "../images/1.png";
                break;
            case 2:
                hangmanImage.src = "../images/2.png";
                break;
            case 3:
                hangmanImage.src = "../images/3.png";
                break;
            case 4:
                hangmanImage.src = "../images/4.png";
                break;
            case 5:
                hangmanImage.src = "../images/5.png";
                break;
            case 6:
                hangmanImage.src = "../images/6.png";
                break;
            default:
                hangmanImage.src = "../images/0.png";
                return;
        }
    }

    // function for countdown, starts at 10 and calls itself recursivily until game is over so as to avoid starting multiple timers causing errors.
    function startCountdown() {

        clearInterval(timeRemainingInterval);
        timeRemaining.textContent = "10";
        timeRemainingValue = 10;
        timeRemainingInterval = setInterval(() => {
            timeRemainingValue--;
            timeRemaining.textContent = timeRemainingValue;
            if (timeRemainingValue <= 0) {
                totalAttempts--;
                attempts.innerText = totalAttempts;
                errorCounter++;
                errors.innerText = errorCounter;
                timeRemainingValue = 10;
                clearInterval(timeRemainingInterval);
                if (totalAttempts > 0 && hiddenWord.includes("_")) {
                    startCountdown();
                } else {
                    timeRemaining.textContent = "0";
                }
                checkGameStatus()
            }
        }, 1000);

    }

    // checks status of hiddenword and shows result, at end of game activates pop-up to give options on how to continue.
    function checkGameStatus() {

        if(!hiddenWord.includes("_")) {
            resultGame.innerText = "Has guanyat!";
            keyboard.style.pointerEvents = "none";
            clearInterval(tempsTranscorregutInterval);
            clearInterval(timeRemainingInterval);
            saveResults();
            popup.style.display = "flex";
        }

        if(totalAttempts === 0) {
            resultGame.innerText = "Has perdut!";
            keyboard.style.pointerEvents = "none";
            clearInterval(tempsTranscorregutInterval);
            clearInterval(timeRemainingInterval);
            popup.style.display = "flex";
        }

    }

    // savs result of games word (total time and number of errors commited).
    function saveResults() {
        
        const username = localStorage.getItem("username");
        const usedWord = word.join("");
        let scores = JSON.parse(localStorage.getItem("leaderboard")) || {};
        if (!scores[username]) {
            scores[username] = {};
        }
        const oldEntry = scores[username][usedWord];
        if (!oldEntry || tempsTranscorregutValor < oldEntry.time || (tempsTranscorregutValor === oldEntry.time && errorCounter < oldEntry.errors)) {
            scores[username][usedWord] = {
                time: tempsTranscorregutValor,
                errors: errorCounter
            };
        }
        localStorage.setItem('leaderboard', JSON.stringify(scores));
        
    }


    // leaderboards table sets up onload of page.
    // gets leaderboard that all our data stored in localStorage that we have added to it over playing all the gaems that wehave played.
    const row = localStorage.getItem("leaderboard");
    if (!row) {
        noDataMsg.style.display = "block";
        return;
    }

    // build the object to them throw into the tables.
    let scoresObj;

    try {
        scoresObj = JSON.parse(row);
    } catch (error) {
        console.error("Error parsing leaderboard:", error);
        noDataMsg.style.display = "block";
        return;
    }

    // breakdown the object into each atribute and then throw into an array to then finally separate into each column of our table.
    const entries = [];

    for (const username in scoresObj) {
        const words = scoresObj[username];
        for (const usedWord in words) {
            const entry = words[usedWord];
            entries.push({
                name: username,
                word: usedWord,
                time: entry.time,
                errors: entry.errors
            });
        }
    }

    if (entries.length === 0) {
        noDataMsg.style.display = "block";
        return;
    }

    // Sort by time and then errors committed
    entries.sort((a, b) => {
        if (a.time !== b.time) {
            return a.time - b.time;
        }
        return a.errors - b.errors;
    });

    // Render rows
    entries.forEach((entry, index) => {
        const tr = document.createElement("tr");
        const rankTd = document.createElement("td");
        rankTd.textContent = index + 1;
        const nameTd = document.createElement("td");
        nameTd.textContent = entry.name;
        const wordTd = document.createElement("td");
        wordTd.textContent = entry.word;
        const timeTd = document.createElement("td");
        timeTd.textContent = entry.time + "s";
        const errorsTd = document.createElement("td");
        errorsTd.textContent = entry.errors;

        tr.appendChild(rankTd);
        tr.appendChild(nameTd);
        tr.appendChild(wordTd);
        tr.appendChild(timeTd);
        tr.appendChild(errorsTd);

        tbody.appendChild(tr);
    });


    // EVENTOS

    // regardless the button we click it activates the event listener.
    buttons.forEach(button => {
        button.addEventListener("click", (e) => {
            startGame(e);
        });
    });

    replay.addEventListener('click', () => {
        window.location.reload();
    });

    newWord.addEventListener('click', () => {
        const username = localStorage.getItem("username");
        location.href = `../index.html?username=${username}`;
    });

    returnBtn.addEventListener('click', () => {
        location.href = "../index.html";
    });

    
});