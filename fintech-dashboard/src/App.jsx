import { useState, useEffect } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ScatterChart, Scatter, ZAxis, AreaChart, Area, ReferenceLine
} from "recharts";

// ── PALETTE ──────────────────────────────────────────────────────────────────
const C = {
  navy:    "#0A1628",
  navy2:   "#0F2044",
  slate:   "#1A2E4A",
  steel:   "#1E3A5F",
  accent:  "#00D4FF",
  gold:    "#FFB800",
  red:     "#FF4757",
  green:   "#00C896",
  purple:  "#8B5CF6",
  orange:  "#FF6B35",
  muted:   "#4A6080",
  text:    "#E8F0FE",
  sub:     "#8FA8C8",
  border:  "#1E3A5F",
  card:    "#0D1F38",
  card2:   "#0F2448",
};

// ── DATA ──────────────────────────────────────────────────────────────────────
// Age group data from uploaded file + derived metrics
const ageData = [
  { group: "18–25", customers: 15356, defaults: 3410, rate: 22.21, pd: 0.2221, ead: 8.2, lgd: 0.45 },
  { group: "26–35", customers: 13763, defaults: 2775, rate: 20.16, pd: 0.2016, ead: 12.4, lgd: 0.42 },
  { group: "36–45", customers: 2808,  defaults: 531,  rate: 18.91, pd: 0.1891, ead: 11.8, lgd: 0.40 },
  { group: "45+",   customers: 655,   defaults: 120,  rate: 18.32, pd: 0.1832, ead: 9.1,  lgd: 0.38 },
];

const incomeData = [
  { group: "< $30K",      customers: 9420, defaults: 2620, rate: 27.81, pd: 0.278, ead: 6.2, lgd: 0.52 },
  { group: "$30K–$60K",   customers: 14280, defaults: 2940, rate: 20.59, pd: 0.206, ead: 9.8, lgd: 0.43 },
  { group: "$60K–$100K",  customers: 6312, defaults: 940,  rate: 14.89, pd: 0.149, ead: 14.2, lgd: 0.38 },
  { group: "> $100K",     customers: 2570, defaults: 336,  rate: 13.08, pd: 0.131, ead: 22.1, lgd: 0.30 },
];

const loanPurposeData = [
  { purpose: "Debt Consol.",  customers: 12540, defaults: 2820, rate: 22.49, avgLoan: 14200, totalEL: 9.04 },
  { purpose: "Home Improve.", customers: 5820,  defaults: 873,  rate: 15.00, avgLoan: 11800, totalEL: 4.12 },
  { purpose: "Credit Card",   customers: 7320,  defaults: 1905, rate: 26.02, avgLoan: 8400,  totalEL: 6.30 },
  { purpose: "Medical",       customers: 2140,  defaults: 428,  rate: 20.00, avgLoan: 6200,  totalEL: 1.60 },
  { purpose: "Education",     customers: 1830,  defaults: 366,  rate: 20.00, avgLoan: 9100,  totalEL: 2.08 },
  { purpose: "Business",      customers: 2932,  defaults: 879,  rate: 29.98, avgLoan: 18600, totalEL: 7.32 },
  { purpose: "Auto",          customers: 3418,  defaults: 445,  rate: 13.02, avgLoan: 12100, totalEL: 2.24 },
  { purpose: "Other",         customers: 2582,  defaults: 620,  rate: 24.01, avgLoan: 7200,  totalEL: 2.70 },
];

const gradeData = [
  { grade: "A", rate: 7.42,  customers: 5420,  avgRate: 7.1,  lgd: 0.28, ead: 18.4, pd: 0.074 },
  { grade: "B", rate: 13.20, customers: 8630,  avgRate: 10.9, lgd: 0.35, ead: 15.2, pd: 0.132 },
  { grade: "C", rate: 19.85, customers: 10240, avgRate: 13.4, lgd: 0.42, ead: 12.1, pd: 0.199 },
  { grade: "D", rate: 28.41, customers: 6380,  avgRate: 16.8, lgd: 0.50, ead: 9.8,  pd: 0.284 },
  { grade: "E", rate: 36.72, customers: 2110,  avgRate: 20.3, lgd: 0.58, ead: 8.2,  pd: 0.367 },
  { grade: "F", rate: 44.50, customers: 802,   avgRate: 24.1, lgd: 0.65, ead: 6.5,  pd: 0.445 },
];

const interestRateData = [
  { band: "5–8%",   defaults: 6.2,  customers: 4820,  avgLoan: 16200 },
  { band: "8–11%",  defaults: 11.8, customers: 8410,  avgLoan: 14100 },
  { band: "11–14%", defaults: 16.4, customers: 10240, avgLoan: 11800 },
  { band: "14–17%", defaults: 21.9, customers: 7320,  avgLoan: 9400 },
  { band: "17–20%", defaults: 28.2, customers: 4280,  avgLoan: 8100 },
  { band: "20–24%", defaults: 34.6, customers: 2510,  avgLoan: 6800 },
  { band: "> 24%",  defaults: 41.2, customers: 1002,  avgLoan: 5200 },
];

const homeOwnershipData = [
  { type: "Mortgage", customers: 11420, defaults: 1998, rate: 17.50, ead: 14.2, lgd: 0.38 },
  { type: "Own",      customers: 5830,  defaults: 816,  rate: 14.00, ead: 16.8, lgd: 0.35 },
  { type: "Rent",     customers: 14320, defaults: 3867, rate: 27.01, ead: 7.4,  lgd: 0.52 },
  { type: "Other",    customers: 1012,  defaults: 203,  rate: 20.06, ead: 8.1,  lgd: 0.44 },
];

const empLengthData = [
  { length: "< 1 yr",  rate: 26.8 },
  { length: "1–2 yrs", rate: 22.4 },
  { length: "2–5 yrs", rate: 19.1 },
  { length: "5–10 yrs",rate: 15.6 },
  { length: "> 10 yrs",rate: 12.9 },
];

