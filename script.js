// ============================================
// СЦЕНА: "Слишком долго смотрел"
// ============================================

console.log("[VN] Запуск...");

const characters = {
    alina: { name: "Алина", color: "#ff6b8a" },
    mc:    { name: "Ты",    color: "#88ccff" }
};

// ============================================
// СЦЕНАРИЙ
// ============================================

const script = [
    { type: "narration", text: "Лекция закончилась. Ты уже минут пять смотришь в сторону — не то чтобы специально..." },
    { type: "narration", text: "Пара девчонок из соседней группы хихикают у окна. Ты честно пытаешься вспомнить, о чём была лекция. Не выходит." },

    { type: "sprite", show: true, variant: "normal" },

    { type: "dialogue", char: "alina", text: "Ну и как тебе вид?" },
    { type: "dialogue", char: "mc",    text: "А?.. В смысле?" },

    { type: "emotion", variant: "smug" },
    { type: "dialogue", char: "alina", text: "В смысле ты на них смотришь уже дольше, чем на конспект. Я считала." },
    { type: "dialogue", char: "mc",    text: "Я... просто задумался." },
    { type: "dialogue", char: "alina", text: "Ага. И задумался ты строго в их сторону. Удобно устроился." },

    { type: "choice", options: [
        { text: "Признаться, что залип", next: "confess" },
        { text: "Оправдываться",         next: "excuse" },
        { text: "Перевести в шутку",     next: "joke"   }
    ]},

    { id: "confess", type: "dialogue", char: "mc",    text: "Ладно, признаю. Засмотрелся. Бывает." },
    { type: "emotion", variant: "smile" },
    { type: "dialogue", char: "alina", text: "Ого, честный. Редкость." },
    { type: "dialogue", char: "alina", text: "Только знаешь, что обидно? Я рядом стою. Вроде тоже ничего." },
    { type: "dialogue", char: "mc",    text: "Ты... это сейчас к чему?" },
    { type: "dialogue", char: "alina", text: "Ни к чему. Просто наблюдение." },
    { type: "jump", next: "after_branch" },

    { id: "excuse", type: "dialogue", char: "mc",    text: "Да я вообще не на них смотрел. Там окно. Птица. Что угодно." },
    { type: "emotion", variant: "smug" },
    { type: "dialogue", char: "alina", text: "Птица. В аудитории. На третьем этаже." },
    { type: "dialogue", char: "mc",    text: "...Редкая птица." },
    { type: "dialogue", char: "alina", text: "Ты бы лучше так на семинарах выкручивался, а не сейчас." },
    { type: "dialogue", char: "alina", text: "И вообще — я не ревную. Мне просто интересно, что в них такого." },
    { type: "jump", next: "after_branch" },

    { id: "joke", type: "dialogue", char: "mc",    text: "Смотрел на расписание. Там, кажется, физра в субботу." },
    { type: "emotion", variant: "smile" },
    { type: "dialogue", char: "alina", text: "Расписание у тебя на потолке висит, да?" },
    { type: "dialogue", char: "mc",    text: "У меня авторское расписание." },
    { type: "dialogue", char: "alina", text: "Ладно, засчитано. Но ты не отвертелся." },
    { type: "dialogue", char: "alina", text: "Я всё видела. И запомнила." },
    { type: "jump", next: "after_branch" },

    { id: "after_branch", type: "narration", text: "Алина делает шаг ближе и складывает руки на груди. Смотрит прямо, не отводя взгляда." },

    { type: "emotion", variant: "serious" },
    { type: "dialogue", char: "alina", text: "В общем так. С этого момента — смотришь только на меня. Ясно?" },
    { type: "dialogue", char: "mc",    text: "Это... ультиматум?" },

    { type: "emotion", variant: "smile" },
    { type: "dialogue", char: "alina", text: "Это приглашение. Думай как хочешь." },

    { type: "narration", text: "Она разворачивается и идёт к выходу. У двери оборачивается через плечо." },
    { type: "dialogue", char: "alina", text: "И да — если что, я тоже сегодня смотрела. Но не в сторону окна." },

    { type: "end" }
];

