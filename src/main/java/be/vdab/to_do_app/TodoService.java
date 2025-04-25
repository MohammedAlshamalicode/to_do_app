package be.vdab.to_do_app;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class TodoService {

    private final TodoRepository todoRepository;

    public TodoService(TodoRepository todoRepository) {
        this.todoRepository = todoRepository;
    }

    @Transactional
    TodoItem save (String task){
        TodoItem todoItem = new TodoItem(task);
        return todoRepository.save(todoItem);
    }

    TodoItem findById(long id){
        return todoRepository.findById(id)
                .orElseThrow(() ->new TaskNotFoundException(id));
    }

    @Transactional
    void deleteById (long id) {
         todoRepository.deleteById(id);
    }

    List<TodoItem> findAllTasks(){
        return todoRepository.findAll();
    }

    @Transactional
    TodoItem updateCompletionStatus(long id, boolean completed){
        TodoItem item = todoRepository.findById(id)
                .orElseThrow(()->new TaskNotFoundException(id));
        item.setCompleted(completed);
        return todoRepository.save(item);
    }
}
