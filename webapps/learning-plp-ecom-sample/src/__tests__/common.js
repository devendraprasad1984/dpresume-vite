import {shallow} from "enzyme";
import toJson from "enzyme-to-json";
import React from "react";
import store from "../redux/createStore";
import {Provider} from "react-redux";

const baseRenderMsg = " rendering without crash";
export const getComponentByName = (name) => {
    return appComponents.filter((comp) => comp.name === name)[0];
};

const getReduxConnectComponent=(component)=>{
    return <Provider store={store}>{component}</Provider>
}

export const baseChecker = (desc, component, isRedux) => {
    const curComponent = isRedux ? getReduxConnectComponent() : component
    let wrapper;
    test(`testing ${desc} - ${baseRenderMsg}`, () => {
        if (isRedux === false)
            wrapper = shallow(curComponent);
        else{
            // wrapper = shallow(curComponent).childAt(0).dive()
            wrapper = shallow(curComponent)
            // expect(wrapper.length).toBe(1)
        }
    });
};

export const snapshotChecker = (desc, component, isRedux, routeMock) => {
    const curComponent = isRedux ? getReduxConnectComponent() : component
    if(routeMock!==undefined) routeMock()
    it(`${desc} snapshot`, () => {
        const tree = shallow(curComponent);
        expect(toJson(tree)).toMatchSnapshot();
        tree.unmount();
    });
};

describe("ignore", () => {
    it("ignore this", () => {
        expect(1).toEqual(1);
    });
});
