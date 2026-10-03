
const themeModeBtn = document.getElementById('themeModeBtn');
const colorDots = document.querySelectorAll('.color-dot');

const savedTheme = localStorage.getItem('theme');
const savedColor = localStorage.getItem('accentColor');

if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeModeBtn.innerHTML = '<i class="bx bx-sun"></i> Light Mode';
}

if (savedColor) {
    document.documentElement.style.setProperty('--accent-color', savedColor);
    const activeDot = document.querySelector('.color-dot.active');
    if (activeDot) {
        activeDot.classList.remove('active');
    }
    colorDots.forEach(dot => {
        if (dot.getAttribute('data-color') === savedColor) {
            dot.classList.add('active');
        }
    });
}

themeModeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'light') {
        document.documentElement.removeAttribute('data-theme');
        themeModeBtn.innerHTML = '<i class="bx bx-moon"></i> Dark Mode';
        localStorage.setItem('theme', 'dark'); 
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeModeBtn.innerHTML = '<i class="bx bx-sun"></i> Light Mode';
        localStorage.setItem('theme', 'light'); 
    }
});


colorDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const activeDot = document.querySelector('.color-dot.active');
        if (activeDot) {
            activeDot.classList.remove('active');
        }
        dot.classList.add('active');
        const selectedColor = dot.getAttribute('data-color');
        document.documentElement.style.setProperty('--accent-color', selectedColor);
        localStorage.setItem('accentColor', selectedColor); 
    });
});

const timerDisplay = document.querySelector('.timer-display');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');


const alarmSound = new Audio('./audio/audio.mp3'); 

let countdown; 
let timeLeft = 25 * 60; 
let isRunning = false; 

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const displayMinutes = minutes < 10 ? '0' + minutes : minutes;
    const displaySeconds = seconds < 10 ? '0' + seconds : seconds;
    timerDisplay.textContent = `${displayMinutes}:${displaySeconds}`;
}

startBtn.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    countdown = setInterval(() => {
        timeLeft--;
        updateDisplay();
        if (timeLeft === 0) {
            clearInterval(countdown);
            isRunning = false;
            
            alarmSound.play();
            
            alert('Time is up! Take a short break. ☕');
            timeLeft = 25 * 60;
            updateDisplay();
        }
    }, 1000);
});

pauseBtn.addEventListener('click', () => {
    clearInterval(countdown);
    isRunning = false;
});

resetBtn.addEventListener('click', () => {
    clearInterval(countdown);
    isRunning = false;
    timeLeft = 25 * 60;
    updateDisplay();
});

const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

const taskModal = document.getElementById('taskModal');
const modalTaskName = document.getElementById('modalTaskName');
const taskDate = document.getElementById('taskDate');
const taskTime = document.getElementById('taskTime');
const cancelModalBtn = document.getElementById('cancelModalBtn');
const confirmModalBtn = document.getElementById('confirmModalBtn');

let temporaryTaskText = ""; 

let savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

function loadTasks() {
    taskList.innerHTML = ""; 
    savedTasks.forEach((task, index) => {
        createTaskElement(task.text, task.date, task.time, index, task.completed || false);
        scheduleReminder(task.text, task.date, task.time); 
    });
}

function createTaskElement(text, date, time, index, isCompleted = false) {
    const li = document.createElement('li');
    li.className = `task-item ${isCompleted ? 'completed' : ''}`;
    
    li.innerHTML = `
        <div class="task-info" style="display: flex; flex-direction: column; gap: 4px; cursor: pointer; flex: 1;">
            <span class="task-name" style="font-weight: 600;">${text}</span>
            <span class="task-due-date" style="font-size: 0.8rem; color: var(--text-secondary); display: flex; align-items: center; gap: 4px;">
                <i class="bx bx-bell" style="color: var(--accent-color);"></i> ${date} at ${time}
            </span>
        </div>
        <button class="task-delete-btn" data-index="${index}"><i class="bx bx-trash"></i></button>
    `;

    const taskInfo = li.querySelector('.task-info');
    taskInfo.addEventListener('click', () => {
        savedTasks[index].completed = !savedTasks[index].completed;
        localStorage.setItem('tasks', JSON.stringify(savedTasks));
        loadTasks();
    });

    const deleteBtn = li.querySelector('.task-delete-btn');
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        savedTasks.splice(index, 1); 
        localStorage.setItem('tasks', JSON.stringify(savedTasks)); 
        loadTasks(); 
    });

    taskList.appendChild(li);
}

addTaskBtn.addEventListener('click', () => {
    temporaryTaskText = taskInput.value.trim();
    if (temporaryTaskText === "") {
        alert("Please write a task first!");
        return;
    }
    modalTaskName.textContent = `Task: ${temporaryTaskText}`;
    taskModal.classList.add('show');
});

taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTaskBtn.click();
    }
});

cancelModalBtn.addEventListener('click', () => {
    taskModal.classList.remove('show');
    taskInput.value = "";
});

confirmModalBtn.addEventListener('click', () => {
    const dateValue = taskDate.value;
    const timeValue = taskTime.value;

    if (!dateValue || !timeValue) {
        alert("Please set both date and time for the reminder!");
        return;
    }

    savedTasks.push({ text: temporaryTaskText, date: dateValue, time: timeValue, completed: false });
    localStorage.setItem('tasks', JSON.stringify(savedTasks)); 

    loadTasks(); 
    taskModal.classList.remove('show');

    taskInput.value = "";
    taskDate.value = "";
    taskTime.value = "";
});

function scheduleReminder(taskName, date, time) {
    const targetDateTime = new Date(`${date}T${time}`);
    const now = new Date();
    const timeDifference = targetDateTime.getTime() - now.getTime();

    if (timeDifference > 0) {
        setTimeout(() => {
            alert(`⏰ REMINDER: It's time for your study task:\n"${taskName}"`);
        }, timeDifference);
    }
}
loadTasks();