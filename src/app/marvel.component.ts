import { Component, OnInit } from '@angular/core';
import { MarvelService } from '../service/marvel.service';
@Component({
  selector: 'app-root',
  templateUrl: './marvel.component.html',
  styleUrls: ['./marvel.component.css']
})
export class AppComponent implements OnInit {

  comics: any[] = [];            // Todos os quadrinhos retornados da API
  filteredComics: any[] = [];     // Quadrinhos filtrados pela busca
  paginatedComics: any[] = [];    // Quadrinhos mostrados na página atual
  currentPage: number = 1;        // Página atual
  itemsPerPage: number = 4;       // Número de itens por página
  totalPages: number = 0;         // Número total de páginas
  searchQuery: string = '';       // Texto de pesquisa do input
  isLoading: boolean = true;      // Controle de carregamento (spinner loader)

  constructor(private marvelService: MarvelService) {}

  ngOnInit(): void {
    this.loadComics();
  }

  // Carrega todos os quadrinhos da API
  loadComics(): void {
    this.isLoading = true; // Exibe o loader enquanto a requisição é feita
    this.marvelService.getComics().subscribe(
      (response: any) => {
        this.comics = response.data.results;
        this.filteredComics = [...this.comics]; // Exibe todos os quadrinhos inicialmente
        this.updatePaginatedComics(); // Atualiza a exibição dos quadrinhos da página atual
        this.isLoading = false;                 // Oculta o loader após carregar os dados
      },
      (error) => {
        console.error('Erro ao buscar os quadrinhos', error);
      }
    );
  }

  // Atualiza a exibição dos quadrinhos de acordo com a página atual
  updatePaginatedComics(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedComics = this.filteredComics.slice(startIndex, endIndex); // Trabalha com a lista filtrada
    this.totalPages = Math.ceil(this.filteredComics.length / this.itemsPerPage); // Atualiza o número total de páginas
  }

  // Método para pesquisar quadrinhos com base no input de busca
  searchCharacters(): void {
    this.isLoading = true;
    setTimeout(() => {
      if (this.searchQuery.trim() === '') {
        // Se a pesquisa estiver vazia, restaura a lista original
        this.filteredComics = [...this.comics];
      } else {
        // Filtra os quadrinhos com base no título
        this.filteredComics = this.comics.filter(comic =>
          comic.title.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      // Volta para a primeira página após uma nova busca
      this.currentPage = 1;
      this.updatePaginatedComics(); // Atualiza a exibição da lista filtrada e paginada

      this.isLoading = false; // Esconde o spinner após a busca
    }, 500); // Simulação de tempo de busca, ajuste conforme necessário
  }



   // Método para ir para uma página específica
   goToPage(page: number): void {
    this.currentPage = page; // Atualiza a página atual
    this.updatePaginatedComics(); // Atualiza os quadrinhos exibidos na página
  }

  // Avançar uma página
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedComics();
    }
  }

  // Voltar uma página
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedComics();
    }
  }

  // Avançar rápido (para a última página)
  fastForward(): void {
    this.goToPage(this.totalPages);
  }

  // Voltar rápido (para a primeira página)
  fastBackward(): void {
    this.goToPage(1);
  }
}
