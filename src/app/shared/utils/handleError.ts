import { toast } from 'ngx-sonner';
import { ToastCliorComponent } from '../components/toast-clior/toast-clior.component';

export function handlerError(e: unknown): void {
  let message = 'Unknown error, try again later.';

  if (e instanceof Error) {
    message = e.message;
  }

  toast(ToastCliorComponent, {
    componentProps: { message },
  });
}
