// ============================================================
// NAVIGATION
// ============================================================
let currentSection = 'hub';
let gravityEngine = null;
let censusIntervals = [];

function navigateTo(id) {
    const oldSection = document.getElementById(currentSection);
    const newSection = document.getElementById(id);
    const backBtn = document.getElementById('backBtn');

    oldSection.classList.remove('visible');

    setTimeout(() => {
        oldSection.classList.remove('active');

        if (currentSection === 'gravity') stopGravity();
        if (currentSection === 'census') stopCensus();
        if (currentSection === 'typing') stopTyping();

        currentSection = id;
        newSection.classList.add('active');
        window.scrollTo(0, 0);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                newSection.classList.add('visible');
            });
        });

        backBtn.classList.toggle('show', id !== 'hub');

        if (id === 'timeline') initTimeline();
        if (id === 'gravity') initGravity();
        if (id === 'census') initCensus();
        if (id === 'reaction') initReaction();
        if (id === 'memory') initMemory();
        if (id === 'colorgame') initColorGame();
        if (id === 'typing') initTyping();
    }, 350);
}

// ============================================================
// ŠKÁLA ČASU
// ============================================================
const timelineData = [
    { icon: '👁️', title: 'Mrknutí oka', time: '~300 milisekund', desc: 'Jeden z nejrychlejších lidských reflexů.' },
    { icon: '💓', title: 'Jeden úder srdce', time: '~800 milisekund', desc: 'Průměrné srdce bije asi 75× za minutu.' },
    { icon: '⚡', title: 'Jeden dech', time: '~4 sekundy', desc: 'V klidu dýcháme asi 15× za minutu.' },
    { icon: '🚦', title: 'Červená na semaforu', time: '~90 sekund', desc: 'Nejdelší čekání, které zná každý řidič.' },
    { icon: '🎵', title: 'Průměrná píseň', time: '~3,5 minuty', desc: 'Pop songy se za poslední dekádu zkrátily.' },
    { icon: '☕', title: 'Přestávka na kávu', time: '~15 minut', desc: 'Kofein začne působit za 20 minut.' },
    { icon: '🎬', title: 'Průměrný film', time: '~2 hodiny', desc: 'Titanic trvá 3 hodiny a 14 minut.' },
    { icon: '😴', title: 'Dobrý spánek', time: '~8 hodin', desc: 'Většina lidí spí méně, než by měla.' },
    { icon: '🌍', title: 'Jeden den na Zemi', time: '24 hodin', desc: 'Země se jednou otočí kolem své osy.' },
    { icon: '🌙', title: 'Měsíční cyklus', time: '~29,5 dne', desc: 'Od novu k novu.' },
    { icon: '🎂', title: 'Jeden rok', time: '365,25 dne', desc: 'Země oběhne Slunce.' },
    { icon: '🏛️', title: 'Průměrný lidský život', time: '~73 let', desc: 'Asi 2,3 miliardy sekund.' },
    { icon: '🏺', title: 'Starověký Egypt', time: '~5 000 let zpátky', desc: 'Pyramidy v Gíze jsou starší než mamuti.' },
    { icon: '🦖', title: 'Vyhynutí dinosaurů', time: '66 milionů let', desc: 'Asteroid o průměru 10 km.' },
    { icon: '🌎', title: 'Stáří Země', time: '~4,5 miliardy let', desc: 'Třetina stáří celého vesmíru.' },
    { icon: '✨', title: 'Stáří vesmíru', time: '~13,8 miliardy let', desc: 'Vše, co existuje. Od Velkého třesku dodnes.' }
];

let timelineInitialized = false;

function initTimeline() {
    if (timelineInitialized) {
        setTimeout(() => {
            document.querySelectorAll('.timeline-item').forEach(el => {
                checkTimelineItem(el);
            });
        }, 100);
        return;
    }
    timelineInitialized = true;

    const container = document.querySelector('.timeline-container');
    timelineData.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'timeline-item';
        div.innerHTML = `
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <span class="t-icon">${item.icon}</span>
                <div class="t-time">${item.time}</div>
                <h3>${item.title}</h3>
                <p>${item.desc}</p>
            </div>
        `;
        container.appendChild(div);
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.timeline-item').forEach(el => observer.observe(el));
}

function checkTimelineItem(el) {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.85) {
        el.classList.add('in-view');
    }
}

