import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';
import { flatMap, catchError, map } from 'rxjs/operators';
import * as moment from 'moment';

import { Entry } from './entry.model';
import { CategoryService } from './../../categories/shared/category.service';
import { BaseResourceService } from './../../../shared/services/base-resource.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor(
    protected injetor: Injector,
    private categoryService: CategoryService
  ) {
    super('api/entries', injetor, Entry.fromJson);
  }

  create(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.create.bind(this));
  }

  update(entry: Entry): Observable<Entry> {
    return this.setCategoryAndSendToServer(entry, super.update.bind(this));
  }

  getByMonthAndYear(month: number, year: number): Observable<Entry[]> {
    return this.getAll().pipe(
      map(entries => this.filterByMonthAndYear(entries, month, year))
    );
  }

  private setCategoryAndSendToServer(entry: Entry, sendFn: any): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return sendFn(entry)
      }),
      catchError(this.handleError)
    );
  }

  filterByMonthAndYear(entries: Entry[], month: number, year: number) {
    return entries.filter(entry => {
      const entryDate = moment(entry.date, 'DD/MM/YYYY');
      const monthMatches = entryDate.month() + 1 == month;
      const yearMatches = entryDate.year() == year;

      if (monthMatches && yearMatches)
        return entry;

    })
  }
}
