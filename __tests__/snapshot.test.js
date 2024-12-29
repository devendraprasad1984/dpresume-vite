import React from "react";

import {appComponents, snapshotChecker} from "./common";

//checks for the unexpected changes in component tree
//one of the importatn checks
describe("snapshot changes of components", () => {
  appComponents.forEach((comp) => {
    let { desc, component } = comp;
    snapshotChecker(desc, component);
  });
});
