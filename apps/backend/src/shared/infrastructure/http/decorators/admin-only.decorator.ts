import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from './roles.decorator';
import { RolesGuard } from './roles.guard';

export const AdminOnly = () => applyDecorators(UseGuards(RolesGuard), Roles('admin'), ApiBearerAuth());
