export const FORM_ERROR: { [key: string]: string } = {
  email: '',
  fullName: '',
  phone: '',
  birthday: '',
  password: '',
  confirmPassword: ''
};
export const VALIDATION_MESSAGE: { [key: string]: { [key: string]: string } } = {
  email: {
    required: 'Required field',
    emailValidator: 'Incorrect e-mail address format'
  },
  fullName: {
    required: 'Required field',
    minlength: 'There must be at least 5 characters',
    maxlength: 'There should be no more than 50 characters'
  },
  phone: {
    required: 'Required field',
    minlength: 'There must be at least 9 characters',
    maxlength: 'There should be no more than 12 characters'
  },
  birthday: {
    required: 'Required field',
    birthdayValidator: 'You must be 18 years or older to sign up'
  },
  password: {
    required: 'Required field',
    passwordValidator: 'Incorrect password format'
  },
  confirmPassword: {
    required: 'Required field',
    passwordMatchValidator: 'Passwords don`t match'
  }
}

export const RESERVATION_ERROR: { [key: string]: string } = {
  email: '',
  fullName: '',
  phone: '',
}
export const RESERVATION_MESSAGE: { [key: string]: { [key: string]: string } } = {
  email: {
    required: 'Required field',
    emailValidator: 'Incorrect e-mail address format'
  },
  fullName: {
    required: 'Required field',
    minlength: 'There must be at least 5 characters',
    maxlength: 'There should be no more than 50 characters'
  },
  phone: {
    required: 'Required field',
    minlength: 'There must be at least 9 characters',
    maxlength: 'There should be no more than 12 characters'
  }
};

export const DINING_ERROR: { [key: string]: string } = {
  email: '',
  fullName: '',
  phone: '',
  date: '',
  startTime: '',
  endTime: ''
};

export const DINING_MESSAGE: { [key: string]: { [key: string]: string } } = {
  email: {
    required: 'Required field',
    emailValidator: 'Incorrect e-mail address format'
  },
  fullName: {
    required: 'Required field',
    minlength: 'There must be at least 5 characters',
    maxlength: 'There should be no more than 50 characters'
  },
  phone: {
    required: 'Required field',
    minlength: 'There must be at least 9 characters',
    maxlength: 'There should be no more than 12 characters'
  },
  date: {
    required: 'Required field'
  },
  startTime: {
    required: 'Required field'
  },
  endTime: {
    required: 'Required field'
  },
  people: {
    required: 'Required field',
    min: 'There must be at least 15 people',
  }
}