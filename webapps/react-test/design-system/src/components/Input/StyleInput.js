import styled from 'styled-components'

const StyledInputComponent = styled.input`
    padding: 4px 4px;
    border: 2px solid green;
    color: ${props => props.color};
    :focus{
        outline: none;
    }
    :hover{
        background-color: lightblue;
    }
`

export default StyledInputComponent