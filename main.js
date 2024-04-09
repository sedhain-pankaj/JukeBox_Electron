const { app, BrowserWindow, ipcMain } = require("electron/main");
const path = require("node:path");
const { spawn } = require("child_process");

// Start the temporary server to cache the song categories data
ipcMain.handle("ping", () => {
  return new Promise((resolve, reject) => {
    const server = spawn("node", ["logic.js"]);
    let data = "";

    server.stdout.on("data", (chunk) => {
      console.log(`Server: ${chunk}`);
      data += chunk;
    });

    server.stdout.on("end", () => {
      resolve(data.toString());
    });

    server.stderr.on("data", (chunk) => {
      console.error(`Server error: ${chunk}`);
      reject(new Error(chunk.toString()));
    });

    server.on("close", (code) => {
      console.log(`Server data cached. Exiting server with code ${code}`);
    });
  });
});

function createWindow() {
  // Get the screen size
  const { width, height } =
    require("electron").screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window
  const win = new BrowserWindow({
    width: width,
    height: height,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // Load your HTML file
  win.loadFile("index.html");
}

// When Electron has finished initialization
app.whenReady().then(() => {
  // Create the window
  createWindow();

  // Open a new window if there are no windows open
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed
app.on("window-all-closed", () => {
  //close the server
  server.kill();

  if (process.platform !== "darwin") {
    app.quit();
  }
});