// ============================================================
// HROZNÝ ŠÉFKUCHAŘ
// ============================================================
const ingredients = [
    { name: 'Ponožka', emoji: '🧦' },
    { name: 'Cihla', emoji: '🧱' },
    { name: 'Zmrzlina', emoji: '🍦' },
    { name: 'Diamant', emoji: '💎' },
    { name: 'Prach', emoji: '🌫️' },
    { name: 'Guma', emoji: '🩹' },
    { name: 'Wifi router', emoji: '📶' },
    { name: 'Slza jednorožce', emoji: '🦄' },
    { name: 'Starý bot', emoji: '👢' },
    { name: 'Blesk', emoji: '⚡' }
];

let selectedIngredients = new Set();

(function initChef() {
    const grid = document.getElementById('ingredientsGrid');
    ingredients.forEach((ing, i) => {
        const btn = document.createElement('button');
        btn.className = 'ingredient';
        btn.textContent = `${ing.emoji} ${ing.name}`;
        btn.onclick = () => toggleIngredient(i, btn);
        grid.appendChild(btn);
    });
})();

function toggleIngredient(i, btn) {
    if (selectedIngredients.has(i)) {
        selectedIngredients.delete(i);
        btn.classList.remove('selected');
    } else {
        selectedIngredients.add(i);
        btn.classList.add('selected');
    }
    updatePot();
}

function updatePot() {
    const potItems = document.getElementById('potItems');
    const cookBtn = document.getElementById('cookBtn');
    if (selectedIngredients.size === 0) {
        potItems.textContent = 'Zatím prázdný hrnec...';
        cookBtn.disabled = true;
    } else {
        const names = [...selectedIngredients].map(i => ingredients[i].emoji).join('  ');
        potItems.textContent = names;
        cookBtn.disabled = false;
    }
}

const recipes = [
    {
        names: ['Perlivá prachová polévka', 'Křupavá ponožková kaše', 'Diamantové flambe', 'Cihlový biftek', 'Zmrzlinový šok', 'Digitální ragú', 'Botková paštika', 'Blesková omáčka', 'Gumový závin', 'Jednorožčí rozvod'],
        tastes: ['Chuť: 0,5/10. Jako lízání chodníku.', 'Chuť: 1/10. Připomíná vzpomínku na jídlo.', 'Chuť: 2/10. Jako litování v tekuté formě.', 'Chuť: —/10. Žádná. Jazyk odešel.', 'Chuť: 3/10. Zajímavé, ale ne v dobrém smyslu.', 'Chuť: 1,5/10. Matně připomíná existenci.'],
        smells: ['Vůně: Jako litování.', 'Vůně: Starý sklep po dešti.', 'Vůně: Absence naděje.', 'Vůně: WiFi signál a únava.', 'Vůně: Představ si fialovou. Tak to.', 'Vůně: Jako úterý odpoledne.'],
        textures: ['Textura: Podezřele křupavé.', 'Textura: Gumová, ale s ambicemi.', 'Textura: Jako žvýkání pixelů.', 'Textura: Neočekávaně vlnitá.', 'Textura: Ano.', 'Textura: Hladká jako výčitky svědomí.'],
        effects: ['Vedlejší efekt: Lehké zhoupnutí reality.', 'Vedlejší efekt: Schopnost slyšet barvy po dobu 5 minut.', 'Vedlejší efekt: Žádné. Nebo všechny. Těžko říct.', 'Vedlejší efekt: Náhlá potřeba zavolat babičce.', 'Vedlejší efekt: Pocit, že jste byli v tomto momentu už dříve.']
    }
];

function cook() {
    const pot = document.getElementById('potIcon');
    pot.classList.add('cooking');
    setTimeout(() => pot.classList.remove('cooking'), 1200);

    setTimeout(() => {
        const r = recipes[0];
        const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const dishIcons = ['🍽️','🥘','🫕','🍜','🥣','🍛'];

        document.getElementById('dishIcon').textContent = pick(dishIcons);
        document.getElementById('dishName').textContent = pick(r.names);
        document.getElementById('dishStats').innerHTML =
            `${pick(r.tastes)}<br>${pick(r.smells)}<br>${pick(r.textures)}<br><br><em>${pick(r.effects)}</em>`;
        document.getElementById('resultModal').classList.add('show');
    }, 1300);
}

