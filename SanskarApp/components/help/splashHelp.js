import React from 'react';
import Helper from "./Helper";
import {Config} from "../common/Config";

const HelpSplash = props => {
    return <Helper {...props} uri={Config.helpScreenEndpoint +'?name=splash'}/>
}
export default HelpSplash;
