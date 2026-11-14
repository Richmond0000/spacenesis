import React, { useState } from "react";
import {
  Activity, HeartPulse, Brain, Bone, ShieldCheck, Radio, Bell, Settings,
  LayoutDashboard, User, ChevronRight, Globe2, Moon, Wind, X, CheckCircle2,
} from "lucide-react";
import PhysiologicalHealth from "./PhysiologicalHealth.jsx";
import BehaviouralHealth from "./BehaviouralHealth.jsx";
import BoneHealth from "./BoneHealth.jsx";
import SpaceEnvironment from "./SpaceEnvironment.jsx";
import EarthGlobe from "./EarthGlobe.jsx";
import GalaxyBackground from "./GalaxyBackground.jsx";
import "./App.css";

const navigation = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "Physiological Health", icon: Activity },
  { name: "Behavioural Health", icon: Brain },
  { name: "Bone Health", icon: Bone },
  { name: "Space Environment", icon: Globe2 },
];

const demoReadings = [
  { id: "heartRate", name: "Heart rate", value: 68, baseline: 68, unit: "BPM", trend: [64, 66, 65, 69, 67, 66, 68] },
  { id: "bloodPressure", name: "Systolic blood pressure", value: 118, baseline: 118, unit: "mmHg", trend: [116, 117, 119, 118, 117, 120, 118] },
  { id: "bloodOxygen", name: "Blood oxygen", value: 98, baseline: 98, unit: "% SpO₂", trend: [97, 98, 97, 99, 98, 98, 98] },
  { id: "respiratoryRate", name: "Respiratory rate", value: 15, baseline: 15, unit: "breaths/min", trend: [14, 15, 15, 16, 15, 14, 15] },
  { id: "temperature", name: "Body temperature", value: 36.8, baseline: 36.8, unit: "°C", trend: [36.7, 36.8, 36.8, 36.9, 36.8, 36.7, 36.8] },
  { id: "glucose", name: "Blood glucose", value: 92, baseline: 92, unit: "mg/dL", trend: [90, 93, 94, 91, 92, 89, 92] },
];

