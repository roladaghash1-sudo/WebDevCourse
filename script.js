const form = document.getElementById('songForm');
const list = document.getElementById('songList');
const submitBtn = document.getElementById('submitBtn');

// Load songs from localStorage
let songs = JSON.parse(localStorage.getItem('songs')) || [];

// Submit form (Add or Update song)
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('title').value;
    const url = document.getElementById('url').value;
    const rating = Number(document.getElementById('rating').value);
    const songId = document.getElementById('songId').value;

    // UPDATE MODE
    if (songId) {
        const idNum = Number(songId);
        const index = songs.findIndex(s => s.id === idNum);

        if (index !== -1) {
            songs[index].title = title;
            songs[index].url = url;
            songs[index].rating = rating;
            songs[index].youtubeId = getYouTubeId(url);
        }

    } else {
        // ADD NEW SONG
        const song = {
            id: Date.now(),
            title,
            url,
            rating,
            dateAdded: Date.now(),
            youtubeId: getYouTubeId(url)
        };

        songs.push(song);
    }

    // Reset form
    form.reset();
    document.getElementById('songId').value = '';

    // Reset button
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Add';
    submitBtn.classList.remove('btn-warning');
    submitBtn.classList.add('btn-success');

    saveAndRender();
});

// Save + render
function saveAndRender() {
    localStorage.setItem('songs', JSON.stringify(songs));
    renderSongs();
}

// Render table
function renderSongs() {
    list.innerHTML = '';

    songs.forEach(song => {
        const row = document.createElement('tr');

        const thumbUrl = song.youtubeId
            ? `https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg`
            : '';

        row.innerHTML = `
    <td>${song.title}</td>
    <td>${song.rating}</td>
    <td><a href="${song.url}" target="_blank" class="text-info">Watch</a></td>
    <td><img src="${thumbUrl}" width="120"></td>
    <td class="text-end">

        <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
            <i class="fas fa-edit"></i>
        </button>

        <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
            <i class="fas fa-trash"></i>
        </button>

        <button class="btn btn-sm btn-info me-2" onclick="openModal(${song.id})">
        <i class="fas fa-eye"></i>
        </button>
    </td>
`;

        list.appendChild(row);
    });

}

//5. Delete song
function deleteSong(id) {
    if (confirm('Are you sure?')) {
        songs = songs.filter(song => song.id !== id);
        saveAndRender();
    }
}

// Edit song — load into form
function editSong(id) {
    const song = songs.find(s => s.id === id);
    if (!song) return;

    document.getElementById('title').value = song.title;
    document.getElementById('url').value = song.url;
    document.getElementById('rating').value = song.rating;
    document.getElementById('songId').value = song.id;

    submitBtn.innerHTML = '<i class="fas fa-save"></i> Save';
    submitBtn.classList.remove('btn-success');
    submitBtn.classList.add('btn-warning');

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
//6 Extract Youtube ID
function getYouTubeId(url) {
    const regExp = /(?:v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

//7 Sorting
function applySorting() {
    const sortValue = document.getElementById('sort').value;

    switch (sortValue) {

        case "newest":
            songs.sort((a, b) => b.dateAdded - a.dateAdded);
            break;

        case "oldest":
            songs.sort((a, b) => a.dateAdded - b.dateAdded);
            break;

        case "az":
            songs.sort((a, b) => a.title.localeCompare(b.title));
            break;

        case "za":
            songs.sort((a, b) => b.title.localeCompare(a.title));
            break;

        case "ratingLow":
            songs.sort((a, b) => a.rating - b.rating);
            break;

        case "ratingHigh":
            songs.sort((a, b) => b.rating - a.rating);
            break;
    }
}

document.getElementById('sort').addEventListener('change', () => {
    applySorting();
    renderSongs();
});
//Search
document.getElementById('search').addEventListener('input', () => {
    const text = document.getElementById('search').value.toLowerCase();

    const filtered = songs.filter(song =>
        song.title.toLowerCase().includes(text)
    );

    renderFiltered(filtered);
});

// Render filtered table
function renderFiltered(filteredSongs) {
    list.innerHTML = '';

    filteredSongs.forEach(song => {
        const thumbUrl = song.youtubeId
            ? `https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg`
            : '';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${song.title}</td>
            <td>${song.rating}</td>
            <td><a href="${song.url}" target="_blank" class="text-info">Watch</a></td>
            <td><img src="${thumbUrl}" width="120"></td>
            <td class="text-end">
                <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
                    <i class="fas fa-edit"></i>
                </button>

                <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
                    <i class="fas fa-trash"></i>
                </button>

                <button class="btn btn-sm btn-info" onclick="openModal(${song.id})">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;

        list.appendChild(row);
    });
}

// VIEW MODAL
function openModal(id) {
    const song = songs.find(s => s.id === id);
    if (!song) return;

    document.getElementById('modalTitle').textContent = song.title;
    document.getElementById('modalRating').textContent = song.rating;

    const imgUrl = song.youtubeId
        ? `https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg`
        : "";

    document.getElementById('modalImg').src = imgUrl;
    document.getElementById('modalLink').href = song.url;

    const modal = new bootstrap.Modal(document.getElementById('songModal'));
    modal.show();
}

//9.Card View + TOGGLE View
//Render cards
function renderCards() {
    const container = document.getElementById("cardsContainer");
    container.innerHTML = "";

    songs.forEach(song => {
        const thumbUrl = song.youtubeId
            ? `https://img.youtube.com/vi/${song.youtubeId}/hqdefault.jpg`
            : "";

        const card = document.createElement("div");
        card.className = "col-md-4";

        card.innerHTML = `
            <div class="card bg-dark text-white h-100">
                <img src="${thumbUrl}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${song.title}</h5>
                    <p class="card-text">Rating: ${song.rating}</p>

                    <a href="${song.url}" target="_blank" class="btn btn-info w-100 mb-2">
                        <i class="fas fa-play"></i> Watch
                    </a>

                    <button class="btn btn-warning w-100 mb-2" onclick="editSong(${song.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>

                    <button class="btn btn-danger w-100" onclick="deleteSong(${song.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

// Toggle View
const toggleBtn = document.getElementById("toggleView");
const tableView = document.getElementById("tableView");
const cardsContainer = document.getElementById("cardsContainer");

toggleBtn.addEventListener("click", () => {
    const isTable = !tableView.classList.contains("d-none");

    if (isTable) {
        // Switch to Cards
        tableView.classList.add("d-none");
        cardsContainer.classList.remove("d-none");

        renderCards();
        toggleBtn.textContent = "View: Table";
    } else {
        // Switch to Table
        cardsContainer.classList.add("d-none");
        tableView.classList.remove("d-none");

        renderSongs();
        toggleBtn.textContent = "View: Cards";
    }
});


// Initial render
renderSongs();
