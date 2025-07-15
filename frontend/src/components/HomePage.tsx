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
          Login with spotify
        </Button>
      </CardFooter>
    </Card>
    </div>
    </>
  )
}

export default HomePage