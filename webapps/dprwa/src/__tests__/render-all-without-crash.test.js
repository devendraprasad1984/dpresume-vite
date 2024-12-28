import React from "react";

import {appComponents, baseChecker} from "./common";

describe("testing just rendering of components without crashing", () => {
  appComponents.forEach((comp) => {
    let { desc, component } = comp;
    baseChecker(desc, component);
  });
});
