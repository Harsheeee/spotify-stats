import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

function HomePage() {

    const [name, setName] = useState("");
    const handleLogin = () => {
        if(!name){
            alert("Please enter your name");
            return;
        }
        localStorage.setItem("userName", name);
        const url = import.meta.env.VITE_AUTH_URL;
        if (url && url.trim() !== "") {
            window.location.href = url;
        } else {
            alert("Authentication URL is not configured.");
        }
        
    }
  return (
    <>
    <h1 className="text-4xl md:text-5xl font-bold text-center text-white-900 leading-tight mb-6">WELCOME TO THE SPOTIFY STATS</h1>
    <div className="flex items-center justify-center">
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          A valid Spotify account is required to access your stats.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button type="submit" onClick={handleLogin} className="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" aria-labelledby="title"
          aria-describedby="desc" role="img" xmlnsXlink="http://www.w3.org/1999/xlink">
            <title>Spotify</title>
            <desc>A solid styled icon from Orion Icon Library.</desc>
            <path data-name="layer1"
            d="M32 0a32 32 0 1 0 32 32A31.966 31.966 0 0 0 32 0zm12.3 47.2a2.654 2.654 0 0 1-1.4-.5 32.041 32.041 0 0 0-16.6-4.3 48.082 48.082 0 0 0-10.1 1.1 11.045 11.045 0 0 1-1.6.3 2 2 0 0 1-2-2 2.11 2.11 0 0 1 1.7-2.2 53.9 53.9 0 0 1 12-1.4A35.787 35.787 0 0 1 44.9 43a2.131 2.131 0 0 1 1.3 2.1 1.846 1.846 0 0 1-1.9 2.1zm3.5-8.5a2.834 2.834 0 0 1-1.6-.6A41.422 41.422 0 0 0 25.9 33a43.3 43.3 0 0 0-10.4 1.3 4.707 4.707 0 0 1-1.6.4 2.476 2.476 0 0 1-2.5-2.5 2.6 2.6 0 0 1 2-2.7A43.762 43.762 0 0 1 26 27.7a44.707 44.707 0 0 1 22.8 5.9 2.583 2.583 0 0 1 1.5 2.5 2.5 2.5 0 0 1-2.5 2.6zm4-9.8a3.022 3.022 0 0 1-1.6-.5C44.3 24.9 35.3 23 26.7 23a49.826 49.826 0 0 0-12.8 1.5 9.005 9.005 0 0 1-1.6.3 3.031 3.031 0 0 1-3-3.1 3.213 3.213 0 0 1 2.2-3.1 55.906 55.906 0 0 1 15.2-2c9.4 0 19.3 1.9 26.5 6.2a3.025 3.025 0 0 1 1.6 2.9 3.058 3.058 0 0 1-3 3.2z"
            fill="#1DB954"></path>
          </svg>
          Login with spotify
        </Button>
      </CardFooter>
    </Card>
    </div>
    </>
  )
}

export default HomePage