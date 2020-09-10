import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { BulkUploadCVComponent } from './bulk-upload-cv.component';

const routes: Routes = [
    {
        path: 'bulk-upload',
        component: BulkUploadCVComponent
    }
];

@NgModule({
    declarations: [],
    imports: [CommonModule, RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class BulkUploadCVRoutingModule { }
