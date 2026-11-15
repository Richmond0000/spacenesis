import React from "react";
import { Activity, AlertTriangle, CheckCircle2, ClipboardCheck, HeartPulse, Radio } from "lucide-react";

function changeFromBaseline(reading) {
  if (!Number.isFinite(reading.baseline) || reading.baseline === 0) return 0;
  return Math.abs((reading.value - reading.baseline) / reading.baseline) * 100;
}

export default function EmergencySupport({ readings }) {
  const changedReadings = readings.filter((reading) => changeFromBaseline(reading) > 10);

  return <section className="module-page emergency-page">
    <div className="module-intro">
      <div><span className="eyebrow">CREW SAFETY · RESPONSE GUIDE</span><h1>Emergency support</h1><p>Review measurement changes and find the next safe step using your mission’s approved medical procedures.</p></div>
      <div className="module-status emergency-status"><AlertTriangle size={17} /> MISSION PROCEDURES TAKE PRIORITY</div>
    </div>

    <section className="emergency-callout" aria-labelledby="emergency-now-title">
      <div className="emergency-callout-icon"><AlertTriangle size={25} /></div>
      <div>
        <span className="emergency-kicker">IMMEDIATE ACTION</span>
        <h2 id="emergency-now-title">If someone may be in immediate danger</h2>
        <p>Follow the spacecraft’s approved emergency checklist and contact the Crew Medical Officer, flight surgeon, or Mission Control using the mission communication procedure. Don’t wait for this app or for another measurement.</p>
      </div>
    </section>

    <section className="panel emergency-readings">
      <div className="panel-heading"><div><span className="eyebrow">CURRENT SESSION · SAMPLE VALUES</span><h2>Measurement review</h2></div><HeartPulse size={20} /></div>
      <div className={changedReadings.length ? "measurement-summary has-changes" : "measurement-summary"}>
        {changedReadings.length ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
        <div><b>{changedReadings.length ? `${changedReadings.length} measurement${changedReadings.length === 1 ? "" : "s"} changed from the demo baseline` : "No large changes from the demo baseline"}</b><span>This is a comparison flag only. It is not an emergency alert, diagnosis, or all-clear.</span></div>
      </div>
      <div className="emergency-measurement-list">{readings.map((reading) => {
        const change = changeFromBaseline(reading);
        const flagged = change > 10;
        return <div className="emergency-measurement" key={reading.id}>
          <div className="emergency-measurement-name"><Activity size={15} /><b>{reading.name}</b><span className={flagged ? "measurement-flag flagged" : "measurement-flag"}>{flagged ? "Review change" : "Near demo baseline"}</span></div>
          <div className="emergency-measurement-value">{reading.value} <small>{reading.unit}</small></div>
          <div className="emergency-measurement-baseline">Demo baseline {reading.baseline} {reading.unit} · {change.toFixed(1)}% difference</div>
        </div>;
      })}</div>
      <p className="disclaimer">The 10% comparison is an illustrative software rule. It is not a medically validated threshold and must not be used to decide whether an astronaut is safe.</p>
    </section>

    <div className="module-columns emergency-columns">
      <section className="panel">
        <div className="panel-heading"><div><span className="eyebrow">IF A MEASUREMENT IS FLAGGED</span><h2>What to do next</h2></div><ClipboardCheck size={19} /></div>
        <ol className="emergency-steps">
          <li><b>Check the reading.</b><span>Confirm the time, units, measurement method, and sensor or device placement using the mission procedure.</span></li>
          <li><b>Repeat only as directed.</b><span>Use the approved measurement instructions; don’t delay escalation if the astronaut feels unwell.</span></li>
          <li><b>Note symptoms and context.</b><span>Record how the crew member feels, when the change began, and any relevant activity or environment changes.</span></li>
          <li><b>Contact medical support.</b><span>Use the mission’s escalation pathway and report the reading, baseline, time, and symptoms to the designated crew medical support.</span></li>
        </ol>
      </section>
      <section className="panel emergency-support-card">
        <div className="panel-heading"><div><span className="eyebrow">CREW MEDICAL SUPPORT</span><h2>Use mission resources</h2></div><Radio size={19} /></div>
        <p className="panel-copy">Actual emergency contacts, thresholds, and treatment steps must come from the mission’s medical plan. This demo is not connected to sensors or Mission Control.</p>
        <a className="emergency-resource-link" href="https://www.nasa.gov/ochmo/health-and-medical-systems/in-flight-medical-care/" target="_blank" rel="noreferrer">NASA · In-flight medical care <span aria-hidden="true">↗</span></a>
        <a className="emergency-resource-link" href="https://www.nasa.gov/directorates/esdmd/hhp/flight-surgeons/" target="_blank" rel="noreferrer">NASA · Flight surgeons <span aria-hidden="true">↗</span></a>
      </section>
    </div>

    <p className="demo-notice"><Radio size={13} /> DEMONSTRATION ONLY <span>No emergency alert is transmitted and no live medical data is connected.</span></p>
  </section>;
}
