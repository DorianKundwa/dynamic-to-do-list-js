// Ensure the script runs after the DOM content has fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Select DOM elements
    const taskForm = document.getElementById('task-form');
    const addButton = document.getElementById('add-task-btn');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const status = document.getElementById('status');

    // Helpers for Local Storage
    function getStoredTasks() {
        try {
            return JSON.parse(localStorage.getItem('tasks') || '[]');
        } catch (error) {
            return [];
        }
    }

    function saveStoredTasks(tasks) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const storedTasks = getStoredTasks();
        storedTasks.forEach(function(text) { addTask(text, false); });
    }

    // Function to add a new task to the list
    function addTask(taskTextParam, save = true) {
        // Determine and trim input value
        const inputText = typeof taskTextParam === 'string' ? taskTextParam : taskInput.value;
        const taskText = (inputText || '').trim();

        // Validate input
        if (taskText === '') {
            alert('Please enter a task');
            // Keep focus on the input for accessibility
            taskInput.focus();
            return;
        }

        // Create list item for the task
        const li = document.createElement('li');
        li.setAttribute('role', 'listitem');
        li.textContent = taskText;

        // Create remove button for the task
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remove';
        removeBtn.classList.add('remove-btn');
        removeBtn.setAttribute('aria-label', `Remove task: ${taskText}`);

        // Attach click handler to remove the task
        removeBtn.onclick = function() {
            taskList.removeChild(li);
            // Update Local Storage after removal
            const tasks = getStoredTasks();
            const index = tasks.indexOf(taskText);
            if (index !== -1) {
                tasks.splice(index, 1);
                saveStoredTasks(tasks);
            }
            if (status) {
                status.textContent = `Removed task: ${taskText}`;
            }
            // Return focus to the input so keyboard users can continue quickly
            taskInput.focus();
        };

        // Append the remove button and list item to the list
        li.appendChild(removeBtn);
        taskList.appendChild(li);

        // Clear the input field
        taskInput.value = '';
        // Persist to Local Storage when needed
        if (save) {
            const tasks = getStoredTasks();
            tasks.push(taskText);
            saveStoredTasks(tasks);
        }
        // Announce addition and move focus to input for rapid entry
        if (status) {
            status.textContent = `Added task: ${taskText}`;
        }
        taskInput.focus();
    }

    // Event listener for Add Task button
    addButton.addEventListener('click', function() { addTask(); });

    // Handle form submit (Enter on input, button click), prevent page reload
    if (taskForm) {
        taskForm.addEventListener('submit', function(event) {
            event.preventDefault();
            addTask();
        });
    }

    // Allow adding task by pressing Enter key
    taskInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addTask();
        }
    });

    // Load tasks from Local Storage on DOMContentLoaded
    loadTasks();
});


