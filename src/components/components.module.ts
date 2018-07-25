import { NgModule } from '@angular/core';
import { AnnotatorComponent } from './annotator/annotator';
import { ObjectInputComponent } from './object-input/object-input';
import { ActionInputComponent } from './action-input/action-input';
import { GenericInputComponent } from './generic-input/generic-input';
@NgModule({
	declarations: [
    AnnotatorComponent,
    ObjectInputComponent,
    ActionInputComponent,
    GenericInputComponent],
	imports: [],
	exports: [
    AnnotatorComponent,
    ObjectInputComponent,
    ActionInputComponent,
    GenericInputComponent]
})
export class ComponentsModule {}
