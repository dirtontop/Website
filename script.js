document.addEventListener("DOMContentLoaded", () => {
    // UI Elements
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

    // --- UTILITIES ---
    const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const rndHex = (len) => [...Array(len)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    
    // Generate distinct, confusing variable names
    function getVar() {
        // Mix of l, I, 1, 0 is classic but effective visual noise
        const chars = ['l', 'I', '1', '0', 'O', 'L'];
        let s = "_";
        for(let i=0; i<10; i++) s += chars[rnd(0, chars.length-1)];
        // Add a hex suffix to ensure mathematical uniqueness (prevents collisions)
        return s + "_" + rndHex(4); 
    }

    // --- CORE HANDLERS ---

    els.btnObfuscate.onclick = () => {
        const code = els.input.value;
        if (!code.trim()) return;

        // UI Feedback
        const originalText = els.btnObfuscate.innerText;
        els.btnObfuscate.innerText = "ENTANGLING LOGIC...";
        els.btnObfuscate.disabled = true;
        els.output.value = "-- Analyzing control flow...\n-- Generating entangled state machine...";

        // Process async to keep UI responsive
        setTimeout(() => {
            const startTime = performance.now();
            try {
                const preset = els.preset.value;
                const target = els.target.value;
                
                let result = "";

                if (preset === 'simple') {
                    result = generateSimple(code);
                } else if (preset === 'good') {
                    // Good: ~3000 lines, standard entanglement
                    result = generateEntangledVM(code, target, 3000); 
                } else {
                    // Evil: ~10000 lines, heavy entanglement
                    result = generateEntangledVM(code, target, 10000); 
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
                els.output.value = "-- FATAL ERROR --\n" + e.message;
            } finally {
                els.btnObfuscate.innerText = originalText;
                els.btnObfuscate.disabled = false;
            }
        }, 100);
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

    // --- GENERATION ENGINES ---

    function generateSimple(payload) {
        // Fast, lightweight string escape (For small scripts)
        const vPayload = getVar();
        const vFunc = getVar();
        let escaped = "";
        for(let i=0; i<payload.length; i++) escaped += "\\" + payload.charCodeAt(i);
        return `-- Zexon Simple\nlocal ${vPayload}="${escaped}"\nlocal ${vFunc}=(loadstring or load)(${vPayload})\nif ${vFunc} then ${vFunc}() end`;
    }

    // --- THE ENTANGLED VM (Anti-AI) ---
    function generateEntangledVM(payload, target, targetLines) {
        // 1. Setup Environment
        const VAR_STATE = getVar();    // Current State ID
        const VAR_STACK = getVar();    // Virtual Stack
        const VAR_TABLE = getVar();    // Function Table
        const VAR_RUNNER = getVar();   // Dispatcher
        const VAR_KEY = getVar();      // Rolling Decryption Key

        const bytes = payload.split('').map(c => c.charCodeAt(0));
        let states = [];
        
        // Initial seeds
        let currentStateId = rnd(100000, 999999);
        const startId = currentStateId;
        let rollingKey = rnd(1, 255); // The key evolves every step

        // 2. Build Real Logic States
        bytes.forEach((byte, index) => {
            const nextStateId = rnd(100000, 999999);
            
            // --- ENTANGLEMENT LOGIC ---
            // Instead of storing 'byte', we calculate it dynamically
            // Target: We need 'cipher' such that: (cipher XOR rollingKey) = byte
            const cipher = byte ^ rollingKey;
            
            // To prevent AI form seeing constants, we split 'cipher' into two variables
            // v1 + v2 = cipher (roughly, using XOR or math)
            const splitA = rnd(1, 255);
            const splitB = cipher ^ splitA; // A ^ B = cipher

            // Update rolling key for NEXT byte (Chain Dependency)
            const nextKey = (rollingKey + byte) % 255;
            
            // --- MATH GENERATION ---
            // We create 2 random variables that LOOK like junk, but are used to build the result.
            const vMath1 = getVar();
            const vMath2 = getVar();
            const val1 = rnd(10, 500);
            const val2 = rnd(10, 500);
            
            // We need to return 'nextStateId'.
            // Instead of 'return 12345', we do 'return (calculated_junk) + offset'
            const mathResult = val1 + val2; // The result of the "Junk"
            const stateOffset = nextStateId - mathResult; 

            states.push({
                code: `${VAR_TABLE}[${currentStateId}]=function(k)
    -- Entangled Variables (AI cannot delete these)
    local ${vMath1} = ${val1}
    local ${vMath2} = ${val2}
    
    -- Opcode Logic
    local p1 = ${splitA}
    local p2 = ${splitB}
    local c = bit32.bxor(p1, p2) -- Reassemble Cipher
    local b = bit32.bxor(c, k)   -- Decrypt Byte using Rolling Key
    
    table.insert(${VAR_STACK}, string.char(b))
    
    -- Mutate Key for next state
    local nk = (k + b) % 255
    
    -- Calculated Transition (Entangled)
    -- If AI removes vMath vars, this calculation fails
    return (${vMath1} + ${vMath2}) + ${stateOffset}, nk
end`
            });

            currentStateId = nextStateId;
            rollingKey = nextKey;
        });

        // 3. Fill with Fake States (to reach targetLines)
        // We calculate how many we need. Each state is ~12 lines.
        const currentLines = states.length * 12;
        const needed = Math.max(0, Math.floor((targetLines - currentLines) / 12));

        for(let i=0; i < needed; i++) {
            const fakeId = rnd(100000, 999999);
            // Fake math that looks real
            const vF1 = getVar();
            const vF2 = getVar();
            
            states.push({
                code: `${VAR_TABLE}[${fakeId}]=function(k)
    local ${vF1} = math.random(1,999)
    local ${vF2} = (${vF1} * 2) % 255
    -- Dead End
    return ${rnd(100000,999999)}, k
end`
            });
        }

        // 4. Shuffle States (Control Flow Flattening)
        states.sort(() => Math.random() - 0.5);

        // 5. Build Header
        let lua = `-- [[ ZEXON PROTECTED | ${targetLines > 5000 ? "EVIL" : "STANDARD"} MODE ]]\n`;
        lua += `-- [[ ENTANGLEMENT: ACTIVE | ROLLING KEYS: ACTIVE ]]\n`;
        
        if (target === 'roblox') {
            lua += `local bit32 = bit32\nlocal task = task\n`;
        } else {
            lua += `local bit32=bit32;pcall(function()bit32=bit32 or require('bit')end);bit32=bit32 or{bxor=function(a,b)return a~b end}\n`;
        }
        
        // Initial Seed
        const initialKey = rnd(1, 255); 
        // We must offset the first key because the loop calculates 'rollingKey'
        // Actually, we pass initialKey into the first function.
        
        lua += `local ${VAR_STATE}=${startId}\n`;
        lua += `local ${VAR_KEY}=${initialKey}\n`; // Start Key
        lua += `local ${VAR_STACK}={}\n`;
        lua += `local ${VAR_TABLE}={}\n`;
        
        lua += states.map(s => s.code).join("\n");

        // 6. Build Dispatcher
        lua += `
-- [[ VM DISPATCHER ]]
local function ${VAR_RUNNER}()
    local c = 0
    while ${VAR_TABLE}[${VAR_STATE}] do
        c = c + 1
        -- Pass Key, Get New State + New Key
        ${VAR_STATE}, ${VAR_KEY} = ${VAR_TABLE}[${VAR_STATE}](${VAR_KEY})
        ${target === 'roblox' ? 'if c%500==0 then task.wait() end' : ''}
    end
end
${VAR_RUNNER}()

-- [[ EXECUTION ]]
local payload=table.concat(${VAR_STACK})
local run=(loadstring or load)(payload)
if run then run() end`;

        return lua;
    }
});