function Overview({ onNavigate, onCheckIn, readings }) {
  const systems = [
    ["Cardiovascular", "Monitor trends", "86%"],
    ["Respiratory", "Self-check available", "94%"],
    ["Immune indicators", "Crew observation", "72%"],
    ["Skeletal health", "Countermeasure log", "78%"],
  ];
  const topReadings = [readings[0], readings[2], { name: "Sleep quality", value: 87, unit: "/100", icon: Moon, status: "Self-report" }, { name: "Stress index", value: 3, unit: "/10", icon: Brain, status: "Self-report" }];
  return <>
    <section className="welcome"><div className="welcome-copy"><span className="eyebrow">SPACEFLIGHT HEALTH INTELLIGENCE</span><h1>Mission<span>Health</span></h1><p>Check in, understand what changed, and choose a safe next step.</p></div><div className="hero-earth"><EarthGlobe /></div><div className="date-chip"><Globe2 size={16} /> ARTEMIS-01 · DEMO DAY 142</div></section>
    <section className="health-banner"><div className="banner-orbit"><Globe2 size={48} /></div><div className="banner-copy"><span>CREW HEALTH CHECK</span><h2>Start with how you feel</h2><p>Record today’s sleep, mood, stress and symptoms, then review your vital signs.</p></div><button className="primary-button" onClick={onCheckIn}>Daily check-in <ChevronRight size={16} /></button></section>
    <div className="section-heading"><div><span className="eyebrow">CURRENT SESSION · DEMO PROFILE</span><h2>Health indicators</h2></div><button className="text-button" onClick={() => onNavigate("Physiological Health")}>Enter a measurement <ChevronRight size={15} /></button></div>
    <section className="metric-grid">{topReadings.map((item) => { const Icon = item.icon || (item.id === "heartRate" ? HeartPulse : Wind); return <article className="metric-card" key={item.name}><div className="metric-top"><div className="metric-icon"><Icon size={20} /></div><span className="status">{item.status || "Demo"}</span></div><p>{item.name}</p><div className="metric-value">{item.value}<small>{item.unit}</small></div><div className="metric-footer">SAMPLE DATA · NOT A SENSOR READING</div></article>; })}</section>
    <div className="lower-grid"><section className="panel"><div className="panel-heading"><div><span className="eyebrow">MONITORING PLAN</span><h2>Health systems</h2></div><Activity size={20} /></div>{systems.map(([name, status, value]) => <div className="system-row" key={name}><div><b>{name}</b><span>{status}</span></div><div className="system-track"><div style={{ width: value }} /></div><small>{value}</small></div>)}<p className="disclaimer">Illustrative progress scores, not clinical assessments.</p><button className="text-button" onClick={() => onNavigate("Physiological Health")}>Open physiological module <ChevronRight size={15} /></button></section>
    <section className="panel alert-panel"><div className="panel-heading"><div><span className="eyebrow">NEXT STEPS</span><h2>Health support</h2></div><ShieldCheck size={20} /></div><div className="insight"><div className="insight-icon"><Moon size={19} /></div><div><b>Daily wellbeing check</b><p>Track sleep, mood and stress to notice changes over time.</p></div></div><div className="insight"><div className="insight-icon"><Bone size={19} /></div><div><b>Mission countermeasures</b><p>Follow the exercise and health plan approved for your mission.</p></div></div><button className="assistant-button" onClick={() => onNavigate("Behavioural Health")}>Open wellbeing check-in <ChevronRight size={16} /></button></section></div>
    <section className="panel sources-panel"><div className="panel-heading"><div><span className="eyebrow">NASA RESEARCH BASIS</span><h2>Learn about the risks</h2></div><Radio size={19} /></div><p className="panel-copy">These resources explain why the demo tracks physiological, behavioral, bone and environment indicators. They are background references, not personal medical instructions.</p><div className="source-links"><a href="https://www.nasa.gov/hrp/hazards/" target="_blank" rel="noreferrer">NASA · Five hazards of human spaceflight <ChevronRight size={14} /></a><a href="https://www.nasa.gov/hrp/risks/" target="_blank" rel="noreferrer">NASA · Health risks in spaceflight <ChevronRight size={14} /></a><a href="https://www.nasa.gov/hrp/ongoing-hrp-research/" target="_blank" rel="noreferrer">NASA · Ongoing Human Research Program studies <ChevronRight size={14} /></a></div></section>
    <p className="demo-notice"><Radio size={13} /> DEMONSTRATION MODE <span>Example values only. No astronaut records or sensors are connected.</span></p>
  </>;
}

