from fastapi import APIRouter, HTTPException, Query
from dotenv import load_dotenv
import os
import time
import asyncio
import requests

router = APIRouter() 
load_dotenv() 
#Powershell command - curl http://127.0.0.1:8000/market/ping 
@router.get("/ping")
async def ping():
    # simple healthcheck
    return  {"ok": True}
@router.get("/ticker/{symbol}")
async def ticker(symbol: str):
    # 1. Uppercase the symbol
    # 2. Call Alpaca: GET /v2/stocks/{symbol}/snapshot
    # 3. Return JSON: symbol, price, changePct, open, high, low, prevClose, volume, asOf    
    start_time = time.perf_counter()
    url = f"https://data.alpaca.markets/v2/stocks/{symbol.upper()}/snapshot"

    def _get_snapshot():
        return requests.get(url, headers=get_headers(), timeout=30)

    response = await asyncio.to_thread(_get_snapshot)
    if response.status_code == 200: 
        content = response.json()
        ticker_json = {
                "symbol": content["symbol"],
                "price": content["latestTrade"]["p"], 
                "changePct": ((content["latestTrade"]["p"] - content["prevDailyBar"]["c"])/ content["prevDailyBar"]["c"])*100, 
                "open": content["dailyBar"]["o"], 
                "high": content["dailyBar"]["h"], 
                "low": content["dailyBar"]["l"],
                "prevClose": content["prevDailyBar"]["c"],
                "volume": content["dailyBar"]["v"], 
                "asOf": content["latestTrade"]["t"]    
            }
        return ticker_json 
    elif response.status_code == 404: 
        return "The stock you are looking for does not exist."
    elif response.status_code == 400:
        return "Sorry, something went wrong. Please try again."




@router.get("/quotes")
async def quotes(symbols: str):
    """
    OUR API — batch quotes endpoint so the frontend can fetch a list of multiple tickers at once(like top 50, s&p 500, etc)!
    Query:  /market/quotes?symbols=AAPL,NVDA,MSFT
    Steps:
      1) Parse CSV → ["AAPL","NVDA","MSFT"] (uppercase, de-dup, cap to 50)
      2) For each symbol, call Alpaca: GET /v2/stocks/{symbol}/snapshot
      3) Compute changePct from price vs prevClose
      4) Return a list of { symbol, price, changePct, open, high, low, prevClose, volume, asOf }
    """
    start = time.time() 
    tickers = symbols.split(",")
    tasks = [asyncio.create_task(helper_ticker(t)) for t in tickers]
    tickers_data = await asyncio.gather(*tasks)
    end = time.time() 
    return tickers_data

async def helper_ticker(symbol: str):
    # 1. Uppercase the symbol
    # 2. Call Alpaca: GET /v2/stocks/{symbol}/snapshot
    # 3. Return JSON: symbol, price, changePct, open, high, low, prevClose, volume, asOf
    url = f"https://data.alpaca.markets/v2/stocks/{symbol.upper()}/snapshot"

    def _get():
        return requests.get(url, headers=get_headers(), timeout=30)

    response = await asyncio.to_thread(_get)
    if response.status_code == 200: 
        content = response.json()
        ticker_json = {
                "symbol": content["symbol"],
                "price": content["latestTrade"]["p"], 
                "changePct": ((content["latestTrade"]["p"] - content["prevDailyBar"]["c"])/ content["prevDailyBar"]["c"])*100, 
                "open": content["dailyBar"]["o"], 
                "high": content["dailyBar"]["h"], 
                "low": content["dailyBar"]["l"],
                "prevClose": content["prevDailyBar"]["c"],
                "volume": content["dailyBar"]["v"], 
                "asOf": content["latestTrade"]["t"]    
            }
        return ticker_json 
    elif response.status_code == 404: 
        return "The stock you are looking for does not exist."
    elif response.status_code == 400:
        return "Sorry, something went wrong. Please try again."
    

def get_headers():
    return {"accept": "application/json", "APCA-API-KEY-ID": os.getenv("APCA_API_KEY_ID"), "APCA-API-SECRET-KEY": os.getenv("APCA_API_SECRET_KEY"), "feed": "iex"}

@router.get("/most-active-stocks")
async def most_active_stocks(n: int = Query(10, ge=1, le=100)):
    """
    Top-N most active symbols (Alpaca screener), enriched with snapshot price / % change.
    Returns [{ "symbol", "name", "price", "change" }, ...].

    Steps:
      1) GET screener → list of symbols ranked by volume
      2) For each symbol, GET snapshot (parallel via gather) for live price and changePct
      3) Shape rows for the UI; skip symbols where helper_ticker returned an error string
    """
    url = f"https://data.alpaca.markets/v1beta1/screener/stocks/most-actives?by=volume&top={n}"

    # Blocking HTTP off the event loop (requests is sync).
    def _get_screener():
        return requests.get(url, headers=get_headers(), timeout=30)

    response = await asyncio.to_thread(_get_screener)
    if response.status_code != 200:
        # Surface Alpaca error body when JSON; else fall back to text / HTTP reason.
        try:
            body = response.json()
            msg = body.get("message", str(body))
        except Exception:
            msg = response.text or getattr(response, "reason", "") or "Request failed"
        raise HTTPException(status_code=response.status_code, detail=msg)

    payload = response.json()
    symbols = [item["symbol"] for item in payload.get("most_actives", [])]
    if not symbols:
        return []

    # One snapshot request per symbol; all run concurrently (each helper uses to_thread internally).
    snapshots = await asyncio.gather(*[helper_ticker(sym) for sym in symbols])
    rows = []
    for sym, snap in zip(symbols, snapshots):
        # helper_ticker returns a dict on success or a user-facing str on 404/400.
        if isinstance(snap, str):
            continue
        cp = snap["changePct"]
        rows.append(
            {
                "symbol": sym,
                "name": sym,
                "price": snap["price"],
                "change": f"{'+' if cp >= 0 else ''}{cp:.2f}%",
            }
        )
    return rows