// src/context/homeGuestState.js
export const initialState = {
  username: {
    value: "",
    hasError: false,
    message: "",
    isUnique: false,
    checkCount: 0
  },
  email: {
    value: "",
    hasError: false,
    message: "",
    isUnique: false,
    checkCount: 0
  },
  password: {
    value: "",
    hasError: false,
    message: ""
  },
  submitCount: 0
};

export function reducer(draft, action) {
  switch (action.type) {
    case "usernameImmediate":
      draft.username.hasError = false;
      draft.username.value = action.value;
      if (draft.username.value.length > 10) {
        draft.username.hasError = true;
        draft.username.message = "Username cannot exceed 10 characters.";
      }
      if (draft.username.value && !/^([a-zA-Z0-9]+)$/.test(draft.username.value)) {
        draft.username.hasError = true;
        draft.username.message = "Username can only contain letters and numbers.";
      }
      return;

    case "usernameAfterDelay":
      if (draft.username.value.length < 3) {
        draft.username.hasError = true;
        draft.username.message = "Username must be at least 3 characters.";
      }
      if (!draft.username.hasError && !action.noRequest) {
        draft.username.checkCount++;
      }
      return;

    case "usernameUniqueResults":
      if (action.value) {
        draft.username.hasError = true;
        draft.username.isUnique = false;
        draft.username.message = "That username is already taken.";
      } else {
        draft.username.isUnique = true;
      }
      return;

    case "emailImmediate":
      draft.email.hasError = false;
      draft.email.value = action.value;
      return;

    case "emailAfterDelay":
      if (!/^\S+@\S+$/.test(draft.email.value)) {
        draft.email.hasError = true;
        draft.email.message = "You must provide a valid email address.";
      }
      if (!draft.email.hasError && !action.noRequest) {
        draft.email.checkCount++;
      }
      return;

    case "emailUniqueResults":
      if (action.value) {
        draft.email.hasError = true;
        draft.email.isUnique = false;
        draft.email.message = "That email is already being used.";
      } else {
        draft.email.isUnique = true;
      }
      return;

    case "passwordImmediate":
      draft.password.hasError = false;
      draft.password.value = action.value;
      if (draft.password.value.length > 10) {
        draft.password.hasError = true;
        draft.password.message = "Password cannot exceed 10 characters.";
      }
      return;

    case "passwordAfterDelay":
      if (draft.password.value.length < 10) {
        draft.password.hasError = true;
        draft.password.message = "Password must be at least 10 characters.";
      }
      return;

    case "submitForm":
      if (
        !draft.username.hasError &&
        draft.username.isUnique &&
        !draft.email.hasError &&
        draft.email.isUnique &&
        !draft.password.hasError
      ) {
        draft.submitCount++;
      }
      return;

    default:
      return;
  }
}
