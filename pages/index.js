import { useState } from 'react';

export default function Home() {
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setLoading(true);
    const res = await fetch('/api/lookup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phone })
    });
    setResult(await res.json());
    setLoading(false);
  };

  const handleClear = () => {
    setPhone('');
    setResult(null);
  };

  return (
    <div>
      <div className="lookup-card">
        <h1 className="lookup-title">📱 កម្មវិធីស្វែងរកលេខទូរស័ព្ទកម្ពុជា</h1>
        <form onSubmit={handleSubmit} className="lookup-form">
          <label htmlFor="phone_number">លេខទូរស័ព្ទ</label>
          <input
            id="phone_number"
            type="text"
            required
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="ឧ. 012345678 ឬ +85512345678"
          />
          <div className="button-row">
            <button
              type="submit"
              disabled={loading}
              className="lookup-btn"
            >
              <span style={{ marginRight: 8 }}>🔍</span> ស្វែងរក
            </button>
            <button
              type="button"
              onClick={handleClear}
              className="clear-btn"
            >
              <span style={{ marginRight: 8 }}>❌</span> សម្អាត
            </button>
          </div>
        </form>

        {loading && <p className="loading">កំពុងស្វែងរក...</p>}

        {result && (
          <div className={`result-card${result.error ? ' error' : ''}`}>
            {result.error ? (
              <>
                <div className="result-header">❗ បញ្ហា</div>
                <div className="result-body">
                  <div className="result-row">{result.error}</div>
                  <button type="button" onClick={handleClear} className="clear-btn">សម្អាត</button>
                </div>
              </>
            ) : (
              <>
                <div className="result-header">📊 លទ្ធផល</div>
                <div className="result-body">
                  <div className="result-row"><span className="icon">📞</span><span className="label">លេខទូរស័ព្ទ:</span> <span className="value">{result.number}</span></div>
                  <div className="result-row"><span className="icon">🌏</span><span className="label">ទីតាំង:</span> <span className="value">{result.location}</span></div>
                  <div className="result-row"><span className="icon">📡</span><span className="label">ក្រុមហ៊ុនបម្រើសេវា:</span> <span className="value">{result.provider}</span></div>
                  <div className="result-row"><span className="icon">⏰</span><span className="label">ម៉ោងតំបន់:</span> <span className="value">{result.timezones.join(', ')}</span></div>
                  <button type="button" onClick={handleClear} className="clear-btn">សម្អាត</button>
                </div>
              </>
            )}
          </div>
        )}

        <div className="powered-by">បង្កើតដោយ <span style={{ color: '#2563eb', fontWeight: 600 }}>Soriya  Developer</span></div>
      </div>
    </div>
  );
}
