import { InMemoryDbService, RequestInfo } from 'angular-in-memory-web-api';

import { Category } from './pages/categories/shared/category.model';
import { Entry } from './pages/entries/shared/entry.model';

export class InMemoryDatabase implements InMemoryDbService {

  createDb() {
    const categories: Category[] = [
      { id: 1, name: "Moradia", description: "Pagamentos de Contas da Casa" },
      { id: 2, name: "Saúde", description: "Plano de Saúde e Remédios" },
      { id: 3, name: "Lazer", description: "Cinema, parques, praia, etc" },
      { id: 4, name: "Salário", description: "Recebimento de Salário" },
      { id: 5, name: "Freelas", description: "Trabalhos como freelancer" }
    ];

    const entries: Entry[] = [
      { id: 1, name: 'Gás de cozinha', categoryId: categories[0].id, category: categories[0], paid: true, date: '20/10/2019', amount: '70,00', type: 'expense',  description: '' } as Entry,
      { id: 2, name: 'Aluguel', categoryId: categories[0].id, category: categories[0], paid: true, date: '20/10/2019', amount: '650,00', type: 'expense',  description: '' } as Entry,
      { id: 3, name: 'Água', categoryId: categories[0].id, category: categories[0], paid: false, date: '20/10/2019', amount: '65,00', type: 'expense',  description: '' } as Entry,
      { id: 4, name: 'Energia', categoryId: categories[0].id, category: categories[0], paid: false, date: '20/10/2019', amount: '110,00', type: 'expense',  description: '' } as Entry,
      { id: 5, name: 'Basis', categoryId: categories[3].id, category: categories[3], paid: true, date: '20/10/2019', amount: '1700,00', type: 'reneveu',  description: '' } as Entry,
      { id: 6, name: 'Funcab', categoryId: categories[4].id, category: categories[4], paid: true, date: '20/10/2019', amount: '800,00', type: 'reneveu',  description: '' } as Entry,
      { id: 7, name: 'Farmácia', categoryId: categories[1].id, category: categories[1], paid: true, date: '20/10/2019', amount: '40,00', type: 'expense',  description: '' } as Entry,
      { id: 8, name: 'Cinema', categoryId: categories[2].id, category: categories[2], paid: true, date: '20/10/2019', amount: '35,00', type: 'expense',  description: '' } as Entry,
      { id: 9, name: 'Internet', categoryId: categories[2].id, category: categories[2], paid: true, date: '20/10/2019', amount: '89,00', type: 'expense',  description: '' } as Entry,
    ]

    return { categories, entries }
  }
}
