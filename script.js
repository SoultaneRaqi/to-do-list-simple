document.addEventListener('DOMContentLoaded', function() {
  const taskInput = document.getElementById('taskInput');
  const addButton = document.getElementById('addButton');
  const taskList = document.getElementById('taskList');
  const clearButton = document.getElementById('clearButton');
  const clearAllButton = document.getElementById('clearAllButton');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const totalTasksSpan = document.getElementById('totalTasks');
  const completedTasksSpan = document.getElementById('completedTasks');
  
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
  // Load tasks from localStorage
  function loadTasks() {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
      taskList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-clipboard-list"></i>
          <p>No tasks yet. Add one above!</p>
        </div>
      `;
      return;
    }
    
    const filter = document.querySelector('.filter-btn.active').dataset.filter;
    
    tasks.forEach((task, index) => {
      if (filter === 'active' && task.completed) return;
      if (filter === 'completed' && !task.completed) return;
      
      const taskItem = document.createElement('li');
      taskItem.className = task.completed ? 'task-completed' : 'task-pending';
      
      taskItem.innerHTML = `
        <span>${task.text}</span>
        <div class="task-actions">
          <i class="fas ${task.completed ? 'fa-check-circle' : 'fa-hourglass-half'}"></i>
          <i class="fas fa-trash" data-index="${index}"></i>
        </div>
      `;
      
      taskList.appendChild(taskItem);
    });
    
    updateStats();
  }
  
  // Update task statistics
  function updateStats() {
    totalTasksSpan.textContent = tasks.length;
    completedTasksSpan.textContent = tasks.filter(task => task.completed).length;
  }
  
  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    loadTasks();
  }
  
  // Add new task
  addButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    if (taskText) {
      tasks.push({ text: taskText, completed: false });
      taskInput.value = '';
      saveTasks();
    }
  });
  
  // Add task on Enter key
  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addButton.click();
    }
  });
  
  // Task actions (complete/delete)
  taskList.addEventListener('click', (event) => {
    const target = event.target;
    
    // Toggle complete
    if (target.classList.contains('fa-hourglass-half') || target.classList.contains('fa-check-circle')) {
      const taskIndex = target.parentElement.querySelector('.fa-trash').dataset.index;
      tasks[taskIndex].completed = !tasks[taskIndex].completed;
      saveTasks();
    }
    
    // Delete task
    if (target.classList.contains('fa-trash')) {
      const taskIndex = target.dataset.index;
      tasks.splice(taskIndex, 1);
      saveTasks();
    }
  });
  
  // Double click to mark for deletion (visual feedback)
  taskList.addEventListener('dblclick', (event) => {
    if (event.target.tagName === 'LI') {
      event.target.classList.add('task-to-delete');
    }
  });
  
  // Clear completed tasks
  clearButton.addEventListener('click', () => {
    tasks = tasks.filter(task => !task.completed);
    saveTasks();
  });
  
  // Clear all tasks
  clearAllButton.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all tasks?')) {
      tasks = [];
      saveTasks();
    }
  });
  
  // Filter tasks
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      loadTasks();
    });
  });
  
  // Initial load
  loadTasks();
});