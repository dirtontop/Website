document.addEventListener("DOMContentLoaded", () => {
    const els = {
        input: document.getElementById("input"),
        output: document.getElementById("output"),
        btnObfuscate: document.getElementById("obfuscate"),
        btnCopy: document.getElementById("copy"),
        btnClear: document.getElementById("clear"),
        preset: document.getElementById("preset"),
        target: document.getElementById("target"),
        debugMode: document.getElementById("debugMode"),
        stats: document.getElementById("statsBox"),
        instrCount: document.getElementById("instrCount"),
        genTime: document.getElementById("genTime")
    };

    const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const rndHex = (len) => [...Array(len)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    
    // Generate distinct variable names (Short & Confusing)
    function getVar() {
        const chars = ['l', 'I', '1', '0', 'O', 'L'];
        let s = "_";
        for(let i=0; i<8; i++) s += chars[rnd(0, chars.length-1)];
        return s + rndHex(3); 
    }

    // --- HANDLERS ---

    els.btnObfuscate.onclick = () => {
        const code = els.input.value;
        if (!code.trim()) return;

        els.btnObfuscate.innerText = "BUILDING VM...";
        els.btnObfuscate.disabled = true;
        els.output.value = "-- Compiling Virtual Machine Instructions...";

        setTimeout(() => {
            const startTime = performance.now();
            try {
                const config = {
                    preset: els.preset.value, // light, standard, maximum
                    target: els.target.value, // lua, roblox
                    debug: els.debugMode.checked
                };

                const result = new LuaObfuscator(code, config).obfuscate();
                
                els.output.value = result.code;
                els.instrCount.innerText = result.instructions;
                els.genTime.innerText = Math.floor(performance.now() - startTime) + "ms";
                els.stats.style.display = "flex";

            } catch (e) {
                console.error(e);
                els.output.value = "-- BUILD ERROR --\n" + e.message;
            } finally {
                els.btnObfuscate.innerText = "PROTECT SOURCE";
                els.btnObfuscate.disabled = false;
            }
        }, 50);
    };

    els.btnCopy.onclick = () => {
        if (!els.output.value) return;
        navigator.clipboard.writeText(els.output.value);
        const original = els.btnCopy.innerText;
        els.btnCopy.innerText = "COPIED";
        setTimeout(() => els.btnCopy.innerText = original, 1000);
    };

    els.btnClear.onclick = () => {
        els.input.value = "";
        els.output.value = "";
        els.stats.style.display = "none";
    };
});

/**
 * Zexon Virtual Machine Generator
 * Turns Lua source into a stream of opcodes executed by a custom interpreter.
 */
class LuaObfuscator {
    constructor(source, config) {
        this.source = source;
        this.config = config;
        
        // VM Registers (Variable Names)
        this.vars = {
            ip: getVar(),      // Instruction Pointer
            stack: getVar(),   // Virtual Stack
            instr: getVar(),   // Instruction Table
            key: getVar(),     // Rolling Key
            vm: getVar(),      // VM Loop Function
            temp: getVar()     // Temp var
        };

        this.instructions = [];
        this.startState = rnd(100000, 999999);
    }

    obfuscate() {
        // 1. Convert Source to Byte Stream
        const bytes = this.source.split('').map(c => c.charCodeAt(0));
        
        // 2. Generate Opcode Logic
        let currentState = this.startState;
        let rollingKey = rnd(1, 255);
        const initialKey = rollingKey;

        // Density Control based on Preset
        let fillerDensity = 0;
        if (this.config.preset === 'standard') fillerDensity = 1; // 1 fake per 1 real
        if (this.config.preset === 'maximum') fillerDensity = 3;  // 3 fakes per 1 real

        bytes.forEach((byte, idx) => {
            // A. Insert Fake Instructions (Decoys)
            for(let i=0; i<fillerDensity; i++) {
                this.addInstruction({
                    id: rnd(100000, 999999),
                    type: 'NO_OP', // Does nothing or modifies unused stack slots
                    next: rnd(100000, 999999) // Points to random location (Dead End)
                });
            }

            // B. Create Real Instruction (Decryption)
            const nextState = rnd(100000, 999999);
            const cipher = byte ^ rollingKey;
            
            this.addInstruction({
                id: currentState,
                type: 'DECRYPT',
                cipher: cipher,
                next: nextState
            });

            // C. Mutate Rolling Key for next step
            // VM Rule: next_key = (current_key + decrypted_byte) % 255
            rollingKey = (rollingKey + byte) % 255;
            currentState = nextState;
        });

        // 3. Mark End State
        this.addInstruction({
            id: currentState,
            type: 'EXIT',
            next: 0
        });

        // 4. Shuffle Instructions (Flatten Control Flow)
        this.instructions.sort(() => Math.random() - 0.5);

        // 5. Build Code
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

        let lua = `-- [[ Zexon Protected VM | Target: ${isRoblox ? 'Roblox' : 'Lua 5.1'} ]]\n`;
        
        // Headers
        if (isRoblox) {
            lua += `local bit32, task, string, table = bit32, task, string, table\n`;
        } else {
            lua += `local bit32=bit32;pcall(function()bit32=bit32 or require('bit')end);bit32=bit32 or{bxor=function(a,b)return a~b end}\n`;
        }

        // Initialize VM State
        lua += `local ${v.ip} = ${this.startState}\n`;
        lua += `local ${v.key} = ${initialKey}\n`;
        lua += `local ${v.stack} = {}\n`;
        lua += `local ${v.instr} = {}\n\n`;

        // Generate Instruction Table
        // Each instruction is a function that returns: NextState, NextKey
        this.instructions.forEach(ins => {
            lua += `${v.instr}[${ins.id}] = function(k, s)\n`;
            
            if (isDebug) lua += `    print("[VM] Executing State: ${ins.id} | Key: "..k)\n`;

            if (ins.type === 'DECRYPT') {
                // Entangled Logic:
                // 1. Decrypt byte: b = cipher XOR k
                // 2. Update key: nk = (k + b) % 255
                // 3. Push b to stack
                
                // Obfuscate the cipher constant using simple math
                const p1 = rnd(1, 100);
                const p2 = ins.cipher - p1;
                
                lua += `    local c = ${p1} + ${p2}\n`;
                lua += `    local b = bit32.bxor(c, k)\n`;
                lua += `    table.insert(s, string.char(b))\n`;
                lua += `    return ${ins.next}, (k + b) % 255\n`;
            
            } else if (ins.type === 'EXIT') {
                lua += `    return nil, k\n`;
            
            } else {
                // NO_OP / Decoy
                // Performs fake stack operations or returns random state
                const fakeNext = rnd(100000, 999999);
                lua += `    local _ = math.abs(math.sin(k) * 100)\n`;
                lua += `    return ${fakeNext}, k\n`;
            }
            
            lua += `end\n`;
        });

        // VM Dispatcher Loop
        lua += `
-- [[ VM DISPATCHER ]]
local function ${v.vm}()
    local c = 0
    while ${v.instr}[${v.ip}] do
        ${v.ip}, ${v.key} = ${v.instr}[${v.ip}](${v.key}, ${v.stack})
        c = c + 1
        ${isRoblox ? 'if c % 500 == 0 then task.wait() end' : ''}
    end
end

if not pcall(${v.vm}) then return end -- Crash Protection

-- [[ EXECUTION ]]
local payload = table.concat(${v.stack})
local run = (loadstring or load)(payload)
if run then run() end
`;
        return lua;
    }
}

// Helper for var gen
function getVar() {
    const chars = ['l', 'I', '1', '0', 'O', 'L'];
    let s = "_";
    for(let i=0; i<8; i++) s += chars[Math.floor(Math.random() * chars.length)];
    return s + Math.floor(Math.random() * 999).toString(16); 
}
