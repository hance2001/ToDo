// DOS Todo List Application - Black & White Version
class DOSTodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.todoIdCounter = this.getNextId();
        this.init();
    }

    init() {
        this.bindEvents();
        this.render();
        this.updateStats();
        this.focusInput();
    }

    bindEvents() {
        const todoInput = document.getElementById('todoInput');
        const addBtn = document.getElementById('addBtn');

        // Add task events
        addBtn.addEventListener('click', () => this.addTodo());
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });

        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // ESC to clear all completed tasks
            if (e.key === 'Escape') {
                this.clearCompleted();
            }
        });

        // Auto-save on changes
        window.addEventListener('beforeunload', () => {
            this.saveTodos();
        });
    }

    addTodo() {
        const input = document.getElementById('todoInput');
        const text = input.value.trim();

        if (text === '') {
            this.showMessage('ERROR: Task cannot be empty!');
            return;
        }

        if (text.length > 60) {
            this.showMessage('ERROR: Task too long! (Max 60 chars)');
            return;
        }

        const todo = {
            id: this.todoIdCounter++,
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(todo); // Add to beginning for DOS-like behavior
        input.value = '';
        
        this.render();
        this.updateStats();
        this.saveTodos();
        this.focusInput();
        
        this.showMessage(`ADDED: "${text}"`);
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.render();
            this.updateStats();
            this.saveTodos();
            
            const status = todo.completed ? 'COMPLETED' : 'REACTIVATED';
            this.showMessage(`${status}: "${todo.text}"`);
        }
    }

    deleteTodo(id) {
        const todoIndex = this.todos.findIndex(t => t.id === id);
        if (todoIndex !== -1) {
            const deletedTodo = this.todos[todoIndex];
            this.todos.splice(todoIndex, 1);
            this.render();
            this.updateStats();
            this.saveTodos();
            
            this.showMessage(`DELETED: "${deletedTodo.text}"`);
        }
    }

    clearCompleted() {
        const completedCount = this.todos.filter(t => t.completed).length;
        if (completedCount === 0) {
            this.showMessage('No completed tasks to clear.');
            return;
        }

        this.todos = this.todos.filter(t => !t.completed);
        this.render();
        this.updateStats();
        this.saveTodos();
        
        this.showMessage(`CLEARED: ${completedCount} completed task(s)`);
    }

    render() {
        const todoList = document.getElementById('todoList');
        
        if (this.todos.length === 0) {
            todoList.innerHTML = `
                <div class="empty-state">
                    No tasks found. Type a task above and press ENTER to add.
                </div>
            `;
            return;
        }

        todoList.innerHTML = this.todos.map(todo => `
            <div class="todo-item ${todo.completed ? 'completed' : ''}" 
                 onclick="todoApp.toggleTodo(${todo.id})"
                 title="Click to toggle completion">
                <span class="todo-checkbox">${todo.completed ? '☑' : '☐'}</span>
                <span class="todo-text">${this.escapeHtml(todo.text)}</span>
                <span class="todo-delete" 
                      onclick="event.stopPropagation(); todoApp.deleteTodo(${todo.id})"
                      title="Delete task">[X]</span>
            </div>
        `).join('');
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const pending = total - completed;

        document.getElementById('taskCount').textContent = `Tasks: ${total}`;
        document.getElementById('completedCount').textContent = `Completed: ${completed}`;
        document.getElementById('pendingCount').textContent = `Pending: ${pending}`;
    }

    showMessage(message) {
        // Create a temporary message display in DOS style
        const prompt = document.querySelector('.prompt');
        const originalText = prompt.textContent;
        
        prompt.textContent = `C:\\TODO> ${message}`;
        prompt.style.color = '#ffffff';
        
        setTimeout(() => {
            prompt.textContent = originalText;
            prompt.style.color = '#ffffff';
        }, 2000);
    }

    focusInput() {
        document.getElementById('todoInput').focus();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Local Storage Methods
    saveTodos() {
        try {
            localStorage.setItem('dos-todos-bw', JSON.stringify(this.todos));
            localStorage.setItem('dos-todo-counter-bw', this.todoIdCounter.toString());
        } catch (e) {
            console.warn('Could not save todos to localStorage:', e);
        }
    }

    loadTodos() {
        try {
            const saved = localStorage.getItem('dos-todos-bw');
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            console.warn('Could not load todos from localStorage:', e);
            return [];
        }
    }

    getNextId() {
        try {
            const saved = localStorage.getItem('dos-todo-counter-bw');
            return saved ? parseInt(saved, 10) : 1;
        } catch (e) {
            return 1;
        }
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.todoApp = new DOSTodoApp();
    
    // Add some DOS-style startup messages
    setTimeout(() => {
        console.log('DOS TODO v1.0 (Black & White) - System Ready');
        console.log('Copyright (C) 2025 - All rights reserved');
        console.log('Type tasks and press ENTER to add them');
        console.log('Use ESC to clear completed tasks');
    }, 100);
});

// Add some retro sound effects (optional - commented out to avoid annoyance)
/*
function playBeep() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}
*/
