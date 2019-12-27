export default function (...paths) {
    if (Array.isArray(paths[0])) {
        paths = paths[0];
    }

    for (let p in paths) {
        for (let cachePath in require.cache) {
            if (paths[p] instanceof RegExp) {
                if (paths[p].test(cachePath)) {
                    delete require.cache[cachePath];
                }
            } else if (typeof paths[p] == "string") {
                if (cachePath.indexOf(paths[p]) != -1) {
                    delete require.cache[cachePath];
                }
            }
        }
    }
}