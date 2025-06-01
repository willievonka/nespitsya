import { FormGroup, FormControl } from '@angular/forms';
import { IFilterTab } from '../../../types/filter-tab.interface';


/**
 * Sorts the given filter tabs alphabetically by their name in Russian locale.
 * @param tabs Array of filter tabs to sort.
 * @returns Sorted array of filter tabs.
 */
export function sortTabs(tabs: IFilterTab[]): IFilterTab[] {
    return (tabs ?? []).slice().sort((a, b) => a.name.localeCompare(b.name, 'ru'));
}

/**
 * Builds a FormGroup from the given filter tabs, mapping each tab's name to a FormControl with its checked value.
 * @param tabs Array of filter tabs to build the form from.
 * @returns FormGroup with controls for each tab.
 */
export function buildForm(tabs: IFilterTab[]): FormGroup {
    const group: Record<string, FormControl> = {};
    tabs.forEach(tab => {
        group[tab.name] = new FormControl(tab.checked);
    });

    return new FormGroup(group);
}

/**
 * Returns the names of selected tabs, excluding the "Выбрать все" tab.
 * @param form The FormGroup containing tab controls.
 * @param tabs The array of filter tabs.
 * @returns Array of selected tab names.
 */
export function getSelectedTabs(form: FormGroup, tabs: IFilterTab[]): string[] {
    return tabs
        .filter(tab => tab.name !== 'Выбрать все' && form.get(tab.name)?.value)
        .map(tab => tab.name);
}