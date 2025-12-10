import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import { useRegisterStudentMutation } from '@/store/api/apiSlice';

// Fallback for Label if not exists
const FormLabel = ({ children, htmlFor }) => (
  <label htmlFor="htmlFor" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-2">
    {children}
  </label>
);

const StudentRegistration = () => {
  const [formData, setFormData] = useState({
    name: '', cnic: '', phone: '', email: '',
    fatherName: '', fatherPhone: '', emergencyContact: '',
    address: '', roomType: 'standard', password: '', confirmPassword: ''
  });

  const [registerStudent, { isLoading }] = useRegisterStudentMutation(); // @REVIEW: Query Check

  const roomRates = {
    standard: 15000,
    deluxe: 20000,
    suite: 25000
  };

  const messFee = 5000; // Compulsory

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const totalFee = roomRates[formData.roomType] + messFee;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match!');
      return;
    }
    
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long!');
      return;
    }
    
    try {
      await registerStudent({
        ...formData,
        guardianName: formData.fatherName,
        guardianPhone: formData.fatherPhone
      }).unwrap();
      
      toast.success(`Student registered successfully! Password: ${formData.password}`, {
        duration: 6000,
        icon: '🎉',
      });
      // Reset form
      setFormData({
        name: '', cnic: '', phone: '', email: '',
        fatherName: '', fatherPhone: '', emergencyContact: '',
        address: '', roomType: 'standard', password: '', confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Student Registration</h2>
        <p className="text-muted-foreground">Register a new student and allocate a room.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
        {/* Personal Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic details of the student.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <FormLabel htmlFor="name">Full Name</FormLabel>
              <Input id="name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <FormLabel htmlFor="cnic">CNIC / ID Card</FormLabel>
              <Input id="cnic" name="cnic" placeholder="00000-0000000-0" value={formData.cnic} onChange={handleChange} required />
            </div>
            <div>
              <FormLabel htmlFor="phone">Phone Number</FormLabel>
              <Input id="phone" name="phone" placeholder="+92 300 1234567" value={formData.phone} onChange={handleChange} required />
            </div>
            <div>
              <FormLabel htmlFor="email">Email Address</FormLabel>
              <Input id="email" name="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required />
            </div>
          </CardContent>
        </Card>

        {/* Guardian Details */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Guardian & Address</CardTitle>
            <CardDescription>Emergency contact and residential details.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <FormLabel htmlFor="fatherName">Father's Name</FormLabel>
              <Input id="fatherName" name="fatherName" placeholder="Father Name" value={formData.fatherName} onChange={handleChange} required />
            </div>
            <div>
              <FormLabel htmlFor="fatherPhone">Father's Phone</FormLabel>
              <Input id="fatherPhone" name="fatherPhone" placeholder="+92 300 7654321" value={formData.fatherPhone} onChange={handleChange} required />
            </div>
            <div className="md:col-span-2">
              <FormLabel htmlFor="address">Permanent Residential Address</FormLabel>
              <Input id="address" name="address" placeholder="House #, Street, City" value={formData.address} onChange={handleChange} required />
            </div>
          </CardContent>
        </Card>

        {/* Password */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Login Credentials</CardTitle>
            <CardDescription>Set a password for the student's account</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input id="password" name="password" type="password" placeholder="Min. 6 characters" value={formData.password} onChange={handleChange} required minLength={6} />
            </div>
            <div>
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <Input id="confirmPassword" name="confirmPassword" type="password" placeholder="Re-enter password" value={formData.confirmPassword} onChange={handleChange} required minLength={6} />
            </div>
          </CardContent>
        </Card>

        {/* Room & Fee */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Room Allocation & Fees</CardTitle>
            <CardDescription>Select room type. Mess fee is compulsory.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FormLabel htmlFor="roomType">Room Type</FormLabel>
                <select 
                  id="roomType" 
                  name="roomType" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={formData.roomType} 
                  onChange={handleChange}
                >
                  <option value="standard">Standard (3 Seater) - 15,000 PKR</option>
                  <option value="deluxe">Deluxe (2 Seater) - 20,000 PKR</option>
                  <option value="suite">Suite (1 Seater) - 25,000 PKR</option>
                </select>
              </div>
              <div className="flex items-end">
                 <div className="bg-muted p-4 rounded-lg w-full flex justify-between items-center border border-border">
                    <span className="text-sm font-medium">Compulsory Mess Fee</span>
                    <span className="font-bold">5,000 PKR</span>
                 </div>
              </div>
            </div>
            
            <div className="bg-primary/10 p-6 rounded-xl border border-primary/20 flex justify-between items-center">
              <div>
                <p className="text-sm text-muted-foreground">Total Monthly Fee</p>
                <p className="text-xs text-muted-foreground">(Rent + Mess)</p>
              </div>
              <div className="text-3xl font-bold text-primary">
                {totalFee.toLocaleString()} PKR
              </div>
            </div>

            <Button size="lg" className="w-full text-lg h-12">Register Student</Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default StudentRegistration;
