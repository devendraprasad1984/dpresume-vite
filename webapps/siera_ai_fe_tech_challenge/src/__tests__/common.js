import {shallow} from "enzyme";
import toJson from "enzyme-to-json";
import {Provider} from "react-redux";
import store from "../_redux/store";

const strMsg = " rendering without crash";
export const Root=({children})=><Provider store={store}>{children}</Provider> //for redux states and objects like dispatch into scope

export const snapshotAndCrashChecks = (desc, component) => {
    it(`${desc} snapshot`, () => {
        const tree = shallow(component);
        expect(toJson(tree)).toMatchSnapshot();
        tree.unmount();
    });
    baseChecker(desc, component)
};

export const baseChecker = (desc, component) => {
    it(`testing ${desc} - ${strMsg}`, () => {
        shallow(component);
    });
};

describe("ignore", () => {
    it("ignore this", () => {
        expect(1).toEqual(1);
    });
});
