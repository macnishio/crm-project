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

    // 縺薙％縺ｧ螳滄圀縺ｮ繝代・繝溘ャ繧ｷ繝ｧ繝ｳ繝√ぉ繝・け繝ｭ繧ｸ繝・け繧貞ｮ溯｣・
    // 萓・ 繝ｦ繝ｼ繧ｶ繝ｼ縺ｮ蠖ｹ蜑ｲ縺ｫ蝓ｺ縺･縺・※繝代・繝溘ャ繧ｷ繝ｧ繝ｳ繧堤｢ｺ隱・
    const hasPermission = user.roles.includes('admin') || user.roles.includes(permission);

    if (!hasPermission) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
}
}
