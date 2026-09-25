import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import type { ApiResponseMetadata } from '@nestjs/swagger';

export const ApiResponses = (...responses: ApiResponseMetadata[]) =>
  applyDecorators(...responses.map((response) => ApiResponse(response)));
