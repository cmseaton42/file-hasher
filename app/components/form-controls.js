import styled from "styled-components";
import Container from "./container";

import styles from "../styles";

export const TitleBlock = styled(Container)`
    justify-content: center;
    align-items: center;
    width: 100%;
    font-size: 2.5em;
    color: ${styles.colors.SECONDARY};
    padding: 0.5em;
`;

export const InputGroup = styled(Container)`
    overflow: visible;
    width: 100%;
    border: ${styles.colors.LIGHT_GREY} 1px solid;
    border-radius: 5px;
    position: relative;
    padding: 1.5em;
    margin: 1em;
    flex-direction: column;

    &:after {
        display: block;
        color: ${styles.colors.GREY};
        background: ${styles.colors.WHITE};
        position: absolute;
        padding: 0em 0.2em;
        font-size: 1.5em;
        top: -9px;
        right: 20px;
    }
`;

export const TextInput = styled.input.attrs({
    type: "text"
})`
    border: none;
    outline: none;
    width: 100%;
    flex-shrink: 1;
    font-size: 1.5em;
    width: 100%;
    padding-left: ${props => props.offset || "0.5em"};
    background: transparent;
    color: ${styles.colors.SECONDARY};
    border-bottom: ${styles.colors.SECONDARY_TINT_2} 1px solid;

    &:focus {
        border-bottom: ${styles.colors.SECONDARY_TINT} 2px solid;
    }

    &:disabled {
        border-bottom: ${styles.colors.LIGHT_GREY} 1px solid;
        color: ${styles.colors.LIGHT_GREY};
    }
`;

export const InputWrapper = styled(Container)`
    height: 3em;
    width: 100%;
    margin: 0.3em 0em;
    position: relative;

    label {
        position: absolute;
        left: 2px;
        top: 5px;
        font-size: 1.5em;
        color: ${styles.colors.GREY};
    }
`;

export const InputDecorator = styled(Container)`
    position: absolute;
    height: 100%;
    align-items: center;
    right: 5px;
    font-size: 1.5em;
    color: ${props => props.color || styles.colors.SECONDARY_TINT};
`;

export const File = styled.input.attrs({
    type: "file"
})`
    display: none;
`;

export const FileDecorator = styled(Container)`
    position: absolute;
    height: 100%;
    align-items: center;
    right: -30px;
    font-size: 1.5em;
    color: ${props => props.color || styles.colors.SECONDARY_TINT};
`;

export const FileUploader = styled.label`
    background: ${props => (props.disabled ? styles.colors.LIGHT_GREY : styles.colors.SECONDARY)};
    width: 9em;
    height: 2.5em;
    border-radius: 3px;
    font-size: 1.5em;
    font-weight: bold;
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    color: ${props => (props.disabled ? styles.colors.GREY : styles.colors.WHITE)};
    transition: all 200ms ease-in-out;

    &:hover {
        cursor: ${props => (props.disabled ? "default" : "pointer")};
        background: ${props => (props.disabled ? styles.colors.LIGHT_GREY : styles.colors.SECONDARY_TINT)};

        transition: all 200ms ease-in-out;
    }
`;
