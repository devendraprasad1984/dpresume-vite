import React from "react";

import {snapshotChecker} from "./common";
import appComponents from "./appComponents";

//checks for the unexpected changes in component tree
//one of the important checks
describe("snapshot changes of components", () => {
    appComponents.forEach((comp) => {
        let { desc, component, isRedux,routeMock } = comp;
        snapshotChecker(desc, component, isRedux);
    });
});
