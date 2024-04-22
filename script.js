// Updated Function to add a new task without drag and drop
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const dueDateInput = document.getElementById('dueDateInput');
    const taskList = document.getElementById('taskList');

    if (taskInput.value.trim() !== '') {
        const newTask = document.createElement('div');
        newTask.className = 'task align-task';

        const dueDateValue = dueDateInput.value;
        const formattedDueDate = dueDateValue ? formatDate(dueDateValue) : 'No Due Date';

        const taskName = document.createElement('span');
        taskName.className = 'task-name';

        // Set the text content to the abbreviated task name
        taskName.textContent = taskInput.value;

        if (taskInput.value.length >= 15) {
            taskName.setAttribute('data-tooltip', taskInput.value);
        }

        const dueDate = document.createElement('span');
        dueDate.className = 'due-date';
        dueDate.textContent = formattedDueDate;

        newTask.appendChild(taskName);
        newTask.appendChild(dueDate);
        newTask.innerHTML += `
            <button class="edit-notes-button" onclick="openNotesModal(this)" data-notes="">Add/Edit Notes</button>
            <img class="delete-icon" src="https://cdn-icons-png.flaticon.com/512/542/542724.png" alt="Delete Task" onclick="removeTask(this)">
        `;

        taskList.appendChild(newTask);
        taskInput.value = '';
        dueDateInput.value = '';

        itemizeListByDate();
    }
}





// Function to open the notes modal
function openNotesModal(button) {
    const task = button.closest('.task');
    const taskName = task.querySelector('.task-name').textContent;

    // Display the overlay and modal
    const overlay = document.querySelector('.overlay');
    const modal = document.querySelector('.modal');

    overlay.style.display = 'block';
    modal.style.display = 'block';

    // Populate modal with current notes
    const modalTextarea = document.querySelector('.modal textarea');
    modalTextarea.value = button.getAttribute('data-notes') || '';
    modalTextarea.placeholder = `Add notes for "${taskName}"`;

    // Save button click listener
    const saveButton = document.querySelector('.modal button');
    saveButton.onclick = function () {
        const notesValue = modalTextarea.value;
        button.setAttribute('data-notes', notesValue);
        closeModal();
    };
}

// Function to save notes
function saveNotes() {
    const overlay = document.querySelector('.overlay');
    const modal = document.querySelector('.modal');

    overlay.style.display = 'none';
    modal.style.display = 'none';
}

// Function to remove a task
function removeTask(element) {
    const taskList = document.getElementById('taskList');
    const task = element.closest('.task');
    taskList.removeChild(task);
    itemizeListByDate(); // Reorganize the list after removal
}


// Function to format date as YYYY-MM-DD
function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const [year, month, day] = dateString.split('-');
    return new Date(`${month}/${day}/${year}`).toLocaleDateString('en-US', options);
}

// Function to update notes for a task
function updateNotes(select) {
    const task = select.closest('.task');
    const notesDropdown = task.querySelector('.notes-dropdown');
    const updatedNotes = notesDropdown.value;
    
    // Update the task's notes
    task.innerHTML = `
        <span>${task.querySelector('span').textContent}</span>
        <span class="due-date">${task.querySelector('.due-date').textContent}</span>
        <select class="notes-dropdown" onchange="updateNotes(this)">
            <option value="">Select Notes</option>
            <option value="${updatedNotes}" selected>${updatedNotes}</option>
        </select>
        <img src="https://cdn-icons-png.flaticon.com/512/542/542724.png" alt="Delete Task" onclick="removeTask(this)">
    `;
}

// Function to itemize the list based on due dates
function itemizeListByDate() {
    const taskList = document.getElementById('taskList');
    const tasks = Array.from(taskList.children);

    // Separate tasks with and without due dates
    const datedTasks = tasks.filter(task => {
        const dueDate = task.querySelector('.due-date').textContent;
        return dueDate !== 'No Due Date';
    });

    const undatedTasks = tasks.filter(task => {
        const dueDate = task.querySelector('.due-date').textContent;
        return dueDate === 'No Due Date';
    });

    // Sort dated tasks based on due date
    datedTasks.sort((taskA, taskB) => {
        const dateA = new Date(taskA.querySelector('.due-date').textContent);
        const dateB = new Date(taskB.querySelector('.due-date').textContent);
        return dateA - dateB;
    });

    // Re-append sorted dated tasks and undated tasks to the list
    taskList.innerHTML = '';
    datedTasks.forEach(task => taskList.appendChild(task));
    undatedTasks.forEach(task => taskList.appendChild(task));
}
//-----------------
function closeModal() {
    const overlay = document.querySelector('.overlay');
    const modal = document.querySelector('.modal');

    overlay.style.display = 'none';
    modal.style.display = 'none';
}