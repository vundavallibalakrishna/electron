import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BulkUploadCVRoutingModule } from './bulk-upload-cv-routing.module';
import { GooglePlaceModule } from "ngx-google-places-autocomplete";

import { BulkUploadCVComponent } from './bulk-upload-cv.component';
import { SharedModule } from '../shared/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import {
  MatAutocompleteModule
} from '@angular/material/autocomplete';
import {
  MatInputModule
} from '@angular/material/input';
import {
  MatFormFieldModule
} from '@angular/material/form-field';
import {
  MatChipsModule
} from '@angular/material/chips';
import {
  MatSlideToggleModule
} from '@angular/material/slide-toggle'
import {
  MatProgressBarModule
} from '@angular/material/progress-bar'
import {
  MatProgressSpinnerModule
} from '@angular/material/progress-spinner'

import { MatIconModule } from '@angular/material/icon';


@NgModule({
  declarations: [BulkUploadCVComponent],
  imports: [CommonModule, SharedModule, FormsModule, ReactiveFormsModule, BulkUploadCVRoutingModule, FlexLayoutModule, GooglePlaceModule, MatInputModule,
    MatAutocompleteModule,
    MatFormFieldModule, MatChipsModule, MatIconModule, MatSlideToggleModule, MatProgressBarModule, MatProgressSpinnerModule]
})
export class BulkUploadCVModule { }