// ============================================
// ДВИЖОК
// ============================================

const spriteEl  = document.getElementById("sprite-alina");
const boxEl     = document.getElementById("dialogue-box");
const nameEl    = document.getElementById("speaker-name");
const textEl    = document.getElementById("dialogue-text");
const choicesEl = document.getElementById("choices");
const hintEl    = document.getElementById("continue-hint");

console.log("[VN] Элементы:", {
    spriteEl, boxEl, nameEl, textEl, choicesEl, hintEl
});

if (!spriteEl || !boxEl || !nameEl || !textEl || !choicesEl || !hintEl) {
    console.error("[VN] Не найдены DOM-элементы! Проверь index.html");
}

let index = 0;
let typing = false;
let typeTimer = null;

function setEmotion(variant) {
    spriteEl.src = `images/sprites/alina/alina-${variant}.png`;
    console.log("[VN] Спрайт:", spriteEl.src);
}

startScene();

function startScene() {
    index = 0;
    step();
}

function step() {
    if (index >= script.length) return;
    const node = script[index];

    console.log("[VN] Шаг", index, node.type);

    switch (node.type) {

        case "narration":
            showDialogue(null, node.text);
            break;

        case "dialogue":
            showDialogue(characters[node.char], node.text);
            break;

        case "sprite":
            if (node.show) {
                setEmotion(node.variant || "normal");
                spriteEl.classList.add("visible");
            } else {
                spriteEl.classList.remove("visible");
            }
            index++;
            step();
            return;

        case "emotion":
            setEmotion(node.variant);
            index++;
            step();
            return;

        case "choice":
            showChoices(node.options);
            return;

        case "jump": {
            const target = script.findIndex(n => n.id === node.next);
            index = target >= 0 ? target : script.length;
            step();
            return;
        }

        case "end":
            endScene();
            return;
    }

    index++;
}

function showDialogue(character, text) {
    choicesEl.classList.add("hidden");
    hintEl.style.visibility = "hidden";

    if (character) {
        nameEl.textContent = character.name;
        nameEl.style.display = "inline-block";
        nameEl.style.background =
            `linear-gradient(180deg, ${character.color} 0%, #c2365c 100%)`;
    } else {
        nameEl.textContent = "";
        nameEl.style.display = "none";
    }

    typeText(text);
}

function typeText(text) {
    clearInterval(typeTimer);
    typing = true;
    textEl.textContent = "";
    let i = 0;

    typeTimer = setInterval(() => {
        textEl.textContent += text[i];
        i++;
        if (i >= text.length) {
            clearInterval(typeTimer);
            typing = false;
            hintEl.style.visibility = "visible";
        }
    }, 25);
}

function skipTyping() {
    if (typing) {
        clearInterval(typeTimer);
        typing = false;
        const node = script[index - 1];
        if (node && node.text) textEl.textContent = node.text;
        hintEl.style.visibility = "visible";
        return true;
    }
    return false;
}

function showChoices(options) {
    choicesEl.innerHTML = "";
    choicesEl.classList.remove("hidden");
    hintEl.style.visibility = "hidden";

    options.forEach(opt => {
        const btn = document.createElement("button");
        btn.className = "choice-btn";
        btn.textContent = opt.text;
        btn.onclick = () => {
            choicesEl.classList.add("hidden");
            const target = script.findIndex(n => n.id === opt.next);
            index = target >= 0 ? target : script.length;
            step();
        };
        choicesEl.appendChild(btn);
    });
}

function endScene() {
    nameEl.style.display = "none";
    textEl.textContent = "— Конец сцены —";
    hintEl.style.visibility = "hidden";
    boxEl.onclick = null;
    boxEl.style.cursor = "default";
}

boxEl.addEventListener("click", () => {
    if (!choicesEl.classList.contains("hidden")) return;
    if (skipTyping()) return;
    step();
});