function closeResult() {
    document.getElementById('resultModal').classList.remove('show');
    selectedIngredients.clear();
    document.querySelectorAll('.ingredient').forEach(b => b.classList.remove('selected'));
    updatePot();
}

// ============================================================
// GRAVITAČNÍ HŘIŠTĚ
// ============================================================
let matterEngine, matterRender, matterRunner, matterBodies = [];

function initGravity() {
    const container = document.getElementById('canvasContainer');
    const canvas = document.getElementById('gravityCanvas');
    const hint = document.getElementById('canvasHint');

    const w = container.clientWidth;
    const h = container.clientHeight;
    canvas.width = w * window.devicePixelRatio;
    canvas.height = h * window.devicePixelRatio;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';

    const Engine = Matter.Engine,
          Render = Matter.Render,
          Runner = Matter.Runner,
          Bodies = Matter.Bodies,
          Composite = Matter.Composite;

    matterEngine = Engine.create();
    matterEngine.gravity.y = 1;

    matterRender = Render.create({
        canvas: canvas,
        engine: matterEngine,
        options: {
            width: w * window.devicePixelRatio,
            height: h * window.devicePixelRatio,
            wireframes: false,
            background: '#ffffff',
            pixelRatio: 1
        }
    });

    const wallOpts = { isStatic: true, render: { fillStyle: '#e4e4e7' } };
    const thick = 60;
    Composite.add(matterEngine.world, [
        Bodies.rectangle(w * window.devicePixelRatio / 2, h * window.devicePixelRatio + thick / 2, w * window.devicePixelRatio + 100, thick, wallOpts),
        Bodies.rectangle(-thick / 2, h * window.devicePixelRatio / 2, thick, h * window.devicePixelRatio * 3, wallOpts),
        Bodies.rectangle(w * window.devicePixelRatio + thick / 2, h * window.devicePixelRatio / 2, thick, h * window.devicePixelRatio * 3, wallOpts)
    ]);

    Render.run(matterRender);
    matterRunner = Runner.create();
    Runner.run(matterRunner, matterEngine);

    let hintVisible = true;
    canvas.addEventListener('click', (e) => {
        if (hintVisible) {
            hint.style.opacity = '0';
            hintVisible = false;
        }
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (e.clientX - rect.left) * scaleX;
        const y = (e.clientY - rect.top) * scaleY;
        const radius = 10 + Math.random() * 20;

        const hue = Math.floor(Math.random() * 360);
        const ball = Bodies.circle(x, y, radius * window.devicePixelRatio, {
            restitution: 0.6,
            friction: 0.05,
            render: {
                fillStyle: `hsl(${hue}, 70%, 55%)`
            }
        });
        Composite.add(matterEngine.world, ball);
        matterBodies.push(ball);
    });

    const slider = document.getElementById('gravitySlider');
    const gValue = document.getElementById('gravityValue');
    slider.value = 1;
    gValue.textContent = '1.0';
    slider.oninput = () => {
        const v = parseFloat(slider.value);
        matterEngine.gravity.y = v;
        gValue.textContent = v.toFixed(1);
    };

    gravityEngine = matterEngine;
}

function stopGravity() {
    if (matterRender) Matter.Render.stop(matterRender);
    if (matterRunner) Matter.Runner.stop(matterRunner);
    if (matterEngine) Matter.Engine.clear(matterEngine);
    matterBodies = [];
    matterEngine = null;
    matterRender = null;
    matterRunner = null;
}

function resetGravity() {
    stopGravity();
    document.getElementById('canvasHint').style.opacity = '1';
    initGravity();
}

// ============================================================
// SČÍTÁNÍ LIDU NA INTERNETU
// ============================================================
const censusData = [
    { icon: '📧', label: 'Odeslané e-maily', perSecond: 3500000, unit: '' },
    { icon: '🔍', label: 'Vyhledávání na Google', perSecond: 99000, unit: '' },
    { icon: '📱', label: 'Odeslané zprávy na WhatsApp', perSecond: 694444, unit: '' },
    { icon: '▶️', label: 'Zhlédnuté hodiny videa na YouTube', perSecond: 277.78, unit: 'hodin' },
    { icon: '🐦', label: 'Posty na X (Twitter)', perSecond: 6944, unit: '' },
    { icon: '📸', label: 'Nahrané fotky na Instagram', perSecond: 1388, unit: '' },
    { icon: '💰', label: 'Online nákupy ($)', perSecond: 443672, unit: '$' }
];

