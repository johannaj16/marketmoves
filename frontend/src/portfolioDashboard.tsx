import "./portfolioDashboard.css";
import NavBar from "./navBar";
import { PortfolioStockCard } from "./components/PortfolioStockCard";
import { useState } from "react";
import { userFacingFetchError } from "./lib/mostActiveStocks";
import { useMostActiveStocksQuery } from "./lib/useMostActiveStocksQuery";

function App() {
  // Leaderboard tabs (individual vs university) — local UI only for now.
  const [activeTab, setActiveTab] = useState("individual");
  const {
    data: mostActive = [],
    isPending: mostActiveLoading,
    isError,
    error,
  } = useMostActiveStocksQuery(10);
  const mostActiveError = isError ? userFacingFetchError(error) : null;

  return (
    <div className="container">
      <NavBar />
      <div className="wrapper">
        <div className="leftSide">
          {/* Portfolio Value Section */}
          {/* Has the total amount of money & ETF's*/}
          <div className="portfolio-value">Portfolio Value</div>
          <div className="total-money">$12,345.67</div>

          {/* Benchmark summary row (static placeholder until real market data is wired). */}
          <div className="row">
            <div className="SP-container">
              <div className="info">
                <h3>S&P 500</h3>
                <p>Standard & Poor's</p>
              </div>
              <div className="change">+49,50%</div>
            </div>

            <div className="SP-container">
              <div className="info">
                <h3>DOW</h3>
                <p>Dow Jones</p>
              </div>
              <div className="change">+49,50%</div>
            </div>
          </div>

          <div className="wishlist-header">
            <h1 className="wishlist-title">Wishlist</h1>
            <button className="add-button">
              {/*Add a stock to wishlist button finish this later*/}
            </button>
          </div>

          {/* Wishlist preview — hardcoded cards; not tied to mostActive fetch. */}
          <div className="stock-grid">
            <div className="stock-card">
              <div className="stock-info">
                <div className="stock-details">
                  <h2>AMZN</h2>
                  <p>Amazon, Inc</p>
                </div>
              </div>
              <div className="stock-change negative">- 0.05%</div>
            </div>

            <div className="stock-card">
              <div className="stock-info">
                <div className="stock-details">
                  <h2>ADBE</h2>
                  <p>Adobe, Inc</p>
                </div>
              </div>
              <div className="stock-change positive">+ 0.32%</div>
            </div>
          </div>

          <div className="total-money">Stocks</div>
          <p className="portfolio-stocks-subtitle">Top 10 most active</p>
          {/* loading → error → empty → list (mutually exclusive states). */}
          {mostActiveLoading ? (
            <p className="portfolio-most-active-status">
              Loading most active stocks…
            </p>
          ) : mostActiveError ? (
            <p className="portfolio-most-active-status portfolio-most-active-error">
              {mostActiveError}
            </p>
          ) : mostActive.length === 0 ? (
            <p className="portfolio-most-active-status">
              No most active data available.
            </p>
          ) : (
            mostActive.map((r) => (
              <PortfolioStockCard
                key={r.symbol}
                symbol={r.symbol}
                name={r.name}
                price={r.price}
                changeLabel={r.change}
              />
            ))
          )}
        </div>
        <div className="rightSide">
          <div className="personal-stats">
            <div className="buying-power">
              <p>Buying Power</p>
              <h2>$1,234.56</h2>
              <h6>$ Available to trade</h6>
            </div>
            <div className="points-earned">
              <p>Points Earned</p>
              <h2>1250</h2>
              <h6>+ 120 this week</h6>
            </div>
            <div className="your-rank">
              <p>Your Rank</p>
              <h2>#41</h2>
              <h6>Up 8 positions</h6>
            </div>
          </div>
          <div className="live-leaderboard">
            <div className="leaderboard-header">Live Leaderboard</div>
            <div className="ranking-button">
              <button
                className={`button ${activeTab === "individual" ? "active" : "inactive"
                  }`}
                onClick={() => setActiveTab("individual")}
              >
                Individual Rankings
              </button>
              <button
                className={`button ${activeTab === "university" ? "active" : "inactive"
                  }`}
                onClick={() => setActiveTab("university")}
              >
                University Rankings
              </button>
            </div>
            <div className="leaderboard-entries">
              {/* Figure out getting / setting data later*/}
              <LeaderBoardEntry
                place="1"
                userName=""
                schoolName="VT"
                points="100"
              />
              <LeaderBoardEntry
                place="2"
                userName=""
                schoolName="UVA"
                points="10"
              />
              <LeaderBoardEntry
                place="3"
                userName=""
                schoolName="VT"
                points="100"
              />
              <LeaderBoardEntry
                place="4"
                userName=""
                schoolName="VT"
                points="100"
              />
              <LeaderBoardEntry />
              <LeaderBoardEntry />
              <LeaderBoardEntry />
              <LeaderBoardEntry />
              <LeaderBoardEntry />
              <LeaderBoardEntry />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;

interface LeaderBoardEntryProps {
  place?: string;
  userName?: string;
  schoolName?: string;
  points?: string;
}

function LeaderBoardEntry(props: LeaderBoardEntryProps) {
  return (
    <div className="leaderboard-entry">
      <div className="name-info">
        <div className="entry-rank">{props.place}</div>
        <div className="entry-name">{props.userName}</div>
        <div className="school-name">{props.schoolName}</div>
      </div>
      <div className="entry-information">
        <div className="entry-points">1500 pts</div>
        <div className="entry-percent">+25% this week</div>
      </div>
    </div>
  );
}
