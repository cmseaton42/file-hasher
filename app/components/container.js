import styled from "styled-components";
import styles from "../styles";

const Container = styled.div`
    display: flex;
    z-index: 1;
    box-sizing: border-box;
    overflow: auto;

    &::-webkit-scrollbar-track {
        background: transparent;
    }

    &::-webkit-scrollbar {
        width: 6px;
    }

    &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        background: ${styles.colors.LIGHT_GREY};
        height: 20px;
    }
`;

export default Container;
