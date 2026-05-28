let allWords = [];
let currentWords = [];
let currentIndex = 0;

let favorites =
JSON.parse(localStorage.getItem("fav")) || [];

let learned =
JSON.parse(localStorage.getItem("learned")) || [];

let currentCategory =
localStorage.getItem("currentCategory") || "Todas";


// ======================
// LOGIN
// ======================

async function login(){

    const user =
        document.getElementById("user").value;

    const pass =
        document.getElementById("pass").value;

    if(
        user === "cesar" &&
        pass === "1234"
    ){

        document.getElementById(
            "loginScreen"
        ).style.display = "none";

        loadWords();

    }else{

        alert(
            "Usuario o contraseña incorrectos"
        );
    }
}

// ======================
// CARGAR PALABRAS
// ======================

async function loadWords(){

    const res =
        await fetch("vocabulario_pro.json");

    allWords =
        await res.json();

    document.getElementById(
        "totalCount"
    ).innerText =
        allWords.length;

    renderCategories();

    currentWords = allWords;

    renderWords(allWords);

    updateLearnedCount();

    loadProgress();
    goToLastWord();
}



// ======================
// CATEGORIAS
// ======================

function renderCategories(){

    const container =
        document.getElementById(
            "categories"
        );

    container.innerHTML = "";

    const allBtn =
        document.createElement("button");

    allBtn.className =
        "cat-btn";

    allBtn.innerText =
        "📚 Todas";

    allBtn.onclick = ()=>{

        currentCategory="Todas";

        currentWords=allWords;

        renderWords(currentWords);

        saveProgress();
    };

    container.appendChild(allBtn);

    const categories =
        [...new Set(
            allWords.map(
                w=>w.categoria
            )
        )];

    categories.forEach(cat=>{

        const btn =
            document.createElement("button");

        btn.className =
            "cat-btn";

        btn.innerText =
            cat;

        btn.onclick = ()=>{

            currentCategory=cat;

            currentWords =
                allWords.filter(
                    w=>w.categoria===cat
                );

            renderWords(currentWords);

            saveProgress();
        };

        container.appendChild(btn);

    });

}


// ======================
// LISTA
// ======================

function renderWords(words){

    const container =
        document.getElementById(
            "wordList"
        );

    container.innerHTML="";

    words.forEach(w=>{

        const fav =
            favorites.includes(
                w.english
            );

        const div =
            document.createElement("div");

        div.className="word";

       div.innerHTML = `

<b>${w.english}</b><br>

${w.spanish}<br>

<small>${w.categoria}</small>

<br><br>

<button onclick="speak('${w.english}')">
🔊
</button>

<button onclick="toggleFav('${w.english}')">
${fav ? "⭐" : "☆"}
</button>

<label style="display:block;margin-top:10px;">

<input
type="checkbox"
onchange="toggleLearned('${w.english}')"
${learned.includes(w.english) ? "checked" : ""}>

Aprendida

</label>

`; 

        container.appendChild(div);

    });

}


// ======================
// AUDIO
// ======================

function speak(text){

    // guardar última palabra escuchada

    localStorage.setItem(
        "lastWord",
        text
    );

    const utterance =
        new SpeechSynthesisUtterance(text);

    utterance.lang = "en-US";

    speechSynthesis.speak(
        utterance
    );
}
function goToLastWord(){

    const lastWord =
        localStorage.getItem(
            "lastWord"
        );

    if(!lastWord) return;

    const pos =
        allWords.findIndex(
            w => w.english === lastWord
        );

    if(pos < 0) return;

    setTimeout(()=>{

        const cards =
            document.querySelectorAll(
                ".word"
            );

        if(cards[pos]){

            cards[pos].scrollIntoView({
                behavior:"smooth",
                block:"center"
            });

            cards[pos].style.boxShadow =
                "0 0 25px #3b82f6";

        }

    },500);
}

