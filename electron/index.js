const { app, BrowserWindow } = require("electron");

const { default: installExtension, REACT_DEVELOPER_TOOLS } = require("electron-devtools-installer");

const path = require("path");
const isDev = require("electron-is-dev");

// Initialize/Reserve window variables
let mainWindow;

// Create primary app window
function createMainWindow() {
    // Define winndow default setings
    mainWindow = new BrowserWindow({
        minWidth: 300,
        width: 300,
        minHeight: 500,
        height: 500,
        resizable: isDev ? true : false,
        icon: __dirname + "/images/icon.png",
        webPreferences: {
            nodeIntegration: true
        },
        icon: path.join(__dirname, "../images/icon.png")
    });

    mainWindow.setMenuBarVisibility(false);

    // Load window URL
    mainWindow.loadURL(
        isDev ? "http://localhost:3000" : `file://${path.join(__dirname, "../build/index.html")}`
    );

    // Install dev tools if in dev mode
    if (isDev) {
        installExtension(REACT_DEVELOPER_TOOLS)
            .then(name => console.log(`Added Extension:  ${name}`))
            .catch(err => console.log("An error occurred: ", err));
    }

    mainWindow.on("closed", () => (mainWindow = null));

    // TODO: Use 'ready-to-show' event
    //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
    mainWindow.webContents.on("did-finish-load", () => {
        if (!mainWindow) throw new Error('"mainWindow" is not defined');

        mainWindow.show();
        mainWindow.focus();
    });
}

// Launch main screen
app.on("ready", createMainWindow);

// Clean up on OSX
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// Launch main screen
app.on("activate", () => {
    if (mainWindow === null) {
        createWindow();
    }
});
