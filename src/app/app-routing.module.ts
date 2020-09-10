import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './shared/components';
import { navbarRoute } from './layouts';
import { HomeRoutingModule } from './home/home-routing.module';
import { BulkUploadCVRoutingModule } from "./cvupload/bulk-upload-cv-routing.module"

const LAYOUT_ROUTES = [navbarRoute];

const routes: Routes = [
  ...LAYOUT_ROUTES,
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    HomeRoutingModule,
    BulkUploadCVRoutingModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
