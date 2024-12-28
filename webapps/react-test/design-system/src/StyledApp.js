import React, {useState} from "react";
import {ThemeProvider} from 'styled-components'

import Button from "./components/Button";
import StyledInputComponent from "./components/Input/StyleInput";
import {darkMode, GlobalStyles, lightMode} from "./themes/StyledTheme";


const StyledApp = props => {
    const [theme, setTheme] = useState('light')
    const toggleTheme = () => {
        setTheme(() => theme === 'light' ? 'dark' : 'light')
    }
    return <>
        <ThemeProvider theme={theme === 'light' ? lightMode : darkMode}>
            <GlobalStyles/>
            <h2>Styled App</h2>
            <div className="column">
                <StyledInputComponent color='red' placeholder='This is new styled component...'/>
                <StyledInputComponent color='green' placeholder='This is new styled component...'/>
                <Button onClick={toggleTheme}>{theme} mode</Button>
            </div>
        </ThemeProvider>
    </>
}

export default StyledApp