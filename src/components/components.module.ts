import { NgModule } from '@angular/core';
import { AnnotatorComponent } from './annotator/annotator';
import { ObjectInputComponent } from './object-input/object-input';
import { ActionInputComponent } from './action-input/action-input';
@NgModule({
	declarations: [
    AnnotatorComponent,
    ObjectInputComponent,
    ActionInputComponent],
	imports: [],
	exports: [
    AnnotatorComponent,
    ObjectInputComponent,
    ActionInputComponent]
})
export class ComponentsModule {}
