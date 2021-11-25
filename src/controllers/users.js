const userService = require("../services/User.service");

const getUser = async (req, res, next) => {
  const { ids } = req.params;
  const { sort_by, order } = req.query;
  
  const keyToSort = sort_by ?? 'id';
  const inOrder = order ?? 'ASC';

  const users = await userService
    .getUsers(ids, { key: keyToSort, inOrder })
    .catch((err) => next(err));
  res.status(207); //multistatus
  return res.json({ data: users });
};

const upsertUser = async (req, res, next) => {
  const { user } = req.body;
  if (!user.id) {
    user = { ...user, id: req.params.id };
  }
  const newUser = await userService.upsert(user).catch((err) => next(err));
  res.status(201);
  return res.json({ data: newUser });
};
const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  await userService.delete(id).catch((err) => next(err));
  res.status(200);
  return res.json({ success: true });
};

module.exports = { getUser, deleteUser, upsertUser };
