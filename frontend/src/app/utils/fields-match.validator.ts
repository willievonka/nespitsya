import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';


/**
 * Validator function to check if the value of the current control matches the value of the target field.
 * @param targetFieldName - The name of the field to compare with.
 * @returns A ValidatorFn that returns an error object if the values do not match, or null otherwise.
 */
export function fieldsMatchValidator(fieldToMatchName: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        if (!control.parent) {
            return null;
        }
        const fieldValue: AbstractControl<string> | null = control.value;
        const fieldToMatchValue: AbstractControl<string> | null = control.parent.get(fieldToMatchName)?.value;
        
        return fieldValue === fieldToMatchValue ? null : { fieldsNotMatched: true };
    };
}