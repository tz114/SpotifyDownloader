import React, { useEffect } from 'react';

export default function Tracks(props){
    
    const [activeTrack, setTrack] = React.useState();
    function onClickTrack(track){
        setTrack(track)
    }
    console.log(activeTrack);
    return(
        <div className="tracksContainer">
            <TracksHeader track={activeTrack} name={props.name} size={props.playlistTracks.length} pic={props.pic}>
            </TracksHeader>
            <div class="trackGrid">
                {props.playlistTracks.map((e, index) => <Track onClick={props.action} onMouseOver={onClickTrack} track={e}></Track>)}
            </div>
        </div>
    )
  }

function Track(props){
    let image;
    function onHoverTrack(){
        props.onMouseOver(props.track);
    }
    if(props.track.image){
        image = props.track.image.url
    }
    else{
        image = "../pics/no-img.png"
    }
    return(
        <div 
        class="trackCard"
        style={{backgroundImage: `url(${image})`}}
        onMouseOver={onHoverTrack}
        onClick = {() => props.onClick(props.track.name,props.track.artist)}
        >
        </div>
    )
}

function TracksHeader(props){
    let activeTrack = props.track;
    useEffect(() => {activeTrack = props.activeTrack;})
    return (
        <div class="trackHeader">
            <div className="playlistPic"  style={{backgroundImage: `url(${props.pic})`}}>

            </div>
            <div className="playlistName">
                <h1>{props.name}</h1>
                <div className="playlistSize">{props.size} Songs</div>
            </div>
            {activeTrack &&  
                <div className="trackPic">
                    <div className="trackInfo">
                        <h3>{activeTrack.name}</h3>
                        <div className="trackArtist">{activeTrack.artist}</div>
                    </div>
                    <div 
                    class="playlistPic"
                    style={{backgroundImage: `url(${activeTrack.image ? activeTrack.image.url : "sad"})`}}
                    >
                </div>
            </div>}
           
        </div>
    )
}