import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FooterService {
  private footerTopSource = new BehaviorSubject<number | undefined>(undefined);
  footerTop$ = this.footerTopSource.asObservable();

  public setFooterTop(top: number | undefined): void {
    this.footerTopSource.next(top);
  }
}
