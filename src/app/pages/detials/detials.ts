import { Component, inject, signal } from '@angular/core';
import { ApiService, User } from '../../services/api-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-detials',
  imports: [],
  templateUrl: './detials.html',
  styleUrl: './detials.scss'
})
export class Detials {
  private route = inject(ActivatedRoute);
  private service = inject(ApiService)

  private userSignal = signal<User | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  user = this.userSignal//.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();

   ngOnInit(){
    this.loadingSignal.set(true);

     this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;

      this.service.getUserByID(id)
      .subscribe({
        next: (sub) => {
          console.log('user:', sub)
          this.userSignal.set(sub.data)
          console.log(' this.userSignal:',  this.userSignal())
          this.loadingSignal.set(false);
          this.errorSignal.set(null);
        },
        error: (err) => {
          console.log('error:', err)
          this.errorSignal.set(err.message);
          this.loadingSignal.set(false);
        }
      })

     })
   
    
  }

}
