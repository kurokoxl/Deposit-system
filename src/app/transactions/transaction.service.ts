import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NgForm } from '@angular/forms';
import { MessageService } from 'primeng/api';

export interface Transaction {
  id?: string;
  bankName: string;
  amount: number;
  category: string;
  date: Date; // Use string to match your JSON date format
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'https://balance-management-c8120-default-rtdb.firebaseio.com/Q5Ahwz1DUzOW8faTQQqKHlQcSOB2/transactions.json';

  constructor(private http: HttpClient, private messageService: MessageService) { }

  getTransactions(): Observable<{ [key: string]: Transaction }> {
    return this.http.get<{ [key: string]: Transaction }>(this.apiUrl);
  }

  saveTransaction(newTransaction: Partial<Transaction>): Observable<any> {
    return this.http.post(this.apiUrl, newTransaction);
  }

  
  deleteTransaction(transactionId: string): Observable<any> {
    const url = `https://balance-management-c8120-default-rtdb.firebaseio.com/Q5Ahwz1DUzOW8faTQQqKHlQcSOB2/transactions/${transactionId}.json`; // Construct URL with transaction ID
    return this.http.delete(url);
  }
  updateTransaction(id: string, transaction: Transaction): Observable<any> {
    return this.http.put(`https://balance-management-c8120-default-rtdb.firebaseio.com/Q5Ahwz1DUzOW8faTQQqKHlQcSOB2/transactions/${id}.json`, transaction);
  }
}
