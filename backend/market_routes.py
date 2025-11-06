from collections import defaultdict
from fastapi import APIRouter
import httpx
import json 
from dotenv import load_dotenv 
import os 
# market_routes.py → stock websocket outputs 
router = APIRouter() 
load_dotenv() 
#Powershell command - curl http://127.0.0.1:8000/market/ping 
@router.get("/ping")
def ping():
    # simple healthcheck
    return  {"ok": True}
@router.get("/ticker/{symbol}")
async def ticker(symbol: str):
    # 1. Uppercase the symbol
    # 2. Call Alpaca: GET /v2/stocks/{symbol}/snapshot
    # 3. Return JSON: symbol, price, changePct, open, high, low, prevClose, volume, asOf    
 
    headers = {"accept": "application/json", "APCA-API-KEY-ID": os.getenv("APCA-API-KEY-ID"), "APCA-API-SECRET-KEY": os.getenv("APCA-API-SECRET-KEY")}
    url = f"https://data.alpaca.markets/v2/stocks/{symbol.upper()}/snapshot"
     #creating an http session to get the data from the api 
    async with httpx.AsyncClient() as client:
        #waiting a response from the api 
        response = await client.get(url, headers=headers)
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
    tickers = symbols.split(",")
    headers = {"accept": "application/json", "APCA-API-KEY-ID": os.getenv("APCA-API-KEY-ID"), "APCA-API-SECRET-KEY": os.getenv("APCA-API-SECRET-KEY")}
    tickers_json = defaultdict(dict)
    for ticker in tickers: 
        url = f"https://data.alpaca.markets/v2/stocks/{ticker.upper()}/snapshot"
        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            content = response.json()
        entry = {
            "price": content["latestTrade"]["p"], 
            "changePct": ((content["latestTrade"]["p"] - content["prevDailyBar"]["c"])/ content["prevDailyBar"]["c"])*100, 
            "open": content["dailyBar"]["o"], 
            "high": content["dailyBar"]["h"], 
            "low": content["dailyBar"]["l"],
            "prevClose": content["prevDailyBar"]["c"],
            "volume": content["dailyBar"]["v"], 
            "asOf": content["latestTrade"]["t"]    
        }
        tickers_json[content["symbol"]] = entry 
        
    return tickers_json 