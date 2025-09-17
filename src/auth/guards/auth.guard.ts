import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { Request } from 'express';
import { firstValueFrom } from 'rxjs';
import { NATS_SERVICE } from 'src/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  // Este método se ejecuta antes de acceder a cualquier ruta protegida
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    // Si no hay token, se lanza una excepción de no autorizado
    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      // Añadimos el payload al objeto de la solicitud para usarlo en controladores

      const { user, token: newToken } = await firstValueFrom(
        this.client.send('auth.verify.user', token),
      );

      request['user'] = user;
      request['token'] = newToken;
    } catch {
      // Si hay un error al verificar el token, lanzamos una excepción
      throw new UnauthorizedException();
    }

    return true;
  }

  // Método para extraer el token de los headers de la solicitud
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
