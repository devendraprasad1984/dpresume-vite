import {shallow} from "enzyme";
import toJson from "enzyme-to-json";
import React from "react";

import App from "../App";
import BasicDisplay from "../components/common/basicDisplay";
import BottomBar from "../components/common/bottomBar";
import HeaderInfo from "../components/common/headerInfo";
import HtmlComponent from "../components/common/htmlComponent";
import Input from "../components/common/input";
import Nav from "../components/common/nav";
import NoData from "../components/common/nodata";
import OneLinerHeader from "../components/common/oneLinerHeader";
import Achievement from "../components/screens/achievement";
import Article from "../components/screens/articles";
import Certificate from "../components/screens/certificate";
import Education from "../components/screens/education";
import AppEnums from "../configs/appEnums";
import Experience from "../components/screens/experience";
import Home from "../components/screens/home";
import Projects from "../components/screens/projects";
import Skills from "../components/screens/skills";
import pageTitles from "../configs/pageTitles";

const strMsg = " rendering without crash";
export const appComponents = [
  { name: AppEnums.app, desc: "app", component: <App /> },
  {
    name: AppEnums.home,
    desc: "home",
    component: <Home title={pageTitles.home} />,
  },
  {
    name: AppEnums.education,
    desc: "education",
    component: <Education title={pageTitles.education} />,
  },
  {
    name: AppEnums.experience,
    desc: "experience",
    component: <Experience title={pageTitles.experience} />,
  },
  {
    name: AppEnums.projects,
    desc: "projects",
    component: <Projects title={pageTitles.projects} />,
  },
  {
    name: AppEnums.certificate,
    desc: "certificate",
    component: <Certificate title={pageTitles.certification} />,
  },
  {
    name: AppEnums.skills,
    desc: "skills",
    component: <Skills title={pageTitles.skills} />,
  },
  {
    name: AppEnums.achievement,
    desc: "achievement",
    component: <Achievement title={pageTitles.achievement} />,
  },
  {
    name: AppEnums.basicDisplay,
    desc: "basic display",
    component: <BasicDisplay list={[]} />,
  },
  { name: AppEnums.bottomBar, desc: "bottom bar", component: <BottomBar /> },
  { name: AppEnums.headerInfo, desc: "header", component: <HeaderInfo /> },
  {
    name: AppEnums.htmlComponent,
    desc: "html component",
    component: <HtmlComponent text={pageTitles.mockTitle} />,
  },
  { name: AppEnums.nav, desc: "navigation", component: <Nav /> },
  {
    name: AppEnums.nodata_ok,
    desc: "noData ok text",
    component: <NoData text={pageTitles.mockTitle} type="200" />,
  },
  {
    name: AppEnums.nodata_404,
    desc: "noData 404",
    component: <NoData text={pageTitles.mockTitle} type="404" />,
  },
  {
    name: AppEnums.onelinerHeader,
    desc: "oneliner",
    component: <OneLinerHeader title={pageTitles.mockTitle} />,
  },
  {
    name: AppEnums.onelinerHeader + "_1",
    desc: "oneliner_1",
    component: <OneLinerHeader title={pageTitles.education} />,
  },
  {
    name: AppEnums.input,
    desc: "input box",
    component: <Input label={"dummy"} />,
  },
  {
    name: AppEnums.articles,
    desc: "articles test component array prop and types check",
    component: <Article />,
  },
];

export const snapshotChecker = (desc, component) => {
  it(`${desc} snapshot`, () => {
    const tree = shallow(component);
    expect(toJson(tree)).toMatchSnapshot();
    tree.unmount();
  });
};

export const getComponentByName = (name) => {
  return appComponents.filter((comp) => comp.name === name)[0];
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
