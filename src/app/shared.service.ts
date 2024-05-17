import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { LoginComponent } from './login/login.component';
import { BehaviorSubject, Observable, map, of, switchMap } from 'rxjs';
import { user } from '@angular/fire/auth';
export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyC3ETczZCrsjdMGk-fA7vrB0XpLIHqjZvc",
    authDomain: "balance-management-c8120.firebaseapp.com",
    databaseURL: "https://balance-management-c8120-default-rtdb.firebaseio.com",
    projectId: "balance-management-c8120",
    storageBucket: "balance-management-c8120.appspot.com",
    messagingSenderId: "666644016549",
    appId: "1:666644016549:web:742b54fe1433b28f9d8c4c"
  }
};
@Injectable({
  providedIn: 'root'
})
export class SharedService {
  
   loggedInSubject = new BehaviorSubject<boolean>(false); // Observable for login state
  isLoggedIn$ = this.loggedInSubject.asObservable();
  email!: string | null;
  userId: string | null = null;
  constructor(private afAuth: AngularFireAuth,private http:HttpClient) {
    
  this.afAuth.authState.subscribe(user => {
      if (user) {
        this.email=user.email;
        console.log(this.email)
        console.log(user.uid);
        
        this.userId = user.uid;
        this.loggedInSubject.next(true);
        // Update login state

      } else {
        this.userId = null;
        this.loggedInSubject.next(false); // Update login state
      }
    });
  }
  isSuperAdmin$(): Observable<boolean> {
    // Use switchMap to switch to another observable based on the current user's authentication status
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (!user) {
          // If user is not authenticated, return false
          return of(false);
        } else {
          // If user is authenticated, check if they have super admin privileges
          // Implement your logic to determine super admin status here
          // For example, check if user email matches a predefined super admin email
          return this.checkIfSuperAdmin(user);
        }
      })
    );
  }
   checkIfSuperAdmin(user: firebase.default.User): Observable<boolean> {
    // Implement your logic here to check if the user is a super admin
    // For example, you can compare the user's email with a predefined super admin email
    const superAdminEmail = 'admin@gmail.com'; // Replace with your super admin email
    return of(user.email === superAdminEmail);
  }
  isSuperOrBank(): Observable<boolean> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (!user) {
          console.log("first");
          // If user is not authenticated, return false
          return of(false);
        } else {
          console.log("nnnniggaa");
          return this.checkIfSuperAdmin(user);
        }
      })

    );
  }
  getPost() {
    return this.http.get(
      'https://balance-management-c8120-default-rtdb.firebaseio.com/userData.json'
    );
  }
  createNewUser(value:any,userId:any){
    this.http.put(`https://balance-management-c8120-default-rtdb.firebaseio.com/${userId}/Balance.json`
    ,
    0
    ).subscribe((res)=>{
      console.log(res)
  });
    this.http.put(`https://balance-management-c8120-default-rtdb.firebaseio.com/${userId}/userType.json`
    ,
    value
    ).subscribe((res)=>{
        console.log(res)
    });
   

  }
  saveUserIncome(income: number) {
      const data=income;

      this.http.put(`https://balance-management-c8120-default-rtdb.firebaseio.com/${this.userId}/income.json`
      ,
      data
      ).subscribe((res)=>{
          console.log(res)
          console.log(this.userId+"useeeridddd")
      });   return; 
    } 

  getUserIncome() {
    console.log(this.userId);
    const url = `https://balance-management-c8120-default-rtdb.firebaseio.com/userData/${this.userId}.json`;
    return this.http.get(url);
    
  }
  logout() {
    return this.afAuth.signOut().then(() => {
      console.log('User logged out successfully');
      this.loggedInSubject.next(false); // Update login state after logout
    }).catch(error => {
      console.error('Error logging out:', error);
    });
  }
}



//   signupDB(email:string,password:string){
//     this.getPost();

//     const data = {
//       email: email,
//       password: password,
//     };
    
    // this.http.post('https://budget-tracking-website-8ec2c-default-rtdb.europe-west1.firebasedatabase.app/userData.json'
    // ,
    // data
    // ).subscribe((res)=>{
    //     console.log(res)
    // });
  