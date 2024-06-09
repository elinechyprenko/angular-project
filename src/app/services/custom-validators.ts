import { AbstractControl, ValidationErrors } from "@angular/forms";

export function emailValidator(control: AbstractControl): { [key: string]: any } | null {
    let value = control.value;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const result = emailRegex.test(value);
    return new Promise((resolve) => {
        if (result) {
            return resolve(null);
        }
        else {
            return resolve({ emailValidator: value })
        }
    })
};
export function passwordValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    const value = control.value;
    const passwordRegEx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[ -/:-@\[-`{-~]).{9,30}$/;

    const result = passwordRegEx.test(value);
    return new Promise((resolve) =>
        setTimeout(() => {
            if (result) {
                return resolve(null);
            }
            else {
                return resolve({ passwordValidator: value });
            }
        }, 0))
};
export function passwordMatchValidator(controlName: string): (control: AbstractControl) => Promise<ValidationErrors | null> {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {
        return new Promise((resolve) =>
            setTimeout(() => {
                const password = control.root.get('password');
                const confirmPassword = control.root.get('confirmPassword');
                if (password?.value !== confirmPassword?.value) {
                    return resolve({ passwordMismatch: true })
                }
                else {
                    return resolve(null);
                }
            }, 0)
        )
    }
};

export function birthdayValidator(control: AbstractControl): Promise<ValidationErrors | null> {
    const value = new Date(control.value);
    const today = new Date();
    const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    return new Promise((resolve) => {
        setTimeout(() => {
            if (value >= eighteenYearsAgo) {
                return resolve({ birthdayValidator: value });
            }
            return resolve(null);

        }, 0)
    })

}

