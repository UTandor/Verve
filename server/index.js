const api = require("./functions/app");
const config = require("./utils/config");
const logger = require("./utils/logger");

api.listen(config.PORT, () => {
  logger.info(`Server is running on Port: ${config.PORT}`);
});
