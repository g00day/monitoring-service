export interface ValidationErrorElement {
  loc: (string | number)[];
  msg: string;
  type: string;
}

export interface ApiErrorResponse {
  detail: string | ValidationErrorElement[];
}