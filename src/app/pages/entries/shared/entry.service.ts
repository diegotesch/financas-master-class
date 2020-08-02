import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';

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
    super('api/entries', injetor);
  }

  create(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.create(entry);
      })
    );
  }

  update(entry: Entry): Observable<Entry> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return super.update(entry);
      })
    );
  }

  protected jsonDataToResources(jsonData: any[]): Entry[] {
    return jsonData.map(element => Object.assign(new Entry(), element));
  }

  protected jsonDataToResource(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }

}
