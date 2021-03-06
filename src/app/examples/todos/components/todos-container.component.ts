import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { select, Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ROUTE_ANIMATIONS_ELEMENTS } from '@app/core';

import {
  ActionTodosAdd,
  ActionTodosFilter,
  ActionTodosPersist,
  ActionTodosRemoveDone,
  ActionTodosToggle
} from '../todos.actions';
import { selectTodos } from '../todos.selectors';
import { Todo, TodosFilter, TodosState } from '../todos.model';
import { State } from '../../examples.state';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '@app/core/notifications/notification.service';

@Component({
  selector: 'vispt-todos',
  templateUrl: './todos-container.component.html',
  styleUrls: ['./todos-container.component.scss']
})
export class TodosContainerComponent implements OnInit, OnDestroy {
  private unsubscribe$: Subject<void> = new Subject<void>();

  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;
  todos: TodosState;
  newTodo = '';

  constructor(
    public store: Store<State>,
    public snackBar: MatSnackBar,
    public translateService: TranslateService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.store
      .pipe(
        select(selectTodos),
        takeUntil(this.unsubscribe$)
      )
      .subscribe(todos => {
        this.todos = todos;
        this.store.dispatch(new ActionTodosPersist({ todos }));
      });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get filteredTodos() {
    const filter = this.todos.filter;
    if (filter === 'ALL') {
      return this.todos.items;
    } else {
      const predicate = filter === 'DONE' ? t => t.done : t => !t.done;
      return this.todos.items.filter(predicate);
    }
  }

  get isAddTodoDisabled() {
    return this.newTodo.length < 4;
  }

  get isRemoveDoneTodosDisabled() {
    return this.todos.items.filter(item => item.done).length === 0;
  }

  onNewTodoChange(newTodo: string) {
    this.newTodo = newTodo;
  }

  onNewTodoClear() {
    this.newTodo = '';
  }

  onAddTodo() {
    this.store.dispatch(new ActionTodosAdd({ name: this.newTodo }));
    this.notificationService.info(`"${this.newTodo}" added`);
    this.newTodo = '';
  }

  onToggleTodo(todo: Todo) {
    this.store.dispatch(new ActionTodosToggle({ id: todo.id }));
    const newStatus = todo.done ? 'active' : 'done';

    this.snackBar
      .open(`Toggled "${todo.name}" to ${newStatus}`, 'Undo', {
        duration: 2500,
        panelClass: 'todos-notification-overlay'
      })
      .onAction()
      .subscribe(() => this.onToggleTodo({ ...todo, done: !todo.done }));
  }

  onRemoveDoneTodos() {
    this.store.dispatch(new ActionTodosRemoveDone());
    this.notificationService.info('Removed done todos');
  }

  onFilterTodos(filter: TodosFilter) {
    this.store.dispatch(new ActionTodosFilter({ filter }));
    this.notificationService.info(`Filtered to ${filter.toLowerCase()}`);
  }
}
