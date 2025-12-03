import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { useGetRoomsQuery } from '@/store/api/apiSlice';

const Rooms = () => {
  const { data: rooms = [] } = useGetRoomsQuery();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rooms</h2>
          <p className="text-muted-foreground">Manage hostel rooms and occupancy.</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2 top-0" /> Add Room
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Room {room.number}</CardTitle>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                room.status === 'full' ? 'bg-rose-500/15 text-rose-500' :
                room.status === 'available' ? 'bg-emerald-500/15 text-emerald-500' :
                'bg-yellow-500/15 text-yellow-500'
              }`}>
                {room.status}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4 capitalize">{room.type}</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Occupancy</span>
                  <span className="font-medium">{room.occupants.length} / {room.capacity}</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${room.status === 'full' ? 'bg-rose-500' : 'bg-primary'}`} 
                    style={{ width: `${(room.occupants.length / room.capacity) * 100}%` }}
                  />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                <div className="flex -space-x-2">
                  {[...Array(room.occupants.length)].map((_, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px]">
                      <Users className="w-3 h-3" />
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="text-xs">View Details</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
