import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

// Creamos el decorador 'User'
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest(); // Accedemos a la solicitud HTTP

    if (!request.user) {
      throw new InternalServerErrorException('User not found'); // Si no hay usuario en la solicitud, retornamos null
    }

    return request.user; // Retornamos el usuario que fue añadido al request por el guard
  },
);
