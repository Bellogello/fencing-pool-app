/* ==================================================================
   SHARED CONFIGURATION
   ================================================================== */
const POOL_LOGIC = {
    5: ["1-2", "3-4", "5-1", "2-3", "5-4", "1-3", "2-5", "4-1", "3-5", "4-2"],
    6: ["1-2", "4-3", "6-5", "3-1", "2-6", "5-4", "1-6", "3-5", "4-2", "5-1", "6-4", "2-3", "1-4", "5-2", "3-6"],
    7: ["1-4", "2-5", "3-6", "7-1", "5-4", "2-3", "6-7", "5-1", "4-3", "6-2", "5-7", "3-1", "4-6", "7-2", "3-5", "1-6", "2-4", "7-3", "6-5", "1-2", "4-7"],
    8: ["2-3", "1-5", "7-4", "6-8", "1-2", "3-4", "5-6", "8-7", "4-1", "5-2", "8-3", "6-7", "4-2", "8-1", "7-5", "3-6", "2-8", "5-4", "6-1", "3-7", "4-8", "2-6", "3-5", "1-7", "4-6", "8-5", "7-2", "1-3"],
    9: ["1-9", "2-8", "3-7", "4-6", "1-5", "2-9", "8-3", "7-4", "6-5", "1-2", "9-3", "8-4", "7-5", "6-1", "3-2", "9-4", "5-8", "7-6", "3-1", "2-4", "5-9", "8-6", "7-1", "4-3", "5-2", "6-9", "8-7", "4-1", "5-3", "6-2", "9-7", "1-8", "4-5", "3-6", "2-7", "9-8"],
    10: ["1-4", "6-9", "2-5", "7-10", "3-1", "8-6", "4-5", "9-10", "2-3", "7-8", "5-1", "10-6", "4-2", "9-7", "5-3", "10-8", "1-2", "6-7", "3-4", "8-9", "5-10", "1-6", "2-7", "3-8", "4-9", "6-5", "10-2", "8-1", "7-4", "9-3", "2-6", "5-8", "4-10", "1-9", "3-7", "8-2", "6-4", "9-5", "10-3", "7-1", "4-8", "2-9", "3-6", "5-7", "1-10"]
};

/* ==================================================================
   PAGE 1: POOL NAME (Creating_pool.html)
   ================================================================== */
const poolNameInput = document.getElementById('pool_name_input');
const nextButton = document.getElementById('names_page');
if (poolNameInput && nextButton) {
    nextButton.addEventListener('click', () => localStorage.setItem('myPoolName', poolNameInput.value));
}

/* ==================================================================
   PAGE 2: ADDING NAMES (names.html)
   ================================================================== */
const nameListContainer = document.getElementById('name-list');
const confirmButton = document.getElementById('confirm-button');
const titleDisplay = document.getElementById('pool_name_display');