let censusStartTime = 0;

function initCensus() {
    censusStartTime = performance.now();
    const grid = document.getElementById('censusGrid');
    grid.innerHTML = '';

    censusData.forEach((item, i) => {
        const card = document.createElement('div');
        card.className = 'counter-card';
        card.innerHTML = `
            <span class="counter-icon">${item.icon}</span>
            <h3>${item.label}</h3>
            <div class="counter-value" id="counter-${i}">0</div>
            ${item.unit ? `<div class="counter-unit">${item.unit}</div>` : ''}
        `;
        grid.appendChild(card);
    });

    const interval = setInterval(() => {
        const elapsed = (performance.now() - censusStartTime) / 1000;
        censusData.forEach((item, i) => {
            const el = document.getElementById(`counter-${i}`);
            if (el) {
                let val = Math.floor(item.perSecond * elapsed);
                if (item.unit === '$') {
                    el.textContent = '$' + val.toLocaleString('cs-CZ');
                } else if (item.unit === 'hodin') {
                    el.textContent = val.toLocaleString('cs-CZ', { maximumFractionDigits: 0 });
                } else {
                    el.textContent = val.toLocaleString('cs-CZ');
                }
            }
        });
    }, 50);

    censusIntervals.push(interval);
}

function stopCensus() {
    censusIntervals.forEach(id => clearInterval(id));
    censusIntervals = [];
}

// ============================================================
// REAKČNÍ TEST
// ============================================================
let reactionState = 'idle'; // idle, waiting, ready, result, too-early
let reactionTimeout = null;
let reactionStartTime = 0;
let reactionResults = [];

function initReaction() {
    reactionState = 'idle';
    reactionResults = [];
    const box = document.getElementById('reactionBox');
    const text = document.getElementById('reactionText');
    box.className = 'reaction-box idle';
    text.textContent = 'Klikni pro start';
    document.getElementById('reactionBest').innerHTML = '';
    document.getElementById('reactionHistory').innerHTML = '';
    if (reactionTimeout) clearTimeout(reactionTimeout);
}

function handleReactionClick() {
    const box = document.getElementById('reactionBox');
    const text = document.getElementById('reactionText');

    if (reactionState === 'idle' || reactionState === 'result' || reactionState === 'too-early') {
        // Start waiting
        reactionState = 'waiting';
        box.className = 'reaction-box waiting';
        text.textContent = 'Počkej na zelenou...';
        const delay = 1500 + Math.random() * 3500;
        reactionTimeout = setTimeout(() => {
            reactionState = 'ready';
            box.className = 'reaction-box ready';
            text.textContent = 'KLIKNI TEĎ!';
            reactionStartTime = performance.now();
        }, delay);
    } else if (reactionState === 'waiting') {
        // Clicked too early
        clearTimeout(reactionTimeout);
        reactionState = 'too-early';
        box.className = 'reaction-box too-early';
        text.textContent = 'Příliš brzy! Klikni znovu.';
    } else if (reactionState === 'ready') {
        // Measure
        const time = Math.round(performance.now() - reactionStartTime);
        reactionState = 'result';
        box.className = 'reaction-box result';
        text.textContent = `${time} ms`;
        reactionResults.push(time);
        updateReactionUI();
    }
}

function updateReactionUI() {
    const history = document.getElementById('reactionHistory');
    const best = document.getElementById('reactionBest');

    history.innerHTML = reactionResults.slice(-5).map(t =>
        `<span class="reaction-history-item">${t} ms</span>`
    ).join('');

    const bestTime = Math.min(...reactionResults);
    const avg = Math.round(reactionResults.reduce((a,b) => a+b, 0) / reactionResults.length);
    best.innerHTML = `Nejlepší: <span>${bestTime} ms</span> · Průměr: <span>${avg} ms</span>`;
}

// ============================================================
// PEXESO
// ============================================================
const memoryEmojis = ['🐶','🐱','🐸','🦊','🐻','🐼','🐨','🦁'];
let memoryCards = [];
let memoryFlipped = [];
let memoryMatched = 0;
let memoryMoves = 0;
let memoryLocked = false;