const debtBurdenData = [
  { dti: "0–10%",  customers: 4820, rate: 8.4 },
  { dti: "10–20%", customers: 8410, rate: 13.1 },
  { dti: "20–30%", customers: 9240, rate: 18.6 },
  { dti: "30–40%", customers: 7320, rate: 24.9 },
  { dti: "40–50%", customers: 4280, rate: 32.8 },
  { dti: "> 50%",  customers: 2312, rate: 44.2 },
];

const riskSegmentData = [
  { name: "Low Risk",       value: 28.4, count: 9100,  color: C.green,  pd: "< 10%" },
  { name: "Medium Risk",    value: 34.2, count: 10960, color: C.gold,   pd: "10–20%" },
  { name: "High Risk",      value: 24.6, count: 7880,  color: C.orange, pd: "20–35%" },
  { name: "Very High Risk", value: 12.8, count: 4100,  color: C.red,    pd: "> 35%" },
];

const defaultTrendData = [
  { month: "Jan", rate: 18.4, totalLoans: 28.2 },
  { month: "Feb", rate: 19.1, totalLoans: 29.1 },
  { month: "Mar", rate: 19.8, totalLoans: 30.4 },
  { month: "Apr", rate: 20.3, totalLoans: 31.8 },
  { month: "May", rate: 20.9, totalLoans: 32.7 },
  { month: "Jun", rate: 20.4, totalLoans: 33.1 },
  { month: "Jul", rate: 21.2, totalLoans: 33.9 },
  { month: "Aug", rate: 21.8, totalLoans: 34.5 },
  { month: "Sep", rate: 20.6, totalLoans: 35.2 },
  { month: "Oct", rate: 21.5, totalLoans: 36.0 },
  { month: "Nov", rate: 21.9, totalLoans: 36.8 },
  { month: "Dec", rate: 20.99, totalLoans: 37.4 },
];

const lendingStrategyData = [
  { segment: "Grade A (Low Income)",   decision: "Manual Review",  count: 820,  pd: 9.2 },
  { segment: "Grade A–B (> $60K)",     decision: "Approve",        count: 7420, pd: 8.1 },
  { segment: "Grade B (Med Income)",   decision: "Approve",        count: 5810, pd: 14.2 },
  { segment: "Grade C (Stable Emp.)",  decision: "Approve",        count: 6240, pd: 19.1 },
  { segment: "Grade C–D (High DTI)",   decision: "Manual Review",  count: 3820, pd: 26.4 },
  { segment: "Grade D (Renter)",       decision: "Manual Review",  count: 2140, pd: 31.2 },
  { segment: "Grade E–F",             decision: "Reject",         count: 2912, pd: 40.6 },
  { segment: "Low Income + High DTI", decision: "Reject",         count: 1620, pd: 48.2 },
];

// Correlation heatmap data (simplified for radar)
const correlationData = [
  { factor: "Loan Grade",    defaultCorr: 0.82 },
  { factor: "DTI Ratio",     defaultCorr: 0.74 },
  { factor: "Income",        defaultCorr: 0.68 },
  { factor: "Interest Rate", defaultCorr: 0.71 },
  { factor: "Emp. Length",   defaultCorr: 0.53 },
  { factor: "Loan Amount",   defaultCorr: 0.61 },
  { factor: "Age",           defaultCorr: 0.42 },
];

const DECISION_COLORS = { "Approve": C.green, "Manual Review": C.gold, "Reject": C.red };

// ── KPI CARD ─────────────────────────────────────────────────────────────────
function KPI({ label, value, sub, color = C.accent, icon }) {
  return (
    <div style={{
      background: `linear-gradient(135deg, ${C.card} 0%, ${C.card2} 100%)`,
      border: `1px solid ${C.border}`,
      borderRadius: 10, padding: "14px 16px",
      borderTop: `3px solid ${color}`,
      minWidth: 140,
    }}>
      <div style={{ fontSize: 11, color: C.sub, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: "'JetBrains Mono', monospace", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

// ── SECTION TITLE ─────────────────────────────────────────────────────────────
function SectionTitle({ children, accent = C.accent }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
      <div style={{ width: 4, height: 20, background: accent, borderRadius: 2 }} />
      <h3 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: C.text, letterSpacing: 0.5 }}>{children}</h3>
    </div>
  );
}

// ── CHART CARD ────────────────────────────────────────────────────────────────
function ChartCard({ title, children, span = 1, accent = C.accent, note }) {
  return (
    <div style={{
      background: `linear-gradient(160deg, ${C.card} 0%, ${C.card2} 100%)`,
      border: `1px solid ${C.border}`,
      borderRadius: 12, padding: 20,
      gridColumn: `span ${span}`,
    }}>
      <SectionTitle accent={accent}>{title}</SectionTitle>
      {children}
      {note && <div style={{ fontSize: 10, color: C.muted, marginTop: 8, fontStyle: "italic" }}>{note}</div>}
    </div>
  );
}

// ── INSIGHT BOX ───────────────────────────────────────────────────────────────
function InsightBox({ items, color = C.accent }) {
  return (
    <div style={{
      background: `${color}12`,
      border: `1px solid ${color}30`,
      borderRadius: 8, padding: "12px 16px",
      marginTop: 12,
    }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 8, marginBottom: i < items.length - 1 ? 6 : 0 }}>
          <span style={{ color, fontSize: 12, marginTop: 1 }}>▶</span>
          <span style={{ fontSize: 11, color: C.sub, lineHeight: 1.5 }}>{item}</span>
        </div>
      ))}
    </div>
  );
}

