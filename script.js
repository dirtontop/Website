// Supabase initialization
const SUPABASE_URL = 'https://efitddfhnqfuahovkqap.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmaXRkZGZobnFmdWFob3ZrcWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2ODg2MTYsImV4cCI6MjA3NjI2NDYxNn0.W4DBhr_TYEdEYvnjNS0V2zNYms0qb2oZOsV3eZdTEbE';
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

let currentUser = null;

// DOM Elements
const tabBtns = document.querySelectorAll('.tabbtn');
const tabPanels = document.querySelectorAll('.tabpanel');

// Tab switching
tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    tabPanels.forEach(panel => panel.classList.remove('active'));
    document.getElementById(tab).classList.add('active');
  });
});

// Copy buttons
document.getElementById('copyZexon').addEventListener('click', ()=>navigator.clipboard.writeText('Zexon Hub Script'));
document.getElementById('copyDirt').addEventListener('click', ()=>navigator.clipboard.writeText('Dirt Hub Script'));
document.getElementById('discordBtn').addEventListener('click', ()=>window.open('https://discord.gg/YOURINVITE','_blank'));

// Login
document.getElementById('loginBtn').addEventListener('click', async () => {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    const { data, error } = await sb.from('users').select('*').eq('username', u).single();
    if ((u === 'Admin' && p==='AdminSecret123') || (data && data.password === p)) {
        currentUser = data || {username:'Admin', id:'admin', keys:'[]'};
        enterDashboard();
    } else alert('Login failed');
});

// Signup
document.getElementById('signupBtn').addEventListener('click', async () => {
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;
    if (!u || !p) return alert('Enter credentials');
    const { data: exists } = await sb.from('users').select('*').eq('username', u).single();
    if (exists) return alert('Username taken');
    const { error } = await sb.from('users').insert([{ username:u, password:p, keys:'[]' }]);
    if (error) return alert('Signup failed');
    alert('Account created! Now log in.');
});

// Dashboard helpers
function enterDashboard(){
    document.querySelector('[data-tab="dashboard"]').style.display='inline-block';
    document.querySelector('[data-tab="login"]').style.display='none';
    document.querySelectorAll('.tabbtn').forEach(b=>b.classList.remove('active'));
    document.querySelector('[data-tab="dashboard"]').classList.add('active');
    tabPanels.forEach(p=>p.classList.remove('active'));
    document.getElementById('dashboard').classList.add('active');
    refreshKeys();
    if(currentUser.username==='Admin'){
        document.querySelector('[data-dtab="adminpanel"]').style.display='inline-block';
        refreshAllUsers();
    }
}

// Dashboard tab switching
const dashTabs = document.querySelectorAll('.dashTab');
const dashPanels = document.querySelectorAll('.dashPanel');
dashTabs.forEach(tab=>{
    tab.addEventListener('click', ()=>{
        dashTabs.forEach(t=>t.classList.remove('active'));
        tab.classList.add('active');
        const dtab = tab.dataset.dtab;
        dashPanels.forEach(p=>p.classList.remove('active'));
        document.getElementById(dtab).classList.add('active');
    });
});

// Generate random key
function generateRandomKey(){
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const make = ()=>Array.from({length:4}, ()=>chars[Math.floor(Math.random()*chars.length)]).join('');
    return `${make()}-${make()}-${make()}-${make()}`;
}

// Generate key button
document.getElementById('genKeyBtn').addEventListener('click', async ()=>{
    const newKey = generateRandomKey();
    let keys = JSON.parse(currentUser.keys || '[]');
    keys.push(newKey);
    if(currentUser.username!=='Admin'){
        const { error } = await sb.from('users').update({ keys: JSON.stringify(keys) }).eq('id', currentUser.id);
        if(error) return alert('Failed to save key');
    } else currentUser.keys = JSON.stringify(keys);
    refreshKeys();
});

// Refresh keys list
function refreshKeys(){
    const list = document.getElementById('keysList');
    list.innerHTML='';
    (JSON.parse(currentUser.keys||'[]')).forEach(k=>{
        const li=document.createElement('li');
        li.textContent=k;
        list.appendChild(li);
    });
}

// Settings update
document.getElementById('updateProfile').addEventListener('click', async ()=>{
    const newU = document.getElementById('newUsername').value;
    const newP = document.getElementById('newPassword').value;
    let updates={};
    if(newU) updates.username=newU;
    if(newP) updates.password=newP;
    if(Object.keys(updates).length===0) return alert('Enter new username or password');
    if(currentUser.username!=='Admin'){
        const { error } = await sb.from('users').update(updates).eq('id', currentUser.id);
        if(error) return alert('Update failed');
        Object.assign(currentUser, updates);
    } else Object.assign(currentUser, updates);
    alert('Profile updated!');
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', ()=>{
    currentUser=null;
    document.querySelector('[data-tab="dashboard"]').style.display='none';
    document.querySelector('[data-tab="login"]').style.display='inline-block';
    tabBtns.forEach(b=>b.classList.remove('active'));
    document.querySelector('[data-tab="login"]').classList.add('active');
    tabPanels.forEach(p=>p.classList.remove('active'));
    document.getElementById('login').classList.add('active');
});

// Admin: view all users
async function refreshAllUsers(){
    const list = document.getElementById('allUsersList');
    list.innerHTML='';
    const { data } = await sb.from('users').select('*');
    if(!data) return;
    data.forEach(u=>{
        const li=document.createElement('li');
        li.textContent=`${u.username} | ${u.password} | Keys: ${u.keys}`;
        list.appendChild(li);
    });
}

// Set current year
document.getElementById('year').textContent = new Date().getFullYear();
