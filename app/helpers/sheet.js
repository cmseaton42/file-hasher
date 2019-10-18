import xlsx from "xlsx";
const { sheet_to_json } = xlsx.utils;

const STORE_ID_SHEET_NAME = "Sorter keying (8 Lanes)";
const TOTE_DESCRIPTOR = "TOTES";
const LANE_DESCRIPTOR = "LANE";
const TOTE_AREA_NUMBER = 0;
const LANE_AREA_NUMBER_1 = 55;
const LANE_AREA_NUMBER_2 = 56;

export const loadSheetData = path => {
    const workbook = xlsx.readFile(path, { type: "string" });
    const worksheet = workbook.Sheets[STORE_ID_SHEET_NAME];
    const data = sheet_to_json(worksheet);

    return data;
};

const addDataToStore = store => (id, area, lane) => {
    if (store[id]) {
        store[id].push({ area, lane });
    } else {
        store[id] = [{ area, lane }];
    }
};

export const parseSheetData = data => {
    const store = {};
    const addData = addDataToStore(store);

    for (let row of data) {
        const keys = Object.keys(row);

        for (let key of keys) {
            const keyComponents = key
                .toUpperCase()
                .trim()
                .split(" ");

            const descriptor = keyComponents[0];
            const lane = parseInt(keyComponents[1]);
            const id = row[key];

            if (descriptor === TOTE_DESCRIPTOR) {
                addData(id, TOTE_AREA_NUMBER, lane);
            } else if (descriptor === LANE_DESCRIPTOR) {
                addData(id, LANE_AREA_NUMBER_1, lane);
                addData(id, LANE_AREA_NUMBER_2, lane);
            }
        }
    }

    return store;
};
