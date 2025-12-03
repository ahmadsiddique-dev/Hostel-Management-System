const Student = require('../models/Student');
const Attendance = require('../models/Attendance');
const Fee = require('../models/Fee');
const Notification = require('../models/Notification');
const Complaint = require('../models/Complaint');

// @desc    Get student profile
// @route   GET /api/student/profile
// @access  Private/Student
const getProfile = async (req, res) => {
  try {
    console.log(`👤 Fetching profile for user: ${req.user._id}`);
    const student = await Student.findOne({ user: req.user._id })
      .populate('user', 'name email role')
      .populate('room', 'number type capacity status');
    
    if (!student) {
      console.log('❌ Student profile not found');
      return res.status(404).json({ message: 'Student profile not found' });
    }
    
    console.log(`✅ Profile found for: ${student.user?.name}`);
    res.json(student);
  } catch (error) {
    console.error('❌ Error fetching student profile:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get attendance history
// @route   GET /api/student/attendance
// @access  Private/Student
const getAttendance = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const attendance = await Attendance.find({ student: student._id }).sort({ date: -1 });
    res.json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get fee history
// @route   GET /api/student/fees
// @access  Private/Student
const getFees = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const fees = await Fee.find({ student: student._id }).sort({ year: -1, month: -1 });
    res.json(fees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// @desc    Get notifications
// @route   GET /api/student/notifications
// @access  Private// Get Student Notifications
const getNotifications = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const notifications = await Notification.find({
      $or: [
        { target: 'all' },
        { target: 'specific', student: student._id }
      ]
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create Complaint
const createComplaint = async (req, res) => {
  try {
    const { title, description } = req.body;
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const complaint = await Complaint.create({
      student: student._id,
      title,
      description
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get My Complaints
const getMyComplaints = async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user._id });
    if (!student) return res.status(404).json({ message: 'Student profile not found' });

    const complaints = await Complaint.find({ student: student._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getProfile, getAttendance, getFees, getNotifications, createComplaint, getMyComplaints };
