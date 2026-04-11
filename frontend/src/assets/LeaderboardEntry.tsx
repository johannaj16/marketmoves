const LeaderboardEntry =  ({place, userName, schoolName, points}: {
   place?: string;
   userName?: string;
   schoolName?: string;
   points?: string;
}) => {


return (
   <div className="Leaderboard-Entry">
       <div className="name-info">
           <div className="entry-rank">{place}</div>
           <div className="entry-name">{userName}</div>
           <div className="school-name">{schoolName}</div>
           <div className="school-name">{points}</div>
       </div>
   </div>
);
}
export default LeaderboardEntry;

