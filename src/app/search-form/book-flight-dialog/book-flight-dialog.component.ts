import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-book-flight-dialog',
  templateUrl: './book-flight-dialog.component.html',
  styleUrls: ['./book-flight-dialog.component.css']
})
export class BookFlightDialogComponent implements OnInit {

    public form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<BookFlightDialogComponent>,
        private fb: FormBuilder,
        @Inject(MAT_DIALOG_DATA) public data,
    ) {}

    // show a form in a dialog for user to fill in personal information
    ngOnInit() {
        this.form = this.fb.group({
            title: "",
            name: [
                "",
                { validators: Validators.required },
            ],
            surname: [
                "",
                { validators: Validators.required },
            ],
            id_number: [
                "",
                { validators: Validators.required },
            ],
        });
    }

    // store the flight data and personal data
    submit() {
        const form = this.form.value;
        const data = Object.assign({}, form, this.data)

        this.dialogRef.close(data);
    }

    onNoClick(): void {
        this.dialogRef.close();
    }
}
