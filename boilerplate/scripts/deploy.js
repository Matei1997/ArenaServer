/**
 * Copies built client, server, and CEF from boilerplate to ragemp-server.
 * Run from boilerplate folder: npm run deploy
 */
const fs = require("fs");
const path = require("path");

const BOILERPLATE = path.join(__dirname, "..");
const RAGEMP_SERVER = path.join(BOILERPLATE, "..", "ragemp-server");

const copies = [
    { src: "packages/server", dest: "packages/server" },
    { src: "client_packages", dest: "client_packages" }
];

console.log("Deploying to ragemp-server...\n");

for (const { src, dest } of copies) {
    const srcPath = path.join(BOILERPLATE, src);
    const destPath = path.join(RAGEMP_SERVER, dest);

    if (!fs.existsSync(srcPath)) {
        console.warn(`  Skip ${src}: not found (run build first)`);
        continue;
    }

    try {
        fs.cpSync(srcPath, destPath, { recursive: true });
        console.log(`  Copied ${src} -> ragemp-server/${dest}`);
    } catch (err) {
        console.error(`  Failed to copy ${src}:`, err.message);
        process.exit(1);
    }
}

console.log("\nDeploy complete.");
