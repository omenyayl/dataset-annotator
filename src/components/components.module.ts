import { NgModule } from '@angular/core';
import { InplaceInputComponent } from './inplace-input/inplace-input';
import { AnnotatorComponent } from './annotator/annotator';
import { ObjectInputComponent } from './object-input/object-input';
@NgModule({
	declarations: [InplaceInputComponent,
    AnnotatorComponent,
    ObjectInputComponent],
	imports: [],
	exports: [InplaceInputComponent,
    AnnotatorComponent,
    ObjectInputComponent]
})
export class ComponentsModule {}
