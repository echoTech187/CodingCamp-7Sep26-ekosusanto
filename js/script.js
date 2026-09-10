// Menunggu event ketika seluruh elemen HTML selesai dimuat di browser
document.addEventListener('DOMContentLoaded', () => {

    // Mengambil elemen tombol pengubah tema dari DOM berdasarkan ID 'theme-toggle'
    const themeToggleBtn = document.getElementById('theme-toggle');

    // Mengambil elemen root HTML untuk mengatur kelas 'dark' atau 'light' Tailwind CSS
    const htmlElement = document.documentElement;

    // Mengambil data tema yang tersimpan di Local Storage, atau gunakan 'light' sebagai default
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Mengecek apakah tema yang tersimpan adalah 'dark'
    if (currentTheme === 'dark') {
        htmlElement.classList.remove('light'); // Menghapus kelas 'light' dari elemen HTML
        htmlElement.classList.add('dark'); // Menambahkan kelas 'dark' ke elemen HTML
        themeToggleBtn.textContent = '☀️ Light Mode'; // Mengubah teks tombol menjadi Light Mode
    }

    // Menambahkan event listener 'click' pada tombol pengubah tema
    themeToggleBtn.addEventListener('click', () => {
        // Mengecek apakah elemen HTML saat ini memiliki kelas 'dark'
        if (htmlElement.classList.contains('dark')) {
            htmlElement.classList.remove('dark'); // Menghapus kelas 'dark'
            htmlElement.classList.add('light'); // Menambahkan kelas 'light'
            localStorage.setItem('theme', 'light'); // Menyimpan preferensi 'light' ke Local Storage
            themeToggleBtn.textContent = '🌙 Dark Mode'; // Mengubah teks tombol kembali ke Dark Mode
        } else {
            htmlElement.classList.remove('light'); // Menghapus kelas 'light'
            htmlElement.classList.add('dark'); // Menambahkan kelas 'dark'
            localStorage.setItem('theme', 'dark'); // Menyimpan preferensi 'dark' ke Local Storage
            themeToggleBtn.textContent = '☀️ Light Mode'; // Mengubah teks tombol ke Light Mode
        }
    });

    // Mengambil elemen tampilan jam digital berdasarkan ID 'clock'
    const clockEl = document.getElementById('clock');

    // Mengambil elemen tampilan tanggal berdasarkan ID 'date'
    const dateEl = document.getElementById('date');

    // Mengambil elemen teks ucapan (greeting) berdasarkan ID 'greeting'
    const greetingEl = document.getElementById('greeting');

    // Mengambil elemen input teks nama pengguna berdasarkan ID 'name-input'
    const nameInput = document.getElementById('name-input');

    // Mengambil elemen teks nama yang ditampilkan berdasarkan ID 'display-name'
    const displayName = document.getElementById('display-name');

    // Mengambil nama pengguna yang tersimpan di Local Storage, atau string kosong jika belum ada
    let userName = localStorage.getItem('userName') || '';

    // Mengecek apakah nama pengguna sudah ada/tersimpan
    if (userName) {
        displayName.textContent = `, ${userName}`; // Menampilkan nama di elemen span
        nameInput.value = userName; // Mengisi nilai input dengan nama yang tersimpan
        nameInput.classList.add('hidden'); // Menyembunyikan elemen input
        displayName.classList.remove('hidden'); // Menampilkan elemen teks nama
    } else {
        displayName.textContent = ''; // Mengosongkan teks tampilan nama
        nameInput.classList.remove('hidden'); // Menampilkan elemen input nama
        displayName.classList.add('hidden'); // Menyembunyikan elemen teks nama
    }

    // Menambahkan event listener 'click' pada teks nama agar bisa diedit kembali
    displayName.addEventListener('click', () => {
        nameInput.classList.remove('hidden'); // Menampilkan input nama
        displayName.classList.add('hidden'); // Menyembunyikan teks nama sementara
        nameInput.focus(); // Fokuskan kursor ke dalam input nama
    });

    // Menambahkan event listener 'keypress' untuk mendeteksi tombol Enter pada input nama
    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveName(); // Jalankan fungsi saveName jika tombol Enter ditekan
    });

    // Menambahkan event listener 'blur' ketika input nama kehilangan fokus
    nameInput.addEventListener('blur', () => saveName()); // Jalankan fungsi saveName saat kehilangan fokus

    // Mendefinisikan fungsi saveName untuk menyimpan nama pengguna
    function saveName() {
        userName = nameInput.value.trim(); // Mengambil nilai input dan menghapus spasi di awal/akhir
        localStorage.setItem('userName', userName); // Menyimpan nama ke Local Storage
        if (userName) {
            displayName.textContent = `, ${userName}`; // Memperbarui teks tampilan nama
            nameInput.classList.add('hidden'); // Menyembunyikan input nama
            displayName.classList.remove('hidden'); // Menampilkan teks nama
        } else {
            displayName.textContent = ''; // Kosongkan tampilan jika nama kosong
            nameInput.classList.remove('hidden'); // Tampilkan input kembali
            displayName.classList.add('hidden'); // Sembunyikan teks nama
        }
    }

    // Mendefinisikan fungsi untuk memperbarui jam, tanggal, dan ucapan secara real-time
    function updateClockAndGreeting() {
        const now = new Date(); // Mendapatkan objek tanggal dan waktu saat ini
        const hours = now.getHours(); // Mendapatkan jam saat ini (0-23)
        const minutes = String(now.getMinutes()).padStart(2, '0'); // Mendapatkan menit dan format 2 digit
        const seconds = String(now.getSeconds()).padStart(2, '0'); // Mendapatkan detik dan format 2 digit
        clockEl.textContent = `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`; // Mengatur teks jam

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }; // Format tanggal
        dateEl.textContent = now.toLocaleDateString('en-US', options); // Menampilkan tanggal dalam format bahasa Inggris

        let greetText = 'Good Morning'; // Nilai default ucapan pagi
        if (hours >= 12 && hours < 18) {
            greetText = 'Good Afternoon'; // Ubah ke ucapan siang jika jam 12-18
        } else if (hours >= 18 || hours < 4) {
            greetText = 'Good Evening'; // Ubah ke ucapan malam jika di atas jam 18 atau di bawah jam 4
        }
        greetingEl.textContent = greetText; // Menampilkan teks ucapan yang sesuai
    }

    setInterval(updateClockAndGreeting, 1000); // Menjalankan fungsi jam setiap 1000ms (1 detik)
    updateClockAndGreeting(); // Memanggil fungsi jam secara langsung saat pertama kali dimuat

    // Mengambil elemen tampilan timer Pomodoro berdasarkan ID 'timer-display'
    const timerDisplay = document.getElementById('timer-display');
    // Mengambil tombol Start Pomodoro
    const startBtn = document.getElementById('start-btn');
    // Mengambil tombol Stop Pomodoro
    const stopBtn = document.getElementById('stop-btn');
    // Mengambil tombol Reset Pomodoro
    const resetBtn = document.getElementById('reset-btn');
    // Mengambil elemen input durasi waktu Pomodoro kustom
    const pomodoroTimeInput = document.getElementById('pomodoro-time');
    // Mengambil tombol untuk mengatur durasi waktu Pomodoro
    const setTimeBtn = document.getElementById('set-time-btn');

    // Mengambil durasi Pomodoro dari Local Storage atau gunakan 25 menit sebagai default
    let defaultTime = parseInt(localStorage.getItem('pomodoroTime')) || 25;
    pomodoroTimeInput.value = defaultTime; // Mengisi input dengan nilai default
    let timeLeft = defaultTime * 60; // Mengonversi durasi menit menjadi detik
    let timerInterval = null; // Variabel untuk menyimpan interval timer
    let isRunning = false; // Status boolean untuk mengecek apakah timer sedang berjalan

    // Fungsi untuk memperbarui tampilan teks hitung mundur timer (format MM:SS)
    function updateTimerDisplay() {
        const m = Math.floor(timeLeft / 60); // Menghitung sisa menit
        const s = timeLeft % 60; // Menghitung sisa detik
        timerDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`; // Tampilkan format 2 digit
    }

    // Event listener saat tombol Set waktu Pomodoro diklik
    setTimeBtn.addEventListener('click', () => {
        const newTime = parseInt(pomodoroTimeInput.value); // Mengambil nilai angka dari input
        if (newTime > 0 && newTime <= 120) { // Validasi rentang waktu antara 1 hingga 120 menit
            defaultTime = newTime; // Memperbarui waktu default
            localStorage.setItem('pomodoroTime', defaultTime); // Simpan durasi ke Local Storage
            if (!isRunning) {
                timeLeft = defaultTime * 60; // Reset waktu sisa jika timer tidak sedang berjalan
                updateTimerDisplay(); // Perbarui tampilan timer
            }
        } else {
            alert('Please enter a valid time between 1 and 120 minutes.'); // Peringatan jika input tidak valid
        }
    });

    // Event listener saat tombol Start timer diklik
    startBtn.addEventListener('click', () => {
        if (!isRunning) { // Mengecek jika timer belum berjalan
            isRunning = true; // Set status menjadi berjalan
            timerInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--; // Kurangi waktu sisa sebanyak 1 detik
                    updateTimerDisplay(); // Perbarui tampilan
                } else {
                    clearInterval(timerInterval); // Hentikan interval jika waktu habis
                    isRunning = false; // Set status menjadi tidak berjalan
                    alert('Focus session completed!'); // Tampilkan notifikasi selesai
                    timeLeft = defaultTime * 60; // Kembalikan waktu ke durasi awal
                    updateTimerDisplay(); // Perbarui tampilan
                }
            }, 1000);
        }
    });

    // Event listener saat tombol Stop timer diklik
    stopBtn.addEventListener('click', () => {
        clearInterval(timerInterval); // Hentikan interval hitung mundur
        isRunning = false; // Set status timer menjadi berhenti
    });

    // Event listener saat tombol Reset timer diklik
    resetBtn.addEventListener('click', () => {
        clearInterval(timerInterval); // Hentikan interval aktif
        isRunning = false; // Ubah status menjadi tidak berjalan
        timeLeft = defaultTime * 60; // Kembalikan waktu ke durasi default
        updateTimerDisplay(); // Perbarui tampilan timer
    });

    updateTimerDisplay(); // Panggil fungsi tampilan awal timer

    // Mengambil elemen input teks tugas baru
    const taskInput = document.getElementById('task-input');
    // Mengambil tombol tambah tugas
    const addTaskBtn = document.getElementById('add-task-btn');
    // Mengambil elemen wadah daftar tugas (<ul>)
    const taskList = document.getElementById('task-list');
    // Mengambil elemen dropdown pengurutan (sort) tugas
    const sortTasksSelect = document.getElementById('sort-tasks');

    // Mengambil data daftar tugas dari Local Storage atau inisialisasi array kosong
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Fungsi untuk menyimpan array daftar tugas ke Local Storage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Fungsi untuk merender/menampilkan daftar tugas ke halaman HTML
    function renderTasks() {
        taskList.innerHTML = ''; // Mengosongkan kontainer daftar tugas sebelum dirender ulang
        let sortValue = sortTasksSelect.value; // Mengambil nilai metode sorting yang dipilih
        let displayedTasks = [...tasks]; // Menyalin array tasks agar array asli tidak berubah saat disortir

        // Logika pengurutan berdasarkan opsi dropdown
        if (sortValue === 'alphabetical') {
            displayedTasks.sort((a, b) => a.text.localeCompare(b.text)); // Urutkan secara abjad A-Z
        } else if (sortValue === 'status') {
            displayedTasks.sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1)); // Urutkan berdasarkan status (aktif dulu)
        }

        // Looping setiap tugas untuk dirender ke dalam DOM
        displayedTasks.forEach((task) => {
            const originalIndex = tasks.findIndex(t => t.id === task.id); // Mencari indeks asli task di array utama

            const li = document.createElement('li'); // Membuat elemen <li> baru untuk setiap item tugas
            li.className = `flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700 gap-2 ${task.completed ? 'opacity-60 line-through' : ''}`; // Menambahkan kelas Tailwind CSS
            
            const leftDiv = document.createElement('div'); // Membuat div bagian kiri untuk checkbox dan teks
            leftDiv.className = 'flex items-center gap-2 flex-1 break-all';

            const checkbox = document.createElement('input'); // Membuat elemen checkbox untuk menandai selesai
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed; // Menyesuaikan status centang dengan data tugas
            checkbox.className = 'w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500';
            checkbox.addEventListener('change', () => {
                tasks[originalIndex].completed = checkbox.checked; // Memperbarui status selesai pada array asli
                saveTasks(); // Simpan perubahan ke Local Storage
                renderTasks(); // Render ulang daftar tugas
            });

            const span = document.createElement('span'); // Membuat elemen teks untuk isi tugas
            span.textContent = task.text; // Mengisi teks span dengan isi tugas

            leftDiv.appendChild(checkbox); // Masukkan checkbox ke div kiri
            leftDiv.appendChild(span); // Masukkan teks span ke div kiri

            const actionsDiv = document.createElement('div'); // Membuat div untuk tombol aksi (Edit & Delete)
            actionsDiv.className = 'flex gap-2';

            const editBtn = document.createElement('button'); // Membuat tombol Edit
            editBtn.className = 'px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded shadow transition';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => {
                const newText = prompt('Edit task:', task.text); // Memunculkan prompt untuk mengubah teks tugas
                if (newText !== null && newText.trim() !== '') {
                    const trimmed = newText.trim();
                    // Pengecekan duplikat saat mengedit tugas (case-insensitive)
                    const isDuplicate = tasks.some((t, i) => i !== originalIndex && t.text.toLowerCase() === trimmed.toLowerCase());
                    if (isDuplicate) {
                        alert('Task already exists!'); // Peringatan jika teks editan sudah ada
                        return;
                    }
                    tasks[originalIndex].text = trimmed; // Memperbarui teks pada array utama
                    saveTasks(); // Simpan ke Local Storage
                    renderTasks(); // Render ulang daftar
                }
            });

            const deleteBtn = document.createElement('button'); // Membuat tombol Delete
            deleteBtn.className = 'px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded shadow transition';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                tasks.splice(originalIndex, 1); // Menghapus tugas dari array utama berdasarkan indeks asli
                saveTasks(); // Simpan ke Local Storage
                renderTasks(); // Render ulang daftar tugas
            });

            actionsDiv.appendChild(editBtn); // Masukkan tombol edit ke div aksi
            actionsDiv.appendChild(deleteBtn); // Masukkan tombol delete ke div aksi

            li.appendChild(leftDiv); // Masukkan div kiri ke elemen <li>
            li.appendChild(actionsDiv); // Masukkan div aksi ke elemen <li>
            taskList.appendChild(li); // Masukkan elemen <li> ke dalam wadah utama <ul>
        });
    }

    // Event listener saat tombol tambah tugas diklik
    addTaskBtn.addEventListener('click', () => {
        const text = taskInput.value.trim(); // Ambil teks dari input dan hapus spasi berlebih
        if (!text) return; // Keluar dari fungsi jika input kosong

        // Challenge 4: Mencegah duplikat tugas (Pemeriksaan bersifat case-insensitive)
        const isDuplicate = tasks.some(t => t.text.toLowerCase() === text.toLowerCase());
        if (isDuplicate) {
            alert('This task already exists in your list!'); // Munculkan alert jika tugas sudah terdaftar
            return;
        }

        tasks.push({ id: Date.now(), text, completed: false }); // Menambahkan objek tugas baru ke array tasks
        taskInput.value = ''; // Mengosongkan input teks tugas
        saveTasks(); // Simpan data ke Local Storage
        renderTasks(); // Render ulang daftar tugas di layar
    });

    // Event listener agar menekan tombol Enter pada input tugas dapat langsung menambahkannya
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTaskBtn.click();
    });

    // Event listener saat opsi pengurutan (sort) pada dropdown diubah
    sortTasksSelect.addEventListener('change', () => renderTasks());

    renderTasks(); // Panggil fungsi render tugas saat pertama kali halaman dimuat

    // Mengambil elemen input nama link cepat
    const linkNameInput = document.getElementById('link-name');
    // Mengambil elemen input URL link cepat
    const linkUrlInput = document.getElementById('link-url');
    // Mengambil tombol tambah link cepat
    const addLinkBtn = document.getElementById('add-link-btn');
    // Mengambil elemen wadah untuk menampilkan badge link cepat
    const linksContainer = document.getElementById('links-container');

    // Mengambil data quick links dari Local Storage atau menggunakan data default bawaan
    let links = JSON.parse(localStorage.getItem('links')) || [
        { name: 'Google', url: 'https://www.google.com' },
        { name: 'Gmail', url: 'https://mail.google.com' },
        { name: 'Calendar', url: 'https://calendar.google.com' }
    ];

    // Fungsi untuk menyimpan array quick links ke Local Storage
    function saveLinks() {
        localStorage.setItem('links', JSON.stringify(links));
    }

    // Fungsi untuk merender badge quick links ke dalam DOM
    function renderLinks() {
        linksContainer.innerHTML = ''; // Mengosongkan kontainer link sebelum dirender ulang
        links.forEach((link, index) => {
            const a = document.createElement('a'); // Membuat elemen tautan (<a>) baru
            a.className = 'inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg font-semibold shadow transition';
            a.href = link.url; // Menetapkan atribut href dengan URL link
            a.target = '_blank'; // Membuka tautan di tab baru browser
            a.textContent = link.name; // Menetapkan teks nama link

            const delBtn = document.createElement('button'); // Membuat tombol hapus (x) kecil pada badge link
            delBtn.className = 'bg-transparent text-white hover:text-red-200 text-sm font-bold ml-1';
            delBtn.textContent = '✕';
            delBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Mencegah tautan utama terbuka saat tombol hapus diklik
                links.splice(index, 1); // Menghapus link dari array berdasarkan indeksnya
                saveLinks(); // Simpan perubahan ke Local Storage
                renderLinks(); // Render ulang daftar quick links
            });

            a.appendChild(delBtn); // Masukkan tombol hapus ke dalam elemen tautan
            linksContainer.appendChild(a); // Masukkan elemen tautan ke dalam wadah kontainer
        });
    }

    // Event listener saat tombol tambah link diklik
    addLinkBtn.addEventListener('click', () => {
        let name = linkNameInput.value.trim(); // Ambil nama link dari input
        let url = linkUrlInput.value.trim(); // Ambil URL dari input
        if (!name || !url) {
            alert('Please enter both link name and URL.'); // Peringatan jika ada input yang kosong
            return;
        }
        // Validasi otomatis penambahan protokol https:// jika pengguna tidak memasukkannya
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        links.push({ name, url }); // Tambahkan objek link baru ke array
        linkNameInput.value = ''; // Kosongkan input nama link
        linkUrlInput.value = ''; // Kosongkan input URL
        saveLinks(); // Simpan data ke Local Storage
        renderLinks(); // Render ulang daftar quick links
    });

    renderLinks(); // Panggil fungsi render link awal saat halaman dimuat
});