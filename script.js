// Ambil elemen DOM
const titleInput = document.getElementById("title");
const kanjiInput = document.getElementById("kanji");
const hiraganaInput = document.getElementById("hiragana");
const artiInput = document.getElementById("arti");
const saveBtn = document.getElementById("save-btn");
const storyList = document.getElementById("stories");

// Load cerita dari Local Storage
let stories = JSON.parse(localStorage.getItem("stories")) || [];
let editingIndex = null; // Untuk menentukan apakah sedang mode edit

// Fungsi untuk memeriksa dan menampilkan cerita penuh berdasarkan ID
function checkForStoryPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const storyIndex = urlParams.get("storyIndex");

    if (storyIndex !== null) {
        viewStory(storyIndex);
    } else {
        updateStoryList();
    }
}

// Tampilkan daftar cerita
function updateStoryList() {
    storyList.innerHTML = '';
    stories.forEach((story, index) => {
        const div = document.createElement('div');
        div.className = 'story-item';

        // Tambahkan judul cerita
        const storyTitle = document.createElement('span');
        storyTitle.textContent = `${story.title}`;
        storyTitle.onclick = () => viewStory(index);

        // Tambahkan tombol Edit dan Hapus
        const actions = document.createElement('div');
        actions.className = 'story-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.textContent = 'Edit';
        editBtn.onclick = (e) => {
            e.stopPropagation(); // Mencegah klik cerita
            editStory(index);
        };

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Hapus';
        deleteBtn.onclick = (e) => {
            e.stopPropagation(); // Mencegah klik cerita
            deleteStory(index);
        };

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        div.appendChild(storyTitle);
        div.appendChild(actions);
        storyList.appendChild(div);
    });
}

// Simpan cerita baru atau update cerita yang sedang diedit
function addStory() {
    const title = titleInput.value.trim();
    const kanji = kanjiInput.value.trim();
    const hiragana = hiraganaInput.value.trim();
    const arti = artiInput.value.trim();

    if (!title || !kanji || !hiragana || !arti) {
        alert("Semua kolom harus diisi!");
        return;
    }

    if (editingIndex !== null) {
        // Mode edit
        stories[editingIndex] = { title, kanji, hiragana, arti };
        editingIndex = null; // Reset index edit
    } else {
        // Mode tambah
        const newStory = { title, kanji, hiragana, arti };
        stories.push(newStory);
    }

    localStorage.setItem("stories", JSON.stringify(stories)); // Simpan ke Local Storage
    updateStoryList();
    clearInputs();
}

// Edit cerita
function editStory(index) {
    const story = stories[index];
    titleInput.value = story.title;
    kanjiInput.value = story.kanji;
    hiraganaInput.value = story.hiragana;
    artiInput.value = story.arti;
    editingIndex = index; // Tandai index cerita yang sedang diedit
    saveBtn.textContent = "Update Cerita"; // Ubah teks tombol
}

// Hapus cerita
function deleteStory(index) {
    if (confirm("Apakah Anda yakin ingin menghapus cerita ini?")) {
        stories.splice(index, 1); // Hapus cerita dari array
        localStorage.setItem("stories", JSON.stringify(stories)); // Update Local Storage
        updateStoryList();
    }
}

// Hapus input setelah simpan
function clearInputs() {
    titleInput.value = '';
    kanjiInput.value = '';
    hiraganaInput.value = '';
    artiInput.value = '';
    saveBtn.textContent = "Simpan Cerita"; // Kembalikan teks tombol
}

// Tampilkan cerita penuh
function viewStory(index) {
    const story = stories[index];

    // Simpan index cerita yang sedang dilihat di URL untuk referensi
    const url = new URL(window.location);
    url.searchParams.set("storyIndex", index);
    window.history.pushState({}, '', url);  // Perbarui URL tanpa reload

    const fullStoryPage = `
        <div class="container">
            <h2 class="story-title">${story.title}</h2>
            <h3>Kanji:</h3>
            <p class="kanji-text">${story.kanji}</p>
            <h3>Hiragana:</h3>
            <p class="hiragana-text">${story.hiragana}</p>
            <h3>Arti:</h3>
            <p class="arti-text">${story.arti}</p>
            <button onclick="goBack()" class="back-btn">Kembali</button>
        </div>
    `;
    document.body.innerHTML = fullStoryPage;
}

// Kembali ke halaman utama
function goBack() {
    const url = new URL(window.location);
    url.searchParams.delete("storyIndex");  // Hapus parameter 'storyIndex'
    window.history.pushState({}, '', url);  // Perbarui URL tanpa reload
    location.reload();  // Muat ulang halaman utama
}

// Event listener untuk tombol simpan
saveBtn.addEventListener("click", addStory);

// Muat daftar cerita saat halaman di-load
checkForStoryPage();
