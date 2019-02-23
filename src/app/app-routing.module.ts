import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { GuideViewerComponent } from './guide-viewer/guide-viewer.component';

const routes: Routes = [
	{ path:'search',component: SearchComponent },
	{ path:'',redirectTo:'/search',pathMatch:'full' },
	{ path:'published/:userId/:key',component: GuideViewerComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
