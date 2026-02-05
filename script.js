/* ZEXON PROFESSIONAL OBFUSCATOR ENGINE
    Core Logic: Polymorphic Virtual Machine with Entangled Control Flow
*/

// --- GLOBAL UTILITIES ---
const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const rndHex = (len) => [...Array(len)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');

// Generates variable names that are visually confusing (e.g., _l1l0I_A9F)
function getVar() {
    const chars = ['l', 'I', '1', '0', 'O', 'L'];
    let s = "_";
    for(let i=0; i<8; i++) s += chars[rnd(0, chars.length-1)];
    return s + rndHex(3); 
}

document.addEventListener("DOMContentLoaded", () => {
    // UI Elements
    const els = {
        input: document.getElementById("input"),
        output: document.getElementById("output"),
        btnObfuscate: document.getElementById("obfuscate"),
        btnCopy: document.getElementById("copy"),
        btnClear: document.getElementById("clear"),
        preset: document.getElementById("preset"),       // light, standard, maximum
        target: document.getElementById("target"),       // lua, roblox
        debugMode: document.getElementById("debugMode"), // Checkbox
        stats: document.getElementById("statsBox"),
        instrCount: document.getElementById("instrCount"),
        genTime: document.getElementById("genTime")
    };

    // --- BUTTON HANDLERS ---

    els.btnObfuscate.onclick = () => {
        const code = els.input.value;
        if (!code.trim()) return;

        // UI Loading State
        const originalText = els.btnObfuscate.innerText;
        els.btnObfuscate.innerText = "ANALYZING CONTROL FLOW...";
        els.btnObfuscate.disabled = true;
        els.output.value = "-- Initializing Virtual Machine...\n-- Entangling logical states...";

        // Run generation in a timeout to allow the UI to update
        setTimeout(() => {
            const startTime = performance.now();
            try {
                // Configuration Object
                const config = {
                    preset: els.preset.value,
                    target: els.target.value,
                    debug: els.debugMode ? els.debugMode.checked : false
                };

                // Execute the Obfuscation Engine
                const engine = new LuaObfuscator(code, config);
                const result = engine.obfuscate();
                
                // Output Result
                els.output.value = result.code;
                
                // Update Stats Panel
                els.instrCount.innerText = result.instructions;
                els.genTime.innerText = Math.floor(performance.now() - startTime) + "ms";
                els.stats.style.display = "flex";

            } catch (e) {
                console.error(e);
                els.output.value = "-- FATAL BUILD ERROR --\n" + e.message;
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
});

/**
 * THE ZEXON VIRTUAL MACHINE ENGINE
 * Transforms linear Lua code into a non-linear, state-driven VM.
 */
class LuaObfuscator {
    constructor(source, config) {
        this.source = source;
        this.config = config;
        
        // VM Registers (Randomized Variable Names)
        this.vars = {
            ip: getVar(),      // Instruction Pointer
            stack: getVar(),   // Virtual Stack
            instr: getVar(),   // Instruction Table
            key: getVar(),     // Rolling Decryption Key
            vm: getVar(),      // VM Dispatcher Function
            temp: getVar()     // Temp logic variable
        };

        this.instructions = [];
        this.startState = rnd(100000, 999999);
    }

    obfuscate() {
        // 1. Convert Source Code to Byte Stream
        const bytes = this.source.split('').map(c => c.charCodeAt(0));
        
        // 2. Initialize Logic Seeds
        let currentState = this.startState;
        let rollingKey = rnd(1, 255);
        const initialKey = rollingKey;

        // 3. Determine Density based on Preset
        // 'Light': Minimal fake code. 'Maximum': High fake density (Anti-AI).
        let fakeDensity = 0;
        if (this.config.preset === 'standard') fakeDensity = 1; 
        if (this.config.preset === 'maximum') fakeDensity = 2; 

        // 4. Generate Instruction Stream
        bytes.forEach((byte, idx) => {
            // A. Inject Fake Instructions (Decoys / Dead Ends)
            // These look real but perform useless math or modify unused stack slots.
            for(let i=0; i<fakeDensity; i++) {
                this.addInstruction({
                    id: rnd(100000, 999999),
                    type: 'NO_OP', 
                    next: rnd(100000, 999999) // Points to nowhere
                });
            }

            // B. Create Real Instruction (Entangled Decryption)
            const nextState = rnd(100000, 999999);
            
            // Logic: The byte is encrypted against the 'Rolling Key'.
            // The Rolling Key changes after every instruction.
            const cipher = byte ^ rollingKey;
            
            this.addInstruction({
                id: currentState,
                type: 'DECRYPT',
                cipher: cipher,
                next: nextState
            });

            // C. Mutate Rolling Key for the next step
            // This creates the dependency chain. You cannot skip instructions.
            rollingKey = (rollingKey + byte) % 255;
            currentState = nextState;
        });

        // 5. Add Exit State
        this.addInstruction({
            id: currentState,
            type: 'EXIT',
            next: 0
        });

        // 6. Shuffle Instructions (Flatten Control Flow)
        // This ensures the code in the file is randomized, not linear.
        this.instructions.sort(() => Math.random() - 0.5);

        // 7. Generate Final Code
        return {
            code: this.generateLua(initialKey),
            instructions: this.instructions.length
        };
    }

    addInstruction(instr) {
        this.instructions.push(instr);
    }

    generateLua(initialKey) {
        const v = this.vars;
        const isRoblox = this.config.target === 'roblox';
        const isDebug = this.config.debug;
        const level = this.config.preset.toUpperCase();

        let lua = `-- [[ ZEXON PROTECTED | ${level} SECURITY ]]\n`;
        lua += `-- [[ TARGET: ${isRoblox ? 'ROBLOX (LUAU)' : 'UNIVERSAL LUA'} ]]\n`;
        
        // --- HEADERS & POLYFILLS ---
        if (isRoblox) {
            // Roblox Optimizations: Localize Globals for speed
            lua += `local bit32, task, string, table = bit32, task, string, table\n`;
        } else {
            // Universal Lua: Pcall require('bit') for LuaJIT/5.1 compat
            lua += `local bit32=bit32;pcall(function()bit32=bit32 or require('bit')end);bit32=bit32 or{bxor=function(a,b)return a~b end}\n`;
        }

        // --- VM STATE INITIALIZATION ---
        lua += `local ${v.ip} = ${this.startState}\n`;
        lua += `local ${v.key} = ${initialKey}\n`;
        lua += `local ${v.stack} = {}\n`;
        lua += `local ${v.instr} = {}\n\n`;

        // --- INSTRUCTION TABLE GENERATION ---
        this.instructions.forEach(ins => {
            // Define the instruction function
            // Arguments: k (Current Key), s (Stack)
            lua += `${v.instr}[${ins.id}] = function(k, s)\n`;
            
            if (isDebug) {
                lua += `    print("[VM] OP: ${ins.type} | ID: ${ins.id} | Key: "..k)\n`;
            }

            if (ins.type === 'DECRYPT') {
                // --- ENTANGLED LOGIC ---
                // We split the cipher into two parts (p1, p2) to hide the constant.
                // p1 + p2 = cipher
                const p1 = rnd(1, 100);
                const p2 = ins.cipher - p1;
                
                lua += `    -- Entangled Opcode\n`;
                lua += `    local c = ${p1} + ${p2}\n`;          // Reassemble Cipher
                lua += `    local b = bit32.bxor(c, k)\n`;      // Decrypt using Rolling Key
                lua += `    table.insert(s, string.char(b))\n`; // Push to Stack
                lua += `    return ${ins.next}, (k + b) % 255\n`; // Return NextState + NewKey
            
            } else if (ins.type === 'EXIT') {
                lua += `    return nil, k\n`; // Signal VM to stop
            
            } else {
                // --- NO_OP (DECOY) ---
                // Looks like real math to confuse AI, but affects local vars only.
                const fakeNext = rnd(100000, 999999);
                lua += `    local _ = math.abs(math.sin(k) * 100)\n`;
                lua += `    return ${fakeNext}, k\n`;
            }
            
            lua += `end\n`;
        });

        // --- VM DISPATCHER LOOP ---
        lua += `
-- [[ VM DISPATCHER ]]
local function ${v.vm}()
    local c = 0
    while ${v.instr}[${v.ip}] do
        -- Execute Instruction & Update State
        ${v.ip}, ${v.key} = ${v.instr}[${v.ip}](${v.key}, ${v.stack})
        
        c = c + 1
        -- Anti-Crash: Wait every 500 ops (Roblox Only)
        ${isRoblox ? 'if c % 500 == 0 then task.wait() end' : ''}
    end
end

-- [[ EXECUTION SINK ]]
if not pcall(${v.vm}) then return end 

local payload = table.concat(${v.stack})
local run = (loadstring or load)(payload)
if run then run() end
`;
        return lua;
    }
}