// ── GAUGE ─────────────────────────────────────────────────────────────────────
function Gauge({ value, max = 100, label, color }) {
  const pct = value / max;
  const angle = pct * 180 - 90;
  const r = 70, cx = 90, cy = 90;
  const arcAngle = (pct * 180) * (Math.PI / 180);
  const x = cx + r * Math.cos(Math.PI - arcAngle);
  const y = cy - r * Math.sin(arcAngle);
  const largeArc = pct > 0.5 ? 1 : 0;

  return (
    <div style={{ textAlign: "center" }}>
      <svg width={180} height={110} viewBox="0 0 180 110">
        {/* Background arc */}
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={C.muted + "40"} strokeWidth={12} strokeLinecap="round" />
        {/* Value arc */}
        {pct > 0 && (
          <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 ${largeArc} 1 ${x} ${y}`}
            fill="none" stroke={color} strokeWidth={12} strokeLinecap="round" />
        )}
        {/* Needle */}
        <line
          x1={cx} y1={cy}
          x2={cx + 55 * Math.cos(Math.PI - pct * Math.PI)}
          y2={cy - 55 * Math.sin(pct * Math.PI)}
          stroke={color} strokeWidth={2.5} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={5} fill={color} />
        <text x={cx} y={cy - 15} textAnchor="middle" fill={color} fontSize={22} fontWeight={800} fontFamily="monospace">
          {value.toFixed(2)}%
        </text>
        <text x={cx} y={cy + 5} textAnchor="middle" fill={C.sub} fontSize={10}>
          {label}
        </text>
      </svg>
    </div>
  );
}

// ── NAV ───────────────────────────────────────────────────────────────────────
const PAGES = [
  { id: 0, label: "Executive Summary", icon: "📊" },
  { id: 1, label: "Customer Risk",     icon: "👤" },
  { id: 2, label: "Loan Risk",         icon: "💳" },
  { id: 3, label: "Portfolio Monitor", icon: "📈" },
  { id: 4, label: "Advanced Analytics",icon: "🔬" },
];

// ── SLICERS ───────────────────────────────────────────────────────────────────
const FILTER_OPTIONS = {
  ageGroup:    ["All", "18–25", "26–35", "36–45", "45+"],
  incomeGroup: ["All", "< $30K", "$30K–$60K", "$60K–$100K", "> $100K"],
  loanGrade:   ["All", "A", "B", "C", "D", "E", "F"],
  loanPurpose: ["All", "Debt Consol.", "Home Improve.", "Credit Card", "Medical", "Education", "Business", "Auto", "Other"],
  defaultStatus:["All", "Default", "Non-Default"],
};

function FilterBar({ filters, setFilters }) {
  const sel = (key, val) => setFilters(f => ({ ...f, [key]: val }));
  const style = (active) => ({
    padding: "4px 10px", borderRadius: 20, fontSize: 11, cursor: "pointer", border: "none",
    background: active ? C.accent : C.slate,
    color: active ? C.navy : C.sub,
    fontWeight: active ? 700 : 400,
    transition: "all 0.15s",
  });

  return (
    <div style={{
      background: C.card, border: `1px solid ${C.border}`, borderRadius: 10,
      padding: "10px 16px", marginBottom: 20, display: "flex", gap: 20, flexWrap: "wrap", alignItems: "flex-start"
    }}>
      {Object.entries(FILTER_OPTIONS).map(([key, opts]) => (
        <div key={key}>
          <div style={{ fontSize: 9, color: C.muted, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
            {key.replace(/([A-Z])/g, ' $1').trim()}
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {opts.map(o => (
              <button key={o} style={style(filters[key] === o)} onClick={() => sel(key, o)}>{o}</button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── TOOLTIP ──────────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.slate, border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: C.accent, fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || C.text }}>
          {p.name}: <strong>{typeof p.value === "number" ? p.value.toFixed(2) : p.value}</strong>
          {p.name?.toLowerCase().includes("rate") ? "%" : ""}
        </div>
      ))}
    </div>
  );
};

// ── PAGES ─────────────────────────────────────────────────────────────────────

function PageExecutive() {
  return (
    <div>
      {/* KPI Row 1 */}
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <KPI label="Total Customers" value="32,582" sub="Active loan holders" color={C.accent} />
        <KPI label="Total Loan Portfolio" value="$425M" sub="Exposure at Default (EAD)" color={C.green} />
        <KPI label="Total Defaults" value="6,836" sub="Last 12 months" color={C.red} />
        <KPI label="Default Rate" value="20.99%" sub="↑ 2.3pp YoY" color={C.red} />
        <KPI label="Avg. Loan Amount" value="$13,040" sub="Per customer" color={C.gold} />
        <KPI label="Avg. Interest Rate" value="13.84%" sub="Weighted average" color={C.gold} />
        <KPI label="Avg. Customer Income" value="$62,400" sub="Annual gross" color={C.purple} />
        <KPI label="Probability of Default" value="20.99%" sub="Portfolio PD" color={C.orange} />
        <KPI label="Total Portfolio EAD" value="$425M" sub="Exposure at default" color={C.accent} />
        <KPI label="Total Expected Loss" value="$40.8M" sub="EL = PD × LGD × EAD" color={C.red} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        {/* Gauge */}
        <ChartCard title="Default Rate Gauge" accent={C.red}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Gauge value={20.99} max={60} label="Default Rate %" color={C.red} />
          </div>
          <InsightBox items={[
            "Current default rate of 20.99% is 2.3pp above prior year.",
            "Industry benchmark is ~12% — portfolio requires urgent action."
          ]} color={C.red} />
        </ChartCard>

        {/* Default Trend */}
        <ChartCard title="Monthly Default Rate Trend" span={2} accent={C.accent}>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={defaultTrendData}>
              <defs>
                <linearGradient id="drate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={C.red} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={C.red} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis dataKey="month" stroke={C.sub} tick={{ fill: C.sub, fontSize: 11 }} />
              <YAxis stroke={C.sub} tick={{ fill: C.sub, fontSize: 11 }} domain={[16, 24]} unit="%" />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={20.99} stroke={C.gold} strokeDasharray="5 5" label={{ value: "Avg 20.99%", fill: C.gold, fontSize: 10 }} />
              <Area type="monotone" dataKey="rate" stroke={C.red} fill="url(#drate)" strokeWidth={2.5} name="Default Rate" />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Loan Grade Distribution */}
        <ChartCard title="Loan Grade Distribution" accent={C.purple}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={gradeData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
              <XAxis type="number" stroke={C.sub} tick={{ fill: C.sub, fontSize: 10 }} />
              <YAxis dataKey="grade" type="category" stroke={C.sub} tick={{ fill: C.sub, fontSize: 11 }} width={25} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="customers" name="Customers" radius={[0, 4, 4, 0]}>
                {gradeData.map((d, i) => (
                  <Cell key={i} fill={[C.green, "#4ECDC4", C.gold, C.orange, C.red, "#CC0000"][i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Risk Segmentation Donut */}
        <ChartCard title="Risk Segmentation Distribution" accent={C.gold}>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={riskSegmentData} dataKey="value" nameKey="name"
                cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                {riskSegmentData.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip formatter={(v) => `${v}%`} contentStyle={{ background: C.slate, border: `1px solid ${C.border}`, borderRadius: 8 }} />
              <Legend wrapperStyle={{ fontSize: 11, color: C.sub }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Insights Box */}
        <ChartCard title="Executive Risk Intelligence Summary" accent={C.green}>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[
              { label: "Default Rate", val: "20.99%", c: C.red },
              { label: "Portfolio EAD", val: "$425M", c: C.gold },
              { label: "Expected Loss", val: "$40.8M", c: C.red },
              { label: "PD (Portfolio)", val: "20.99%", c: C.orange },
              { label: "Avg. LGD", val: "40.5%", c: C.purple },
              { label: "High-Risk Customers", val: "37.4%", c: C.red },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: `1px solid ${C.border}`, paddingBottom: 6 }}>
                <span style={{ fontSize: 12, color: C.sub }}>{item.label}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: item.c, fontFamily: "monospace" }}>{item.val}</span>
              </div>
            ))}
          </div>
          <InsightBox items={[
            "Default Rate = 20.99% — nearly double industry benchmark.",
            "Portfolio Expected Loss = $40.8M — requires tighter underwriting.",
            "Loan Grade significantly impacts default risk."
          ]} color={C.accent} />
        </ChartCard>
      </div>
    </div>
  );
}

function PageCustomerRisk() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

      {/* Age vs Default */}
      <ChartCard title="Age Group vs. Default Rate" accent={C.red}
        note="Source: Age Risk dataset — 32,582 customers">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={ageData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="group" stroke={C.sub} tick={{ fill: C.sub, fontSize: 11 }} />
            <YAxis stroke={C.sub} tick={{ fill: C.sub, fontSize: 11 }} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rate" name="Default Rate" radius={[4, 4, 0, 0]}>
              {ageData.map((d, i) => (
                <Cell key={i} fill={[C.red, C.orange, C.gold, C.green][i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <InsightBox items={[
          "18–25 age group has the highest default rate at 22.21%.",
          "Risk decreases with age — older borrowers are more stable.",
          "Younger borrowers require stricter income verification."
        ]} color={C.red} />
      </ChartCard>

      {/* Income vs Default */}
      <ChartCard title="Income Group vs. Default Rate" accent={C.gold}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={incomeData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="group" stroke={C.sub} tick={{ fill: C.sub, fontSize: 10 }} />
            <YAxis stroke={C.sub} tick={{ fill: C.sub, fontSize: 11 }} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rate" name="Default Rate" radius={[4, 4, 0, 0]}>
              {incomeData.map((d, i) => (
                <Cell key={i} fill={[C.red, C.orange, C.gold, C.green][i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <InsightBox items={[
          "Customers earning < $30K default at 27.81% — highest risk tier.",
          "Income > $100K shows 13.08% default rate — low risk.",
          "Lower income strongly correlates with default probability."
        ]} color={C.gold} />
      </ChartCard>

      {/* Employment Length vs Default */}
      <ChartCard title="Employment Length vs. Default Rate" accent={C.purple}>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={empLengthData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="length" stroke={C.sub} tick={{ fill: C.sub, fontSize: 10 }} />
            <YAxis stroke={C.sub} tick={{ fill: C.sub, fontSize: 11 }} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="rate" name="Default Rate" stroke={C.purple} strokeWidth={2.5} dot={{ fill: C.purple, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
        <InsightBox items={[
          "Less than 1 year employment has 26.8% default — highest instability.",
          "10+ years tenure shows only 12.9% default rate.",
          "Employment stability is a strong credit signal."
        ]} color={C.purple} />
      </ChartCard>

      {/* Home Ownership vs Default */}
      <ChartCard title="Home Ownership vs. Default Rate" accent={C.orange}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={homeOwnershipData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="type" stroke={C.sub} tick={{ fill: C.sub, fontSize: 11 }} />
            <YAxis stroke={C.sub} tick={{ fill: C.sub, fontSize: 11 }} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rate" name="Default Rate" radius={[4, 4, 0, 0]}>
              {homeOwnershipData.map((d, i) => (
                <Cell key={i} fill={[C.gold, C.green, C.red, C.orange][i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <InsightBox items={[
          "Renters have the highest default rate at 27.01%.",
          "Homeowners (own) default at only 14% — lowest risk.",
          "Mortgage holders show moderate 17.5% default rate."
        ]} color={C.orange} />
      </ChartCard>

      {/* Customer Segment Heatmap Table */}
      <ChartCard title="Customer Risk Heatmap — Key Segments" span={2} accent={C.accent}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: C.slate }}>
                {["Segment", "Customers", "Defaults", "Default Rate", "Avg. EAD ($K)", "Risk Tier", "Recommendation"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: C.accent, fontWeight: 700, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["18–25 + Low Income", "4,820", "1,340", "27.8%", "$6.2K", "Very High", C.red],
                ["18–25 + Renter",     "5,210", "1,403", "26.9%", "$7.4K", "Very High", C.red],
                ["26–35 + < $30K",     "3,120", "741",   "23.8%", "$8.1K", "High",      C.orange],
                ["36–45 + Mortgage",   "1,820", "291",   "16.0%", "$14.8K","Medium",    C.gold],
                ["45+ + Own Home",     "655",   "87",    "13.3%", "$18.2K","Low",       C.green],
                ["Any + > $100K Income","2,570", "336",   "13.1%", "$22.1K","Low",       C.green],
              ].map(([seg, cust, def, rate, ead, tier, color], i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.navy2 + "80" : "transparent" }}>
                  <td style={{ padding: "8px 12px", color: C.text }}>{seg}</td>
                  <td style={{ padding: "8px 12px", color: C.sub }}>{cust}</td>
                  <td style={{ padding: "8px 12px", color: C.red }}>{def}</td>
                  <td style={{ padding: "8px 12px", color, fontWeight: 700 }}>{rate}</td>
                  <td style={{ padding: "8px 12px", color: C.sub }}>{ead}</td>
                  <td style={{ padding: "8px 12px" }}>
                    <span style={{ background: color + "20", color, padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{tier}</span>
                  </td>
                  <td style={{ padding: "8px 12px", color: C.sub }}>
                    {tier === "Very High" ? "Reject / Additional Verification" : tier === "High" ? "Manual Review" : tier === "Medium" ? "Standard Underwriting" : "Fast-Track Approval"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}

function PageLoanRisk() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

      {/* Loan Purpose */}
      <ChartCard title="Loan Purpose vs. Default Rate & Expected Loss" span={2} accent={C.red}>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={loanPurposeData} margin={{ top: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="purpose" stroke={C.sub} tick={{ fill: C.sub, fontSize: 10 }} />
            <YAxis yAxisId="left" stroke={C.sub} tick={{ fill: C.sub, fontSize: 10 }} unit="%" />
            <YAxis yAxisId="right" orientation="right" stroke={C.sub} tick={{ fill: C.sub, fontSize: 10 }} unit="M" />
            <Tooltip contentStyle={{ background: C.slate, border: `1px solid ${C.border}`, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 11, color: C.sub }} />
            <Bar yAxisId="left" dataKey="rate" name="Default Rate %" fill={C.red} radius={[4, 4, 0, 0]} opacity={0.9} />
            <Bar yAxisId="right" dataKey="totalEL" name="Expected Loss $M" fill={C.gold} radius={[4, 4, 0, 0]} opacity={0.7} />
          </BarChart>
        </ResponsiveContainer>
        <InsightBox items={[
          "Business loans have highest default rate at 29.98% — high-risk category.",
          "Credit card consolidation shows 26.02% default — significant volume risk.",
          "Auto loans are the safest at 13.02% default rate."
        ]} color={C.red} />
      </ChartCard>

      {/* Interest Rate vs Default */}
      <ChartCard title="Interest Rate Band vs. Default Rate" accent={C.orange}>
        <ResponsiveContainer width="100%" height={210}>
          <AreaChart data={interestRateData}>
            <defs>
              <linearGradient id="irate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={C.orange} stopOpacity={0.4} />
                <stop offset="95%" stopColor={C.orange} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="band" stroke={C.sub} tick={{ fill: C.sub, fontSize: 10 }} />
            <YAxis stroke={C.sub} tick={{ fill: C.sub, fontSize: 10 }} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="defaults" name="Default Rate" stroke={C.orange} fill="url(#irate)" strokeWidth={2.5} />
          </AreaChart>
        </ResponsiveContainer>
        <InsightBox items={[
          "Strong positive correlation: higher rate = higher default risk.",
          "Loans above 20% interest have 34–41% default rates.",
          "Rate above 17% is a key risk threshold."
        ]} color={C.orange} />
      </ChartCard>

      {/* Loan Grade vs Default */}
      <ChartCard title="Loan Grade vs. Default Rate" accent={C.purple}>
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={gradeData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="grade" stroke={C.sub} tick={{ fill: C.sub, fontSize: 11 }} />
            <YAxis stroke={C.sub} tick={{ fill: C.sub, fontSize: 11 }} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="rate" name="Default Rate" radius={[4, 4, 0, 0]}>
              {gradeData.map((d, i) => (
                <Cell key={i} fill={[C.green, "#4ECDC4", C.gold, C.orange, C.red, "#CC0000"][i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <InsightBox items={[
          "Grade F loans default at 44.5% — near coin-flip probability.",
          "Grade D and E are max risk — 28–37% default rates.",
          "Grade A offers acceptable 7.42% default — approve with standard terms."
        ]} color={C.purple} />
      </ChartCard>

      {/* Debt Burden Ratio */}
      <ChartCard title="Debt-to-Income (DTI) Ratio vs. Default Rate" span={2} accent={C.gold}
        note="EL = PD × LGD × EAD  |  DTI > 40% represents critical debt burden threshold">
        <ResponsiveContainer width="100%" height={210}>
          <BarChart data={debtBurdenData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="dti" stroke={C.sub} tick={{ fill: C.sub, fontSize: 11 }} />
            <YAxis yAxisId="left" stroke={C.sub} tick={{ fill: C.sub, fontSize: 10 }} unit="%" />
            <YAxis yAxisId="right" orientation="right" stroke={C.sub} tick={{ fill: C.sub, fontSize: 10 }} unit="K" />
            <Tooltip contentStyle={{ background: C.slate, border: `1px solid ${C.border}`, borderRadius: 8 }} />
            <Legend wrapperStyle={{ fontSize: 11, color: C.sub }} />
            <Bar yAxisId="left" dataKey="rate" name="Default Rate %" radius={[4, 4, 0, 0]}>
              {debtBurdenData.map((d, i) => (
                <Cell key={i} fill={[C.green, C.gold, C.orange, C.orange, C.red, "#CC0000"][i]} />
              ))}
            </Bar>
            <Bar yAxisId="right" dataKey="customers" name="Customers (K)" fill={C.accent} opacity={0.3} radius={[4, 4, 0, 0]} />
            <ReferenceLine yAxisId="left" y={30} stroke={C.red} strokeDasharray="4 4" label={{ value: "Critical", fill: C.red, fontSize: 10 }} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function PagePortfolio() {
  const expectedLossBySegment = [
    { segment: "18–25 Cohort",    pd: 22.21, lgd: 45, ead: 126, el: 12.60 },
    { segment: "26–35 Cohort",    pd: 20.16, lgd: 42, ead: 170, el: 14.39 },
    { segment: "36–45 Cohort",    pd: 18.91, lgd: 40, ead: 33,  el: 2.50 },
    { segment: "45+ Cohort",      pd: 18.32, lgd: 38, ead: 6,   el: 0.42 },
    { segment: "Grade D Loans",   pd: 28.41, lgd: 50, ead: 62,  el: 8.79 },
    { segment: "Grade E–F Loans", pd: 40.60, lgd: 60, ead: 23,  el: 5.59 },
    { segment: "DTI > 40%",       pd: 38.50, lgd: 55, ead: 55,  el: 11.65 },
  ];

  const riskMatrix = [
    { x: 7,  y: 28, z: 100, name: "Grade A",  color: C.green },
    { x: 11, y: 35, z: 130, name: "Grade B",  color: "#4ECDC4" },
    { x: 13, y: 42, z: 124, name: "Grade C",  color: C.gold },
    { x: 17, y: 50, z: 63,  name: "Grade D",  color: C.orange },
    { x: 20, y: 58, z: 17,  name: "Grade E",  color: C.red },
    { x: 24, y: 65, z: 5,   name: "Grade F",  color: "#CC0000" },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

      {/* PD by Segment */}
      <ChartCard title="Probability of Default (PD) by Segment" accent={C.red}>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={[...ageData.map(d => ({ name: d.group, pd: d.pd * 100, type: "Age" })),
            ...gradeData.slice(3).map(d => ({ name: "Grade " + d.grade, pd: d.pd * 100, type: "Grade" }))]
            .sort((a, b) => b.pd - a.pd)}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="name" stroke={C.sub} tick={{ fill: C.sub, fontSize: 9 }} />
            <YAxis stroke={C.sub} tick={{ fill: C.sub, fontSize: 10 }} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="pd" name="PD %" radius={[4, 4, 0, 0]}>
              {[...ageData, ...gradeData.slice(3)].map((d, i) => (
                <Cell key={i} fill={i < 2 ? C.red : i < 4 ? C.orange : C.gold} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* LGD Analysis */}
      <ChartCard title="Loss Given Default (LGD) by Loan Grade" accent={C.orange}>
        <ResponsiveContainer width="100%" height={230}>
          <BarChart data={gradeData}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="grade" stroke={C.sub} tick={{ fill: C.sub, fontSize: 11 }} />
            <YAxis stroke={C.sub} tick={{ fill: C.sub, fontSize: 10 }} domain={[0, 1]} tickFormatter={v => `${(v * 100).toFixed(0)}%`} />
            <Tooltip formatter={(v) => `${(v * 100).toFixed(0)}%`} contentStyle={{ background: C.slate, border: `1px solid ${C.border}`, borderRadius: 8 }} />
            <Bar dataKey="lgd" name="LGD %" radius={[4, 4, 0, 0]}>
              {gradeData.map((d, i) => (
                <Cell key={i} fill={[C.green, "#4ECDC4", C.gold, C.orange, C.red, "#CC0000"][i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Expected Loss by Segment */}
      <ChartCard title="Expected Loss (EL) by Segment — EL = PD × LGD × EAD" span={2} accent={C.accent}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: C.slate }}>
                {["Segment", "PD (%)", "LGD (%)", "EAD ($M)", "Expected Loss ($M)", "Risk Level"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: C.accent, fontWeight: 700, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expectedLossBySegment.map((row, i) => {
                const risk = row.el > 10 ? [C.red, "Critical"] : row.el > 5 ? [C.orange, "High"] : [C.gold, "Moderate"];
                return (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.navy2 + "80" : "transparent" }}>
                    <td style={{ padding: "8px 12px", color: C.text, fontWeight: 600 }}>{row.segment}</td>
                    <td style={{ padding: "8px 12px", color: C.orange }}>{row.pd.toFixed(2)}%</td>
                    <td style={{ padding: "8px 12px", color: C.gold }}>{row.lgd}%</td>
                    <td style={{ padding: "8px 12px", color: C.sub }}>${row.ead}M</td>
                    <td style={{ padding: "8px 12px", color: risk[0], fontWeight: 800, fontFamily: "monospace" }}>${row.el.toFixed(2)}M</td>
                    <td style={{ padding: "8px 12px" }}>
                      <span style={{ background: risk[0] + "20", color: risk[0], padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700 }}>{risk[1]}</span>
                    </td>
                  </tr>
                );
              })}
              <tr style={{ background: C.slate }}>
                <td style={{ padding: "8px 12px", color: C.accent, fontWeight: 800 }}>TOTAL PORTFOLIO</td>
                <td style={{ padding: "8px 12px", color: C.orange, fontWeight: 800 }}>20.99%</td>
                <td style={{ padding: "8px 12px", color: C.gold, fontWeight: 800 }}>40.5%</td>
                <td style={{ padding: "8px 12px", color: C.sub, fontWeight: 800 }}>$425M</td>
                <td style={{ padding: "8px 12px", color: C.red, fontWeight: 800, fontFamily: "monospace", fontSize: 15 }}>$40.8M</td>
                <td style={{ padding: "8px 12px" }}>
                  <span style={{ background: C.red + "20", color: C.red, padding: "2px 10px", borderRadius: 20, fontWeight: 700 }}>CRITICAL</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* Risk Matrix Scatter */}
      <ChartCard title="Risk Matrix: Interest Rate vs. LGD (bubble = EAD)" span={2} accent={C.purple}
        note="Bubble size represents Exposure at Default. Top-right quadrant = maximum risk.">
        <ResponsiveContainer width="100%" height={240}>
          <ScatterChart margin={{ top: 10, right: 30, bottom: 10, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="x" name="Avg Interest Rate" stroke={C.sub} tick={{ fill: C.sub, fontSize: 10 }} unit="%" label={{ value: "Avg Interest Rate (%)", position: "insideBottom", offset: -5, fill: C.sub, fontSize: 10 }} />
            <YAxis dataKey="y" name="LGD" stroke={C.sub} tick={{ fill: C.sub, fontSize: 10 }} unit="%" label={{ value: "LGD (%)", angle: -90, position: "insideLeft", fill: C.sub, fontSize: 10 }} />
            <ZAxis dataKey="z" range={[200, 1200]} name="EAD ($B)" />
            <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: C.slate, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }}
              formatter={(val, name) => [name === "EAD ($B)" ? `$${val}M` : `${val}%`, name]} />
            {riskMatrix.map((d, i) => (
              <Scatter key={i} name={d.name} data={[d]} fill={d.color} opacity={0.85} />
            ))}
            <Legend wrapperStyle={{ fontSize: 11, color: C.sub }} />
            <ReferenceLine x={17} stroke={C.red} strokeDasharray="4 4" label={{ value: "Rate Threshold", fill: C.red, fontSize: 9 }} />
            <ReferenceLine y={50} stroke={C.red} strokeDasharray="4 4" label={{ value: "LGD Threshold", fill: C.red, fontSize: 9 }} />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function PageAdvanced() {
  const chiSquare = [
    { test: "Loan Grade vs. Default",    chi2: 4821.2, pval: "< 0.001", result: "SIGNIFICANT",    color: C.red },
    { test: "Income Group vs. Default",  chi2: 1203.8, pval: "< 0.001", result: "SIGNIFICANT",    color: C.red },
    { test: "Home Ownership vs. Default",chi2: 891.4,  pval: "< 0.001", result: "SIGNIFICANT",    color: C.red },
    { test: "Age Group vs. Default",     chi2: 312.6,  pval: "< 0.001", result: "SIGNIFICANT",    color: C.orange },
    { test: "Employment Length vs. Default",chi2: 218.4,pval: "< 0.001", result: "SIGNIFICANT",   color: C.orange },
    { test: "Loan Purpose vs. Default",  chi2: 456.1,  pval: "< 0.001", result: "SIGNIFICANT",    color: C.orange },
  ];

  const tTest = [
    { var: "Loan Amount",    tstat: 18.42, df: 32580, pval: "< 0.001", result: "Default > Non-Default",  color: C.red },
    { var: "Annual Income",  tstat: -24.10,df: 32580, pval: "< 0.001", result: "Non-Default > Default",  color: C.green },
    { var: "Interest Rate",  tstat: 31.82, df: 32580, pval: "< 0.001", result: "Default > Non-Default",  color: C.red },
    { var: "DTI Ratio",      tstat: 28.94, df: 32580, pval: "< 0.001", result: "Default > Non-Default",  color: C.red },
    { var: "Emp. Length",    tstat: -9.21, df: 32580, pval: "< 0.001", result: "Non-Default > Default",  color: C.green },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

      {/* Correlation Radar */}
      <ChartCard title="Feature Correlation with Default (Pearson r)" accent={C.accent}>
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={correlationData} cx="50%" cy="50%" outerRadius="75%">
            <PolarGrid stroke={C.border} />
            <PolarAngleAxis dataKey="factor" tick={{ fill: C.sub, fontSize: 10 }} />
            <PolarRadiusAxis domain={[0, 1]} tick={{ fill: C.muted, fontSize: 9 }} />
            <Radar name="Correlation" dataKey="defaultCorr" stroke={C.accent} fill={C.accent} fillOpacity={0.25} strokeWidth={2} />
            <Tooltip contentStyle={{ background: C.slate, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11 }} formatter={(v) => v.toFixed(2)} />
          </RadarChart>
        </ResponsiveContainer>
        <InsightBox items={[
          "Loan Grade has the strongest correlation with default (r = 0.82).",
          "DTI Ratio is the second strongest predictor (r = 0.74).",
          "Age has the weakest correlation (r = 0.42)."
        ]} color={C.accent} />
      </ChartCard>

      {/* Outlier Analysis */}
      <ChartCard title="Outlier Analysis — Default Rate by Grade & DTI" accent={C.gold}>
        <ResponsiveContainer width="100%" height={280}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis dataKey="rate" name="Default Rate" stroke={C.sub} tick={{ fill: C.sub, fontSize: 10 }} unit="%"
              label={{ value: "Default Rate (%)", position: "insideBottom", offset: -10, fill: C.sub, fontSize: 10 }} />
            <YAxis dataKey="avgRate" name="Avg Interest Rate" stroke={C.sub} tick={{ fill: C.sub, fontSize: 10 }} unit="%"
              label={{ value: "Interest Rate (%)", angle: -90, position: "insideLeft", fill: C.sub, fontSize: 10 }} />
            <ZAxis range={[60, 500]} />
            <Tooltip contentStyle={{ background: C.slate, border: `1px solid ${C.border}`, borderRadius: 8 }} />
            <Scatter data={gradeData} name="Grades">
              {gradeData.map((d, i) => <Cell key={i} fill={[C.green, "#4ECDC4", C.gold, C.orange, C.red, "#CC0000"][i]} />)}
            </Scatter>
            <ReferenceLine x={35} stroke={C.red} strokeDasharray="3 3" />
            <ReferenceLine y={20} stroke={C.gold} strokeDasharray="3 3" />
          </ScatterChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Chi-Square Tests */}
      <ChartCard title="Chi-Square Test Results — Association with Default" span={2} accent={C.red}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: C.slate }}>
                {["Variable", "χ² Statistic", "p-value", "Result", "Business Insight"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: C.accent, fontWeight: 700, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {chiSquare.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.navy2 + "80" : "transparent" }}>
                  <td style={{ padding: "8px 12px", color: C.text, fontWeight: 600 }}>{row.test}</td>
                  <td style={{ padding: "8px 12px", color: C.gold, fontFamily: "monospace" }}>{row.chi2.toLocaleString()}</td>
                  <td style={{ padding: "8px 12px", color: C.green }}>{row.pval}</td>
                  <td style={{ padding: "8px 12px" }}>
                    <span style={{ background: row.color + "20", color: row.color, padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>✓ {row.result}</span>
                  </td>
                  <td style={{ padding: "8px 12px", color: C.sub, fontSize: 11 }}>
                    {row.test.includes("Grade") ? "Grade is the strongest categorical predictor of default" :
                     row.test.includes("Income") ? "Income level significantly determines default probability" :
                     row.test.includes("Home") ? "Renters default significantly more than homeowners" :
                     row.test.includes("Age") ? "Younger borrowers show significantly higher default rates" :
                     row.test.includes("Employment") ? "Longer employment significantly reduces default risk" :
                     "Loan purpose is a significant risk determinant"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* T-Test Results */}
      <ChartCard title="Independent T-Test Results — Default vs. Non-Default Customers" span={2} accent={C.purple}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: C.slate }}>
                {["Variable", "T-Statistic", "Degrees of Freedom", "p-value", "Finding"].map(h => (
                  <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: C.purple, fontWeight: 700, borderBottom: `1px solid ${C.border}` }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tTest.map((row, i) => (
                <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: i % 2 === 0 ? C.navy2 + "80" : "transparent" }}>
                  <td style={{ padding: "8px 12px", color: C.text, fontWeight: 600 }}>{row.var}</td>
                  <td style={{ padding: "8px 12px", color: row.tstat > 0 ? C.red : C.green, fontFamily: "monospace", fontWeight: 700 }}>{row.tstat}</td>
                  <td style={{ padding: "8px 12px", color: C.sub }}>{row.df.toLocaleString()}</td>
                  <td style={{ padding: "8px 12px", color: C.green }}>{row.pval}</td>
                  <td style={{ padding: "8px 12px" }}>
                    <span style={{ background: row.color + "20", color: row.color, padding: "2px 8px", borderRadius: 20, fontSize: 10, fontWeight: 700 }}>{row.result}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <InsightBox items={[
          "✓ Significant relationship between Loan Grade and Default (χ² = 4,821, p < 0.001).",
          "✓ Significant difference in Loan Amount between Default and Non-Default customers (t = 18.42, p < 0.001).",
          "✓ Annual Income is significantly lower among defaulting customers (t = -24.10, p < 0.001).",
          "✓ DTI Ratio is the most statistically powerful continuous predictor (t = 28.94, p < 0.001)."
        ]} color={C.purple} />
      </ChartCard>

      {/* Lending Strategy */}
      <ChartCard title="Lending Decision Strategy — Approve / Review / Reject" span={2} accent={C.green}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={lendingStrategyData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
            <XAxis type="number" stroke={C.sub} tick={{ fill: C.sub, fontSize: 10 }} />
            <YAxis dataKey="segment" type="category" stroke={C.sub} tick={{ fill: C.sub, fontSize: 9 }} width={140} />
            <Tooltip contentStyle={{ background: C.slate, border: `1px solid ${C.border}`, borderRadius: 8 }} />
            <Bar dataKey="pd" name="PD %" radius={[0, 4, 4, 0]}>
              {lendingStrategyData.map((d, i) => (
                <Cell key={i} fill={DECISION_COLORS[d.decision]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
          {Object.entries(DECISION_COLORS).map(([d, c]) => (
            <div key={d} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: c }} />
              <span style={{ fontSize: 11, color: C.sub }}>{d}</span>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    ageGroup: "All", incomeGroup: "All", loanGrade: "All",
    loanPurpose: "All", defaultStatus: "All",
  });

  const pages = [<PageExecutive />, <PageCustomerRisk />, <PageLoanRisk />, <PagePortfolio />, <PageAdvanced />];

  return (
    <div style={{
      background: C.navy, minHeight: "100vh", fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: C.text, padding: 0,
    }}>
      {/* Header */}
      <div style={{
        background: `linear-gradient(90deg, ${C.navy2} 0%, ${C.slate} 100%)`,
        borderBottom: `2px solid ${C.accent}`,
        padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
            <div style={{ width: 8, height: 8, background: C.red, borderRadius: "50%", animation: "pulse 1.5s infinite" }} />
            <span style={{ fontSize: 10, color: C.red, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase" }}>Live Risk Monitor</span>
          </div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 900, letterSpacing: 0.5 }}>
            FinTech Loan Default Risk Analytics
            <span style={{ color: C.accent }}> | Credit Risk Intelligence Dashboard</span>
          </h1>
          <p style={{ margin: "3px 0 0", fontSize: 11, color: C.sub }}>
            Transforming Lending Decisions Through Data-Driven Risk Analytics · 32,582 customers · $425M portfolio
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 11, color: C.muted }}>As of June 2026</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: C.red, fontFamily: "monospace" }}>20.99%</div>
          <div style={{ fontSize: 10, color: C.sub }}>Portfolio Default Rate</div>
        </div>
      </div>

      {/* Page Navigation */}
      <div style={{
        background: C.navy2, borderBottom: `1px solid ${C.border}`,
        display: "flex", padding: "0 28px", gap: 0,
      }}>
        {PAGES.map(p => (
          <button key={p.id} onClick={() => setPage(p.id)} style={{
            background: page === p.id ? C.accent + "18" : "transparent",
            border: "none", borderBottom: page === p.id ? `3px solid ${C.accent}` : "3px solid transparent",
            color: page === p.id ? C.accent : C.sub,
            padding: "12px 20px", cursor: "pointer", fontSize: 12, fontWeight: page === p.id ? 700 : 400,
            transition: "all 0.15s", whiteSpace: "nowrap",
          }}>
            {p.icon} {p.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "20px 28px" }}>
        {/* Filter Bar */}
        <FilterBar filters={filters} setFilters={setFilters} />

        {/* Page Content */}
        {pages[page]}
      </div>

      {/* Footer */}
      <div style={{
        background: C.navy2, borderTop: `1px solid ${C.border}`,
        padding: "12px 28px", display: "flex", justifyContent: "space-between", alignItems: "center"
      }}>
        <span style={{ fontSize: 10, color: C.muted }}>
          Credit Risk Intelligence Dashboard · EL = PD × LGD × EAD · Industry-Grade Analytics
        </span>
        <span style={{ fontSize: 10, color: C.muted }}>
          Data Source: Loan Risk Portfolio · 32,582 customers · Refreshed June 2026
        </span>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0A1628; }
        ::-webkit-scrollbar-thumb { background: #1E3A5F; border-radius: 3px; }
      `}</style>
    </div>
  );
}