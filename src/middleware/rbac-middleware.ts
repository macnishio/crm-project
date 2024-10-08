import { Request, Response, NextFunction } from 'express';

interface User {
  roles: string[];
}

export function rbacMiddleware(requiredRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User | undefined;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const hasRequiredRole = requiredRoles.some(role => user.roles.includes(role));

    if (!hasRequiredRole) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
}

export function checkPermission(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as User | undefined;

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // ここで実際のパ�EミッションチェチE��ロジチE��を実裁E
    // 侁E ユーザーの役割に基づぁE��パ�Eミッションを確誁E
    const hasPermission = user.roles.includes('admin') || user.roles.includes(permission);

    if (!hasPermission) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
}
}
