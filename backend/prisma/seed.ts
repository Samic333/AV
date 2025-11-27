import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Hash password for all users
  const passwordHash = await bcrypt.hash('password123', 10);

  // Create Admin User
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aviatortutor.com' },
    update: {},
    create: {
      email: 'admin@aviatortutor.com',
      passwordHash,
      role: 'admin',
      adminRole: 'super_admin',
      firstName: 'Admin',
      lastName: 'User',
      timezone: 'UTC',
      emailVerified: true,
    },
  });

  // Create Students
  const students = [];
  const studentData = [
    { firstName: 'John', lastName: 'Smith', email: 'john.smith@example.com', country: 'USA', city: 'New York' },
    { firstName: 'Emma', lastName: 'Johnson', email: 'emma.johnson@example.com', country: 'UK', city: 'London' },
    { firstName: 'Ahmed', lastName: 'Hassan', email: 'ahmed.hassan@example.com', country: 'UAE', city: 'Dubai' },
    { firstName: 'Maria', lastName: 'Garcia', email: 'maria.garcia@example.com', country: 'Spain', city: 'Madrid' },
    { firstName: 'David', lastName: 'Chen', email: 'david.chen@example.com', country: 'Singapore', city: 'Singapore' },
  ];

  for (const data of studentData) {
    const student = await prisma.user.upsert({
      where: { email: data.email },
      update: {},
      create: {
        ...data,
        passwordHash,
        role: 'student',
        timezone: 'UTC',
        emailVerified: true,
        studentProfile: {
          create: {
            learningGoals: 'Prepare for ATPL exams and airline interviews',
            yearsOfAviationExperience: Math.floor(Math.random() * 5),
            preferredLanguages: ['English', 'French'],
            preferredAircraftTypes: ['A320', 'B737'],
            currentRole: 'Student Pilot',
            currentCompany: 'Flight School',
          },
        },
      },
    });
    students.push(student);
  }

  // Create Instructors
  const instructors = [];
  const instructorData = [
    {
      firstName: 'Sarah',
      lastName: 'Jenkins',
      email: 'sarah.jenkins@example.com',
      country: 'UK',
      hourlyRate: 85,
      bio: 'Flying for major legacy carriers for over 15 years. Currently a Type Rating Instructor (TRI) on the Airbus A320 family. I specialize in technical interviews, CRM coaching, and simulator profile briefings.',
      specialties: ['Captain', 'Instructor'],
      aircraftTypes: ['A320', 'A330', 'DA-42'],
      languages: ['English', 'French'],
      isFeatured: true,
      averageRating: 4.9,
      totalLessonsTaught: 124,
      introVideoUrl: 'https://example.com/videos/sarah-intro.mp4',
    },
    {
      firstName: 'Michael',
      lastName: 'Chen',
      email: 'michael.chen@example.com',
      country: 'Hong Kong',
      hourlyRate: 50,
      bio: 'Retired Radar controller with 20 years experience at Hong Kong CAD. Now dedicated to helping pilots and controllers achieve ICAO Level 5 and 6 English proficiency.',
      specialties: ['ATC', 'Language Coach'],
      aircraftTypes: [],
      languages: ['English', 'Mandarin', 'Cantonese'],
      isFeatured: true,
      averageRating: 4.8,
      totalLessonsTaught: 89,
      introVideoUrl: 'https://example.com/videos/michael-intro.mp4',
    },
    {
      firstName: 'Elena',
      lastName: 'Rodriguez',
      email: 'elena.rodriguez@example.com',
      country: 'UAE',
      hourlyRate: 45,
      bio: 'Helping aspiring cabin crew earn their wings. I guide you through the assessment days for Emirates, Qatar, and Etihad.',
      specialties: ['Cabin Crew'],
      aircraftTypes: ['B777', 'A380'],
      languages: ['English', 'Spanish', 'Arabic'],
      isFeatured: true,
      averageRating: 5.0,
      totalLessonsTaught: 210,
      introVideoUrl: 'https://example.com/videos/elena-intro.mp4',
    },
    {
      firstName: 'David',
      lastName: 'Müller',
      email: 'david.muller@example.com',
      country: 'Germany',
      hourlyRate: 60,
      bio: 'Experienced First Officer with expertise in IFR procedures and MCC training.',
      specialties: ['First Officer', 'IFR'],
      aircraftTypes: ['A320', 'B737'],
      languages: ['English', 'German'],
      isFeatured: false,
      averageRating: 4.7,
      totalLessonsTaught: 67,
    },
    {
      firstName: 'James',
      lastName: 'Anderson',
      email: 'james.anderson@example.com',
      country: 'USA',
      hourlyRate: 75,
      bio: 'ATP-rated pilot with 10,000+ hours. Specializing in ATPL theory and exam preparation.',
      specialties: ['Captain', 'ATPL Theory'],
      aircraftTypes: ['B787', 'A350'],
      languages: ['English'],
      isFeatured: false,
      averageRating: 4.6,
      totalLessonsTaught: 95,
    },
  ];

  for (const data of instructorData) {
    const { specialties, aircraftTypes, languages, ...instructorInfo } = data;
    const instructor = await prisma.user.upsert({
      where: { email: instructorInfo.email },
      update: {},
      create: {
        firstName: instructorInfo.firstName,
        lastName: instructorInfo.lastName,
        email: instructorInfo.email,
        passwordHash,
        role: 'tutor',
        country: instructorInfo.country,
        timezone: 'UTC',
        emailVerified: true,
        tutorProfile: {
          create: {
            bio: instructorInfo.bio,
            hourlyRate: instructorInfo.hourlyRate,
            status: 'approved',
            approvalDate: new Date(),
            isFeatured: instructorInfo.isFeatured,
            averageRating: instructorInfo.averageRating,
            totalLessonsTaught: instructorInfo.totalLessonsTaught,
            introVideoUrl: instructorInfo.introVideoUrl,
            specialties: {
              create: specialties.map((s) => ({
                specialty: s,
                experienceYears: Math.floor(Math.random() * 20) + 5,
              })),
            },
            aircraftTypes: {
              create: aircraftTypes.map((at) => ({
                aircraftType: at,
                hoursLogged: Math.floor(Math.random() * 5000) + 1000,
              })),
            },
            languages: {
              create: languages.map((lang) => ({
                languageCode: lang,
                proficiencyLevel: 'native',
              })),
            },
            wallet: {
              create: {
                balance: Math.random() * 1000,
                pendingBalance: Math.random() * 500,
                totalEarned: instructorInfo.totalLessonsTaught * instructorInfo.hourlyRate * 0.85,
              },
            },
          },
        },
      },
      include: { tutorProfile: true },
    });
    instructors.push(instructor);
  }

  // Create Bookings
  const bookings = [];
  for (let i = 0; i < 10; i++) {
    const student = students[Math.floor(Math.random() * students.length)];
    const instructor = instructors[Math.floor(Math.random() * instructors.length)];
    const tutorProfile = instructor.tutorProfile;
    if (!tutorProfile) continue;

    const scheduledAt = new Date();
    scheduledAt.setDate(scheduledAt.getDate() + Math.floor(Math.random() * 30));
    const durationMinutes = 60;
    const pricePerHour = Number(tutorProfile.hourlyRate);
    const totalPrice = (pricePerHour * durationMinutes) / 60;
    const platformFee = totalPrice * 0.15;
    const tutorPayout = totalPrice - platformFee;

    const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    const status = statuses[Math.floor(Math.random() * statuses.length)] as any;

    const booking = await prisma.booking.create({
      data: {
        studentId: student.id,
        tutorId: tutorProfile.id,
        bookingType: 'one_on_one',
        status,
        lessonType: 'ATPL Theory',
        scheduledAt,
        durationMinutes,
        pricePerHour,
        totalPrice,
        platformFee,
        tutorPayout,
        timezone: 'UTC',
        meetingLink: status === 'confirmed' || status === 'completed' ? 'https://zoom.us/j/123456789' : null,
        completedAt: status === 'completed' ? new Date() : null,
      },
    });
    bookings.push(booking);
  }

  // Create Group Classes
  const groupClasses = [];
  const classData = [
    {
      title: 'Advanced IFR Procedures',
      description: 'Learn advanced instrument flight rules and procedures with experienced instructors.',
      topic: 'IFR Training',
      category: 'IFR Procedures',
      pricePerStudent: 25,
      maxStudents: 10,
      durationMinutes: 120,
      isFeatured: true,
    },
    {
      title: 'ATPL Exam Preparation',
      description: 'Comprehensive ATPL theory preparation covering all subjects.',
      topic: 'ATPL Theory',
      category: 'ATPL Theory',
      pricePerStudent: 30,
      maxStudents: 15,
      durationMinutes: 180,
      isFeatured: false,
    },
    {
      title: 'Airline Interview Masterclass',
      description: 'Prepare for airline interviews with mock sessions and expert guidance.',
      topic: 'Interview Prep',
      category: 'Cabin Crew Interview Prep',
      pricePerStudent: 40,
      maxStudents: 8,
      durationMinutes: 90,
      isFeatured: true,
    },
  ];

  for (const data of classData) {
    const instructor = instructors[Math.floor(Math.random() * instructors.length)];
    const tutorProfile = instructor.tutorProfile;
    if (!tutorProfile) continue;

    const scheduledAt = new Date();
    scheduledAt.setDate(scheduledAt.getDate() + Math.floor(Math.random() * 30));

    const groupClass = await prisma.groupClass.create({
      data: {
        tutorId: tutorProfile.id,
        ...data,
        scheduledAt,
        status: 'approved',
        approvedBy: admin.id,
        approvedAt: new Date(),
      },
    });
    groupClasses.push(groupClass);
  }

  // Create Transactions
  for (const booking of bookings.filter((b) => b.status === 'completed' || b.status === 'confirmed')) {
    await prisma.transaction.create({
      data: {
        userId: booking.studentId,
        bookingId: booking.id,
        type: 'payment',
        amount: booking.totalPrice,
        currency: 'USD',
        paymentMethod: 'paypal',
        status: booking.status === 'completed' ? 'completed' : 'pending',
        platformFee: booking.platformFee,
        netAmount: booking.tutorPayout,
      },
    });
  }

  // Create Reviews
  for (const booking of bookings.filter((b) => b.status === 'completed')) {
    await prisma.tutorReview.create({
      data: {
        tutorId: booking.tutorId,
        studentId: booking.studentId,
        bookingId: booking.id,
        rating: Math.floor(Math.random() * 2) + 4, // 4 or 5
        comment: 'Great lesson! Very helpful and professional.',
      },
    });
  }

  console.log('Seed completed successfully!');
  console.log(`Created: ${students.length} students, ${instructors.length} instructors, ${bookings.length} bookings, ${groupClasses.length} group classes`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

