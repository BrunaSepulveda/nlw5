import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { usePlayer } from '../../contexts/PlayerContext';
import styles from './styles.module.scss';

import {convertDurationToTimeString} from '../../utils/convertDurationToTimeString.js'

export function Player() {
  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);

  function setUpProgressListener () {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener('timeupdate', () => {
      setProgress(Math.floor(audioRef.current.currentTime))
    })
  }

  function handleSeek (amount) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  };

  function handleEpisodeEnded () {
    if (hasNext) {
      playNext();
    } else {
      clearPlayState();
    }
  };

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    toggleLoop,
    togglePlay,
    setIsPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    isShuffling,
    toggleShuffle,
    clearPlayState,
  } = usePlayer();

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora </strong>
      </header>
      { episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            alt={`foto com os participantes do podcast ${episode.title}`}
            objectFit='cover'
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <strong> Selecione um podcast para ouvir </strong>
        </div>
      )}
      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
        <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                onChange={handleSeek}
                trackStyle={{ backgroundColor: '#04d361' }}
                railStyle={{ backgroundColor: '#9f75ff' }}
                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            autoPlay
            src={episode.url}
            ref={audioRef}
            loop={isLooping}
            onEnded={handleEpisodeEnded}
            onPlay={() => setIsPlayingState(true)}
            onPause={() => setIsPlayingState(false)}
            onLoadedMetadata={setUpProgressListener}
          />
        )}

        <div className={styles.buttons}>
          <button
            type="button"
            disabled={!episode || episodeList.length == 1 }
            onClick={toggleShuffle}
            className={isShuffling ? styles.isActive : ''}
          >
            <img src="/shuffle.svg" alt="Embaralhar" />
          </button>
          <button
            type="button"
            onClick={playPrevious}
            disabled={!episode || !hasPrevious}
          >
            <img src="/play-previous.svg" alt="Tocar anterior" />
          </button>
          <button
            type="button"
            className={styles.playButton}
            disabled={!episode}
            onClick={togglePlay}
          >
            {isPlaying
              ? <img className={styles.pause} src="/pause.svg" alt="Pause" />
              : <img src="/play.svg" alt="Tocar" />
            }
          </button>
          <button
            type="button"
            onClick={playNext}
            disabled={!episode || !hasNext}
          >
            <img src="/play-next.svg" alt="Tocar próxima" />
          </button>
          <button
            type="button"
            disabled={!episode}
            onClick={toggleLoop}
            className={isLooping ? styles.isActive : ''}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  )
}
/*
refs são formas de acessar os elementos nativos do html assim como fazemos ao manipular o DOM
onLoadedMetadata: dispara assim que o player conseguiu carregar os dados para o audio
*/