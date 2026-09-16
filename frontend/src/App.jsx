import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, Globe2, Calculator, Calendar, MapPin, Search, ListFilter, DollarSign, PieChart, AlertTriangle } from 'lucide-react';

const styles = {
  // Fondo con degradado premium sutil
  container: { fontFamily: 'Inter, system-ui, sans-serif', padding: '40px', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh', color: '#0f172a', textAlign: 'left' },
  header: { display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' },
  title: { fontSize: '32px', fontWeight: 'bold', margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '12px' },
  subtitle: { color: '#64748b', marginTop: '6px', fontSize: '18px' },
  controlsContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '25px', maxWidth: '1300px', margin: '0 auto 25px auto' },
  // Tarjetas con bordes más suaves y sombras más elegantes (Glassmorphism sutil)
  controlCard: { backgroundColor: 'white', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.05)', border: '1px solid #f1f5f9' },
  controlHeader: { display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '600', marginBottom: '15px', color: '#334155', fontSize: '18px' },
  input: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '15px', backgroundColor: '#f8fafc', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' },
  slider: { width: '100%', cursor: 'pointer', marginTop: '10px', accentColor: '#ef4444' },
  tariffValue: { fontSize: '28px', fontWeight: 'bold', color: '#ef4444', marginTop: '15px', display: 'block' },
  
  kpiContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', maxWidth: '1300px', margin: '0 auto 30px auto' },
  kpiCard: { display: 'flex', alignItems: 'center', gap: '20px', backgroundColor: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.05)', border: '1px solid #f1f5f9' },
  kpiTextContainer: { display: 'flex', flexDirection: 'column' },
  kpiLabel: { color: '#64748b', fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '5px' },
  kpiValue: { fontSize: '28px', fontWeight: 'bold', color: '#0f172a', margin: 0 },
  
  card: { backgroundColor: 'white', padding: '35px', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)', maxWidth: '1300px', margin: '0 auto', border: '1px solid #f1f5f9', overflow: 'hidden' },
  cardTitle: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '22px', marginBottom: '35px', fontWeight: 'bold', color: '#1e293b' },
  toggleBtn: { flex: 1, padding: '12px', borderRadius: '8px', border: 'none', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.2s' }
};

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [year, setYear] = useState('2025');
  const [region, setRegion] = useState('Canada');
  const [tariff, setTariff] = useState(10);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAll, setShowAll] = useState(false);

  const [regionalTotal, setRegionalTotal] = useState(0);
  const [nationalTotal, setNationalTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    
    
    const API_BASE = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';

    const fetchRegional = axios.get(`${API_BASE}/api/top-exports?year=${year}&region=${region}`);
    const fetchNational = region === 'Canada' 
      ? fetchRegional 
      : axios.get(`${API_BASE}/api/top-exports?year=${year}&region=Canada`);

    Promise.all([fetchRegional, fetchNational])
      .then(([regionalResponse, nationalResponse]) => {
        let regTotal = 0;
        const formattedData = regionalResponse.data.map(item => {
          const val = parseFloat(item.total_value) / 1000000000;
          regTotal += val; 
          return {
            category: item.product_category.split(' [')[0],
            originalValue: val,
          };
        });

        let natTotal = 0;
        nationalResponse.data.forEach(item => {
          natTotal += parseFloat(item.total_value) / 1000000000;
        });

        setData(formattedData);
        setRegionalTotal(regTotal);
        setNationalTotal(natTotal);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, [year, region]);

  let processedData = data.filter(item => 
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!showAll && searchQuery === '') {
    processedData = processedData.slice(0, 5);
  }

  const chartData = processedData.map(item => ({
    ...item,
    tariffImpact: item.originalValue * (tariff / 100),
    retainedRevenue: item.originalValue - (item.originalValue * (tariff / 100))
  }));

  const dynamicHeight = Math.max(500, chartData.length * 45);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const formatNum = (val) => (val > 0 && val < 0.01) ? val.toFixed(5) : val.toFixed(2);
      return (
        <div style={{ backgroundColor: 'white', padding: '15px', border: '1px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}>
          <p style={{ fontWeight: 'bold', margin: '0 0 12px 0', color: '#0f172a' }}>{label}</p>
          <p style={{ color: '#3b82f6', margin: '5px 0', fontSize: '14px' }}>
            Retained Revenue: <strong>${formatNum(payload[0].value)}B</strong>
          </p>
          <p style={{ color: '#ef4444', margin: '5px 0', fontSize: '14px' }}>
            Revenue at Risk: <strong>${formatNum(payload[1].value)}B</strong>
          </p>
          <hr style={{ borderTop: '1px solid #e2e8f0', margin: '12px 0' }}/>
          <p style={{ fontWeight: 'bold', margin: 0, color: '#334155', fontSize: '15px' }}>
            Total Export Value: ${formatNum(payload[0].value + payload[1].value)}B
          </p>
        </div>
      );
    }
    return null;
  };

  const totalTariffCost = regionalTotal * (tariff / 100);
  const percentageOfNational = nationalTotal > 0 ? ((regionalTotal / nationalTotal) * 100).toFixed(1) : 0;

  return (
    <div style={styles.container}>
      <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
        
        {/* TÍTULO CON BANDERAS INTEGRADAS */}
        <div style={styles.header}>
          <Globe2 size={48} color="#2563eb" />
          <div>
            <h1 style={styles.title}>
              🇨🇦 {region === 'Canada' ? 'National' : region} - US Trade Tariff Simulator 🇺🇸
            </h1>
            <p style={styles.subtitle}>Historical export data pipeline & Real-time impact analysis model</p>
          </div>
        </div>

        {!loading && (
          <div style={styles.kpiContainer}>
            <div style={{...styles.kpiCard, borderLeft: '5px solid #10b981'}}>
              <div style={{ backgroundColor: '#d1fae5', padding: '15px', borderRadius: '50%' }}>
                <DollarSign size={32} color="#059669" />
              </div>
              <div style={styles.kpiTextContainer}>
                <span style={styles.kpiLabel}>Total Export Volume</span>
                <h3 style={styles.kpiValue}>${regionalTotal.toFixed(2)}B</h3>
              </div>
            </div>

            <div style={{...styles.kpiCard, borderLeft: '5px solid #3b82f6'}}>
              <div style={{ backgroundColor: '#dbeafe', padding: '15px', borderRadius: '50%' }}>
                <PieChart size={32} color="#2563eb" />
              </div>
              <div style={styles.kpiTextContainer}>
                <span style={styles.kpiLabel}>Share of National Total</span>
                <h3 style={styles.kpiValue}>{region === 'Canada' ? '100' : percentageOfNational}%</h3>
              </div>
            </div>

            <div style={{...styles.kpiCard, borderLeft: '5px solid #ef4444'}}>
              <div style={{ backgroundColor: '#fee2e2', padding: '15px', borderRadius: '50%' }}>
                <AlertTriangle size={32} color="#dc2626" />
              </div>
              <div style={styles.kpiTextContainer}>
                <span style={styles.kpiLabel}>Tariff Exposure</span>
                <h3 style={{...styles.kpiValue, color: '#dc2626'}}>${totalTariffCost.toFixed(2)}B</h3>
              </div>
            </div>
          </div>
        )}

        <div style={styles.controlsContainer}>
          <div style={styles.controlCard}>
            <div style={styles.controlHeader}>
              <MapPin size={22} color="#8b5cf6" />
              <span>Location & Timeframe</span>
            </div>
            <select style={{...styles.input, marginBottom: '10px'}} value={region} onChange={(e) => setRegion(e.target.value)}>
              <option value="Canada">All Canada (National Total)</option>
              <option value="Alberta">Alberta</option>
              <option value="British Columbia">British Columbia</option>
              <option value="Manitoba">Manitoba</option>
              <option value="New Brunswick">New Brunswick</option>
              <option value="Newfoundland and Labrador">Newfoundland and Labrador</option>
              <option value="Northwest Territories">Northwest Territories</option>
              <option value="Nova Scotia">Nova Scotia</option>
              <option value="Nunavut">Nunavut</option>
              <option value="Ontario">Ontario</option>
              <option value="Prince Edward Island">Prince Edward Island</option>
              <option value="Quebec">Quebec</option>
              <option value="Saskatchewan">Saskatchewan</option>
              <option value="Yukon">Yukon</option>
            </select>
            <select style={styles.input} value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="2026">2026 (YTD)</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              <option value="2020">2020</option>
            </select>
          </div>

          <div style={styles.controlCard}>
            <div style={styles.controlHeader}>
              <ListFilter size={22} color="#f59e0b" />
              <span>Category Filters</span>
            </div>
            <div style={{ position: 'relative', marginBottom: '15px' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '13px' }} />
              <input 
                type="text" 
                placeholder="Search category (e.g. Wood, Metal)..." 
                style={{...styles.input, paddingLeft: '35px'}}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={() => setShowAll(false)} 
                style={{...styles.toggleBtn, backgroundColor: !showAll ? '#3b82f6' : '#f1f5f9', color: !showAll ? 'white' : '#64748b'}}
              >
                Top 5 Only
              </button>
              <button 
                onClick={() => setShowAll(true)} 
                style={{...styles.toggleBtn, backgroundColor: showAll ? '#3b82f6' : '#f1f5f9', color: showAll ? 'white' : '#64748b'}}
              >
                Show All ({data.length})
              </button>
            </div>
          </div>

          <div style={styles.controlCard}>
            <div style={styles.controlHeader}>
              <Calculator size={22} color="#ef4444" />
              <span>Simulated US Tariff Rate</span>
            </div>
            <input 
              type="range" min="0" max="100" step="1"
              value={tariff} onChange={(e) => setTariff(e.target.value)} 
              style={styles.slider}
            />
            <span style={styles.tariffValue}>{tariff}% Applied Tariff</span>
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.cardTitle}>
            <TrendingUp size={28} color="#059669" />
            Export Categories & Financial Impact (Billions CAD)
          </h2>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#64748b', padding: '50px 0', fontSize: '18px' }}>
              ⏳ Executing SQL query in Cloud Database...
            </p>
          ) : chartData.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#ef4444', padding: '50px 0', fontSize: '18px' }}>
              No categories match your search.
            </p>
          ) : (
            <div style={{ height: `${dynamicHeight}px`, width: '100%', transition: 'height 0.3s ease' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" tickFormatter={(value) => `$${value}B`} />
                  <YAxis dataKey="category" type="category" width={250} tick={{fontSize: 12, fill: '#475569'}} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#f1f5f9'}} />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '15px' }} />
                  <Bar dataKey="retainedRevenue" name="Retained Revenue" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} barSize={35} />
                  <Bar dataKey="tariffImpact" name="Revenue at Risk" stackId="a" fill="#ef4444" radius={[0, 6, 6, 0]} barSize={35} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;