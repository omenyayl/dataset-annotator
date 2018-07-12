import { NgModule } from '@angular/core';
import { InplaceInputComponent } from './inplace-input/inplace-input';
import { AnnotatorComponent } from './annotator/annotator';
@NgModule({
	declarations: [InplaceInputComponent,
    AnnotatorComponent],
	imports: [],
	exports: [InplaceInputComponent,
    AnnotatorComponent]
})
export class ComponentsModule {}
