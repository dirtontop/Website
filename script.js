// Supabase
const SUPABASE_URL='https://efitddfhnqfuahovkqap.supabase.co';
const SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmaXRkZGZobnFmdWFob3ZrcWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2ODg2MTYsImV4cCI6MjA3NjI2NDYxNn0.W4DBhr_TYEdEYvnjNS0V2zNYms0qb2oZOsV3eZdTEbE';
const sb = supabase.createClient(SUPABASE_URL,SUPABASE_ANON_KEY);

let currentUser=null;

// Outer tabs
document.querySelectorAll('.tabbtn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
        const target=btn.dataset.tab;
        document.querySelectorAll('.tabbtn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tabpanel').forEach(p=>p.classList.remove('active'));
        const panel=document.getElementById(target);
        if(panel) panel.classList.add('active');
    });
});

// Dashboard inner tabs
document.querySelectorAll('.dashTab').forEach(tab=>{
    tab.addEventListener('click', ()=>{
        const target=tab.dataset.dtab;
        document.querySelectorAll('.dashTab').forEach(t=>t.classList.remove('active'));
        tab.classList.add('active');
        document.querySelectorAll('.dashPanel').forEach(p=>p.classList.remove('active'));
        const panel=document.getElementById(target);
        if(panel) panel.classList.add('active');
    });
});

// Copy buttons
document.getElementById('copyZexon').addEventListener('click', ()=>navigator.clipboard.writeText('Zexon Hub Script'));
document.getElementById('copyDirt').addEventListener('click', ()=>navigator.clipboard.writeText('Dirt Hub Script'));
document.getElementById('discordBtn').addEventListener('click', ()=>window.open('https://discord.gg/YOURINVITE','_blank'));

// Login
document.getElementById('loginBtn').addEventListener('click', async ()=>{
    const u=document.getElementById('username').value;
    const p=document.getElementById('password').value;
    const {data,error}=await sb.from('users').select().eq('username',u).single();
    if((u==='Admin'&&p==='AdminSecret123') || (data && data.password===p)){
        currentUser = { ...data, username:u };
        alert('Logged in!');
        document.querySelector('[data-tab="login"]').style.display='none';
        const dashBtn=document.querySelector('[data-tab="dashboard"]');
        dashBtn.style.display='inline-block';
        dashBtn.click();
        if(u==='Admin') document.querySelector('.dashTab[data-dtab="adminpanel"]').style.display='inline-block';
        loadKeys();
        if(u==='Admin') loadAllUsers();
    } else alert('Invalid credentials!');
});

// Signup
document.getElementById('signupBtn').addEventListener('click', async ()=>{
    const u=document.getElementById('username').value;
    const p=document.getElementById('password').value;
    const {data}=await sb.from('users').select().eq('username',u).single();
    if(data) return alert('Username exists!');
    await sb.from('users').insert([{ username:u, password:p, keys:'[]' }]);
    alert('Account created! Log in now.');
});

// Log out
document.getElementById('logoutBtn').addEventListener('click', ()=>{
    currentUser=null;
    document.querySelector('[data-tab="dashboard"]').style.display='none';
    document.querySelector('[data-tab="login"]').style.display='inline-block';
    document.querySelector('[data-tab="login"]').click();
});

// Generate new key
document.getElementById('genKeyBtn').addEventListener('click', async ()=>{
    if(!currentUser) return alert('Not logged in!');
    const newKey = Array.from({length:4},()=>Math.random().toString(36).slice(2,6).toUpperCase()).join('-');
    let keys = JSON.parse(currentUser.keys||'[]');
    keys.push(newKey);
    await sb.from('users').update({ keys: JSON.stringify(keys) }).eq('id', currentUser.id);
    currentUser.keys=JSON.stringify(keys);
    loadKeys();
    alert('Key generated: '+newKey);
});

// Load user keys
async function loadKeys(){
    if(!currentUser) return;
    let keys = JSON.parse(currentUser.keys||'[]');
    const list = document.getElementById('keysList');
    list.innerHTML='';
    keys.forEach(k=>{
        const li=document.createElement('li'); li.textContent=k; list.appendChild(li);
    });
}

// Load all users (Admin)
async function loadAllUsers(){
    const {data}=await sb.from('users').select();
    const list=document.getElementById('allUsersList');
    list.innerHTML='';
    data.forEach(u=>{
        const li=document.createElement('li');
        li.textContent=`${u.username} | ${u.password} | Keys: ${u.keys}`;
        list.appendChild(li);
    });
}

// Update profile
document.getElementById('updateProfile').addEventListener('click', async ()=>{
    if(!currentUser) return;
    const newU=document.getElementById('newUsername').value;
    const newP=document.getElementById('newPassword').value;
    const updateObj={};
    if(newU) updateObj.username=newU;
    if(newP) updateObj.password=newP;
    if(Object.keys(updateObj).length===0) return;
    await sb.from('users').update(updateObj).eq('id', currentUser.id);
    if(newU) currentUser.username=newU;
    if(newP) currentUser.password=newP;
    alert('Profile updated!');
});
