import { Component, OnInit } from '@angular/core';

import { BaseResourceModel } from './../models/base-resource.model';
import { BaseResourceService } from './../services/base-resource.service';

export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = [];

  constructor(
    private resourceService: BaseResourceService<T>
  ) { }

  ngOnInit() {
    this.resourceService.getAll().subscribe(
      resources => this.resources = resources,
      error => alert('Erro ao carregar a lista')
    );
  }

  deleteResource(resource: T) {
    const deletar = confirm('Tem certeza de que deseja deletar o registro?');

    if (deletar) {
      this.resourceService.delete(resource.id).subscribe(
        () => this.resources = this.resources.filter(res => res.id !== resource.id),
        () => alert('Erro ao tentar excluir')
      );
    }
  }

}
