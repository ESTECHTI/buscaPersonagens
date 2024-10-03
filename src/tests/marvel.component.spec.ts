import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AppComponent } from '../app/marvel.component';
import { MarvelService } from '../service/marvel.service';
import { of } from 'rxjs';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let marvelServiceSpy: jasmine.SpyObj<MarvelService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MarvelService', ['getComics']);

    TestBed.configureTestingModule({
      declarations: [ AppComponent ],
      providers: [
        { provide: MarvelService, useValue: spy }
      ]
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    marvelServiceSpy = TestBed.inject(MarvelService) as jasmine.SpyObj<MarvelService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load comics on init', () => {
    const mockComics = { data: { results: [{ id: 1, title: 'Comic 1' }, { id: 2, title: 'Comic 2' }] } };
    marvelServiceSpy.getComics.and.returnValue(of(mockComics));

    component.ngOnInit();

    expect(marvelServiceSpy.getComics).toHaveBeenCalled();
    expect(component.comics.length).toBe(2);
    expect(component.filteredComics.length).toBe(2);
    expect(component.isLoading).toBeFalse();
  });

  it('should update paginated comics', () => {
    component.filteredComics = [
      { id: 1, title: 'Comic 1' },
      { id: 2, title: 'Comic 2' },
      { id: 3, title: 'Comic 3' },
      { id: 4, title: 'Comic 4' },
      { id: 5, title: 'Comic 5' }
    ];
    component.itemsPerPage = 2;
    component.currentPage = 2;

    component.updatePaginatedComics();

    expect(component.paginatedComics.length).toBe(2);
    expect(component.paginatedComics[0].title).toBe('Comic 3');
    expect(component.paginatedComics[1].title).toBe('Comic 4');
    expect(component.totalPages).toBe(3);
  });

  it('should search characters', fakeAsync(() => {
    component.comics = [
      { id: 1, title: 'Spider-Man' },
      { id: 2, title: 'Iron Man' },
      { id: 3, title: 'Captain America' }
    ];
    component.searchQuery = 'man';

    component.searchCharacters();
    tick(500);

    expect(component.filteredComics.length).toBe(2);
    expect(component.filteredComics[0].title).toBe('Spider-Man');
    expect(component.filteredComics[1].title).toBe('Iron Man');
    expect(component.currentPage).toBe(1);
    expect(component.isLoading).toBeFalse();
  }));

  it('should navigate pages', () => {
    component.filteredComics = new Array(10).fill({});
    component.itemsPerPage = 4;
    component.updatePaginatedComics();

    component.nextPage();
    expect(component.currentPage).toBe(2);

    component.previousPage();
    expect(component.currentPage).toBe(1);

    component.fastForward();
    expect(component.currentPage).toBe(3);

    component.fastBackward();
    expect(component.currentPage).toBe(1);

    component.goToPage(2);
    expect(component.currentPage).toBe(2);
  });
});
