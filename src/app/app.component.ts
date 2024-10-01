import { Component, OnInit } from '@angular/core';
import { MarvelService } from './marvel.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  comics: any[] = [];
  paginatedComics: any[] = []; // Quadrinhos mostrados na página atual
  searchQuery: string = '';
  characters: any[] = [];
  itemsPerPage: number = 4; // Número de itens por página
  limit: number = 4;    // Número de personagens por página
  offset: number = 0;   // Controla o deslocamento da página atual
  currentPage: number = 1;  // Página atual
  totalPages: number = 4;   // Número total de páginas (você pode alterar isso conforme necessário)

  constructor(private marvelService: MarvelService) {}

  ngOnInit(): void {
    this.marvelService.getComics().subscribe(
      (response: any) => {
        this.comics = response.data.results;
        this.totalPages = Math.ceil(this.comics.length / this.itemsPerPage); // Calcula o total de páginas
        this.updatePaginatedComics(); // Atualiza a exibição dos quadrinhos da página atual
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
    this.paginatedComics = this.comics.slice(startIndex, endIndex);
  }

   // Método para buscar personagens
   searchCharacters(): void {
    if (this.searchQuery.trim()) {
      this.marvelService.searchCharacters(this.searchQuery, this.limit, this.offset).subscribe(
        (response: any) => {
          this.characters = response.data.results;
        },
        (error) => {
          console.error('Erro ao buscar personagens', error);
        }
      );
    } else {
      this.characters = [];
    }
  }

   // Método para ir para uma página específica
   goToPage(page: number): void {
    this.currentPage = page;
    this.offset = (page - 1) * this.limit;
    this.searchCharacters();
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
