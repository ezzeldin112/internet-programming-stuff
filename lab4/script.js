class Task {
    constructor(description, completed = false, createdAt = new Date().toISOString(), id = Date.now()) {
        this.id = id;
        this.description = description;
        this.completed = completed;
        this.createdAt = createdAt;
    }

    toggle() {
        this.completed = !this.completed;
    }

    rename(newDescription) {
        this.description = newDescription;
    }
}

class TaskManager {
    constructor() {
        this.tasks = [];
        this.filter = "all";
        this.sortBy = "newest";

        this.taskInput = document.getElementById("taskInput");
        this.addTaskBtn = document.getElementById("addTaskBtn");
        this.taskList = document.getElementById("taskList");
        this.emptyMessage = document.getElementById("emptyMessage");
        this.filterButtons = document.querySelectorAll(".filter-btn");
        this.sortSelect = document.getElementById("sortSelect");

        this.loadTasks();
        this.bindEvents();
        this.renderTasks();
    }

    bindEvents() {
        this.addTaskBtn.addEventListener("click", () => this.addTask());

        this.taskInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                this.addTask();
            }
        });

        this.filterButtons.forEach((button) => {
            button.addEventListener("click", () => {
                this.filter = button.dataset.filter;

                this.filterButtons.forEach((btn) => btn.classList.remove("active"));
                button.classList.add("active");

                this.renderTasks();
            });
        });

        this.sortSelect.addEventListener("change", () => {
            this.sortBy = this.sortSelect.value;
            this.renderTasks();
        });
    }

    addTask() {
        const description = this.taskInput.value.trim();

        if (description === "") {
            alert("Please enter a task description.");
            return;
        }

        const task = new Task(description);
        this.tasks.push(task);

        this.taskInput.value = "";
        this.saveTasks();
        this.renderTasks();
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter((task) => task.id !== taskId);
        this.saveTasks();
        this.renderTasks();
    }

    toggleTask(taskId) {
        const task = this.tasks.find((item) => item.id === taskId);
        if (task) {
            task.toggle();
            this.saveTasks();
            this.renderTasks();
        }
    }

    editTask(taskId) {
        const task = this.tasks.find((item) => item.id === taskId);
        if (!task) return;

        const updatedText = prompt("Edit task:", task.description);

        if (updatedText === null) return;

        const trimmedText = updatedText.trim();

        if (trimmedText === "") {
            alert("Task description cannot be empty.");
            return;
        }

        task.rename(trimmedText);
        this.saveTasks();
        this.renderTasks();
    }

    getFilteredTasks() {
        if (this.filter === "completed") {
            return this.tasks.filter((task) => task.completed);
        }

        if (this.filter === "incomplete") {
            return this.tasks.filter((task) => !task.completed);
        }

        return [...this.tasks];
    }

    getSortedTasks(taskArray) {
        const sortedTasks = [...taskArray];

        if (this.sortBy === "az") {
            sortedTasks.sort((a, b) => a.description.localeCompare(b.description));
        } else if (this.sortBy === "za") {
            sortedTasks.sort((a, b) => b.description.localeCompare(a.description));
        } else if (this.sortBy === "oldest") {
            sortedTasks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        } else {
            sortedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return sortedTasks;
    }

    formatDate(dateString) {
        const date = new Date(dateString);

        return date.toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
        });
    }

    saveTasks() {
        localStorage.setItem("tasks", JSON.stringify(this.tasks));
    }

    loadTasks() {
        const savedTasks = localStorage.getItem("tasks");

        if (savedTasks) {
            const parsedTasks = JSON.parse(savedTasks);

            this.tasks = parsedTasks.map(
                (task) => new Task(task.description, task.completed, task.createdAt, task.id)
            );
        }
    }

    renderTasks() {
        const filteredTasks = this.getFilteredTasks();
        const finalTasks = this.getSortedTasks(filteredTasks);

        this.taskList.innerHTML = "";

        if (finalTasks.length === 0) {
            this.emptyMessage.classList.remove("hidden");
            return;
        }

        this.emptyMessage.classList.add("hidden");

        finalTasks.forEach((task) => {
            const li = document.createElement("li");
            li.className = `task-item ${task.completed ? "completed" : ""}`;

            li.innerHTML = `
                <div class="task-content">
                    <p class="task-text" data-id="${task.id}" title="Click to toggle completion">
                        ${this.escapeHTML(task.description)}
                    </p>
                    <p class="task-time">Created: ${this.formatDate(task.createdAt)}</p>
                </div>

                <div class="task-actions">
                    <button class="edit-btn" data-id="${task.id}" title="Edit task">✏️</button>
                    <button class="delete-btn" data-id="${task.id}" title="Delete task">❌</button>
                </div>
            `;

            this.taskList.appendChild(li);
        });

        this.attachTaskEvents();
    }

    attachTaskEvents() {
        const textElements = document.querySelectorAll(".task-text");
        const editButtons = document.querySelectorAll(".edit-btn");
        const deleteButtons = document.querySelectorAll(".delete-btn");

        textElements.forEach((text) => {
            text.addEventListener("click", () => {
                const taskId = Number(text.dataset.id);
                this.toggleTask(taskId);
            });
        });

        editButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const taskId = Number(button.dataset.id);
                this.editTask(taskId);
            });
        });

        deleteButtons.forEach((button) => {
            button.addEventListener("click", () => {
                const taskId = Number(button.dataset.id);
                this.deleteTask(taskId);
            });
        });
    }

    escapeHTML(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new TaskManager();
});