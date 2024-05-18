import { login } from "./login";
import { tweet } from "./tweet";

(async () => {
  const [, , command, ...params] = process.argv;

  switch (command) {
    case "login":
      await login();
      break;
    case "tweet":
      await tweet(params[0]);
      break;
    case "test":
      console.log("Test", ...params);
      break;
    default:
      console.log("Unknown command");
      break;
  }
})();
