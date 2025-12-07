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
    <td><img src="${thumbUrl}" width="120"></td>   <!-- ⬅ תמונת יוטיוב -->
    <td class="text-end">
        <button class="btn btn-sm btn-warning me-2" onclick="editSong(${song.id})">
            <i class="fas fa-edit"></i>
        </button>
        <button class="btn btn-sm btn-danger" onclick="deleteSong(${song.id})">
            <i class="fas fa-trash"></i>
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
//6
function getYouTubeId(url) {
    const regExp = /(?:v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
}

//7
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

// Initial render
renderSongs();
