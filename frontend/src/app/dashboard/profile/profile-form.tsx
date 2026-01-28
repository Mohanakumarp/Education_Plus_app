"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateProfile } from "@/actions/profile";
// import { toast } from "sonner" // Assuming we might add toast later, but simple alert for now

export function ProfileForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);
    setMessage("");
    
    // We need to append the select values if they are not picked up by native FormData 
    // (Native select works, Shadcn Select needs hidden input or controlled state)
    // Actually, Shadcn Select doesn't use native select, so FormData won't pick it up automatically unless we use a hidden input.
    // simpler to just use controlled state for selects and append to formData, 
    // OR just use native select for simplicity, 
    // OR use the hidden input trick.
    
    const result = await updateProfile(formData);
    if (result.error) {
        setMessage(result.error);
    } else {
        setMessage("Saved successfully!");
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription>
          Update your personal and academic details.
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" name="name" defaultValue={user.name} required />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} disabled />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input id="phone" name="phone" defaultValue={user.phone} placeholder="+1234567890" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="language">Preferred Language</Label>
            <Input id="language" name="language" defaultValue={user.language || "en"} placeholder="en, es, fr..." />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="school">School / University</Label>
                <Input id="school" name="school" defaultValue={user.academicDetails?.school} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="grade">Grade / Year</Label>
                <Input id="grade" name="grade" defaultValue={user.academicDetails?.grade} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stream">Stream / Major</Label>
            <Input id="stream" name="stream" defaultValue={user.academicDetails?.stream} placeholder="Computer Science" />
          </div>

          {message && <p className={`text-sm ${message.includes("Saved") ? "text-green-600" : "text-red-500"}`}>{message}</p>}
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
