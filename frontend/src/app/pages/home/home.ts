import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskService, Task } from '../../services/task.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  tasks: Task[] = [];

  constructor(private taskService: TaskService) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.taskService.getTasks().subscribe((tasks: Task[]) => {
      this.tasks = tasks;
    });
  }

  addTask() {
    const title = prompt('Enter task name:');
    if (!title || title.trim() === '') return;

    const priority = prompt('Enter priority (Low, Medium, High):') || '';
    const dueDate = prompt('Enter due date (YYYY-MM-DD):') || '';

    this.taskService.addTask({ title, priority, dueDate })
      .subscribe(() => this.loadTasks());
  }

  deleteTask(id: string) {
    this.taskService.deleteTask(id)
      .subscribe(() => this.loadTasks());
  }

  editTask(task: Task) {
    const title = prompt('New task name:', task.title);
    if (!title || title.trim() === '') return;

    const priority = prompt('New priority:', task.priority || '') || '';
    const dueDate = prompt('New due date:', task.dueDate || '') || '';

    this.taskService.updateTask(task.id, { title, priority, dueDate })
      .subscribe(() => this.loadTasks());
  }
}
