'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Bell, Plus, MessageSquare, Pin, Calendar, Users } from 'lucide-react';

export default function Announcements() {
  const [announcements] = useState([
    {
      id: 1,
      title: "New 3D Printer Available",
      content: "We've added a new high-resolution 3D printer to our equipment lineup. Book your sessions now!",
      author: "MakrCave Admin",
      date: "2024-01-15",
      priority: "high",
      pinned: true
    },
    {
      id: 2,
      title: "Workshop: Introduction to Electronics",
      content: "Join us for a beginner-friendly electronics workshop this Saturday at 2 PM.",
      author: "Electronics Team",
      date: "2024-01-12",
      priority: "medium",
      pinned: false
    },
    {
      id: 3,
      title: "Maintenance Schedule",
      content: "The laser cutter will be offline for maintenance on January 20th from 9 AM to 2 PM.",
      author: "Maintenance Team",
      date: "2024-01-10",
      priority: "low",
      pinned: false
    }
  ]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Announcements</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Announcement
        </Button>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id} className={announcement.pinned ? "border-blue-200 bg-blue-50" : ""}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {announcement.pinned && <Pin className="h-4 w-4 text-blue-600" />}
                  <CardTitle className="text-lg">{announcement.title}</CardTitle>
                  <Badge variant={
                    announcement.priority === 'high' ? 'destructive' : 
                    announcement.priority === 'medium' ? 'default' : 'secondary'
                  }>
                    {announcement.priority}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  {announcement.date}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">{announcement.content}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  {announcement.author}
                </div>
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}