document.addEventListener('DOMContentLoaded', () => {
    // --- Challenge 1: Light / Dark Mode ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggleBtn.textContent = '☀️ Light Mode';
    }

    themeToggleBtn.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            themeToggleBtn.textContent = '🌙 Dark Mode';
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeToggleBtn.textContent = '☀️ Light Mode';
        }
    });

    // --- Challenge 2: Custom Name in Greeting ---
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');
    const greetingEl = document.getElementById('greeting');
    const nameInput = document.getElementById('name-input');
    const displayName = document.getElementById('display-name');

    let userName = localStorage.getItem('userName') || '';
    if (userName) {
        displayName.textContent = `, ${userName}`;
        nameInput.value = userName;
        nameInput.style.display = 'none';
        displayName.style.display = 'inline';
    } else {
        displayName.textContent = '';
        nameInput.style.display = 'inline';
        displayName.style.display = 'none';
    }

    displayName.addEventListener('click', () => {
        nameInput.style.display = 'inline';
        displayName.style.display = 'none';
        nameInput.focus();
    });

    nameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') saveName();
    });

    nameInput.addEventListener('blur', () => saveName());

    function saveName() {
        userName = nameInput.value.trim();
        localStorage.setItem('userName', userName);
        if (userName) {
            displayName.textContent = `, ${userName}`;
            nameInput.style.display = 'none';
            displayName.style.display = 'inline';
        } else {
            displayName.textContent = '';
            nameInput.style.display = 'inline';
            displayName.style.display = 'none';
        }
    }

    function updateClockAndGreeting() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        clockEl.textContent = `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;

        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-US', options);

        let greetText = 'Good Morning';
        if (hours >= 12 && hours < 18) {
            greetText = 'Good Afternoon';
        } else if (hours >= 18 || hours < 4) {
            greetText = 'Good Evening';
        }
        greetingEl.textContent = greetText;
    }

    setInterval(updateClockAndGreeting, 1000);
    updateClockAndGreeting();

    // --- Challenge 3: Change Pomodoro Time ---
    const timerDisplay = document.getElementById('timer-display');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const resetBtn = document.getElementById('reset-btn');
    const pomodoroTimeInput = document.getElementById('pomodoro-time');
    const setTimeBtn = document.getElementById('set-time-btn');

    let defaultTime = parseInt(localStorage.getItem('pomodoroTime')) || 25;
    pomodoroTimeInput.value = defaultTime;
    let timeLeft = defaultTime * 60;
    let timerInterval = null;
    let isRunning = false;

    function updateTimerDisplay() {
        const m = Math.floor(timeLeft / 60);
        const s = timeLeft % 60;
        timerDisplay.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    setTimeBtn.addEventListener('click', () => {
        const newTime = parseInt(pomodoroTimeInput.value);
        if (newTime > 0 && newTime <= 120) {
            defaultTime = newTime;
            localStorage.setItem('pomodoroTime', defaultTime);
            if (!isRunning) {
                timeLeft = defaultTime * 60;
                updateTimerDisplay();
            }
        } else {
            alert('Please enter a valid time between 1 and 120 minutes.');
        }
    });

    startBtn.addEventListener('click', () => {
        if (!isRunning) {
            isRunning = true;
            timerInterval = setInterval(() => {
                if (timeLeft > 0) {
                    timeLeft--;
                    updateTimerDisplay();
                } else {
                    clearInterval(timerInterval);
                    isRunning = false;
                    alert('Focus session completed!');
                    timeLeft = defaultTime * 60;
                    updateTimerDisplay();
                }
            }, 1000);
        }
    });

    stopBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        isRunning = false;
    });

    resetBtn.addEventListener('click', () => {
        clearInterval(timerInterval);
        isRunning = false;
        timeLeft = defaultTime * 60;
        updateTimerDisplay();
    });

    updateTimerDisplay();

    // --- Challenges 4 & 5: Prevent Duplicate Tasks & Sort Tasks ---
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const sortTasksSelect = document.getElementById('sort-tasks');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        let sortValue = sortTasksSelect.value;
        let displayedTasks = [...tasks];

        if (sortValue === 'alphabetical') {
            displayedTasks.sort((a, b) => a.text.localeCompare(b.text));
        } else if (sortValue === 'status') {
            displayedTasks.sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));
        }

        displayedTasks.forEach((task) => {
            const originalIndex = tasks.findIndex(t => t.id === task.id);

            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            const leftDiv = document.createElement('div');
            leftDiv.className = 'task-left';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => {
                tasks[originalIndex].completed = checkbox.checked;
                saveTasks();
                renderTasks();
            });

            const span = document.createElement('span');
            span.textContent = task.text;

            leftDiv.appendChild(checkbox);
            leftDiv.appendChild(span);

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'task-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'edit-btn';
            editBtn.textContent = 'Edit';
            editBtn.addEventListener('click', () => {
                const newText = prompt('Edit task:', task.text);
                if (newText !== null && newText.trim() !== '') {
                    const trimmed = newText.trim();
                    const isDuplicate = tasks.some((t, i) => i !== originalIndex && t.text.toLowerCase() === trimmed.toLowerCase());
                    if (isDuplicate) {
                        alert('Task already exists!');
                        return;
                    }
                    tasks[originalIndex].text = trimmed;
                    saveTasks();
                    renderTasks();
                }
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                tasks.splice(originalIndex, 1);
                saveTasks();
                renderTasks();
            });

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);

            li.appendChild(leftDiv);
            li.appendChild(actionsDiv);
            taskList.appendChild(li);
        });
    }

    addTaskBtn.addEventListener('click', () => {
        const text = taskInput.value.trim();
        if (!text) return;

        // Challenge 4: Prevent duplicate tasks check
        const isDuplicate = tasks.some(t => t.text.toLowerCase() === text.toLowerCase());
        if (isDuplicate) {
            alert('This task already exists in your list!');
            return;
        }

        tasks.push({ id: Date.now(), text, completed: false });
        taskInput.value = '';
        saveTasks();
        renderTasks();
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTaskBtn.click();
    });

    sortTasksSelect.addEventListener('change', () => renderTasks());

    renderTasks();

    // --- Quick Links ---
    const linkNameInput = document.getElementById('link-name');
    const linkUrlInput = document.getElementById('link-url');
    const addLinkBtn = document.getElementById('add-link-btn');
    const linksContainer = document.getElementById('links-container');

    let links = JSON.parse(localStorage.getItem('links')) || [
        { name: 'Github', url: 'https://github.com/echoTech187' },
        { name: 'Linked', url: 'https://www.linkedin.com/in/ekosuesanto' }
    ];

    function saveLinks() {
        localStorage.setItem('links', JSON.stringify(links));
    }

    function renderLinks() {
        linksContainer.innerHTML = '';
        links.forEach((link, index) => {
            const a = document.createElement('a');
            a.className = 'link-badge';
            a.href = link.url;
            a.target = '_blank';
            a.textContent = link.name;

            const delBtn = document.createElement('button');
            delBtn.className = 'link-delete';
            delBtn.textContent = '✕';
            delBtn.addEventListener('click', (e) => {
                e.preventDefault();
                links.splice(index, 1);
                saveLinks();
                renderLinks();
            });

            a.appendChild(delBtn);
            linksContainer.appendChild(a);
        });
    }

    addLinkBtn.addEventListener('click', () => {
        let name = linkNameInput.value.trim();
        let url = linkUrlInput.value.trim();
        if (!name || !url) {
            alert('Please enter both link name and URL.');
            return;
        }
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
        }
        links.push({ name, url });
        linkNameInput.value = '';
        linkUrlInput.value = '';
        saveLinks();
        renderLinks();
    });

    renderLinks();
});