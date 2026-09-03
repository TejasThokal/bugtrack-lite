import { useState, useEffect } from 'react'

export default function App() {
  const [bugs, setBugs] = useState([])
  const [title, setTitle] = useState("")
  const [priority, setPriority] = useState("P1 • High")

  useEffect(() => {
    fetch("http://localhost:8000/bugs").then(r=>r.json()).then(d=>{
      if(d.length===0){
        setBugs([
          {id:1, title:"Login crashes on Safari 17", desc:"TypeError on form submit", priority:"P1 • High", status:"Open", tag:"Frontend"},
          {id:2, title:"Payment webhook failing", desc:"Stripe event not received", priority:"P1 • High", status:"Open", tag:"Payments"},
          {id:3, title:"CSV export timeout", desc:">10k rows hangs after 30s", priority:"P2 • Medium", status:"In Progress", tag:"Backend"},
          {id:4, title:"Dark mode not persisting", desc:"localStorage fix needed", priority:"P2 • Medium", status:"In Progress", tag:"UI/UX"},
          {id:5, title:"Fix onboarding typo", desc:"Getting Started -> Started", priority:"P3 • Low", status:"Closed", tag:"Docs"},
        ])
      } else setBugs(d)
    })
  }, [])

  const addBug = async () => {
    if(!title) return
    const m={"P1 • High":"High","P2 • Medium":"Medium","P3 • Low":"Low"}
    const nb={id:Date.now(), title, description:title, priority:m[priority], status:"Open"}
    await fetch("http://localhost:8000/bugs",{method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(nb)})
    setBugs([{id:nb.id, title, desc:title, priority, status:"Open", tag:"Frontend"},...bugs])
    setTitle("")
  }

  const col = (p) => p.includes("P1")? "#ff3b30" : p.includes("P2")? "#ff9500" : "#34c759"

  return (
    <div style={{background:"#0a0a0b", minHeight:"100vh", fontFamily:"Inter, sans-serif", color:"white", overflowX:"hidden"}}>
      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes glow { 0%,100% { box-shadow:0 0 20px rgba(124,92,255,0.2); } 50% { box-shadow:0 0 30px rgba(124,92,255,0.4); } }
       .card { animation:slideIn 0.4s ease forwards; transition:all 0.2s ease; cursor:pointer; }
       .card:hover { transform:translateY(-4px) scale(1.02); box-shadow:0 12px 24px rgba(0,0,0,0.4); border-color:#7c5cff!important; }
       .shimmer { background:linear-gradient(90deg, #1a1a1f 25%, #252530 50%, #1a1a1f 75%); background-size:200% 100%; animation:shimmer 2s infinite; }
        @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
      `}</style>

      {/* HEADER */}
      <div style={{background:"rgba(15,15,20,0.8)", backdropFilter:"blur(20px)", borderBottom:"1px solid #222", padding:"16px 28px", display:"flex", justifyContent:"space-between", position:"sticky", top:0, zIndex:10}}>
        <div style={{display:"flex", alignItems:"center", gap:12}}>
          <div style={{width:32, height:32, background:"linear-gradient(135deg,#7c5cff,#5c6cff)", borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center", animation:"glow 2s infinite"}}>🐛</div>
          <b style={{fontSize:17}}>BugTrack Lite</b><span style={{background:"#1a1a1f", padding:"4px 10px", borderRadius:20, fontSize:11, color:"#888"}}>Mini JIRA • {bugs.length} issues</span>
        </div>
        <div style={{display:"flex", gap:10}}>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="✨ What needs to be fixed?" style={{background:"#1a1a1f", border:"1px solid #2a2a32", color:"white", padding:"9px 14px", borderRadius:10, width:240, outline:"none"}}/>
          <select value={priority} onChange={e=>setPriority(e.target.value)} style={{background:"#1a1a1f", color:"white", border:"1px solid #2a2a32", borderRadius:10, padding:"9px"}}><option>P1 • High</option><option>P2 • Medium</option><option>P3 • Low</option></select>
          <button onClick={addBug} style={{background:"white", color:"black", padding:"9px 18px", borderRadius:10, border:"none", fontWeight:700, cursor:"pointer", transition:"0.2s"}}>+ New</button>
        </div>
      </div>

      {/* BOARD */}
      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20, padding:24, maxWidth:1400, margin:"0 auto"}}>
        {["Open","In Progress","Closed"].map((s,i)=>(
          <div key={s} style={{background:"#111113", border:"1px solid #1e1e24", borderRadius:16, padding:16, minHeight:500}}>
            <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16}}>
              <div style={{display:"flex", alignItems:"center", gap:8}}><div style={{width:8, height:8, borderRadius:50, background: s==="Open"?"#3b82f6": s==="In Progress"?"#a855f7":"#22c55e", boxShadow:`0 0 10px ${s==="Open"?"#3b82f6": s==="In Progress"?"#a855f7":"#22c55e"}`}}></div><b style={{fontSize:13, letterSpacing:0.5}}>{s.toUpperCase()}</b><span style={{background:"#1a1a1f", padding:"2px 8px", borderRadius:20, fontSize:11}}>{bugs.filter(b=>b.status===s).length}</span></div>
              <span style={{fontSize:11, color:"#555"}}>{s==="Open"?"● To do":"● Active"}</span>
            </div>
            <div style={{display:"flex", flexDirection:"column", gap:12}}>
              {bugs.filter(b=>b.status===s).map((b,idx)=>(
                <div key={b.id} className="card" style={{background:"#18181b", border:"1px solid #232326", borderRadius:12, padding:14, animationDelay:`${idx*0.07}s`, borderLeft:`3px solid ${col(b.priority)}`}}>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}><span style={{background:col(b.priority)+"20", color:col(b.priority), fontSize:10, padding:"3px 8px", borderRadius:6, fontWeight:700, border:`1px solid ${col(b.priority)}30`}}>{b.priority}</span><span style={{fontSize:10, color:"#666"}}>BUG-{String(b.id).slice(-4)}</span></div>
                  <div style={{fontWeight:600, fontSize:13.5, marginTop:10, lineHeight:1.4}}>{b.title}</div>
                  <div style={{fontSize:11.5, color:"#888", marginTop:6}}>{b.desc}</div>
                  <div style={{marginTop:12, display:"flex", justifyContent:"space-between", alignItems:"center"}}><span style={{background:"#1f1f23", fontSize:10, padding:"4px 8px", borderRadius:6, color:"#aaa"}}>{b.tag}</span><div style={{display:"flex", gap:4}}><div style={{width:20, height:20, borderRadius:50, background:"linear-gradient(135deg,#ff7a7a,#ff3b30)"}}></div><div style={{width:20, height:20, borderRadius:50, background:"#222", border:"1px dashed #333", display:"flex", alignItems:"center", justifyContent:"center", fontSize:8}}>+</div></div></div>
                </div>
              ))}
              <div style={{border:"1px dashed #232326", borderRadius:12, padding:16, textAlign:"center", color:"#444", fontSize:12, cursor:"pointer"}}>+ Add issue</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{textAlign:"center", color:"#333", fontSize:11, paddingBottom:20}}>✨ Built with FastAPI + React + Animation • Hover cards for magic</div>
    </div>
  )
}