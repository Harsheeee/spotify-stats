import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, CardHeader, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

interface TopSong {
  name: string;
  popularity: number;
  album :{
    name: string;
    images: { url: string }[];
  }
  artist?: {
    name: string;
  }
}

interface ApiSongResponse {
  items: {
    name: string;
    popularity: number;
    album: {
      name: string;
      images: { url: string }[];
    }
    artists: {
      name: string;
    }[];
  }[];
}

interface Artist{
  name: string;
  popularity: number;
  imageUrl: string;
  firstGenre: string;
}

interface ApiArtistResponse {
  items: {
    name: string;
    popularity: number;
    images: { url: string }[];
    genres: string[];
  }[];
}
function Dashboard() {
  const username = localStorage.getItem('userName');
  const urlParams = new URLSearchParams(window.location.search);
  const access_token = urlParams.get('access_token');

  const [displayName, setDisplayName] = useState<string | null>(null);
  const [imgUrl, setImgUrl] = useState<string | null>(null);
  const [followers, setFollowers] = useState<number | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);

  const [topSongs, setTopSongs] = useState<TopSong[]>([]);
  const [topArtists, setTopArtists] = useState<Artist[]>([]);


  
  const navigate = useNavigate();
  useEffect(() => {
    if(!username) {
      navigate("/")
    }
    //get access token from url query params

    if(!access_token) {
      navigate("/");
    }
  }, [username, navigate]);

  useEffect(() => {
    axios.get('https://api.spotify.com/v1/me', {
      headers: {
        'Authorization': `Bearer ${access_token}`
      }
    })
    .then(response => {
      setDisplayName(response.data.display_name);
      setImgUrl(response.data.images[0]?.url || null);
      setFollowers(response.data.followers.total);
      setAccountType(response.data.product);
    })
    .catch(error => {
      console.error('Error fetching user data:', error);
    });
  }, []);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=10', {
          headers: {
            'Authorization': `Bearer ${access_token}`
          },
        });
        const data:ApiSongResponse = await response.json();
        const filter= data.items.map((item)=> ({
          name: item.name,
          popularity: item.popularity,
          album: {
            name: item.album.name,
            images: item.album.images, // pass the array as expected by TopSong
          },
          artist: item.artists.length > 0 ? {
            name: item.artists[0].name,
          } : undefined,
        }));
        setTopSongs(filter);
      } catch (error) {
        console.error('Error fetching top songs:', error);
      }
    };
    fetchSongs();
  }, []);

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=10', {
          headers: {
            'Authorization': `Bearer ${access_token}`
          },
        });
        const data: ApiArtistResponse = await response.json();
        const filter = data.items.map((item) => ({
          name: item.name,
          popularity: item.popularity,
          imageUrl: item.images[0]?.url || '',
          firstGenre: item.genres[0] || 'Unknown',
        }));
        setTopArtists(filter);
      } catch (error) {
        console.error('Error fetching top artists:', error);
      }
    };
    fetchArtists();
  }, []);
        

     return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-60 text-white flex flex-col p-4">
        <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
        <Button onClick={()=>{
          localStorage.removeItem('userName');
          navigate("/");
        }}>Logout</Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 text-white">
        <div className="flex items-center space-x-6 mb-8">
          <Avatar>
            <AvatarImage src={imgUrl || undefined} alt={username||""} />
          </Avatar>
          <div>
            <h1 className="text-3xl font-semibold">{displayName}</h1>
            <p className="text-gray-400">Followers: {followers}</p>
            <p className="text-gray-400">Account Type: {accountType}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Top Songs Section */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Your Top Songs</h2>
            </CardHeader>
            <CardContent>
              {topSongs.map((song, index) => (
                <div key={index} className="flex items-center space-x-4 mb-4">
                  <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="1em" focusable="false">
                    <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
                      <path d="M9 18V5l12-2v13" />
                      <circle cx="6" cy="18" r="3" />
                      <circle cx="18" cy="16" r="3" />
                    </g>
                  </svg>
                  <img src={song.album.images[0]?.url} alt={song.album.name} className="w-12 h-12 rounded" />
                  <div>
                    <h3 className="text-xl font-medium">{song.name}</h3>
                    <p className="text-gray-400">Album: {song.album.name}</p>
                    {song.artist && <p className="text-gray-400">Artist: {song.artist.name}</p>}
                  </div>
                  <div className="flex-grow"></div>
                  <div className="flex-grow">
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Artists Section */}
          <Card>
            <CardHeader>
              <h2 className="text-2xl font-semibold">Your Top Artists</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {topArtists.map((artist, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <img src={artist.imageUrl} alt={artist.name} className="w-24 h-24 rounded-full mb-2" />
                    <strong className="text-lg font-medium">{artist.name}</strong>
                    <p className="text-gray-400">Genre: {artist.firstGenre}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Dashboard