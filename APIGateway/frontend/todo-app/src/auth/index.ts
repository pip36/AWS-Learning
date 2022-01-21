import Auth, { Amplify } from "aws-amplify";
import config from "../config";

Amplify.configure({
  Auth: {
    region: config.AWS_REGION,
    userPoolId: config.USER_POOL_ID,
    userPoolWebClientId: config.APP_CLIENT_ID,
  },
});

const currentConfig = Auth.configure();
export default currentConfig;
