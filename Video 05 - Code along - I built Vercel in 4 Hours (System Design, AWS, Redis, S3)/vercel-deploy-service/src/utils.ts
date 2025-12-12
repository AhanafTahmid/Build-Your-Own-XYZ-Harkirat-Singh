import { exec, spawn } from "child_process";
import path from "path";

export function buildProject(id: string) {
    return new Promise((resolve) => {
        const projectPath = path.join(__dirname, `output/${id}`);
        const child = exec(`cd "${projectPath}" && npm install && npm run build`);
        console.log("pppp ",projectPath);

        // const child = exec(`cd ${path.join(__dirname, `output/${id}`)} && npm install && npm run build`)

        child.stdout?.on('data', function(data) {
            console.log('stdout: ' + data);
        });
        child.stderr?.on('data', function(data) {
            console.log('stderr: ' + data);
        });

        child.on('close', function(code) {
           resolve("")
        });

    })
}

// buildProject("ffb41");