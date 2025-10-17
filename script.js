:root{
  --bg1:#9be7ff;
  --bg2:#0b1226;
  --accent:#00d4ff;
  --glass: rgba(255,255,255,0.06);
  --muted: rgba(255,255,255,0.75);
}

/* reset */
*{box-sizing:border-box;margin:0;padding:0;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial}

body{
  min-height:100vh;
  background: linear-gradient(180deg,var(--bg1),rgba(80,170,220,0.06) 30%,var(--bg2));
  color:#e9fbff;
  -webkit-font-smoothing:antialiased;
  -moz-osx-font-smoothing:grayscale;
  padding:22px;
}

.shell{max-width:1100px;margin:0 auto;}

.topbar{
  display:flex;align-items:center;justify-content:space-between;padding:14px;border-radius:14px;background:linear-gradient(90deg,rgba(255,255,255,0.03),rgba(255,255,255,0.01));
  box-shadow:0 10px 40px rgba(2,6,23,0.45);
}

.brand{display:flex;gap:12px;align-items:center}
.logo{width:56px;height:56px;border-radius:12px;background:linear-gradient(135deg,var(--accent),#60a5fa);display:flex;align-items:center;justify-content:center;color:#021124;font-weight:800;font-size:20px;box-shadow:0 6px 18px rgba(0,0,0,0.35)}
.sitename{font-weight:800;font-size:18px}
.sitename span{color:var(--accent)}
.subtitle{font-size:12px;color:var(--muted)}

.nav{display:flex;gap:8px}
.tab-btn{background:transparent;border:0;color:var(--muted);padding:8px 12px;border-radius:10px;cursor:pointer;font-weight:700}
.tab-btn.active{background:rgba(255,255,255,0.03);color:#fff}

/* main */
.main{margin-top:18px;padding:18px;border-radius:12px;background:linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01));box-shadow:0 12px 40px rgba(2,6,23,0.45)}
.tabpanel{display:none}
.tabpanel.active{display:block}
h1{font-size:28px;margin-bottom:6px}
.lead{color:var(--muted);margin-bottom:18px}

/* cards */
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}
.card{padding:14px;border-radius:12px;background:linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01));border:1px solid rgba(255,255,255,0.03)}
.row{display:flex;gap:10px;margin-top:12px;flex-wrap:wrap}

/* glass / inputs */
.glass{background:var(--glass);padding:18px;border-radius:12px}
.small{padding:12px}
input{width:100%;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.04);background:transparent;color:inherit;margin:8px 0}

/* buttons */
.btn{padding:8px 14px;border-radius:10px;border:0;font-weight:800;cursor:pointer}
.primary{background:linear-gradient(90deg,var(--accent),#60a5fa);color:#021124;box-shadow:0 6px 18px rgba(0,0,0,0.35)}
.ghost{background:transparent;border:1px solid rgba(255,255,255,0.06);color:var(--muted)}
.discord{background:#5865f2;color:#fff}
.danger{background:linear-gradient(90deg,#ff7a7a,#ff4d4d);color:#04111a}
.btn:hover{transform:translateY(-2px);transition:all 160ms ease}

/* dashboard */
.dash-controls{display:flex;gap:18px;flex-wrap:wrap}
.dash-panel{flex:1;min-width:300px}
.key-list{list-style:none;padding:0;margin-top:10px}
.key-list li{background:rgba(0,0,0,0.2);padding:8px;border-radius:8px;display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.key-item-actions button{margin-left:8px}

/* admin table */
.admin-table{width:100%;border-collapse:collapse;margin-top:12px}
.admin-table th,.admin-table td{padding:8px;border:1px solid rgba(255,255,255,0.04);text-align:center}
.admin-table tbody tr:hover{background:rgba(255,255,255,0.02)}

/* footer */
.footer{margin-top:18px;padding:12px;border-radius:8px;text-align:center;color:var(--muted);font-size:13px}

/* messages */
.msg{margin-top:8px;color:var(--accent);font-weight:700}

/* responsive */
@media (max-width:800px){.dash-controls{flex-direction:column}}
