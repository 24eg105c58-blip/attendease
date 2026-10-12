import React, { useEffect, useMemo, useState } from 'react';
import { Activity, BookOpen, CalendarCheck, ChevronDown, CircleAlert, GraduationCap, LayoutDashboard, LogOut, Search, ShieldCheck, Users } from 'lucide-react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
const demo = { ADMIN:{email:'admin@attendease.com',password:'admin123'}, FACULTY:{email:'faculty@attendease.com',password:'faculty123'}, STUDENT:{email:'student@attendease.com',password:'student123'} };

export default function App() {
  const [user,setUser] = useState(null);
  const [email,setEmail] = useState(demo.ADMIN.email);
  const [password,setPassword] = useState(demo.ADMIN.password);
  const [role,setRole] = useState('ADMIN');
  const [section,setSection] = useState('Overview');
  const [users,setUsers] = useState([]);
  const [subjects,setSubjects] = useState([]);
  const [records,setRecords] = useState([]);
  const [summary,setSummary] = useState(null);
  const [query,setQuery] = useState('');
  const [notice,setNotice] = useState('');
  const [studentId,setStudentId] = useState('3');
  const [subjectId,setSubjectId] = useState('1');
  const [status,setStatus] = useState('PRESENT');
  const [attendanceDate,setAttendanceDate] = useState(new Date().toISOString().slice(0,10));
  const [newName,setNewName] = useState('');
  const [newEmail,setNewEmail] = useState('');
  const [newPassword,setNewPassword] = useState('student123');
  const [newRole,setNewRole] = useState('STUDENT');

  async function api(path, options={}) {
    const res = await fetch(`${API}${path}`, { ...options, headers:{'Content-Type':'application/json', ...(options.headers||{})} });
    const body = await res.json().catch(()=>({}));
    if(!res.ok) throw new Error(body.message || `Request failed (${res.status})`);
    return body;
  }
  async function refresh() {
    try {
      const [u,s,a] = await Promise.all([api('/users'),api('/subjects'),api('/attendance')]);
      setUsers(u); setSubjects(s); setRecords(a);
      const sid = user?.role==='STUDENT' ? user.id : Number(studentId || 3);
      if(sid) setSummary(await api(`/attendance/summary?studentId=${sid}`).catch(()=>null));
    } catch(e) { setNotice(`Backend connection: ${e.message}. Start the Spring Boot API and MySQL.`); }
  }
  useEffect(()=>{ if(user) refresh(); },[user]);
  const filtered = useMemo(()=>records.filter(r => `${r.studentName} ${r.subject} ${r.status} ${r.date}`.toLowerCase().includes(query.toLowerCase())),[records,query]);
  async function login(e) {
    e.preventDefault();
    try { const u=await api('/auth/login',{method:'POST',body:JSON.stringify({email,password})}); setUser(u); setRole(u.role); setSection('Overview'); setNotice(`Welcome back, ${u.name}`); }
    catch(err) { setNotice(err.message); }
  }
  function logout(){setUser(null);setNotice('');}
  async function markAttendance(e) {
    e.preventDefault();
    try { await api('/attendance',{method:'POST',body:JSON.stringify({studentId:Number(studentId),subjectId:Number(subjectId),date:attendanceDate,status})}); setNotice('Attendance recorded successfully.'); await refresh(); }
    catch(err){setNotice(err.message);}
  }
  async function addUser(e) {
    e.preventDefault();
    try { await api('/users',{method:'POST',body:JSON.stringify({name:newName,email:newEmail,password:newPassword,role:newRole})}); setNewName('');setNewEmail('');setNotice('User created.');await refresh(); }
    catch(err){setNotice(err.message);}
  }
  const nav = [
    {name:'Overview',icon:LayoutDashboard,roles:['ADMIN','FACULTY','STUDENT']},
    {name:'Attendance',icon:CalendarCheck,roles:['ADMIN','FACULTY','STUDENT']},
    {name:'Students & Staff',icon:Users,roles:['ADMIN']},
    {name:'Subjects',icon:BookOpen,roles:['ADMIN','FACULTY']}
  ].filter(x=>x.roles.includes(user?.role));
  if(!user) return <div className="login-wrap"><div className="login-card"><div className="brand-mark"><GraduationCap size={28}/></div><div className="eyebrow">SMART ATTENDANCE PLATFORM</div><h1>Welcome to <span>AttendEase</span></h1><p className="muted">One simple place to track every class.</p><form onSubmit={login} className="login-form"><label>Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)} required/></label><label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} required/></label><button className="primary full">Sign in <span>→</span></button></form><div className="demo-box"><strong>Demo accounts</strong>{Object.entries(demo).map(([r,d])=><button key={r} className="demo-row" onClick={()=>{setRole(r);setEmail(d.email);setPassword(d.password)}}><span>{r}</span><small>{d.email}</small><span>↗</span></button>)}</div>{notice&&<div className="notice">{notice}</div>}</div><div className="login-aside"><div className="aside-orb orb-one"/><div className="aside-orb orb-two"/><div className="aside-content"><div className="aside-tag"><ShieldCheck size={16}/> SMARTER CAMPUS. SIMPLER DAYS.</div><h2>Every class<br/>counts.</h2><p>Attendance insights that help students stay on track and faculty stay focused.</p><div className="aside-stats"><div><strong>Real-time</strong><small>Tracking</small></div><div><strong>Role-based</strong><small>Access</small></div><div><strong>One place</strong><small>For everyone</small></div></div></div></div></div>;

  return <div className="app-shell"><aside className="sidebar"><div className="logo"><div className="logo-icon"><GraduationCap size={22}/></div><div><b>AttendEase</b><small>SMART CAMPUS</small></div></div><div className="nav-caption">WORKSPACE</div><nav>{nav.map(n=><button key={n.name} className={section===n.name?'nav-item active':'nav-item'} onClick={()=>setSection(n.name)}><n.icon size={18}/>{n.name}{section===n.name&&<span className="nav-dot"/>}</button>)}</nav><div className="sidebar-bottom"><div className="secure-label"><ShieldCheck size={15}/> Secure workspace</div><div className="profile"><div className="avatar">{user.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><div className="profile-text"><b>{user.name}</b><small>{user.role.toLowerCase()}</small></div><button className="icon-btn" onClick={logout} title="Sign out"><LogOut size={17}/></button></div></div></aside><main className="main"><header className="topbar"><div><div className="breadcrumb">Workspace <span>/</span> {section}</div><h2>{section==='Overview'?'Dashboard overview':section}</h2></div><div className="top-right"><div className="today"><CalendarCheck size={16}/>{new Date().toLocaleDateString(undefined,{weekday:'short',month:'short',day:'numeric',year:'numeric'})}</div><div className="top-avatar">{user.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div></div></header>{notice&&<div className="notice" role="status">{notice}<button onClick={()=>setNotice('')}>×</button></div>}
  {section==='Overview'&&<><div className="welcome"><div><div className="eyebrow">YOUR CAMPUS AT A GLANCE</div><h1>Good day, {user.name.split(' ')[0]} <span>✦</span></h1><p>Here’s what’s happening with attendance today.</p></div><div className="welcome-art"><div className="art-ring"><GraduationCap size={42}/></div><div className="art-spark">✦</div></div></div><div className="stats-grid"><Stat icon={Users} label="Registered users" value={users.length} foot="Across all roles"/><Stat icon={BookOpen} label="Active subjects" value={subjects.length} foot="Available courses"/><Stat icon={CalendarCheck} label="Attendance entries" value={records.length} foot="Records to date"/><Stat icon={Activity} label="Attendance rate" value={summary?`${summary.percentage}%`:'—'} foot={summary?.shortage?'Below 75% target':'Selected student'} alert={summary?.shortage}/></div><div className="content-grid"><section className="panel attendance-panel"><div className="panel-heading"><div><h3>Recent attendance</h3><p>Latest records across your classes</p></div><button className="text-btn" onClick={()=>setSection('Attendance')}>View all ↗</button></div><Records records={filtered.slice(0,5)}/></section><section className="panel insight-panel"><div className="panel-heading"><div><h3>Attendance insight</h3><p>Student attendance summary</p></div><CircleAlert size={19} className="muted-icon"/></div><label className="field-label">Student ID<select value={studentId} onChange={e=>setStudentId(e.target.value)}>{users.filter(u=>u.role==='STUDENT').map(u=><option key={u.id} value={u.id}>{u.name} (#{u.id})</option>)}</select></label><div className="percentage"><strong>{summary?`${summary.percentage}`:'0'}<small>%</small></strong><span className={summary?.shortage?'pill warning':'pill good'}>{summary?.shortage?'Shortage alert':'On track'}</span></div><div className="progress"><span style={{width:`${Math.min(summary?.percentage||0,100)}%`}}/></div><div className="insight-meta"><span>Attended <b>{summary?.attended||0}</b></span><span>Total classes <b>{summary?.totalClasses||0}</b></span></div><p className="helper">Required attendance: 75%. Present and late entries count as attended.</p><button className="secondary full" onClick={refresh}>Refresh summary</button></section></div></>}
  {section==='Attendance'&&<><section className="panel form-panel"><div className="panel-heading"><div><h3>Record attendance</h3><p>Mark a student's status for a subject and date</p></div><CalendarCheck size={20} className="muted-icon"/></div>{user.role!=='STUDENT'?<form className="attendance-form" onSubmit={markAttendance}><label>Student<select value={studentId} onChange={e=>setStudentId(e.target.value)}>{users.filter(u=>u.role==='STUDENT').map(u=><option key={u.id} value={u.id}>{u.name} (ID {u.id})</option>)}</select></label><label>Subject<select value={subjectId} onChange={e=>setSubjectId(e.target.value)}>{subjects.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}</select></label><label>Date<input type="date" value={attendanceDate} onChange={e=>setAttendanceDate(e.target.value)} required/></label><label>Status<select value={status} onChange={e=>setStatus(e.target.value)}><option>PRESENT</option><option>ABSENT</option><option>LATE</option></select></label><button className="primary">Save attendance</button></form>:<p className="helper">Student accounts can view attendance but cannot mark records.</p>}</section><section className="panel table-panel"><div className="panel-heading"><div><h3>Attendance records</h3><p>Search and review recorded attendance</p></div><div className="searchbox"><Search size={16}/><input placeholder="Search records..." value={query} onChange={e=>setQuery(e.target.value)}/></div></div><Records records={user.role==='STUDENT'?filtered.filter(r=>r.studentId===user.id):filtered}/></section></>}
  {section==='Students & Staff'&&<><section className="panel form-panel"><div className="panel-heading"><div><h3>Add a user</h3><p>Create a student, faculty, or admin profile</p></div><Users size={20} className="muted-icon"/></div><form className="attendance-form user-form" onSubmit={addUser}><label>Full name<input value={newName} onChange={e=>setNewName(e.target.value)} required placeholder="e.g. Ananya Rao"/></label><label>Email<input type="email" value={newEmail} onChange={e=>setNewEmail(e.target.value)} required placeholder="name@college.edu"/></label><label>Temporary password<input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required minLength="6"/></label><label>Role<select value={newRole} onChange={e=>setNewRole(e.target.value)}><option>STUDENT</option><option>FACULTY</option><option>ADMIN</option></select></label><button className="primary">Create user</button></form></section><section className="panel table-panel"><div className="panel-heading"><div><h3>People directory</h3><p>All registered campus users</p></div><div className="searchbox"><Search size={16}/><input placeholder="Search people..." value={query} onChange={e=>setQuery(e.target.value)}/></div></div><div className="table-scroll"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead><tbody>{users.filter(u=>`${u.name} ${u.email} ${u.role}`.toLowerCase().includes(query.toLowerCase())).map(u=><tr key={u.id}><td><b>{u.name}</b></td><td>{u.email}</td><td><span className="pill neutral">{u.role}</span></td></tr>)}</tbody></table></div></section></>}
  {section==='Subjects'&&<section className="panel table-panel"><div className="panel-heading"><div><h3>Subjects & courses</h3><p>Subjects available for attendance tracking</p></div><BookOpen size={20} className="muted-icon"/></div><div className="subject-grid">{subjects.map(s=><div className="subject-card" key={s.id}><div className="subject-icon"><BookOpen size={20}/></div><div><b>{s.name}</b><small>{s.code}</small></div><span className="subject-id">#{s.id}</span></div>)}</div></section>}
  <footer>© {new Date().getFullYear()} AttendEase <span>Built for a smarter campus</span></footer></main></div>;
}
function Stat({icon:Icon,label,value,foot,alert}) {return <div className="stat-card"><div className="stat-top"><span>{label}</span><div className="stat-icon"><Icon size={18}/></div></div><strong className={alert?'alert-text':''}>{value}</strong><small>{foot}</small></div>}
function Records({records}) {if(!records.length)return <div className="empty"><CalendarCheck size={24}/><b>No attendance records yet</b><span>Mark attendance to see records here.</span></div>;return <div className="table-scroll"><table><thead><tr><th>Student</th><th>Subject</th><th>Date</th><th>Status</th></tr></thead><tbody>{records.map(r=><tr key={r.id}><td><div className="student-cell"><div className="mini-avatar">{r.studentName.split(' ').map(x=>x[0]).join('').slice(0,2)}</div><b>{r.studentName}</b></div></td><td>{r.subject}</td><td>{r.date}</td><td><span className={`pill ${r.status==='PRESENT'?'good':r.status==='LATE'?'warning':'bad'}`}><span className="status-dot"/>{r.status}</span></td></tr>)}</tbody></table></div>}
