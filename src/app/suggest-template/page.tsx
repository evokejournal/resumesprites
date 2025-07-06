"use client";

import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function SuggestTemplatePage() {
  return (
    <MainLayout>
      <div className="flex flex-col items-center">
        <div className="w-full max-w-2xl space-y-6">
            <div>
            <h1 className="text-3xl font-headline font-bold">Suggest a Template</h1>
            <p className="text-muted-foreground">
                Have a brilliant idea for a resume template? We'd love to hear it!
            </p>
            </div>
            <Card>
            <CardHeader>
                <CardTitle>Your Idea</CardTitle>
                <CardDescription>
                Describe your template idea in as much detail as possible. Think about the layout, animations, and overall feel.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                <Label htmlFor="suggestion">Template Suggestion</Label>
                <Textarea id="suggestion" placeholder="e.g., A resume that looks like a retro video game UI, with skill points and achievements..." rows={8} />
                </div>
            </CardContent>
            <CardFooter>
                <Button>Submit Suggestion</Button>
            </CardFooter>
            </Card>
        </div>
      </div>
    </MainLayout>
  );
}
