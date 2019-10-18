import React, { useState } from "react";
import styled from "styled-components";
import fs from "fs";
import crypto from "crypto";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import Container from "./container";

import { TitleBlock, File, FileUploader, FileDecorator } from "./form-controls";

import styles from "../styles";

const Wrapper = styled(Container)`
    background: ${styles.colors.WHITE};
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 1em;
`;

const HashButton = styled.button`
    background: ${props => (props.disabled ? styles.colors.LIGHT_GREY : styles.colors.SECONDARY)};
    width: 90%;
    height: 2.5em;
    border-radius: 3px;
    font-size: 1.5em;
    border: none;
    font-weight: bold;
    display: flex;
    position: absolute;
    bottom: 20px;
    align-items: center;
    justify-content: center;
    color: ${props => (props.disabled ? styles.colors.GREY : styles.colors.WHITE)};
    transition: all 200ms ease-in-out;

    &:hover {
        cursor: ${props => (props.disabled ? "default" : "pointer")};
        background: ${props =>
            props.disabled ? styles.colors.LIGHT_GREY : styles.colors.SECONDARY_TINT};

        transition: all 200ms ease-in-out;
    }
`;

const Main = () => {
    const [path, setPath] = useState(null);
    let hash = crypto.createHash("sha256");
    hash.setEncoding("hex");

    const handleClick = () => {
        // the file you want to get the hash
        let fd = fs.createReadStream(path);

        fd.on("end", function() {
            hash.end();
            const hashStr = hash.read();

            copyStringToClipboard(hashStr);

            alert(`Hash has been copied to clipboard!\n${hashStr}`);

            setPath(null);
        });

        // read all file and pipe it (write it) to the hash object
        fd.pipe(hash);
    };

    const handleFile = e => {
        try {
            const { path } = e.target.files[0];

            setPath(path);
        } catch (error) {
            console.log(error);
        }
    };

    const formValidated = path !== null;

    return (
        <Wrapper>
            <TitleBlock>File Hash Generator</TitleBlock>
            <FileUploader disabled={false}>
                Select File
                <File disabled={false} onChange={handleFile} />
                {path ? (
                    <FileDecorator color={styles.colors.GREEN}>
                        <FontAwesomeIcon icon={faCheck} />
                    </FileDecorator>
                ) : null}
            </FileUploader>
            <HashButton disabled={!formValidated} onClick={handleClick}>
                Produce Hash
            </HashButton>
        </Wrapper>
    );
};

function copyStringToClipboard(str) {
    // Create new element
    let el = document.createElement("textarea");
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute("readonly", "");
    el.style = { position: "absolute", left: "-9999px" };
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand("copy");
    // Remove temporary element
    document.body.removeChild(el);
}

export default Main;
