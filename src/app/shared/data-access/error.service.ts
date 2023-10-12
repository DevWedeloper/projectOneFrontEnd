import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
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
