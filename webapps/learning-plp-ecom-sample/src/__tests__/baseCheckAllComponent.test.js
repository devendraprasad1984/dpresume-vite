import React from "react";

import {baseChecker} from "./common";
import appComponents from "./appComponents";

//checks for the unexpected changes in component tree
//one of the important checks
describe("checking components", () => {
    appComponents.forEach((comp) => {
        let {desc, component, isRedux,routeMock} = comp;
        baseChecker(desc, component, isRedux || false);
    });
});
