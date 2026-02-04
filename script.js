document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const els = {
        input: document.getElementById("input"),
        output: document.getElementById("output"),
        btnObfuscate: document.getElementById("obfuscate"),
        btnCopy: document.getElementById("copy"),
        btnClear: document.getElementById("clear"),
        preset: document.getElementById("preset"),
        target: document.getElementById("target"),
        stats: document.getElementById("statsBox"),
        lineCount: document.getElementById("lineCount"),
        genTime: document.getElementById("genTime")
    };

    // Utils
    const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const rndHex = (len) => [...Array(len)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    
    function getVar() {
        const chars = ['l', '1', 'I', 'i', 'L', '0', 'O'];
        let s = "_";
        for(let i=0; i<12; i++) s += chars[rnd(0, chars.length-1)];
        return s + "_" + rndHex(4);
    }

    // --- BUTTON HANDLERS ---

    els.btnObfuscate.onclick = () => {
        const code = els.input.value;
        if (!code.trim()) return;

        // UI Loading State
        const originalText = els.btnObfuscate.innerText;
        els.btnObfuscate.innerText = "PROCESSING...";
        els.btnObfuscate.disabled = true;
        els.output.value = "-- Generating obfuscated script...";

        // Process in Timeout to allow UI update
        setTimeout(() => {
            const startTime = performance.now();
            try {
                // Determine settings based on preset
                const preset = els.preset.value;
                const target = els.target.value;
                
                let result = "";

                if (preset === 'simple') {
                    result = generateSimple(code, target);
                } else if (preset === 'good') {
                    result = generateVM(code, target, 2500); // 2.5k lines
                } else {
                    result = generateVM(code, target, 12000); // 12k lines (EVIL)
                }

                els.output.value = result;
                
                // Update stats
                const lines = result.split('\n').length;
                const time = Math.floor(performance.now() - startTime);
                els.lineCount.innerText = `Lines: ${lines}`;
                els.genTime.innerText = `Time: ${time}ms`;
                els.stats.style.display = "flex";

            } catch (e) {
                console.error(e);
                els.output.value = "-- ERROR GENERATING CODE --\n" + e.message;
            } finally {
                els.btnObfuscate.innerText = originalText;
                els.btnObfuscate.disabled = false;
            }
        }, 50);
    };

    els.btnCopy.onclick = () => {
        if (!els.output.value) return;
        navigator.clipboard.writeText(els.output.value);
        const original = els.btnCopy.innerText;
        els.btnCopy.innerText = "COPIED!";
        setTimeout(() => els.btnCopy.innerText = original, 1000);
    };

    els.btnClear.onclick = () => {
        els.input.value = "";
        els.output.value = "";
        els.stats.style.display = "none";
    };

    // --- GENERATORS ---

    // 1. SIMPLE MODE: Just string encryption, no VM
    function generateSimple(payload, target) {
        const vPayload = getVar();
        const vFunc = getVar();
        
        // Use byte escape sequence for compactness
        let escaped = "";
        for(let i=0; i<payload.length; i++) {
            escaped += "\\" + payload.charCodeAt(i);
        }

        let lua = `-- Zexon Simple Obfuscation\n`;
        lua += `local ${vPayload} = "${escaped}"\n`;
        lua += `local ${vFunc} = (loadstring or load)(${vPayload})\n`;
        lua += `if ${vFunc} then ${vFunc}() end`;
        
        return lua;
    }

    // 2. VM MODE (Good & Evil share logic, difference is line count)
    function generateVM(payload, target, targetLines) {
        // Setup Vars
        const VAR_STATE = getVar();    
        const VAR_STACK = getVar();    
        const VAR_TABLE = getVar();    
        const VAR_RUNNER = getVar();   
        
        const bytes = payload.split('').map(c => c.charCodeAt(0));
        let states = [];
        let currentStateId = rnd(100000, 999999);
        const startId = currentStateId;

        // Create Real States
        bytes.forEach(byte => {
            const nextStateId = rnd(100000, 999999);
            const key = rnd(1, 255);
            const cipher = byte ^ key; 

            // Junk Math (To bloat lines)
            let junkCode = "";
            const junkLines = rnd(3, 6);
            for(let j=0; j<junkLines; j++) {
                const vJunk = getVar();
                junkCode += `local ${vJunk}=(${rnd(1,999)}*${rnd(1,999)})%${rnd(100,9999)}\n`;
            }

            states.push({
                code: `${VAR_TABLE}[${currentStateId}]=function()
${junkCode}local k=${key}
local v=${cipher}
table.insert(${VAR_STACK},string.char(bit32.bxor(v,k)))
return ${nextStateId}
end`
            });
            currentStateId = nextStateId;
        });

        // Create Fake States (Fill to targetLines)
        // Approx 10 lines per state
        const currentLines = states.length * 10;
        const neededLines = targetLines - currentLines;
        const fakeNodesNeeded = Math.max(0, Math.floor(neededLines / 10));

        for(let i=0; i < fakeNodesNeeded; i++) {
            const fakeId = rnd(100000, 999999);
            let junkCode = "";
            for(let j=0; j<5; j++) junkCode += `local ${getVar()}=math.sin(${rnd(1,99)})\n`;

            states.push({
                code: `${VAR_TABLE}[${fakeId}]=function()
${junkCode}return ${rnd(100000,999999)}
end`
            });
        }

        // Shuffle
        states.sort(() => Math.random() - 0.5);

        // Header
        let lua = `-- Zexon ${targetLines > 5000 ? "EVIL" : "Standard"} Protection\n`;
        
        if (target === 'roblox') {
            lua += `local bit32 = bit32\nlocal task = task\n`; 
        } else {
            lua += `local bit32=bit32;pcall(function()bit32=bit32 or require('bit')end);bit32=bit32 or{bxor=function(a,b)return a~b end}\n`;
        }

        lua += `local ${VAR_STATE}=${startId}\n`;
        lua += `local ${VAR_STACK}={}\n`;
        lua += `local ${VAR_TABLE}={}\n`;
        lua += states.map(s => s.code).join("\n");

        // Runner
        lua += `
local function ${VAR_RUNNER}()
    local c = 0
    while ${VAR_TABLE}[${VAR_STATE}] do
        c = c + 1
        ${VAR_STATE}=${VAR_TABLE}[${VAR_STATE}]()
        ${target === 'roblox' ? 'if c%500==0 then task.wait() end' : ''}
    end
end
${VAR_RUNNER}()
local payload=table.concat(${VAR_STACK})
local run=(loadstring or load)(payload)
if run then run() end`;

        return lua;
    }
});