function initMemory() {
    memoryMatched = 0;
    memoryMoves = 0;
    memoryFlipped = [];
    memoryLocked = false;
    document.getElementById('memoryMoves').textContent = '0';
    document.getElementById('memoryPairs').textContent = '0 / 8';

    const pairs = [...memoryEmojis, ...memoryEmojis];
    memoryCards = pairs.sort(() => Math.random() - 0.5);

    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    memoryCards.forEach((emoji, i) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = i;
        card.innerHTML = `<span class="card-face">${emoji}</span>`;
        card.onclick = () => flipMemoryCard(i, card);
        grid.appendChild(card);
    });
}

function flipMemoryCard(index, card) {
    if (memoryLocked) return;
    if (card.classList.contains('flipped') || card.classList.contains('matched')) return;
    if (memoryFlipped.length >= 2) return;

    card.classList.add('flipped');
    memoryFlipped.push({ index, card });

    if (memoryFlipped.length === 2) {
        memoryMoves++;
        document.getElementById('memoryMoves').textContent = memoryMoves;

        const [a, b] = memoryFlipped;
        if (memoryCards[a.index] === memoryCards[b.index]) {
            // Match
            a.card.classList.add('matched');
            b.card.classList.add('matched');
            memoryMatched++;
            document.getElementById('memoryPairs').textContent = `${memoryMatched} / 8`;
            memoryFlipped = [];

            if (memoryMatched === 8) {
                setTimeout(() => {
                    document.getElementById('memoryResult').textContent =
                        `Našel jsi všech 8 párů na ${memoryMoves} tahů!`;
                    document.getElementById('memoryModal').classList.add('show');
                }, 500);
            }
        } else {
            // No match
            memoryLocked = true;
            setTimeout(() => {
                a.card.classList.remove('flipped');
                b.card.classList.remove('flipped');
                memoryFlipped = [];
                memoryLocked = false;
            }, 700);
        }
    }
}

function closeMemoryModal() {
    document.getElementById('memoryModal').classList.remove('show');
    initMemory();
}

// ============================================================
// HÁDEJ BARVU - OPRAVENO
// ============================================================
let colorScore = 0;
let colorStreak = 0;
let colorCorrectIndex = 0;
let colorLocked = false;

function initColorGame() {
    colorScore = 0;
    colorStreak = 0;
    document.getElementById('colorScore').textContent = '0';
    document.getElementById('colorStreak').textContent = '';
    newColorRound();
}

function randomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return { r, g, b };
}

