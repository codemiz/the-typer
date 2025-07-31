import { createContext , useContext , useEffect, useState } from "react";
import { getLeaderboard } from "../appwrite";
const LeaderboardContext = createContext()

export const LeaderboardProvider =({children}) =>{
    const [leaderboard, setLeaderboard] = useState([])
    const [loading, setLoading] = useState(true)



    useEffect(() => {
       getLeaderboard()
       .then(res=>{
         setLeaderboard(res.documents);
         console.log(res);
         
         

       })
       .catch(()=>setLeaderboard(null))
       .finally(()=>setLoading(false))
    }, [])
    
   return(
   <LeaderboardContext.Provider value={{leaderboard,loading , setLeaderboard}}>
    {children}
   </LeaderboardContext.Provider>
   )
}
export const useLeaderboard = () => useContext(LeaderboardContext)