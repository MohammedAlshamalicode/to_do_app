package be.vdab.to_do_app;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("todo")
public class TodoController {

    private final TodoService todoService ;

    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @PostMapping
    TodoItem create(@RequestBody TodoItem todoItem) {
        return todoService.save(todoItem.getTask());
    }

    @GetMapping("/{id}")
    TodoItem findTaskById (@PathVariable long id) {
        return todoService.findById(id);
    }

    @DeleteMapping("/{id}")
    void deleteTask (@PathVariable long id) {
        var task = todoService.findById(id);
        todoService.deleteById(id);
    }

    @GetMapping
    List<TodoItem> findAllTasks(){
        return todoService.findAllTasks();
    }

    // 4. تحديث حالة الإنجاز فقط
    @PutMapping("/{id}")
    public ResponseEntity<TodoItem> updateCompletion(@PathVariable long id, @RequestBody CompletionUpdateRequest request) {
        try {
            TodoItem updated = todoService.updateCompletionStatus(id, request.isCompleted());
            return ResponseEntity.ok(updated);
        } catch (TaskNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }

}
