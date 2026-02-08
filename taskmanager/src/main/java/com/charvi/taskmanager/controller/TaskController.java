package com.charvi.taskmanager.controller;

import com.charvi.taskmanager.entity.Task;
import com.charvi.taskmanager.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tasks") // base URL
public class TaskController {

    @Autowired
    private TaskService taskService;

    // ✅ Get all tasks
    @GetMapping
    public List<Task> getAllTasks() {
        return taskService.getAllTasks();
    }

    // ✅ Get task by id
    @GetMapping("/{id}")
    public Task getTaskById(@PathVariable Long id) {
        Optional<Task> task = taskService.getTaskById(id);
        return task.orElse(null); // agar task nahi mila to null return
    }

    // ✅ Create a new task
    @PostMapping
    public Task createTask(@RequestBody Task task) {
        return taskService.saveTask(task);
    }

    // ✅ Update an existing task
    @PutMapping("/{id}")
    public Task updateTask(@PathVariable Long id, @RequestBody Task taskDetails) {
        Optional<Task> optionalTask = taskService.getTaskById(id);
        if (optionalTask.isPresent()) {
            Task task = optionalTask.get();
            task.setTitle(taskDetails.getTitle());
            task.setDescription(taskDetails.getDescription());
            task.setCompleted(taskDetails.isCompleted()); // ✅ corrected line
            return taskService.saveTask(task);
        } else {
            return null; // ya exception throw kar sakte ho
        }
    }

    // ✅ Delete a task
    @DeleteMapping("/{id}")
    public String deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return "Task deleted with id: " + id;
    }
}
