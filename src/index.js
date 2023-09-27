import SwaggerUI from "swagger-ui";
import SwaggerUIStandalonePreset from "swagger-ui/dist/swagger-ui-standalone-preset";
import "swagger-ui/dist/swagger-ui.css";

// 파일 직접 접근 시 아래와 같이 파일 지정
// const spec = require('./swagger-config.yaml');

const ui = SwaggerUI({
  presets: [SwaggerUI.presets.apis, SwaggerUIStandalonePreset],
  presets_config: {
    SwaggerUIStandalonePreset: {
      TopbarPlugin: true
    }
  },
  layout: "StandaloneLayout",
  dom_id: "#swagger",
  // spec,
  url: null,
  urls: [
    {
      url:
        "//swagger-url-test.s3.ap-northeast-2.amazonaws.com/swagger-config.yaml",
      name: "K Project"
    },
    {
      url:
        "//swagger-url-test.s3.ap-northeast-2.amazonaws.com/swagger-config.yaml",
      name: "H Project"
    }
  ]
});

// ui.initOAuth({
//   appName: "Swagger UI Webpack Demo",
//   // See https://demo.identityserver.io/ for configuration details.
//   clientId: 'implicit'
// });
