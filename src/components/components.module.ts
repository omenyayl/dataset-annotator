import { NgModule } from '@angular/core';
import { InplaceInputComponent } from './inplace-input/inplace-input';
import { AnnotatorComponent } from './annotator/annotator';
import { ObjectInputComponent } from './object-input/object-input';
import { ActionInputComponent } from './action-input/action-input';
@NgModule({
	declarations: [InplaceInputComponent,
    AnnotatorComponent,
    ObjectInputComponent,
    ActionInputComponent],
	imports: [],
	exports: [InplaceInputComponent,
    AnnotatorComponent,
    ObjectInputComponent,
    ActionInputComponent]
})
export class ComponentsModule {}
