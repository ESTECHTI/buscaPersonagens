import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MarvelService } from '../service/marvel.service';
import * as CryptoJS from 'crypto-js';

describe('MarvelService', () => {
  let service: MarvelService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MarvelService]
    });
    service = TestBed.inject(MarvelService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate correct hash', () => {
    const ts = '1234567890';
    const publicKey = '4a8930993ac6a30bef5b5b05dd0f0172';
    const privateKey = '16aea37008d78c15f719f324176601cc9abd4e94';

    // Calcular o hash esperado usando os valores conhecidos
    const expectedHash = CryptoJS.MD5(ts + privateKey + publicKey).toString();

    // @ts-ignore (para acessar o método privado para teste)
    const generatedHash = service['generateHash'](ts);

    expect(generatedHash).toBe(expectedHash);
  });

  it('should make a GET request to fetch comics', () => {
    const mockResponse = { data: { results: [] } };

    service.getComics().subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(request =>
      request.url.includes('/comics') &&
      request.method === 'GET' &&
      request.params.has('ts') &&
      request.params.has('apikey') &&
      request.params.has('hash')
    );

    expect(req.request.url).toContain('https://gateway.marvel.com/v1/public/comics');
    req.flush(mockResponse);
  });

  it('should make a GET request to search characters', () => {
    const mockResponse = { data: { results: [] } };
    const searchQuery = 'Spider';
    const limit = 10;
    const offset = 0;

    service.searchCharacters(searchQuery, limit, offset).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(request =>
      request.url.includes('/characters') &&
      request.method === 'GET' &&
      request.params.get('nameStartsWith') === searchQuery &&
      request.params.get('limit') === limit.toString() &&
      request.params.get('offset') === offset.toString() &&
      request.params.has('ts') &&
      request.params.has('apikey') &&
      request.params.has('hash')
    );

    expect(req.request.url).toContain('https://gateway.marvel.com/v1/public/characters');
    req.flush(mockResponse);
  });
});
