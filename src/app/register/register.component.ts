import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserService } from '@app/_services';

@Component({ templateUrl: 'register.component.html' })
export class RegisterComponent implements OnInit {
    registrationForm: FormGroup;
    loading = false;
    submitted = false;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService
    ) {}

    ngOnInit() {
        this.registrationForm = this.formBuilder.group({
            username: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.registrationForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.registrationForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.register(this.f.username.value, this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    // get return url from route parameters or default to '/'
                    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
                    this.router.navigate([returnUrl]);
                },
                error: error => {
                    this.error = error;
                    this.loading = false;
                }
            });
    }
}
