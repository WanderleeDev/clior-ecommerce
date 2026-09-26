import { Controller, Get } from '@nestjs/common';
import { Public } from '../../shared/infrastructure/http/decorators/public.decorator';

@Controller('health')
@Public()
export class HealthController {
  @Get()
  check() {
    return { status: 'ok' };
  }
}
