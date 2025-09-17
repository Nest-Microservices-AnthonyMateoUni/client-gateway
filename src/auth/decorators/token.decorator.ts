import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

// Creamos el decorador 'User'
export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest(); // Accedemos a la solicitud HTTP

    if (!request.token) {
      throw new InternalServerErrorException('Token not found'); // Si no hay usuario en la solicitud, retornamos null
    }

    return request.token; // Retornamos el usuario que fue añadido al request por el guard
  },
);
