import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms'; // reactive form import
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

@Component({
  selector: 'input-user-data-form',
  templateUrl: './input-user-data-form.component.html',
  styleUrls: ['./input-user-data-form.component.css']
})

export class InputUserDataFormComponent implements OnInit {
	registered = false;
	submitted = false;
	userForm: FormGroup; // name your reactive form with its type "FormGroup"
	city: Array<String> = ['New York', 'San Francisco', 'Chicago', 'Houston'];  // ===========================
	guid: string;
	serviceErrors:any = {};

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private router: Router)
  {
  	this.http.get('/api/v1/generate_uid').subscribe((data:any) => {
      this.guid = data.guid;
    }, error => {
        console.log("There was an error generating the proper GUID on the server", error);
    });
  }

  invalidFirstName()
  {
  	return (this.submitted && (this.serviceErrors.first_name != null || this.userForm.controls.first_name.errors != null));
  }

  invalidLastName()
  {
  	return (this.submitted && (this.serviceErrors.last_name != null || this.userForm.controls.last_name.errors != null));
  }

  invalidEmail()
  {
  	return (this.submitted && (this.serviceErrors.email != null || this.userForm.controls.email.errors != null));
  }

  // Changes ====================
  invalidCity()
  {
	return (this.submitted && (this.serviceErrors.city != null || this.userForm.controls.city.errors != null))
  }
  // Changes ====================

  invalidZipcode()
  {
  	return (this.submitted && (this.serviceErrors.zipcode != null || this.userForm.controls.zipcode.errors != null));
  }

  invalidPassword()
  {
  	return (this.submitted && (this.serviceErrors.password != null || this.userForm.controls.password.errors != null));
  }





  ngOnInit()
  {
  	this.userForm = this.formBuilder.group({
  		first_name: ['', [Validators.required, Validators.maxLength(50)]],
  		last_name: ['', [Validators.required, Validators.maxLength(50)]],
  		email: ['', [Validators.required, Validators.email, Validators.maxLength(75)]],
		city: [null, Validators.required], // changes ==============
  		zipcode: ['', [Validators.required, Validators.pattern('^[0-9]{5}(?:-[0-9]{4})?$')]],
  		password: ['', [Validators.required, Validators.minLength(5), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')]],
  	});
  }

  onSubmit()
  {
	console.log(this.userForm)

  	this.submitted = true;

  	if(this.userForm.invalid == true)
  	{
  		return;
  	}
  	else
  	{
  		let data: any = Object.assign({guid: this.guid}, this.userForm.value);

  		this.http.post('/api/v1/customer', data).subscribe((data:any) => {
	      
	      let path = '/user/' + data.customer.uid;

	      this.router.navigate([path]);
	    }, error =>
	    {
	    	this.serviceErrors = error.error.error;
        });

  		this.registered = true;

  	}
  }

};