import { createContext, useState } from 'react';

export const PlayerContext = createContext('');

export const PlayerProvider = ({ children }) => {

  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [ isPlaying, setIsPlaying ] = useState(false)

  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true)
  }

  function togglePlay () {
    setIsPlaying(!isPlaying); //altera para o contrario dela

  }

  function setIsPlayingState (state) {
    setIsPlaying(state);
  };

  const context = {
    episodeList,
    currentEpisodeIndex,
    play,
    isPlaying,
    togglePlay,
    setIsPlayingState,
  }

  return (
    <PlayerContext.Provider value={context}>
      { children }
    </PlayerContext.Provider>
  );
};