import {createGlobalStyle} from "styled-components";

export const lightMode = {
    body: 'white',
    fontColor: 'magenta',
    buttonColor: 'pink'
}

export const darkMode = {
    body: 'black',
    fontColor: 'red',
    buttonColor: 'purple'
}


export const GlobalStyles = createGlobalStyle`
    body{
        background-color: ${props=>props.theme.body};
    }
    * {
        box-sizing: border-box;
        color: ${props=>props.theme.fontColor};
    }
    .styled-button{
        background-color: ${props=>props.theme.buttonColor};
    }
`