// ======================
// FLASHCARDS
// ======================
let lastWord = localStorage.getItem("lastWord") || "";
function startFlashcards(){

    if(currentWords.length===0){

        currentWords=allWords;
    }

    document.getElementById(
        "wordList"
    ).classList.add("hidden");

    document.getElementById(
        "flashcard"
    ).classList.remove("hidden");

    document.getElementById(
        "progressContainer"
    ).classList.remove("hidden");

    showFlashcard();
}


function showFlashcard(){

    const w =
        currentWords[currentIndex];

    if(!w) return;

    document.getElementById(
        "flashWord"
    ).innerText =
        w.english;

    document.getElementById(
        "flashAnswer"
    ).innerText =
        w.spanish;

    document.getElementById(
        "flashAnswer"
    ).classList.add(
        "hidden"
    );

    updateProgress();
}


function revealAnswer(){

    document.getElementById(
        "flashAnswer"
    ).classList.remove(
        "hidden"
    );
}


function nextCard(){

    currentIndex++;

    if(
        currentIndex>=
        currentWords.length
    ){
        currentIndex=0;
    }

    saveProgress();

    showFlashcard();
}


// ======================
// FAVORITOS
// ======================

function toggleFav(word){

    if(favorites.includes(word)){

        favorites =
            favorites.filter(
                w=>w!==word
            );

    }else{

        favorites.push(word);
    }

    localStorage.setItem(
        "fav",
        JSON.stringify(favorites)
    );

    renderWords(currentWords);
}


function showFavorites(){

    const favWords =
        allWords.filter(
            w=>
            favorites.includes(
                w.english
            )
        );

    renderWords(favWords);
}


// ======================
// PROGRESO
// ======================

function saveProgress(){

    localStorage.setItem(
        "studyProgress",
        JSON.stringify({
            category:
                currentCategory,
            index:
                currentIndex
        })
    );
}


function loadProgress(){

    const saved =
        localStorage.getItem(
            "studyProgress"
        );

    if(!saved) return;

    const p =
        JSON.parse(saved);

    currentCategory =
        p.category || "Todas";

    currentIndex =
        p.index || 0;
}
function goToLastWord(){

    const lastWord =
        localStorage.getItem(
            "lastWord"
        );

    if(!lastWord) return;

    const pos =
        allWords.findIndex(
            w =>
            w.english.toLowerCase().trim() ===
            lastWord.toLowerCase().trim()
        );

    if(pos < 0) return;

    setTimeout(()=>{

        const cards =
            document.querySelectorAll(
                ".word"
            );

        if(cards[pos]){

            cards[pos].scrollIntoView({
                behavior:"smooth",
                block:"center"
            });

            cards[pos].style.boxShadow =
                "0 0 25px #3b82f6";
        }

    },500);
}

// ======================
// CONTADORES
// ======================

function updateLearnedCount(){

    document.getElementById(
        "learnedCount"
    ).innerText =
        learned.length;
}


// ======================
// HOME
// ======================

function showHome(){

    document.getElementById(
        "wordList"
    ).classList.remove(
        "hidden"
    );

    document.getElementById(
        "flashcard"
    ).classList.add(
        "hidden"
    );

    document.getElementById(
        "progressContainer"
    ).classList.add(
        "hidden"
    );

    renderWords(currentWords);
}


// ======================
// AÑADIR
// ======================

function showAdd(){

    document.getElementById(
        "addScreen"
    ).classList.remove(
        "hidden"
    );
}


// ======================
// SALIR
// ======================

function exitStudy(){

    saveProgress();

    alert(
        "Progreso guardado"
    );

    location.reload();
}
function toggleLearned(word){

    if(learned.includes(word)){

        learned =
            learned.filter(
                w => w !== word
            );

    }else{

        learned.push(word);
    }

    localStorage.setItem(
        "learned",
        JSON.stringify(learned)
    );

    updateLearnedCount();
}