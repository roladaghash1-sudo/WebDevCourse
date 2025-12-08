const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());   // ✅ allow JSON in POST

//--static folder is client folder
app.use(express.static(path.join(__dirname, "client")));

let songs = [
    { id: 1, title: "Nothing Else Matters", artist: "Metallica", year: 1992 },
    { id: 2, title: "Imagine", artist: "John Lennon", year: 1971 },
    { id: 3, title: "Bohemian Rhapsody", artist: "Queen", year: 1975 }
];

// ✅ GET ALL SONGS
app.get("/api/songs", (req, res) => {
    res.json(songs);
});

// ✅ GET SONG BY ID
app.get("/api/songs/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const song = songs.find(s => s.id === id);

    if (!song)
        return res.status(404).json({ error: "Song not found" });

    res.json(song);
});



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/home.html'));
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/home.html'));
});
app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/home.html'));
});




app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});


