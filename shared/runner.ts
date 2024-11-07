import { URL, PORT, IMAGE, CNAME } from './config';
import { spawn, spawnSync } from 'child_process';

export function alreadyRunning() {
    let output = spawnSync('docker', ['ps', '--filter', `name=${CNAME}`, '--format', '{{.Image}}'], { encoding: 'utf8' });
    return output.stdout.includes(IMAGE);
}

export async function startGhost() {
    if (alreadyRunning()) {
        return;
    }

    let sargs = ['run', '-d', '--rm', '-e', 'NODE_ENV=development', '-e', `url=${URL}`, '-p', `${PORT}:2368`, '--name', CNAME, IMAGE]
    let rargs = ['rm', '-f', CNAME]
    let out;
    spawnSync('docker', rargs);
    out = spawnSync('docker', sargs, { encoding: 'utf8' });

    if (out.status !== 0) {
        throw new Error(`Failed to start docker container: ${out.stderr}`);
    } else {
        console.log(`Started docker container: ${IMAGE} in port ${PORT}`);
    }

    // Return when ghost is ready
    let child = spawn('docker', ['logs', '-f', CNAME]);
    console.log('Waiting for Ghost to be operational');
    if (child.stdout) {
        for await (let line of child.stdout) {
            let l = line.toString('utf8').trim()
            // console.debug(l)
            if (l.includes('Ghost URL Service Ready')) {
                // Once it's ready return and the test can start
                console.log('Ghost ready for testing');
                child.kill();
                return;
            }
        }
    }

}