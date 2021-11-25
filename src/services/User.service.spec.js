const service = require("./User.service");
const mockingoose = require("mockingoose");
const UserModel = require("../models/users/user.model");
const NotFoundError = require("../errors/NotFoundError");

jest.mock("./ReqRes.service");
jest.mock("../models/users/user.model");
describe("UserService", () => {
  let userService = service;
  beforeEach(() => {
    mockingoose.resetAll();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should be defined", () => {
    expect(userService).toBeDefined();
  });
  it("should fetch user from db", async () => {
    const expectedUser = {
      _id: "507f191e810c19729de860ea",
      id: 1,
      first_name: "test",
    };
    jest.spyOn(service, "_fetchUserFromDB").mockResolvedValue(expectedUser);
    const user = await service.getUsers(1);
    expect(user).toBe(expectedUser);
  });
  it("should call external api if not stored in DB", async () => {
    const expectedUser = {
      _id: "507f191e810c19729de860ea",
      id: 1,
      first_name: "test",
    };
    jest.spyOn(service, "_fetchUserFromDB").mockResolvedValue(null);
    jest.spyOn(service, "_fetchUserFromRemote").mockResolvedValue(expectedUser);
    const user = await service.getUsers(1);

    expect(service._fetchUserFromDB).toHaveBeenCalled();
    expect(service._fetchUserFromRemote).toHaveBeenCalled();
    expect(user).toBe(expectedUser);
  });
  it("should handle multiple id request", async () => {
    const expectedUser1 = {
      _id: "507f191e810c19729de860ea",
      id: 1,
      first_name: "test",
    };
    const expectedUser2 = {
      _id: "507f191e810c19729de860ea",
      id: 2,
      first_name: "test",
    };
    const expectedUser3 = {
      _id: "507f191e810c19729de860ea",
      id: 3,
      first_name: "test",
    };
    jest
      .spyOn(service, "_fetchUserFromDB")
      .mockResolvedValueOnce(expectedUser1)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(expectedUser3);

    jest
      .spyOn(service, "_fetchUserFromRemote")
      .mockResolvedValueOnce(expectedUser2);
    const users = await service.getUsers([1, 2, 3]);

    expect(service._fetchUserFromDB).toHaveBeenCalledTimes(3);
    expect(service._fetchUserFromRemote).toHaveBeenCalledTimes(1);
    expect(users).toStrictEqual([expectedUser1, expectedUser2, expectedUser3]);
  });
  it("should handle multiple id request with errors", async () => {
    const expectedUser1 = {
      _id: "507f191e810c19729de860ea",
      id: 1,
      first_name: "test",
    };
    const expectedUser2 = {
      _id: "507f191e810c19729de860ea",
      id: 2,
      first_name: "test",
    };

    jest
      .spyOn(service, "_fetchUserFromDB")
      .mockResolvedValueOnce(expectedUser1)
      .mockResolvedValueOnce(null);

    jest
      .spyOn(service, "_fetchUserFromRemote")
      .mockRejectedValueOnce(new NotFoundError("not found"));
    const users = await service.getUsers([1, 2]);

    expect(service._fetchUserFromDB).toHaveBeenCalledTimes(2);
    expect(service._fetchUserFromRemote).toHaveBeenCalledTimes(1);
    expect(users[0]).toBe(expectedUser1);
    expect(users[1]).not.toBe(expectedUser2);
    expect(users[1]).toHaveProperty("statusCode");
    expect(users[1]).toHaveProperty("message");
    expect(users[1].statusCode).toBe(404);
  });
  it("should call model findOneAndDelete with expected params", async () => {
    const id = 12;
    mockingoose(UserModel).toReturn(
      {
        id: 12,
        first_name: "test",
      },
      "findOneAndDelete"
    );

    await service.delete(id);
    jest.spyOn(UserModel, "findOneAndDelete");

    expect(UserModel.findOneAndDelete).toHaveBeenCalledWith({ id });
  });
  it("should order to default params", async () => {
    const users = [
      {
        id: 2,
        email: "janet.weaver@reqres.in",
        first_name: "Janet",
        last_name: "Weaver",
      },
      {
        id: 4,
        email: "eve.holt@reqres.in",
        first_name: "Eve",
        last_name: "Holt",
      },
    ];
    jest
      .spyOn(service, "_fetchUserFromDB")
      .mockResolvedValueOnce(users[0])
      .mockResolvedValueOnce(users[1]);
    const result = await service.getUsers([1, 2]);
    expect(result[0]).toBe(users[0]);
    expect(result[1]).toBe(users[1]);
  });
  it("should order with expected params", async () => {
    const users = [
      {
        id: 2,
        email: "janet.weaver@reqres.in",
        first_name: "Janet",
        last_name: "Weaver",
      },
      {
        id: 4,
        email: "eve.holt@reqres.in",
        first_name: "Eve",
        last_name: "Holt",
      },
    ];
    jest
      .spyOn(service, "_fetchUserFromDB")
      .mockResolvedValueOnce(users[0])
      .mockResolvedValueOnce(users[1]);
    const result = await service.getUsers([1, 2], {key: 'id', inOrder: 'desc'});
    expect(result[0]).toBe(users[1]);
    expect(result[1]).toBe(users[0]);
  });
});
