import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface BudgetItem {
  title: string;
  budget: number;
}

export interface IncomeItem {
  title: string;
  amount: number;
}

export interface BudgetResponse {
  myBudget: BudgetItem[];
  income: IncomeItem[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _data: BudgetResponse | null = null;

  constructor(private http: HttpClient) {}

  getData(): Observable<BudgetResponse> {
    if (this._data) {
      return of(this._data);
    } else {
      return this.http.get<BudgetResponse>('http://localhost:3000/budget')
        .pipe(
          tap(res => this._data = res)
        );
    }
  }
}

