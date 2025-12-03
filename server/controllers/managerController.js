const User = require('../models/User');
const Student = require('../models/Student');
const Room = require('../models/Room');
const Attendance = require('../models/Attendance');
const Notification = require('../models/Notification');
const Complaint = require('../models/Complaint');
const bcrypt = require('bcryptjs');

// @desc    Register a new student
// @route   POST /api/manager/students
// @access  Private/Admin
const registerStudent = async (req, res) => {
  const { 
    name, email, password, cnic, phone, address, 
    guardianName, guardianPhone, roomType 
  } = req.body;

  try {
    // 1. Create User
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({
      name, email, password, role: 'student'
    });

    // 2. Allocate Room (Simple logic: find first available room of type)
    const room = await Room.findOne({ type: roomType, status: { $ne: 'full' } });
    if (!room) return res.status(400).json({ message: 'No available room of this type' });

    // 3. Create Student Profile
    const student = await Student.create({
      user: user._id,
      cnic, phone, address,
      guardian: { name: guardianName, phone: guardianPhone },
      room: room._id
    });

    // 4. Update Room Occupancy
    room.occupants.push(student._id);
    if (room.occupants.length >= room.capacity) {
      room.status = 'full';
    }
    await room.save();

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all students
// @route   GET /api/manager/students
// @access  Private/Admin
const getStudents = async (req, res) => {
  try {
    console.log('📚 Fetching all students...');
    const students = await Student.find().populate('user', 'name email').populate('room', 'number type');
    console.log(`✅ Found ${students.length} students`);
    res.json(students);
  } catch (error) {
    console.error('❌ Error fetching students:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get student by ID
// @route   GET /api/manager/students/:id
// @access  Private/Admin
const getStudentById = async (req, res) => {
  try {
    console.log(`📖 Fetching student with ID: ${req.params.id}`);
    const student = await Student.findById(req.params.id)
      .populate('user', 'name email role')
      .populate('room', 'number type capacity status');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    console.log(`✅ Found student: ${student.user?.name}`);
    res.json(student);
  } catch (error) {
    console.error('❌ Error fetching student:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/manager/students/:id
// @access  Private/Admin
const updateStudent = async (req, res) => {
  try {
    const { name, email, cnic, phone, address, guardianName, guardianPhone } = req.body;
    console.log(`✏️ Updating student with ID: ${req.params.id}`);
    
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Update User info if provided
    if (name || email) {
      const user = await User.findById(student.user);
      if (user) {
        if (name) user.name = name;
        if (email) user.email = email;
        await user.save();
      }
    }

    // Update Student info
    if (cnic) student.cnic = cnic;
    if (phone) student.phone = phone;
    if (address) student.address = address;
    if (guardianName) student.guardian.name = guardianName;
    if (guardianPhone) student.guardian.phone = guardianPhone;

    await student.save();
    
    // Populate and return updated student
    const updatedStudent = await Student.findById(student._id)
      .populate('user', 'name email')
      .populate('room', 'number type');
    
    console.log(`✅ Student updated successfully`);
    res.json(updatedStudent);
  } catch (error) {
    console.error('❌ Error updating student:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/manager/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res) => {
  try {
    console.log(`🗑️ Deleting student with ID: ${req.params.id}`);
    
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    // Remove student from room occupants
    if (student.room) {
      const room = await Room.findById(student.room);
      if (room) {
        room.occupants = room.occupants.filter(
          occupant => occupant.toString() !== student._id.toString()
        );
        if (room.status === 'full' && room.occupants.length < room.capacity) {
          room.status = 'available';
        }
        await room.save();
      }
    }

    // Delete associated user account
    await User.findByIdAndDelete(student.user);
    
    // Delete student record
    await Student.findByIdAndDelete(req.params.id);
    
    console.log(`✅ Student deleted successfully`);
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    console.error('❌ Error deleting student:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a room
// @route   POST /api/manager/rooms
// @access  Private/Admin
const createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all rooms
// @route   GET /api/manager/rooms
// @access  Private/Admin
const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mark attendance
// @route   POST /api/manager/attendance
// @access  Private/Admin
const markAttendance = async (req, res) => {
  const { date, records } = req.body; // records: [{ studentId, status }]

  try {
    const attendanceRecords = records.map(record => ({
      student: record.studentId,
      date: new Date(date),
      status: record.status,
      markedBy: req.user._id
    }));

    await Attendance.insertMany(attendanceRecords);
    res.status(201).json({ message: 'Attendance marked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// @desc    Send notification
// @route   POST /api/manager/notifications
// @access  Private/Admin
const sendNotification = async (req, res) => {
  try {
    const { title, message, target, student } = req.body;

    const notification = await Notification.create({
      title,
      message,
      target,
      student: student || null
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all complaints
// @route   GET /api/manager/complaints
// @access  Private/Admin
const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate({
      path: 'student',
      populate: { path: 'user', select: 'name email' }
    }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update complaint status
// @route   PUT /api/manager/complaints/:id
// @access  Private/Admin
const updateComplaintStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    res.json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/manager/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalRooms = await Room.countDocuments();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const attendanceToday = await Attendance.countDocuments({
      date: { $gte: today },
      status: 'present'
    });

    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });

    res.json({
      totalStudents,
      totalRooms,
      attendanceToday,
      pendingComplaints
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  registerStudent, getStudents, getStudentById, updateStudent, deleteStudent,
  createRoom, getRooms, 
  markAttendance, sendNotification,
  getAllComplaints, updateComplaintStatus,
  getDashboardStats
};