if (nameListContainer) {
    const savedName = localStorage.getItem('myPoolName');
    if (titleDisplay) titleDisplay.textContent = savedName || "My Pool";

    let rowCounter = 0;
    function addNewEntry() {
        rowCounter++;
        const row = document.createElement('div');
        row.classList.add('name-entry');
        
        const picUploader = document.createElement('label');
        picUploader.classList.add('pic-uploader');
        const picInput = document.createElement('input');
        picInput.type = 'file'; picInput.accept = 'image/*'; picInput.capture = 'environment';
        const playerImage = document.createElement('img');
        playerImage.classList.add('player-pic');
        
        picInput.addEventListener('change', () => {
            const file = picInput.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const img = new Image();
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');
                        const MAX_WIDTH = 300;
                        const scale = MAX_WIDTH / img.width;
                        canvas.width = MAX_WIDTH;
                        canvas.height = img.height * scale;
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        playerImage.src = canvas.toDataURL('image/jpeg', 0.7);
                    };
                    img.src = e.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
        picUploader.append(playerImage, picInput);

        const nameInput = document.createElement('input');
        nameInput.type = 'text'; nameInput.placeholder = 'Player Name';
        nameInput.className = (rowCounter % 2 === 1) ? 'style-a' : 'style-b';
        
        const removeBtn = document.createElement('button');
        removeBtn.textContent = '❌'; removeBtn.classList.add('remove-button');
        row.append(picUploader, nameInput, removeBtn);
        nameListContainer.appendChild(row);
    }

    function checkNameCount() {
        const count = Array.from(nameListContainer.querySelectorAll('input[type="text"]')).filter(i => i.value.trim() !== '').length;
        if (confirmButton) confirmButton.disabled = !(count >= 2 && count <= 10);
    }

    nameListContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.type === 'text') {
            e.preventDefault();
            const inputs = Array.from(nameListContainer.querySelectorAll('input[type="text"]'));
            const idx = inputs.indexOf(e.target);
            if (idx < inputs.length - 1) inputs[idx + 1].focus();
            else if (idx === inputs.length - 1 && e.target.value.trim() !== '' && inputs.length < 10) {
                addNewEntry();
                setTimeout(() => nameListContainer.querySelectorAll('input[type="text"]')[inputs.length].focus(), 0);
            }
        }
    });

    nameListContainer.addEventListener('input', (e) => {
        if (e.target.type === 'text') {
            const inputs = nameListContainer.querySelectorAll('input[type="text"]');
            if (e.target === inputs[inputs.length - 1] && e.target.value.trim() !== '' && inputs.length < 10) addNewEntry();
            checkNameCount();
        }
    });

    nameListContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-button')) {
            e.target.parentElement.remove();
            const inputs = nameListContainer.querySelectorAll('input[type="text"]');
            if (inputs.length === 0 || (inputs[inputs.length-1].value.trim() !== '' && inputs.length < 10)) addNewEntry();
            checkNameCount();
        }
    });

    if (confirmButton) {
        confirmButton.addEventListener('click', () => {
            const players = [];
            document.querySelectorAll('.name-entry').forEach(row => {
                const name = row.querySelector('input[type="text"]').value.trim();
                const img = row.querySelector('.player-pic').src;
                if (name) players.push({ name, image: img });
            });

            if (players.length < 2) return alert("Need 2+ players!");

            // --- CRITICAL: SET THE RESET FLAG ---
            // We save the players, but we tell the next page "RESET EVERYTHING"
            localStorage.setItem('playerList', JSON.stringify(players));
            localStorage.setItem('resetGame', 'true'); // <--- THE MAGIC SIGNAL
            window.location.href = 'game.html';
        });
    }
    addNewEntry();
    checkNameCount();
}

/* ==================================================================
   PAGE 3: THE GAME (game.html)
   ================================================================== */
const currentMatchTitle = document.getElementById('current_match');
const nextMatchBtn = document.getElementById('next_match');
const finishBtn = document.getElementById('finish-btn');
const dom = {
    p1Div: document.getElementById('player1'),
    p2Div: document.getElementById('player2'),
    p1Name: document.getElementById('player1_name'),
    p2Name: document.getElementById('player2_name'),
    p1Score: document.getElementById('player1_score'),
    p2Score: document.getElementById('player2_score'),
    listDiv: document.getElementById('match-list'),
    listContainer: document.getElementById('match-list-container'),
    openBtn: document.getElementById('open-list-btn'),
    closeBtn: document.getElementById('close-list-btn')
};

