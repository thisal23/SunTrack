const role = (requiredRole) => {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

module.exports = roleMiddleware;const { User, Role } = require('../models');

const roleMiddleware= (requiredRole) => {
  return async (req, res, next) => {const { User, Role } = require('../models');

const roleMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id, { include: 'role' });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.role.name !== requiredRole) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
};

module.exports = roleMiddleware;
    try {
      const user = await User.findByPk(req.user.id, { include: 'role' });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (user.role.name !== requiredRole) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };
};

module.exports = roleMiddleware;