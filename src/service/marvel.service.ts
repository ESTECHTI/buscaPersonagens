import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as CryptoJS from 'crypto-js';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MarvelService {

  private publicKey = '4a8930993ac6a30bef5b5b05dd0f0172';
  private privateKey = '16aea37008d78c15f719f324176601cc9abd4e94';
  private baseUrl = 'https://gateway.marvel.com/v1/public';

  constructor(private http: HttpClient) {}

  // Função para gerar o hash MD5 necessário para autenticação
  private generateHash(ts: string): string {
    const hash = CryptoJS.MD5(ts + this.privateKey + this.publicKey).toString();
    return hash;
  }

  // Função para fazer a requisição GET
  getComics(): Observable<any> {
    const ts = new Date().getTime().toString();
    const hash = this.generateHash(ts);

    // Montando os parâmetros da requisição
    const params = new HttpParams()
      .set('ts', ts)
      .set('apikey', this.publicKey)
      .set('hash', hash);

    // Fazendo a requisição GET para a API da Marvel
    return this.http.get(`${this.baseUrl}/comics`, { params });
  }

   // Método para buscar personagens pelo nome, com paginação
   searchCharacters(searchQuery: string, limit: number, offset: number): Observable<any> {
    const ts = new Date().getTime().toString();
    const hash = this.generateHash(ts);

    // Montar os parâmetros da requisição
    let params = new HttpParams()
      .set('ts', ts)
      .set('apikey', this.publicKey)
      .set('hash', hash)
      .set('nameStartsWith', searchQuery)
      .set('limit', limit.toString())   // Quantos personagens por página
      .set('offset', offset.toString()); // Página atual (offset)

    return this.http.get(`${this.baseUrl}/characters`, { params });
  }
}
