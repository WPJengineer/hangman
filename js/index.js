const username = document.getElementById("username");
const password = document.getElementById("password");
const btnSubmit = document.querySelector('.loginMenu input[type="submit"]');
const collectionPicked = document.querySelector('#collection');
// const urlPalabrasEndPoint = "http://localhost:3000/palabras";

// estan aqui para ver el funcionamiento del resto del programma pero la ideea seria que obtienga todo esto de mi doc palabras.json.
const animals = ["elefant", "girafa", "pingui", "cangur", "dofi", "cocodril", "papallona", "pop", "tigre", "lloro"];
const sports = ["futbol", "basquet", "tennis", "natacio", "voleibol", "golf", "boxa", "ciclisme", "atletisme", "esqui"];
const objects = ["cadira", "finestra", "llapis", "quadern", "tisores", "ampolla", "paraigua", "mirall", "motxilla", "telefon"];
const fruit = ["poma", "platan", "maduixa", "tomaquet", "sindria", "pinya", "cogombre", "alvocat", "melo", "melicoto"];
const professions = ["mestre", "enginyer", "metge", "artista", "bomber", "cientific", "music", "pages", "arquitecte", "pilot"];
const parametros = new URLSearchParams(window.location.search);
const parametroUsername = parametros.get("username");
let result = false;

// in case we are sent back to change word to continue playing with the same username, we check for username and autofill textbox automatically.
if (parametroUsername) {
    username.value = `${parametroUsername}`;
}

// FUNCTIONS

// document.addEventListener('DOMContentLoaded', () => {
//     cargarCollections();
// });

// async function cargarCollections() {
//     try {
//         const response = await fetch(urlPalabrasEndPoint);
//         const collections = await response.json();

//         console.log(collections);

//         collectionPicked.innerHTML = '<option value="">Selecciona una col·lecció</option>';

//         Object.keys(collections).forEach(key => {
//         const option = document.createElement('option');
//         option.value = key;
//         option.textContent = key;
//         collectionPicked.appendChild(option);
//     });
//     } catch (error) {
//     console.error('Error carregant col·leccions:', error);
//     }
// }

// No he logrado que me funcione la parte de json-server, però te dejo aquí lo habia escrito hasta ahora.





// check username input so it only contains alphanumeric charaters and that it is not empty when submitted.
function checkUsername() {

    const formGroup = username.closest(".form-group");
    const small = formGroup.querySelector("small");
    const alphanumericRegex = /^[a-zA-Z0-9]+$/;

    if (username.value.trim() === "") {
        formGroup.classList.add("error");
        formGroup.classList.remove("correct");
        small.textContent = "El camp no pot estar buit";
        return false;
    }

    if (!alphanumericRegex.test(username.value.trim())) {
        formGroup.classList.add("error");
        formGroup.classList.remove("correct");
        small.textContent = "Només es permeten lletres i números.";
        return false;
    }

    formGroup.classList.remove("error");
    formGroup.classList.add("correct");
    small.textContent = "";
    return true;
    
}

// EVENTS

// submition event to save username, randomly assign work from collectioned to start game.
btnSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    if (checkUsername()) {
        const category = collectionPicked.value;
        let selectedArray = [];
        switch (category) {
            case "animals":
                selectedArray = animals;
                break;
            case "sports":
                selectedArray = sports;
                break;
            case "objects":
                selectedArray = objects;
                break;
            case "fruit":
                selectedArray = fruit;
                break;
            case "professions":
                selectedArray = professions;
                break;
            default:
                console.log("Cap categoria seleccionada!");
                return;
        }
        let word = selectedArray[Math.floor(Math.random() * selectedArray.length)].toUpperCase().split("");
        localStorage.setItem('username', username.value);
        localStorage.setItem('word', JSON.stringify(word));
        location.href = "./html/game.html";
    }
});