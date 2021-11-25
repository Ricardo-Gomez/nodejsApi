const axios = require("axios");
const BadGatewayError = require("../errors/BadGatewayError");
const NotFoundError = require("../errors/NotFoundError");

class ReqResService {
  baseUrl;
  constructor() {
    this.baseUrl = process.env.REMOTE_API_URL;
  }

  async fetchUser(id) {
    console.log("calling remote server!!!!");
    const endpoint = `${this.baseUrl}/users/${id}`;
    return this._callRemoteService(endpoint);
  }

  async _callRemoteService(endopoint) {
    try {
      const response = await axios.get(endopoint);
      return response.data.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new NotFoundError(error.response?.statusText);
      }
      throw new BadGatewayError("remote api is down");
    }
  }
}

module.exports = new ReqResService();
