function MusicCard({ music, rank }) {

    return (

        <a 
        href={`https://www.youtube.com/watch?v=${music.youtube_id}`} 
        target="_blank" 
        rel="noopener noreferrer"       
        className="music-card-link"
        >

            <div className="music-card">
                <div className="rank">{rank}</div>
                <div className="music-info">
                <div className="music-title">{music.titulo}</div>
                <div className="views">{music.visualizacoes} visualizações</div>
                </div>
                <img
                src={music.thumb}
                alt={`Thumbnail ${music.titulo}`}
                className="thumbnail"
                />
            </div>

        </a>

    );

}

export default MusicCard;