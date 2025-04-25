package be.vdab.to_do_app;

import jakarta.persistence.*;

@Entity
@Table(name = "todos")
public class TodoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private long id ;

    @Column(name = "task")
    private String task ;

    @Column(name = "completed")
    private boolean completed ;

    protected TodoItem(){}

    public TodoItem(String task) {
        this.task = task;
        this.completed = false;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public long getId() {
        return id;
    }

    public String getTask() {
        return task;
    }

    public boolean isCompleted() {
        return completed;
    }


}
