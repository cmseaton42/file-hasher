import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import Container from "./container";
import { loadSheetData, parseSheetData } from "../helpers/sheet";
import { writeStoreToController } from "../helpers/plc";
import { isIP, isInt } from "validator";

import {
    TitleBlock,
    InputWrapper,
    InputGroup,
    TextInput,
    InputDecorator,
    File,
    FileUploader,
    FileDecorator
} from "./form-controls";

import styles from "../styles";

const NO_FILE = 0;
const GOOD_FILE = 1;
const BAD_FILE = 2;

const Wrapper = styled(Container)`
    background: ${styles.colors.WHITE};
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    padding: 1em;
`;

const DownloadButton = styled.button`
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
        background: ${props => (props.disabled ? styles.colors.LIGHT_GREY : styles.colors.SECONDARY_TINT)};

        transition: all 200ms ease-in-out;
    }
`;

const ConfigGroup = styled(InputGroup)`
    &:after {
        content: "Config";
    }
`;

const ProgressBar = styled.div`
    position: absolute;
    bottom: 0px;
    left: 0px;
    height: 1em;
    width: ${props => props.progress || 0}%;
    background: ${styles.colors.SECONDARY};
    transition: all 50ms ease-in;
`;

const ErrorContainer = styled(Container)`
    width: 100%;
    border: ${styles.colors.RED} 1px solid;
    border-radius: 3px;
    margin-top: 1em;
    flex-direction: column;
    background: ${styles.colors.WHITE};
`;

const ErrorHeader = styled(Container)`
    width: 100%;
    margin: 0;
    margin-bottom: 0.2em;
    align-items: center;
    padding: 0.5em;
    font-size: 1.5em;
    font-weight: bold;
    justify-content: center;
    background: ${styles.colors.RED};
    border: none;
    color: ${styles.colors.WHITE};
`;

const ErrorMsg = styled(Container)`
    width: 100%;
    margin: 0;
    margin-bottom: 0.2em;
    padding: 0.3em;
    font-size: 1.2em;
    font-weight: bold;
    background: ${styles.colors.WHITE};
    border: none;
    color: ${styles.colors.RED_TINT};
`;

const Main = () => {
    const initIp = localStorage.getItem("ip") ? localStorage.getItem("ip") : "192.168.1.1";
    const [ip, setIp] = useState(initIp);

    const initSlot = localStorage.getItem("slot") ? localStorage.getItem("slot") : "0";
    const [slot, setSlot] = useState(initSlot);

    const [store, setStore] = useState(null);
    const [fileStatus, setFileStatus] = useState(NO_FILE);

    const [uploading, setUploading] = useState(false);
    const [percentComplete, setPercentComplete] = useState(0);

    const [errMsg, setErrMsg] = useState(null);

    const handleClick = async () => {
        if (!uploading) {
            setUploading(true);
            setErrMsg(null);

            const { err } = await writeStoreToController(ip, parseInt(slot), store, setPercentComplete);

            if (err) {
                setErrMsg(`${err} (Double check config params and data in worksheet and then try again)`);

                setUploading(false);
                setPercentComplete(0);
            } else {
                setUploading(false);
                setTimeout(() => setPercentComplete(0), 1500);
            }
        }
    };

    const handleFile = e => {
        try {
            const { path } = e.target.files[0];

            const data = loadSheetData(path);

            if (data.length === 0) {
                setFileStatus(BAD_FILE);
                setStore(null);
            } else {
                const store = parseSheetData(data);
                setFileStatus(GOOD_FILE);
                setStore(store);
            }
        } catch (error) {
            setFileStatus(BAD_FILE);
            console.log(error);
        }
    };

    useEffect(() => {
        if (isIP(ip, 4)) localStorage.setItem("ip", ip);
        if (isInt(slot, { min: 0, max: 30 })) localStorage.setItem("slot", slot);
    }, [ip, slot]);

    const ipValid = isIP(ip, 4);
    const slotValid = isInt(slot, { min: 0, max: 30 });
    const formValidated = fileStatus === GOOD_FILE && ipValid && slotValid;

    return (
        <Wrapper>
            <TitleBlock>Amazon Parameter Tool</TitleBlock>
            <ConfigGroup>
                <InputWrapper>
                    <label>IP Address</label>
                    <TextInput disabled={uploading} offset={"6em"} value={ip} onChange={e => setIp(e.target.value)} />
                    {ipValid ? (
                        <InputDecorator color={styles.colors.GREEN}>
                            <FontAwesomeIcon icon={faCheck} />
                        </InputDecorator>
                    ) : (
                        <InputDecorator color={styles.colors.RED}>
                            <FontAwesomeIcon icon={faTimes} />
                        </InputDecorator>
                    )}
                </InputWrapper>
                <InputWrapper>
                    <label>Slot Number</label>
                    <TextInput
                        disabled={uploading}
                        offset={"6em"}
                        value={slot}
                        onChange={e => setSlot(e.target.value)}
                    />
                    {slotValid ? (
                        <InputDecorator color={styles.colors.GREEN}>
                            <FontAwesomeIcon icon={faCheck} />
                        </InputDecorator>
                    ) : (
                        <InputDecorator color={styles.colors.RED}>
                            <FontAwesomeIcon icon={faTimes} />
                        </InputDecorator>
                    )}
                </InputWrapper>
            </ConfigGroup>
            <FileUploader disabled={uploading}>
                Select File
                <File disabled={uploading} onChange={handleFile} />
                {fileStatus === GOOD_FILE || fileStatus === BAD_FILE ? (
                    fileStatus === GOOD_FILE ? (
                        <FileDecorator color={styles.colors.GREEN}>
                            <FontAwesomeIcon icon={faCheck} />
                        </FileDecorator>
                    ) : (
                        <FileDecorator color={styles.colors.RED}>
                            <FontAwesomeIcon icon={faTimes} />
                        </FileDecorator>
                    )
                ) : null}
            </FileUploader>
            {errMsg ? (
                <ErrorContainer>
                    <ErrorHeader>Error Occurred</ErrorHeader>
                    <ErrorMsg>{errMsg}</ErrorMsg>
                </ErrorContainer>
            ) : null}
            <DownloadButton disabled={!formValidated} onClick={handleClick}>
                {uploading ? "Uploading..." : percentComplete === 100 ? "Upload Successful :)" : "Upload Data to PLC"}
            </DownloadButton>
            <ProgressBar progress={percentComplete} />
        </Wrapper>
    );
};

export default Main;
