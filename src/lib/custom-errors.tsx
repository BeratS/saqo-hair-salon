export const errorMessages = (message?: string, defaultMessage?: string) => {
  switch (message) {
    case 'Firebase: Error (auth/invalid-credential).':
      return 'Incorrect username or password. Please try again!';

    case 'Internal server error':
    case 'Request failed with status code 500':
    case 'Request failed with status code 404':
      return 'An server error occurred!';
    
    case 'Request failed with status code 401':
      return 'Authentication token expired';
    
    case 'Network Error':
      return 'An error occurred while connecting to the server. Please check your internet connection and try again!';

    default:
      return !message ? defaultMessage || message : message;
  }
}

export const generalErrorMessage = (message?: string) => errorMessages(message, MESSAGES.GENERAL)

export const MESSAGES = {
  GENERAL: "Error: Something went wrong. Please try again!",
  AUTH_FAIL: 'Failed authenticating user.',
  USER_NOT_EXISTS: "User does not exists!",
}