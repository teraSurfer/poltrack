import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { Store } from '@ngrx/store';


import { ROUTE_ANIMATIONS_ELEMENTS, SearchResultItem } from '@app/core';

/** Displays search results, allows selection of one or more items in the list */
@Component({
  selector: 'search-result-list',
  templateUrl: './search-result-list.component.html',
  styleUrls: ['./search-result-list.component.scss']
})
export class SearchResultListComponent implements OnInit {

  searchResults: [SearchResultItem];
  routeAnimationsElements = ROUTE_ANIMATIONS_ELEMENTS;

  constructor(public store: Store<any>, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.searchResults = [
      {id: 'p1', isSelected: false, title: 'John McCain', description: 'Senator from Arizona'}
    ];
  }

  onToggleItem(item: SearchResultItem) {
    const newStatus = item.isSelected ? 'unselected' : 'selected';
  //  this.store.dispatch(new ActionTodosToggle({ id: item.id }));
    this.showNotification(`Toggled "${item.title}" to ${newStatus}`, 'Undo')
      .onAction()
      .subscribe(() => this.onToggleItem({ ...item, isSelected: !item.isSelected }));
  }

  private showNotification(message: string, action?: string) {
    return this.snackBar.open(message, action, {
      duration: 2500,
      panelClass: 'todos-notification-overlay'
    });
  }

}
