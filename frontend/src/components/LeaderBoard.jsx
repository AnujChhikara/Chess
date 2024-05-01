/* eslint-disable react/prop-types */


export default function LeaderBoard({ allPlayerData }) {
    console.log('leaderbora')
    return (
      <div>
        <p className="text-2xl font-bold mb-4 text-teal-500 underline">Leaderboard</p>
        <div className="border w-80">
            <div className="flex justify-between bg-teal-200 w-full text-black font-bold text-lg px-4 ">
                <div></div>
                <p>Playername</p>
                 <p>Ratings</p>
            </div>
            <div className="px-4 font-bold">
        {
          allPlayerData && allPlayerData
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 9)
            .map((player, index) => (
              <div className="flex justify-between" key={player._id}>
                <div>#{index + 1}:</div>
                <p>{player.playername}</p>
                <p>{player.rating}</p>
              </div>
            ))
        }
        </div>
      </div></div>
    );
  }