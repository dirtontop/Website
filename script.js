// Supabase setup
const SUPABASE_URL = 'https://efitddfhnqfuahovkqap.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmaXRkZGZobnFmdWFob3ZrcWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2ODg2MTYsImV4cCI6MjA3NjI2NDYxNn0.W4DBhr_TYEdEYvnjNS0V2zNYms0qb2oZOsV3eZdTEbI';
const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Tabs
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');
const dashboardTabBtn = document.querySelector('[data-tab="dashboard"]');

tabs.forEach(tab => tab.addEventListener('click', () => {
  tabs.forEach(t=>t.classList.remove('active'));
  tab.classList.add('active');
  tabContents.forEach(tc=>tc.classList.remove('active'));
  document.getElementById(tab.dataset.tab).classList.add('active');
}));

// Register
document.getElementById('registerBtn').addEventListener('click', async ()=>{
  const username = document.getElementById('regUsername').value.trim();
  const password = document.getElementById('regPassword').value.trim();

  if(!username || !password) return;

  const { data, error } = await supabase.from('users').insert([{ username, password, keys: JSON.stringify([]) }]);
  if(error){
    document.getElementById('registerMsg').textContent = "Error: "+error.message;
  } else {
    document.getElementById('registerMsg').textContent = "Account created! You can log in.";
  }
});

// Login
let currentUser = null;
document.getElementById('loginBtn').addEventListener('click', async ()=>{
  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  const { data, error } = await supabase.from('users').select('*').eq('username', username).eq('password', password).single();
  if(error || !data){
    document.getElementById('loginMsg').textContent = "Invalid credentials!";
  } else {
    currentUser = data;
    document.getElementById('loginMsg').textContent = "Login successful!";
    dashboardTabBtn.style.display = "inline-block";
    showTab('dashboard');
    refreshKeys();
  }
});

// Dashboard
const keyList = document.getElementById('keyList');
document.getElementById('generateKey').addEventListener('click', async ()=>{
  if(!currentUser) return;
  const key = generateKey();
  let keys = JSON.parse(currentUser.keys);
  keys.push(key);
  await supabase.from('users').update({ keys: JSON.stringify(keys) }).eq('id', currentUser.id);
  currentUser.keys = JSON.stringify(keys);
  refreshKeys();
});

function generateKey(){
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let key = "";
  for(let i=0;i<16;i++){
    if(i>0 && i%4===0) key+="-";
    key += chars.charAt(Math.floor(Math.random()*chars.length));
  }
  return key;
}

function refreshKeys(){
  keyList.innerHTML="";
  const keys = JSON.parse(currentUser.keys);
  keys.forEach(k=>{
    const li = document.createElement('li');
    li.textContent = k;
    keyList.appendChild(li);
  });
}

// Logout
document.getElementById('logoutBtn').addEventListener('click', ()=>{
  currentUser = null;
  showTab('home');
  dashboardTabBtn.style.display = "none";
});

function showTab(id){
  tabContents.forEach(tc=>tc.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  tabs.forEach(t=>t.classList.remove('active'));
  document.querySelector(`[data-tab="${id}"]`)?.classList.add('active');
}
