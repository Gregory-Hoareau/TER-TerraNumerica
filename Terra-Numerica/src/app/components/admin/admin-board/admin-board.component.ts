import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal, { SweetAlertOptions } from 'sweetalert2';

@Component({
  selector: 'app-admin-board',
  templateUrl: './admin-board.component.html',
  styleUrls: ['./admin-board.component.scss']
})
export class AdminBoardComponent implements OnInit {
  
  // const string of type that are available to be selected
  public ADD_GRAPH = 'add-graph';
  public DASHBOARD = 'dashboard';

  public type = this.ADD_GRAPH; // possible value are: 'dashboard', 'add-graph'

  private PASSWORD = 'admin';

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.tryToAccess();
  }

  selectDisplay(type) {
    this.type = type;
  }

  isSelected(type) {
    return this.type === type ? 'selected' : '';
  }

  private tryToAccess(error = false) {
    let options: SweetAlertOptions = {
      title: 'Accès au panneau d\'administration.',
      text: 'Veuillez saissir le mot de passe pour accèder au panneau d\'administration du site.',
      input: 'password',
      inputPlaceholder: 'Mot de passe',
      confirmButtonText: 'Valider',
      confirmButtonColor: 'purple',
      showCancelButton: true,
      cancelButtonText: 'Retour au menu',
      cancelButtonColor: 'rgb(190,0,0)',
      allowOutsideClick: false
    }
    if(error) 
      options.footer = '<span style="color: red;">Le mot de passe saissi est incorrect.</span>';

    Swal.fire(options).then((result) => {
      console.log(result)
      if(result.isConfirmed) {
        if(!this.checkPassword(result.value)) {
          this.tryToAccess(true)
        } else {
          Swal.fire('Accès autorisé', '', 'success')
        }
      } else if(result.isDismissed || result.isDenied) {
        this.router.navigate(['/'])
      }
    })
  }

  /**
   * Cette fonction vérifier si le mot de passe passer en paramètre est correct. Si le mot de passe est correct la fonction renvoie 'true'
   * sinon la fonction renvoie false
   * 
   * @param pwd mot de passe saissie par l'utilisateur
   */
  private checkPassword(pwd) {
    return pwd === this.PASSWORD;
  }

}
