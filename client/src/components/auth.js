export default function ConnectSpotify(props){
    if(props.isUserAuthorized){
      return <div className="headerRight" ><a className="auth" href="http://localhost:3001/logout">Logout</a></div>
    }
    return <div className="headerRight" ><a  className="auth" href="http://localhost:3001/login">Connect your Spotify and Youtube accounts</a></div>
}
