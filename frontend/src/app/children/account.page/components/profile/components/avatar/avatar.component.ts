import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { TuiActiveZone, TuiObscured } from '@taiga-ui/cdk';
import { TuiButton, TuiDropdown } from '@taiga-ui/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { IUser } from '../../../../../../interfaces/user.interface';


@Component({
    selector: 'app-avatar',
    imports: [
        CommonModule,
        TuiAvatar,
        TuiButton,
        TuiDropdown,
        TuiActiveZone,
        TuiObscured,
    ],
    templateUrl: './avatar.component.html',
    styleUrl: './avatar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AvatarComponent {
    @Input()
    public user: IUser = {} as IUser;

    @ViewChild('fileInput') 
    public fileInput!: ElementRef<HTMLInputElement>;
    
    protected isOpenDropdown: boolean = false;
    
    protected readonly avatarChangeForm : FormGroup = new FormGroup({
        avatar: new FormControl(null),
    });
    protected avatarChangeError: string | null = null;

    /**
     * Toggles the dropdown open state.
     */
    protected onDropdownClick(): void {
        this.isOpenDropdown = !this.isOpenDropdown;
    }

    /**
     * Handles the obscured state of the dropdown.
     * @param obscured - A boolean indicating if the dropdown is obscured.
     */
    protected onObscured(obscured: boolean): void {
        if (obscured) {
            this.isOpenDropdown = false;
        }
    }

    /**
     * Handles the active zone state of the dropdown.
     * @param active - A boolean indicating if the dropdown is in the active zone.
     */
    protected onActiveZone(active: boolean): void {
        this.isOpenDropdown = active && this.isOpenDropdown;
    }

    /**
     * Handles the click event on the edit button to trigger the file input.
     * @param event - The click event.
     */
    protected onEditClick(event: Event): void {
        event.stopPropagation();
        this.fileInput.nativeElement.click();
    }

    /**
     * Handles the file input change event and updates the avatar form control.
     * @param event - The file input change event.
     */
    protected onFileSelected(event: Event): void {
        const input: HTMLInputElement = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file: File = input.files[0];
            this.avatarChangeForm.get('avatar')?.setValue(file);
        }
    }
}
