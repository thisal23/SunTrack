const { User, Role, driverDetail } = require('../models');

const getAllUsers = async (req, res) => {
  try {

    let data = [];

    const users = await User.findAll({
      include: [
        { model: Role, as: 'role' },
        { model: driverDetail, as: 'detail' }
      ]
    });

    // users.forEach((_v, idx) => {
    //   data.push({
    //     fullname: _v.firstName + " " + _v.lastName
    //   })
    // })

    res.status(200).json({message: "Data fetched success", data:users});
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getUserById = async (req, res) => {
  try {

    const user = await User.findByPk(req.params.id, {
      include: [
        { model: Role, as: 'role' },
        { model: driverDetail, as: 'detail' }
      ]
    });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const data = {
      fullanme: user.firstName + " " + user.lastName
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.update(req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
};