function colorToHex(c) {
    // OPRAVA: Zaokrouhlíme hodnoty na celá čísla před konverzí na hex
    const r = Math.round(c.r);
    const g = Math.round(c.g);
    const b = Math.round(c.b);
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

function similarColor(base, variance) {
    // OPRAVA: Zaokrouhlíme výsledek na celé číslo
    const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
    return {
        r: clamp(base.r + (Math.random() - 0.5) * variance * 2),
        g: clamp(base.g + (Math.random() - 0.5) * variance * 2),
        b: clamp(base.b + (Math.random() - 0.5) * variance * 2)
    };
}

function newColorRound() {
    colorLocked = false;
    const correct = randomColor();
    const correctHex = colorToHex(correct);

    // Obtížnost se zvyšuje se sérií
    const variance = Math.max(30, 100 - colorStreak * 8);

    let options = [];
    colorCorrectIndex = Math.floor(Math.random() * 6);
    for (let i = 0; i < 6; i++) {
        if (i === colorCorrectIndex) {
            options.push(correct);
        } else {
            options.push(similarColor(correct, variance));
        }
    }

    document.getElementById('colorDisplay').style.display = 'none';
    document.getElementById('colorHex').textContent = correctHex;

    const optionsEl = document.getElementById('colorOptions');
    optionsEl.innerHTML = '';
    options.forEach((color, i) => {
        const div = document.createElement('div');
        div.className = 'color-option';
        div.style.backgroundColor = colorToHex(color);
        div.onclick = () => pickColor(i, div);
        optionsEl.appendChild(div);
    });
}

function pickColor(index, el) {
    if (colorLocked) return;
    colorLocked = true;

    const allOptions = document.querySelectorAll('.color-option');

    if (index === colorCorrectIndex) {
        el.classList.add('correct');
        colorScore++;
        colorStreak++;
        document.getElementById('colorScore').textContent = colorScore;
        document.getElementById('colorStreak').textContent = colorStreak > 1 ? `🔥 Série: ${colorStreak}` : '';
    } else {
        el.classList.add('wrong');
        allOptions[colorCorrectIndex].classList.add('correct');
        colorStreak = 0;
        document.getElementById('colorStreak').textContent = '';
    }

    setTimeout(() => newColorRound(), 1000);
}

// ============================================================
// RYCHLOST PSANÍ
// ============================================================
const typingTexts = [
    "Rychlá hnědá liška skáče přes líného psa. Nikdo neví, proč to dělá každý den, ale je to tradice.",
    "Programování je jako psaní knihy, kde každá chyba v pravopisu způsobí výbuch. Přesto nás to baví.",
    "Slunce pomalu zapadalo za obzor a celé nebe se zbarvilo do odstínů oranžové a růžové barvy.",
    "Život je jako jízda na kole. Abyste udrželi rovnováhu, musíte se neustále pohybovat kupředu.",
    "Káva je nejlepší přítel programátora. Bez ní by svět informačních technologií přestal existovat.",
    "Hvězdy na noční obloze vypadají jako drobné světélka, ale ve skutečnosti jsou to obrovské koule žhavého plynu.",
    "Každý velký programátor začínal jako začátečník, který nevěděl, co je to proměnná ani cyklus."
];

let typingText = '';
let typingStartTime = 0;
let typingStarted = false;
let typingFinished = false;
let typingInterval = null;

function initTyping() {
    typingText = typingTexts[Math.floor(Math.random() * typingTexts.length)];
    typingStarted = false;
    typingFinished = false;
    if (typingInterval) clearInterval(typingInterval);

    const input = document.getElementById('typingInput');
    input.value = '';
    input.disabled = false;
    input.focus();

    document.getElementById('typingWPM').textContent = '0';
    document.getElementById('typingAccuracy').textContent = '100%';
    document.getElementById('typingTime').textContent = '0s';

    renderTypingDisplay('', typingText);

    input.oninput = () => {
        if (typingFinished) return;

        if (!typingStarted) {
            typingStarted = true;
            typingStartTime = performance.now();
            typingInterval = setInterval(updateTypingStats, 100);
        }

        const typed = input.value;
        renderTypingDisplay(typed, typingText);

        if (typed.length >= typingText.length) {
            typingFinished = true;
            input.disabled = true;
            clearInterval(typingInterval);
            updateTypingStats();
        }
    };
}

function renderTypingDisplay(typed, full) {
    const display = document.getElementById('typingDisplay');
    let html = '';
    for (let i = 0; i < full.length; i++) {
        if (i < typed.length) {
            if (typed[i] === full[i]) {
                html += `<span class="typed-correct">${escapeHtml(full[i])}</span>`;
            } else {
                html += `<span class="typed-wrong">${escapeHtml(full[i])}</span>`;
            }
        } else if (i === typed.length) {
            html += `<span class="typed-cursor"></span><span class="typed-remaining">${escapeHtml(full[i])}</span>`;
        } else {
            html += `<span class="typed-remaining">${escapeHtml(full[i])}</span>`;
        }
    }
    display.innerHTML = html;
}

function escapeHtml(c) {
    if (c === '<') return '&lt;';
    if (c === '>') return '&gt;';
    if (c === '&') return '&amp;';
    return c;
}

function updateTypingStats() {
    if (!typingStarted) return;
    const elapsed = (performance.now() - typingStartTime) / 1000;
    const typed = document.getElementById('typingInput').value;

    let correct = 0;
    for (let i = 0; i < typed.length; i++) {
        if (typed[i] === typingText[i]) correct++;
    }

    const accuracy = typed.length > 0 ? Math.round((correct / typed.length) * 100) : 100;
    const words = correct / 5;
    const minutes = elapsed / 60;
    const wpm = minutes > 0 ? Math.round(words / minutes) : 0;

    document.getElementById('typingWPM').textContent = wpm;
    document.getElementById('typingAccuracy').textContent = accuracy + '%';
    document.getElementById('typingTime').textContent = Math.round(elapsed) + 's';
}

function stopTyping() {
    if (typingInterval) clearInterval(typingInterval);
    typingInterval = null;
}
