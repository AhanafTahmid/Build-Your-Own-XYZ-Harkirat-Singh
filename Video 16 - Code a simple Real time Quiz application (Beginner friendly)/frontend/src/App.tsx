import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { User } from './components/User';
import { Admin } from './components/Admin';
import { LeaderBoard } from './components/leaderboard/LeaderBoard';

function App() {

  return (
    <BrowserRouter>
      <Routes>
       
          <Route path="admin" element={<Admin />} />
          <Route path="user" element={<User />} />
          <Route
              path="leaderboard"
              element={
                <LeaderBoard
                  leaderboardData={[
                    {
                      points: 124,
                      username: "ahanaf",
                      profilePicture:
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtRs_rWILOMx5-v3aXwJu7LWUhnPceiKvvDg&s",
                    },
                    {
                      points: 12225354,
                      username: "ahanaf2",
                      profilePicture:
                        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRtRs_rWILOMx5-v3aXwJu7LWUhnPceiKvvDg&s",
                    },
                  ]}
                />
              }
            />


      </Routes>
    </BrowserRouter>
  )
}

export default App
