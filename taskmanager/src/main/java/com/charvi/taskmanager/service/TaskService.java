package com.charvi.taskmanager.service;

import com.charvi.taskmanager.entity.Task;
import com.charvi.taskmanager.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    // Create or Update Task
    public Task saveTask(Task task) {
        return taskRepository.save(task);
    }

    // Get all tasks
    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    // Get task by id
    public Optional<Task> getTaskById(Long id) {
        return taskRepository.findById(id);
    }

    // Delete task by id
    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}
