# SPACENESIS · Challenge mapping

## What the challenge asks for

The 2026 NASA Space Apps challenge asks for a visual tool that gathers health indicators so astronauts can assess their own health and act on what they learn. The full brief suggests measurements such as blood pressure, heart rate, blood sugar, body temperature, sleep and mood. It also highlights clear explanations, dynamic trends, at-a-glance status colors, and guidance for next steps.

## Where SPACENESIS addresses it

| Challenge need | Prototype feature |
| --- | --- |
| Gather indicators | Manual entry for heart rate, systolic blood pressure, blood oxygen, respiratory rate, temperature and glucose; crew self-report for sleep, mood, stress and focus; session checklist for bone countermeasures and cabin review. |
| Help astronauts evaluate | Each physiological reading is compared with that crew member’s editable demo baseline. The page shows a history chart and flags changes greater than the prototype rule. |
| Help astronauts act | A flagged change prompts a repeat measurement, symptom/context recording and following the mission’s approved medical pathway. Other modules point to wellbeing support and mission countermeasure procedures. |
| Make results understandable | Each screen explains what the indicator represents, how to review a trend, and what the limitations of the demo rule are. |
| Show trends and status | Session entries update trend bars; amber flags indicate a demo baseline change. |
| Use NASA resources | The Overview links to NASA Human Research Program pages for spaceflight hazards, health risks and ongoing research. These references explain the risks; they are not astronaut telemetry files. |

## Data and safety notes

- Every prefilled number is synthetic sample data. No real astronaut health record or live sensor is connected.
- Manually entered values stay in React app memory for the current session and are lost when the page refreshes.
- The 10% change rule is an illustrative software demonstration rule only. It is not clinically validated and is not a NASA flight-medicine threshold.
- SPACENESIS does not diagnose, prescribe treatment, detect emergencies or replace mission medical procedures. The suggested actions are to repeat/record a measurement and follow the approved crew health pathway.
- The linked NASA pages provide background research and context. Do not describe their research content as real-time astronaut health data.

## Run locally

```powershell
npm install
npm run dev
```
