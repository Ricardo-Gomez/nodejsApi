const BadGatewayError = require("../errors/BadGatewayError");
const ReqResService = require("./ReqRes.service");
const UserModel = require("../models/users/user.model");
const { InternalServerError } = require("../errors/InternalServerError");

class userService {
  reqResService;
  userModel = UserModel;
  constructor() {
    this.reqResService = ReqResService;
  }
  async getUsers(ids, sort = { key: "id", inOrder: "ASC" }) {
    const isArray = Array.isArray(ids);

    if (!isArray) {
      const user = await this._fetchUserFromDB(ids);
      if (!user) {
        return this._fetchUserFromRemote(ids);
      }
      return user;
    }
    const users = await Promise.allSettled(
      ids.map(
        async (id) =>
          (await this._fetchUserFromDB(id)) ||
          (await this._fetchUserFromRemote(id))
      )
    );
    const usersResponse = users.map((userResponse, index) => {
      if (userResponse.status === "rejected") {
        return { ...userResponse.reason, userId: ids[index] };
      }
      return userResponse.value;
    });
    if (
      users.every(
        (promise) =>
          promise.status === "rejected" && promise.reason.statusCode === 502
      )
    ) {
      return new BadGatewayError("api is down");
    }
    return this.sortByKey(usersResponse, sort.key, sort.inOrder);
  }
  async _fetchUserFromDB(id) {
    return this.userModel.findOne({ id },['-_id', '-__v'],{lean: true}).exec();
  }
  async _fetchUserFromRemote(id) {
    const user = await this.reqResService.fetchUser(id);
    try {
      await this.upsert(user);
    } catch (error) {
      throw new InternalServerError("failed to save to DB");
    }
    return user;
  }

  async upsert(user) {
    const { id, ...rest } = user;
    return this.userModel
      .findOneAndUpdate({ id }, rest, {
        upsert: true,
        new: true,
        runValidators: true,
      })
      .exec();
  }
  async delete(id) {
    return this.userModel.findOneAndDelete({ id });
  }

  sortByKey(users, key, order = "ASC") {
    const allowedOrders = ["ASC", "DESC"];
    const hasKey = users.map((u) => u[key]);
    if (hasKey.every((k) => undefined)) {
      return users;
    }
    if (!allowedOrders.includes(order.toLocaleUpperCase())) {
      order = "ASC";
    }
    const sorted = users.sort(function (a, b) {
      if (a[key] > b[key]) {
        return 1;
      }
      if (a[key] < b[key]) {
        return -1;
      }

      return 0;
    });

    if (order.toLocaleUpperCase() === "DESC") {
      return sorted.reverse();
    }
    return sorted;
  }
}

module.exports = new userService();
