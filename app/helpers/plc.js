import { Controller, Tag, EthernetIP } from "ethernet-ip";
const { INT, DINT } = EthernetIP.CIP.DataTypes.Types;

const HANDSHAKE_TAG = "HANDSHAKE_TAG";

export const buildTagNames = (storeId, index) => {
    const laneTagName = `STORE_DATA[${storeId}].AREA_DATA[${index}].LANE`;
    const areaTagName = `STORE_DATA[${storeId}].AREA_DATA[${index}].AREA`;

    return [laneTagName, areaTagName];
};

const delay = ms => new Promise((resolve, reject) => setTimeout(resolve, ms));

const getPercentageFn = total => completed => (completed / total) * 100;

export const writeStoreToController = async (ip, slot, store, updateFn) => {
    try {
        const PLC = new Controller();
        const storeIds = Object.keys(store);
        const getPercentage = getPercentageFn(storeIds.length);
        const handshake = new Tag(HANDSHAKE_TAG, null, DINT);

        await PLC.connect(ip, slot);
        await PLC.writeTag(handshake, 10);

        while (handshake.value === 10) {
            await delay(250);
            await PLC.readTag(handshake);
        }

        let numCompleted = 0;
        for (let id of storeIds) {
            const storeId = parseInt(id);
            const data = store[storeId];

            data.sort((a, b) => (a.area === b.area ? 0 : a.area > b.area ? 1 : -1));

            for (let i = 0; i < data.length; i++) {
                const [laneTagName, areaTagName] = buildTagNames(storeId, i);
                const laneTag = new Tag(laneTagName, null, INT);
                const areaTag = new Tag(areaTagName, null, INT);
                const { lane, area } = data[i];

                await PLC.writeTag(laneTag, lane);
                await PLC.writeTag(areaTag, area);
            }

            numCompleted += 1;
            updateFn(getPercentage(numCompleted));
        }

        PLC.destroy();
        updateFn(100);

        return { err: null, success: true };
    } catch (error) {
        console.log(error);
        return { err: error.message, success: false };
    }
};