function App() {
  const [active, setActive] = useState("Overview");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [readings, setReadings] = useState(demoReadings);
  const [checkIns, setCheckIns] = useState([]);
  const [checkInMessage, setCheckInMessage] = useState("");
  const saveReading = (id, value) => setReadings((current) => current.map((item) => item.id === id ? { ...item, value: Number(value), trend: [...item.trend.slice(-6), Number(value)] } : item));
  const setBaseline = (id) => setReadings((current) => current.map((item) => item.id === id ? { ...item, baseline: item.value } : item));
  const saveCheckIn = (entry) => { setCheckIns((current) => [...current, entry]); setCheckInMessage("Check-in saved for this session."); };
  let page;
  if (active === "Physiological Health") page = <PhysiologicalHealth readings={readings} onSaveReading={saveReading} onSetBaseline={setBaseline} />;
  else if (active === "Behavioural Health") page = <BehaviouralHealth onSave={saveCheckIn} checkIns={checkIns} message={checkInMessage} />;
  else if (active === "Bone Health") page = <BoneHealth />;
  else if (active === "Space Environment") page = <SpaceEnvironment />;
  else page = <Overview onNavigate={setActive} onCheckIn={() => setActive("Behavioural Health")} readings={readings} />;
  return <div className="app-shell">
    <GalaxyBackground />
    <aside className="sidebar"><button className="brand" onClick={() => setActive("Overview")} aria-label="SPACENESIS home"><span className="brand-icon"><Globe2 size={23} /></span><span className="brand-copy"><b>SPACENESIS</b><small>HEALTH INTELLIGENCE</small></span></button><nav aria-label="Health modules">{navigation.map((item) => { const Icon = item.icon; return <button key={item.name} className={active === item.name ? "nav-item active" : "nav-item"} aria-current={active === item.name ? "page" : undefined} onClick={() => setActive(item.name)}><Icon size={17} /><span>{item.name}</span><ChevronRight size={14} /></button>; })}</nav><div className="sidebar-bottom"><button className="nav-item settings-trigger" onClick={() => setSettingsOpen(true)}><Settings size={17} /><span>Settings</span></button></div></aside>
    <main className="main-content"><header className="topbar"><div className="breadcrumb"><span>MISSION CONTROL</span><ChevronRight size={14} /><b>{active.toUpperCase()}</b></div><div className="top-actions"><span className="connection"><Radio size={14} /> DEMO MODE · LOCAL SESSION</span><button className="icon-button notification-trigger" aria-label="Open notifications" onClick={() => setNotificationsOpen(true)}><Bell size={18} /><span className="notification-dot" /></button><div className="avatar small" aria-label="Crew profile"><User size={16} /></div></div></header>{active === "Overview" ? page : <div className="module-stage"><div className="module-earth"><EarthGlobe /></div>{page}</div>}<footer><span>SPACENESIS · SPACEFLIGHT HEALTH INTELLIGENCE</span><span>PROTOTYPE · SIMULATED DATA · NOT FOR CLINICAL USE</span></footer></main>
    {notificationsOpen && <div className="modal-scrim" onMouseDown={(event) => event.target === event.currentTarget && setNotificationsOpen(false)}><section className="side-dialog" role="dialog" aria-modal="true" aria-labelledby="notifications-title"><div className="dialog-heading"><div><span className="eyebrow">MISSION LOG</span><h2 id="notifications-title">Notifications</h2></div><button className="icon-button" onClick={() => setNotificationsOpen(false)} aria-label="Close notifications"><X size={18} /></button></div><div className="notification-item"><span className="notification-symbol"><CheckCircle2 size={18} /></span><div><b>Demo system ready</b><p>SPACENESIS is showing sample values for this prototype.</p><small>SESSION STATUS</small></div></div><div className="notification-item"><span className="notification-symbol"><Moon size={18} /></span><div><b>Daily wellbeing check-in</b><p>Record sleep, mood, stress and focus to review self-reported changes.</p><small>SELF-REPORT</small></div></div><button className="primary-button full-width" onClick={() => { setNotificationsOpen(false); setActive("Behavioural Health"); }}>Open check-in <ChevronRight size={15} /></button></section></div>}
    {settingsOpen && <div className="modal-scrim" onMouseDown={(event) => event.target === event.currentTarget && setSettingsOpen(false)}><section className="settings-dialog" role="dialog" aria-modal="true" aria-labelledby="settings-title"><div className="dialog-heading"><div><span className="eyebrow">PROTOTYPE CONFIGURATION</span><h2 id="settings-title">Settings</h2></div><button className="icon-button" onClick={() => setSettingsOpen(false)} aria-label="Close settings"><X size={18} /></button></div><div className="settings-row"><span>Mission profile</span><b>ARTEMIS-01 · DEMO</b></div><div className="settings-row"><span>Data source</span><b>Manual entries + sample data</b></div><div className="settings-row"><span>Review rule</span><b>10% demo baseline change</b></div><p className="disclaimer">This comparison is an illustrative prototype rule, not a validated astronaut or clinical threshold. Entries exist only in this browser session.</p><button className="primary-button full-width" onClick={() => setSettingsOpen(false)}>Done <CheckCircle2 size={15} /></button></section></div>}
  </div>;
}
export default App;

