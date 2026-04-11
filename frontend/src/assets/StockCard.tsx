const StockCard =  ({ticker, name, change}: {
   ticker?: string;
   name?: string;
   change?: string;
}) => {
const changeType = () => {
   if(change.startsWith('-')){
       return <div className = 'change' style ={{color: 'red'}}>{change}</div>
   }
   else if(change.startsWith('+')){
       return <div className = 'change' style ={{color: 'green'}}>{change}</div>
   }
   else{
       return <div className = 'change'>{change}</div>
   }
}
return (
   <div className="Leaderboard-Entry">
       <div className="stock-info">
           <div className="ticker">{ticker}</div>
           <div className="name">{name}</div>
           {changeType()}
       </div>
   </div>
);
}
export default StockCard;





