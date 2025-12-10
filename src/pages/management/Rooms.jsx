import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Users, DoorOpen, Bed, IndianRupee, MapPin, User, Loader2 } from 'lucide-react';
import { useGetRoomsQuery, useCreateRoomMutation } from '@/store/api/apiSlice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import toast from 'react-hot-toast';

const Rooms = () => {
  const { data: rooms = [] } = useGetRoomsQuery();
  const [createRoom, { isLoading: creating }] = useCreateRoomMutation();
  
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [addRoomOpen, setAddRoomOpen] = useState(false);
  
  const [newRoom, setNewRoom] = useState({
    number: '',
    type: 'standard',
    capacity: 2,
    price: 15000,
    floor: 1,
    status: 'available'
  });

  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setDetailsOpen(true);
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await createRoom(newRoom).unwrap();
      toast.success('Room created successfully!');
      setAddRoomOpen(false);
      setNewRoom({
        number: '',
        type: 'standard',
        capacity: 2,
        price: 15000,
        floor: 1,
        status: 'available'
      });
    } catch (error) {
      toast.error(error.data?.message || 'Failed to create room');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'full':
        return 'bg-rose-500/15 text-rose-500';
      case 'available':
        return 'bg-emerald-500/15 text-emerald-500';
      case 'maintenance':
        return 'bg-orange-500/15 text-orange-500';
      default:
        return 'bg-yellow-500/15 text-yellow-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rooms</h2>
          <p className="text-muted-foreground">Manage hostel rooms and occupancy.</p>
        </div>
        <Button onClick={() => setAddRoomOpen(true)}>
          <Plus className="w-4 h-4 mr-2 top-0" /> Add Room
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => (
          <Card key={room._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg font-bold">Room {room.number}</CardTitle>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getStatusColor(room.status)}`}>
                {room.status}
              </span>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4 capitalize">{room.type}</div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Occupancy</span>
                  <span className="font-medium">{room.occupants?.length || 0} / {room.capacity}</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${room.status === 'full' ? 'bg-rose-500' : 'bg-primary'}`} 
                    style={{ width: `${((room.occupants?.length || 0) / room.capacity) * 100}%` }}
                  />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
                <div className="flex -space-x-2">
                  {[...Array(room.occupants?.length || 0)].map((_, i) => (
                    <div key={i} className="w-6 h-6 rounded-full bg-muted border-2 border-background flex items-center justify-center text-[10px]">
                      <Users className="w-3 h-3" />
                    </div>
                  ))}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs"
                  onClick={() => handleViewDetails(room)}
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Room Dialog */}
      <Dialog open={addRoomOpen} onOpenChange={setAddRoomOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Room
            </DialogTitle>
            <DialogDescription>
              Create a new room in the hostel management system
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddRoom} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="number">Room Number *</Label>
              <Input
                id="number"
                placeholder="e.g., 201"
                value={newRoom.number}
                onChange={(e) => setNewRoom({ ...newRoom, number: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Room Type *</Label>
              <Select 
                value={newRoom.type} 
                onValueChange={(value) => setNewRoom({ ...newRoom, type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard</SelectItem>
                  <SelectItem value="deluxe">Deluxe</SelectItem>
                  <SelectItem value="suite">Suite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity *</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  max="4"
                  value={newRoom.capacity}
                  onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor">Floor *</Label>
                <Input
                  id="floor"
                  type="number"
                  min="0"
                  max="10"
                  value={newRoom.floor}
                  onChange={(e) => setNewRoom({ ...newRoom, floor: parseInt(e.target.value) })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Monthly Price (PKR) *</Label>
              <Input
                id="price"
                type="number"
                min="0"
                step="1000"
                placeholder="e.g., 15000"
                value={newRoom.price}
                onChange={(e) => setNewRoom({ ...newRoom, price: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={newRoom.status} 
                onValueChange={(value) => setNewRoom({ ...newRoom, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setAddRoomOpen(false)}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Room
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Room Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl">
              <DoorOpen className="w-6 h-6" />
              Room {selectedRoom?.number}
            </DialogTitle>
            <DialogDescription>
              Detailed information about this room and its occupants
            </DialogDescription>
          </DialogHeader>

          {selectedRoom && (
            <div className="space-y-6">
              {/* Status and Type */}
              <div className="flex gap-3">
                <Badge className={getStatusColor(selectedRoom.status) + " capitalize"}>
                  {selectedRoom.status}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {selectedRoom.type}
                </Badge>
              </div>

              {/* Room Specifications */}
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Bed className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Capacity</p>
                        <p className="text-xl font-bold">{selectedRoom.capacity} Beds</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <IndianRupee className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Price/Month</p>
                        <p className="text-xl font-bold">{selectedRoom.price?.toLocaleString()} PKR</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Users className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Occupied</p>
                        <p className="text-xl font-bold">{selectedRoom.occupants?.length || 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Floor</p>
                        <p className="text-xl font-bold">{selectedRoom.floor || 'N/A'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Occupants List */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Occupants ({selectedRoom.occupants?.length || 0}/{selectedRoom.capacity})
                </h3>
                
                {selectedRoom.occupants?.length > 0 ? (
                  <div className="space-y-2">
                    {selectedRoom.occupants.map((occupant, index) => (
                      <Card key={occupant._id || index} className="bg-muted/50">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                              <User className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{occupant.user?.name || 'Student Name'}</p>
                              <p className="text-sm text-muted-foreground">
                                {occupant.cnic || 'CNIC not available'}
                              </p>
                            </div>
                            <Badge variant="outline">Active</Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="p-8 text-center text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-2 opacity-20" />
                      <p>No occupants in this room</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Rooms;