if (currentMatchTitle && nextMatchBtn) {
    
if (localStorage.getItem('resetGame') === 'true') {
        localStorage.removeItem('matchSchedule');
        localStorage.removeItem('finalResults');
        localStorage.removeItem('resetGame'); 
    }
    const players = JSON.parse(localStorage.getItem('playerList') || "[]");
    let matchSchedule = JSON.parse(localStorage.getItem('matchSchedule') || "[]");
    let currentMatchIndex = 0;

    // --- 2. GENERATE SCHEDULE IF EMPTY ---
    if (matchSchedule.length === 0) {
        let rawSchedule = [];
        if (POOL_LOGIC[players.length]) {
            rawSchedule = POOL_LOGIC[players.length].map(m => {
                const [p1, p2] = m.split('-');
                return { p1: parseInt(p1)-1, p2: parseInt(p2)-1 };
            });
        } else {
            // Fallback for sizes not in POOL_LOGIC (2, 3, 4, or >10)
            for (let i = 0; i < players.length; i++) {
                for (let j = i + 1; j < players.length; j++) {
                    rawSchedule.push({ p1: i, p2: j });
                }
            }
        }
        
        matchSchedule = rawSchedule.map(m => ({ 
            p1: m.p1, p2: m.p2, s1: null, s2: null, played: false 
        }));
        
        localStorage.setItem('matchSchedule', JSON.stringify(matchSchedule));
    }

    // Find first unplayed match
    const firstUnplayed = matchSchedule.findIndex(m => !m.played);
    if (firstUnplayed !== -1) currentMatchIndex = firstUnplayed;
    else currentMatchIndex = matchSchedule.length - 1; 

    function renderActiveMatch() {
        const allPlayed = matchSchedule.every(m => m.played);
        if (allPlayed) {
            nextMatchBtn.style.display = 'none';
            if(finishBtn) finishBtn.style.display = 'block';
        } else {
            nextMatchBtn.style.display = 'block';
            if(finishBtn) finishBtn.style.display = 'none';
        }

        if (currentMatchIndex >= matchSchedule.length) return;

        const match = matchSchedule[currentMatchIndex];
        const player1 = players[match.p1];
        const player2 = players[match.p2];

        currentMatchTitle.textContent = `Match ${currentMatchIndex + 1}`;
        dom.p1Name.textContent = player1.name;
        dom.p2Name.textContent = player2.name;
        dom.p1Div.innerHTML = `<img src="${player1.image}">`;
        dom.p2Div.innerHTML = `<img src="${player2.image}">`;

        dom.p1Score.value = match.played ? match.s1 : '';
        dom.p2Score.value = match.played ? match.s2 : '';
        renderList();
        dom.p1Score.focus();
    }

    function renderList() {
        dom.listDiv.innerHTML = '';
        matchSchedule.forEach((match, index) => {
            const p1 = players[match.p1];
            const p2 = players[match.p2];
            const li = document.createElement('div');
            li.className = 'list-item';
            if (index === currentMatchIndex) li.classList.add('active');
            if (match.played) li.classList.add('played');
            const scoreText = match.played ? `${match.s1} - ${match.s2}` : "VS";
            li.innerHTML = `<img src="${p1.image}" class="li-img"><div class="li-names"><span>${p1.name}</span><div class="li-score">${scoreText}</div><span>${p2.name}</span></div><img src="${p2.image}" class="li-img">`;
            li.addEventListener('click', () => {
                currentMatchIndex = index;
                renderActiveMatch();
                dom.listContainer.classList.remove('visible');
            });
            dom.listDiv.appendChild(li);
        });
    }

    nextMatchBtn.addEventListener('click', () => {
        const s1Val = dom.p1Score.value;
        const s2Val = dom.p2Score.value;
        if (s1Val === '' || s2Val === '') return alert("Please enter scores.");
        const s1 = parseInt(s1Val);
        const s2 = parseInt(s2Val);
        if (s1 < 0 || s1 > 5 || s2 < 0 || s2 > 5) return alert("Scores must be between 0 and 5!");

        matchSchedule[currentMatchIndex].s1 = s1;
        matchSchedule[currentMatchIndex].s2 = s2;
        matchSchedule[currentMatchIndex].played = true;
        localStorage.setItem('matchSchedule', JSON.stringify(matchSchedule));
        
        const nextUnplayed = matchSchedule.findIndex((m, i) => !m.played && i > currentMatchIndex);
        if (nextUnplayed !== -1) currentMatchIndex = nextUnplayed;
        else if (currentMatchIndex < matchSchedule.length - 1) currentMatchIndex++;
        renderActiveMatch();
    });

    dom.p1Score.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); dom.p2Score.focus(); } });
    dom.p2Score.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); nextMatchBtn.click(); } });

    if (dom.openBtn) dom.openBtn.addEventListener('click', () => { renderList(); dom.listContainer.classList.add('visible'); });
    if (dom.closeBtn) dom.closeBtn.addEventListener('click', () => dom.listContainer.classList.remove('visible'));
    renderActiveMatch();
}

/* ==================================================================
   PAGE 4: RESULTS (TABLE + PODIUM)
   ================================================================== */
const tableElement = document.getElementById('pool-sheet');
const podiumDiv = document.getElementById('podium-section');
const otherListDiv = document.getElementById('other-ranks-list');
const newPoolBtn = document.getElementById('new-pool-btn');

