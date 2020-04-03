import { createError } from 'apollo-errors';

export const MissingDataError = createError('MissingDataError', {
    message: 'Not all required fields are filled in.'
});
  
export const InvalidEmailError = createError('InvalidEmailError', {
    message: 'Given email is invalid.'
});

export const ResetTokenExpiredError = createError('ResetTokenExpiredError', {
    message: 'passwordResetToken expired.'
});

// export const PasswordTooShortError = createError('PasswordTooShortError', {
//     message: 'Password is too short.'
// });

export const UserNotFoundError = createError('UserNotFoundError', {
    message: 'No user found.'
});

export const InvalidEmailConfirmToken = createError(
'InvalidEmailConfirmToken',
{
    message: 'emailConfirmToken is invalid.'
}
);

export const EmailAlreadyVerified = createError('EmailAlreadyVerified', {
    message: 'User has already verified email.'
});

export const UserEmailExistsError = createError('UserEmailExistsError', {
    message: 'User already exists with this email.'
});

export const UserDeletedError = createError('UserDeletedError', {
    message: 'User has been deleted.'
});

export const UserEmailUnconfirmedError = createError(
'UserEmailUnconfirmedError',
{
    message: 'Users email has not been confirmed yet.'
}
);

// export const InvalidOldPasswordError = createError('InvalidOldPasswordError', {
//     message: 'Invalid old password.'
// });