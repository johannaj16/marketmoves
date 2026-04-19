import './trade.css'
import NavBar from './navBar'
import { useState, useEffect, useRef } from 'react'
import { FiSearch } from 'react-icons/fi'
import bellIcon from './assets/bell.svg'
import appleIcon from './assets/apple_icon.svg'
import { apiUrl } from './lib/apiUrl'
import { userFacingFetchError } from './lib/mostActiveStocks'
import { useMostActiveStocksQuery } from './lib/useMostActiveStocksQuery'

interface TickerData {
    symbol: string
    price: number
    changePct: number
    open: number
    high: number
    low: number
    prevClose: number
    volume: number
    asOf: string
}

function Trade() {
    const [quantity, setQuantity] = useState(1)
    const [selectedStock, setSelectedStock] = useState('')
    const [price, setPrice] = useState(0)
    const {
        data: trendingStocks = [],
        isPending: trendingLoading,
        isError: trendingIsError,
        error: trendingQueryError,
    } = useMostActiveStocksQuery(10)
    const trendingError = trendingIsError
        ? userFacingFetchError(trendingQueryError)
        : null
    const [action, setAction] = useState<'buy' | 'sell'>('buy')
    const [timeframe, setTimeframe] = useState('1M')
    const [detailView, setDetailView] = useState<'summary' | 'details'>('details')
    const [tickerData, setTickerData] = useState<TickerData | null>(null)
    const intervalRef = useRef<number | null>(null)

    // Default selection once list exists (cache hit: data may be ready on first paint).
    useEffect(() => {
        if (trendingStocks.length === 0 || selectedStock) return
        setSelectedStock(trendingStocks[0].symbol)
        setPrice(trendingStocks[0].price)
    }, [trendingStocks, selectedStock])

    useEffect(() => {
        if (!selectedStock) return

        const fetchTicker = async () => {
            try {
                const response = await fetch(apiUrl(`/market/ticker/${selectedStock}`))
                if (!response.ok) throw new Error('Failed to fetch ticker data')
                const data: TickerData = await response.json()
                setTickerData(data)
                setPrice(data.price)
            } catch (error) {
                console.error('Error fetching ticker data:', error)
            }
        }

        fetchTicker()
        if (intervalRef.current) clearInterval(intervalRef.current)
        intervalRef.current = window.setInterval(fetchTicker, 5000)
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current)
        }
    }, [selectedStock])

    const selectedLabel =
        trendingStocks.find((s) => s.symbol === selectedStock)?.name ?? ''

    return (
        <div className="trade-page">
            {/* Navbar spans full width */}
            <div className="navbar-wrapper">
                <NavBar />
            </div>

            <div className="shell">
                {/* Centered search bar */}
                <div className="trade-search-bar">
                    <FiSearch className="search-icon" />
                    <input type="text" placeholder="Search Stocks" />
                </div>

                <div className="trade-columns">
                    {/* ===== LEFT ===== */}
                    <aside className="stocks-list">
                        <h3>Trending Stocks</h3>

                        {trendingLoading ? (
                            <p className="trade-trending-status">Loading trending stocks…</p>
                        ) : trendingError ? (
                            <p className="trade-trending-status trade-trending-error">{trendingError}</p>
                        ) : (
                        <div className="stocks-scroll">
                            {trendingStocks.length === 0 ? (
                                <p className="trade-trending-status">No trending data available.</p>
                            ) : (
                            trendingStocks.map((s) => (
                                <div
                                    key={s.symbol}
                                    className={`stock-card ${selectedStock === s.symbol ? 'active' : ''}`}
                                    onClick={() => { 
                                        setSelectedStock(s.symbol)
                                        if (s.price > 0) {
                                            setPrice(s.price)
                                        }
                                    }}
                                >
                                    <div>
                                        <strong>{s.symbol}</strong>
                                        <p>{s.name}</p>
                                    </div>
                                    <div className="stock-info">
                                        <span>{s.price > 0 ? `$${s.price.toFixed(2)}` : 'Loading...'}</span>
                                        <small style={{ color: typeof s.change === 'string' && s.change.includes('-') ? '#ef4444' : '#10b981' }}>
                                            {s.change}
                                        </small>
                                    </div>
                                </div>
                            ))
                            )}
                        </div>
                        )}

                        <div className="trade-form">
                            <h4>{selectedStock}</h4>

                            <label>Quantity</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                            />

                            <div className="price-row">
                                <p>Estimated Total</p>
                                <strong>${(price * quantity).toFixed(2)}</strong>
                            </div>

                            <div className="toggle-buttons">
                                <button
                                    className={action === 'buy' ? 'active-buy' : ''}
                                    onClick={() => setAction('buy')}
                                >
                                    Buy
                                </button>
                                <button
                                    className={action === 'sell' ? 'active-sell' : ''}
                                    onClick={() => setAction('sell')}
                                >
                                    Sell
                                </button>
                            </div>

                            <button className={`submit-btn ${action === 'buy' ? 'green' : 'red'}`}>
                                {action === 'buy' ? `Buy ${selectedStock}` : `Sell ${selectedStock}`}
                            </button>
                            <small>+50 points for smart risk management</small>
                        </div>
                    </aside>

                    {/* ===== RIGHT ===== */}
                    <main className="chart-area">
                        <div className="stock-preview">
                            <div className="stock-symbol">
                                <img src={appleIcon} alt="Apple Inc." className="company-icon" />
                                <div>
                                    <strong>{selectedStock || '—'}</strong>
                                    <p>{selectedLabel || '\u00a0'}</p>
                                </div>
                            </div>


                            <div className="stock-price">
                                <strong>
                                    {tickerData ? `$${tickerData.price.toFixed(2)}` : 'Loading...'}
                                </strong>
                                {tickerData && (
                                    <p className={tickerData.changePct >= 0 ? 'positive' : 'negative'}>
                                        {tickerData.changePct >= 0 ? '+' : ''}{tickerData.changePct.toFixed(2)}%
                                    </p>
                                )}
                            </div>

                            <div className="stock-price">
                                <strong>
                                    {tickerData ? `$${tickerData.prevClose.toFixed(2)}` : 'Loading...'}
                                </strong>
                                {tickerData && (() => {
                                    const change = tickerData.price - tickerData.prevClose
                                    const changePercent = (change / tickerData.prevClose) * 100
                                    return (
                                        <p className={changePercent >= 0 ? 'positive' : 'negative'}>
                                            {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
                                        </p>
                                    )
                                })()}
                            </div>

                            <button className="bell-btn" title="Notifications">
                                <img src={bellIcon} alt="Notify" />
                            </button>
                        </div>

                        <div className="chart-placeholder">
                            <p>📈 Chart Coming Soon</p>
                        </div>

                        <div className="chart-buttons">
                            {['1D', '1W', '1M', '1Y', '5Y', 'ALL'].map(btn => (
                                <button
                                    key={btn}
                                    className={timeframe === btn ? 'active' : ''}
                                    onClick={() => setTimeframe(btn)}
                                >
                                    {btn}
                                </button>
                            ))}
                        </div>

                        <div className="summary-buttons">
                            <button
                                onClick={() => setDetailView('summary')}
                                className={detailView === 'summary' ? 'active' : ''}
                            >Summary</button>
                            <button
                                onClick={() => setDetailView('details')}
                                className={detailView === 'details' ? 'active' : ''}
                            >Details</button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Trade
