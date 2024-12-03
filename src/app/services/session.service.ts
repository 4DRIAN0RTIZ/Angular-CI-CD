import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import CryptoJS from 'crypto-js';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private cookieKey = 'userData';
  private encryptionKey = 'D3m0P@$$w0rd';
  private userDataSubject = new BehaviorSubject<any>(this.getUserData());
  userData$ = this.userDataSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Encripta un texto.
   */
  private encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.encryptionKey).toString();
  }

  /**
   * Desencripta un texto.
   */
  private decrypt(encryptedText: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedText, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  /**
   * Guarda los datos del usuario en una cookie.
   */
  setUserData(data: any, expiresInDays: number = 7): void {
    this.clearUserData(); // Limpia datos previos
    const encryptedData = this.encrypt(JSON.stringify(data));
    const date = new Date();
    date.setTime(date.getTime() + expiresInDays * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${this.cookieKey}=${encodeURIComponent(
      encryptedData
    )}; ${expires}; path=/`;
    this.userDataSubject.next(data);
  }

  /**
   * Recupera los datos del usuario desde la cookie.
   * Devuelve un objeto con el token encriptado y desencriptado.
   */
  getUserData(): any {
    const cookies = document.cookie.split('; ');
    const userDataCookie = cookies.find((cookie) =>
      cookie.startsWith(`${this.cookieKey}=`)
    );
    if (userDataCookie) {
      const encryptedData = userDataCookie.split('=')[1];
      const decryptedData = this.decrypt(decodeURIComponent(encryptedData));
      return {
        encryptedToken: encryptedData,
        decryptedToken: JSON.parse(decryptedData),
      };
    }
    return null;
  }

  /**
   * Elimina los datos del usuario de la cookie.
   */
  clearUserData(): void {
    document.cookie = `${this.cookieKey}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
    this.userDataSubject.next(null); // Actualiza el BehaviorSubject
  }

  /**
   * Valida la sesión del usuario con la API.
   */
  validateSession(
    login: string,
    version: string,
    token: string
  ): Observable<any> {
    const url = `api/session/${login}/${version}/${token}`;
    return this.http.get(url);
  }
}
