import { createContext, useContext, useState } from 'react';

export const PlayerContext = createContext('');

export const PlayerProvider = ({ children }) => {

  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [ isPlaying, setIsPlaying ] = useState(false);
  const [ isLooping, setIsLooping ] = useState(false);
  const [ isShuffling, setIsShuffling ] = useState(false);

  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(arrayEps, indexEps) {
    setEpisodeList(arrayEps);
    setCurrentEpisodeIndex(indexEps);
    setIsPlaying(true);
  }

  function togglePlay () {
    setIsPlaying(!isPlaying); //altera para o contrario dela
  }

  function toggleLoop () {
    setIsLooping(!isLooping); 
  }

  function toggleShuffle () {
    setIsShuffling(!isShuffling); 
  }

  function setIsPlayingState (state) {
    setIsPlaying(state);
  };

  function clearPlayState () {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

  function playNext () {
    if(isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(Math.random()*episodeList.length);

      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) {
      return setCurrentEpisodeIndex(currentEpisodeIndex + 1)
    }
    return
  }

  function playPrevious () {
    if (hasPrevious) {
      return setCurrentEpisodeIndex(currentEpisodeIndex - 1)
    }
    return
  }

  const context = {
    episodeList,
    currentEpisodeIndex,
    play,
    isPlaying,
    togglePlay,
    toggleLoop,
    setIsPlayingState,
    playList,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isLooping,
    isShuffling,
    toggleShuffle,
    clearPlayState,
  }

  return (
    <PlayerContext.Provider value={context}>
      { children }
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  return useContext(PlayerContext);
}