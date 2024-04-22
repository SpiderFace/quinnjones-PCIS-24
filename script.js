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