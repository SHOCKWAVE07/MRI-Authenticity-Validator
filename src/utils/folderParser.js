/**
 * Parses a FileList (from <input type="file" webkitdirectory />) into a Manifest.
 * 
 * Expected structure variants:
 * 1. Root/warmup/case_id/... & Root/test/case_id/...
 * 2. Flat list with filenames indicating phase and type.
 * 
 * We will assume a structure where Phase is a directory name (warmup/test)
 * and within that, we look for triplets.
 * 
 * Heuristic:
 * - Filter images (png, jpg, jpeg, bmp, tiff).
 * - Split path. Look for 'warmup' or 'test' in path segments.
 * - Group by directory.
 * - In each directory, look for 3 files answering to 'input', 'real', 'synth'.
 */
export async function parseFolder(fileList) {
    const manifest = {
        warmup: [],
        test: []
    };

    const files = Array.from(fileList);

    // Helper to read file as object URL
    const getUrl = (file) => URL.createObjectURL(file);

    // Group by directory path
    const dirMap = new Map(); // path -> [file, file...]

    for (const file of files) {
        // webkitRelativePath example: "MyData/warmup/case1/image.png"
        const path = file.webkitRelativePath;
        if (!path) continue; // Should not happen with webkitdirectory

        // Check extension
        if (!/\.(png|jpg|jpeg|bmp|tiff|tif)$/i.test(path)) continue;

        const parts = path.split('/');
        const filename = parts.pop();
        const dirPath = parts.join('/');

        if (!dirMap.has(dirPath)) dirMap.set(dirPath, []);
        dirMap.get(dirPath).push({ file, filename, path });
    }

    // Process groups
    dirMap.forEach((group, dirPath) => {
        // Determine phase
        const lowerPath = dirPath.toLowerCase();
        let phase = null;
        if (lowerPath.includes('warmup')) phase = 'warmup';
        else if (lowerPath.includes('test')) phase = 'test';

        if (!phase) return; // Skip if not in known phase folder

        let input, real, synth, target;

        // ID is usually the directory name
        const id = dirPath.split('/').pop() || `case_${Math.random().toString(36).substr(2, 5)}`;

        group.forEach(item => {
            const name = item.filename.toLowerCase();
            // Extract modality: last part after underscore, before extension
            // e.g. "case1_real_T1.png" -> "T1"
            const nameWithoutExt = item.filename.substring(0, item.filename.lastIndexOf('.'));
            const parts = nameWithoutExt.split('_');
            const modality = parts.length > 1 ? parts[parts.length - 1] : '';

            item.modality = modality;

            if (name.includes('input') || name.includes('source')) input = item;
            else if (name.includes('real')) real = item;
            else if (name.includes('synth') || name.includes('generated') || name.includes('fake')) synth = item;
            else if (name.includes('target')) target = item;
        });

        // Warmup: Needs Input + (Real AND Synth) OR (Input + Target + TruthMetadata? No, prompt says retain all 3)
        // Admin Portal puts input, real, synthetic in warmup.
        if (phase === 'warmup') {
            if (input && real && synth) {
                manifest.warmup.push({
                    id,
                    input: getUrl(input.file),
                    real: getUrl(real.file),
                    synthetic: getUrl(synth.file),
                    inputModality: input.modality,
                    realModality: real.modality,
                    syntheticModality: synth.modality
                });
            }
        }
        // Test: Needs Input + Target
        else if (phase === 'test') {
            // Supports Blinded (input + target) OR Unblinded Triplets (fallback/dev mode)
            if (input && target) {
                manifest.test.push({
                    id,
                    input: getUrl(input.file),
                    target: getUrl(target.file),
                    inputModality: input.modality,
                    targetModality: target.modality
                    // No real/synth here, blind!
                });
            }
            // Fallback for dev: if we have real/synth but no target, maybe we want to use them? 
            // But strictly speaking, the expert package has target.
        }
    });

    return manifest;
}