if (tableElement && podiumDiv) {
    const rawPlayers = JSON.parse(localStorage.getItem('playerList') || "[]");
    const schedule = JSON.parse(localStorage.getItem('matchSchedule') || "[]");

    rawPlayers.forEach((p, i) => { p.originalIndex = i; p.v = 0; p.ts = 0; p.tr = 0; });
    schedule.forEach(m => {
        if (m.played) {
            const p1 = rawPlayers[m.p1];
            const p2 = rawPlayers[m.p2];
            p1.ts += m.s1; p1.tr += m.s2;
            p2.ts += m.s2; p2.tr += m.s1;
            if (m.s1 > m.s2) p1.v++;
            else if (m.s2 > m.s1) p2.v++;
        }
    });

    let headerHTML = `<thead><tr><th>Name</th>`;
    rawPlayers.forEach((_, i) => headerHTML += `<th>${i+1}</th>`);
    headerHTML += `<th>V</th><th>Ind</th><th>TS</th><th>TR</th></tr></thead>`;
    tableElement.innerHTML = headerHTML;

    const tbody = document.createElement('tbody');
    rawPlayers.forEach((pRow, rIndex) => {
        const tr = document.createElement('tr');
        const ind = pRow.ts - pRow.tr;
        let rowHTML = `<td><img src="${pRow.image}" class="table-pic"> ${rIndex+1}. ${pRow.name}</td>`;
        rawPlayers.forEach((_, cIndex) => {
            if (rIndex === cIndex) rowHTML += `<td class="diagonal-cell"></td>`;
            else {
                const match = schedule.find(m => (m.p1 === rIndex && m.p2 === cIndex) || (m.p1 === cIndex && m.p2 === rIndex));
                if (match && match.played) {
                    let myScore, opScore;
                    if (match.p1 === rIndex) { myScore = match.s1; opScore = match.s2; }
                    else { myScore = match.s2; opScore = match.s1; }
                    let char = 'T', color = '#555';
                    if (myScore > opScore) { char = 'V'; color = '#0F6013'; }
                    else if (myScore < opScore) { char = 'D'; color = '#dc3545'; }
                    rowHTML += `<td style="color:${color}">${char}${myScore}</td>`;
                } else rowHTML += `<td>-</td>`;
            }
        });
        rowHTML += `<td>${pRow.v}</td><td>${ind>0?'+':''}${ind}</td><td>${pRow.ts}</td><td>${pRow.tr}</td>`;
        tr.innerHTML = rowHTML;
        tbody.appendChild(tr);
    });
    tableElement.appendChild(tbody);

    const sortedPlayers = [...rawPlayers].sort((a, b) => {
        if (b.v !== a.v) return b.v - a.v; 
        const indA = a.ts - a.tr, indB = b.ts - b.tr;
        if (indB !== indA) return indB - indA; 
        return b.ts - a.ts; 
    });

    const createPodiumHTML = (player, rank, placeClass) => {
        if (!player) return '';
        const ind = player.ts - player.tr;
        return `<div class="podium-place ${placeClass}"><div class="podium-rank">${rank}</div><img src="${player.image}" class="podium-pic"><div class="podium-name">${player.name}</div><div class="podium-stats">${player.v}V (${ind>0?'+':''}${ind})</div></div>`;
    };

    let podiumHTML = '';
    podiumHTML += createPodiumHTML(sortedPlayers[1], 2, 'p2');
    podiumHTML += createPodiumHTML(sortedPlayers[0], 1, 'p1');
    podiumHTML += createPodiumHTML(sortedPlayers[2], 3, 'p3');
    podiumDiv.innerHTML = podiumHTML;

    const otherPlayers = sortedPlayers.slice(3);
    let listHTML = '';
    otherPlayers.forEach((p, i) => {
        const ind = p.ts - p.tr;
        listHTML += `<div class="rank-card"><div class="rc-rank">${i+4}</div><img src="${p.image}" class="rc-pic"><div class="rc-name">${p.name}</div><div class="rc-stats">${p.v}V | Ind: ${ind>0?'+':''}${ind}</div></div>`;
    });
    otherListDiv.innerHTML = listHTML;

    if (newPoolBtn) {
        newPoolBtn.addEventListener('click', () => {
            if(confirm("Start a new pool?")) {
                localStorage.clear();
                window.location.href = 'Creating_pool.html';
            }
        });
    }
}
