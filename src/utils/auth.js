export const MAIL_REGEXP = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const PASSWORD_REGEXP = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&:_.])[A-Za-z\d@$!%*#?&:_.]{8,}$/;
export const OTP_REGEXP = /^[0-9]{6}$/;
export const getPasswordValidationInfo = (pwd) => ({
  uppercase: /(?=[A-Z])/.test(pwd),
  lowercase: /(?=[a-z])/.test(pwd),
  special: /(?=[@$!%*#?&:_.])/.test(pwd),
  integer: /(?=\d)/.test(pwd),
  length: /[A-Za-z\d@$!%*#?&:_.]{8,}/.test(pwd),
});
