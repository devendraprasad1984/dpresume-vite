import React from "react";
import styled from '@emotion/styled'
import './style.css'
import theme from "../../themes";
import {css} from "@styled-system/css";
import {Element} from 'react-ui'


export const Input = (props) => {
    return (
        <>
            <input
                className="dp-input"
                {...props}
            />
        </>
    );
};


//https://emotion.sh/docs/styled
//css in js library
//tokenize approach
export const StyledInput = styled.input`
  border: ${theme.borders.thick} ${theme.colors.grays[200]};
  padding: 4px 8px;
  font-size: 16px;
`
export const StyledInput2 = styled.input({
    border: theme.borders.thick + " " + theme.colors.grays[400],
    padding: '4px 8px',
    fontSize: theme.fontSizes[5]
})

export const StyledInput3 = styled.input(css({
    border: 'thick',
    borderColor: 'grays.500',
    paddingX: 3,
    paddingY: 2,
    fontSize: 4
}))
// export const StyledInput4 = styled.input(css((theme) => theme.InputStyle.Input))

export const StyledInput5 = props => {
    return <Element as='input' InputStyle="Input" {...props} />
}

export const Form = props => {
    return <Element as='form' InputStyle="Form" {...props} />
}

export const StyledButton = styled.button`
  background-color: ${props => props.bgcolor || 'white'};
  color: ${props => props.color || 'black'};
  padding: 5px 8px;
  font-size: 14px;
  font-weight: bolder;
`