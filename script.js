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
    const {data,error}=
