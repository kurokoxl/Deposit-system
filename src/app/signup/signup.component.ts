import { Component, OnInit } from '@angular/core';
import { EmailValidator, NgForm } from '@angular/forms';
import { SharedService } from '../shared.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {
 
  constructor(private messageService:MessageService,private router:Router,private sharedService:SharedService,private afAuth: AngularFireAuth){}
  ngOnInit(){
    this.sharedService.logout();

  }
  async onSingup(form:NgForm){
    if (form.valid){
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(form.value.email,form.value.password);
      const result2 = await this.afAuth.signInWithEmailAndPassword(form.value.email, form.value.password);
      this.router.navigate(['/dashboard']); // Redirect to dashboard

      console.log('Sign up successful!', result);
      // Optionally, you can navigate to another page or display a success message.
    } catch (error) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Email maybe invalid or already used' });

    }
  }
else{
  this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all the fields with right values' });

}
}
}
