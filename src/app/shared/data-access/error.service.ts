import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  handleValidSymbolError(error: HttpErrorResponse): boolean {
    return error.error.message.includes('failed: name: Path `name` is invalid');
  }

  handleMinLengthError(error: HttpErrorResponse): boolean {
    return error.error.message.includes('is shorter than the minimum allowed length (6).');
  }

  handleMaxLengthError(error: HttpErrorResponse): boolean {
    return error.error.message.includes('is longer than the maximum allowed length (20).');
  }

  handleDuplicateKeyError(error: HttpErrorResponse): boolean {
    return error.error.message.includes('E11000 duplicate key error');
  }

  handleAlreadyMemberError(error: HttpErrorResponse): boolean {
    return error.error.error.includes('Already a member of this guild');
  }
  
  handleNotFoundError(error: HttpErrorResponse): boolean {
    return error.error.error.includes('not found');
  }
}
