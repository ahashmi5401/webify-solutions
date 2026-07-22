import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // WARNING: This seed script creates a Super Admin user with a default password.
  // IMPORTANT: Change this password immediately after running the seed script in production!
  // The default password is: Admin123! (meets complexity requirements: uppercase, lowercase, number, special char)
  // To use a custom password, set the SEED_ADMIN_PASSWORD environment variable.
  const defaultPassword = 'Admin123!';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || defaultPassword;
  
  if (!process.env.SEED_ADMIN_PASSWORD) {
    console.warn('⚠️  WARNING: Using default password for Super Admin. Change it immediately in production!');
    console.warn('   Default credentials: admin@webify-solutions.com / Admin123!');
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@webify-solutions.com' },
    update: {},
    create: {
      email: 'admin@webify-solutions.com',
      name: 'Super Admin',
      password_hash: hashedPassword,
      role: 'SUPER_ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log('Created Super Admin:', superAdmin.email);

  // Create sample courses
  const course1 = await prisma.course.create({
    data: {
      title: 'Complete Web Development Bootcamp',
      slug: 'complete-web-development-bootcamp',
      description: 'Learn full-stack web development from scratch. This comprehensive course covers HTML, CSS, JavaScript, React, Node.js, and more.',
      price: 99.99,
      category: 'Web Development',
      level: 'BEGINNER',
      isPublished: true,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: 'Advanced React Patterns',
      slug: 'advanced-react-patterns',
      description: 'Master advanced React concepts including hooks, context, performance optimization, and design patterns.',
      price: 149.99,
      category: 'Frontend',
      level: 'ADVANCED',
      isPublished: true,
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: 'Node.js Backend Development',
      slug: 'nodejs-backend-development',
      description: 'Build scalable backend applications with Node.js, Express, MongoDB, and PostgreSQL.',
      price: 129.99,
      category: 'Backend',
      level: 'INTERMEDIATE',
      isPublished: true,
    },
  });

  console.log('Created sample courses');

  // Create modules for course 1
  const module1 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: 'Introduction to Web Development',
      order: 1,
    },
  });

  const module2 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: 'HTML Fundamentals',
      order: 2,
    },
  });

  const module3 = await prisma.module.create({
    data: {
      courseId: course1.id,
      title: 'CSS Styling',
      order: 3,
    },
  });

  console.log('Created modules for course 1');

  // Create lessons for module 1
  await prisma.lesson.create({
    data: {
      moduleId: module1.id,
      title: 'What is Web Development?',
      content: 'Web development is the work involved in developing a website for the Internet or an intranet.',
      order: 1,
      isFreePreview: true,
    },
  });

  await prisma.lesson.create({
    data: {
      moduleId: module1.id,
      title: 'Setting Up Your Environment',
      content: 'Learn how to set up your development environment with VS Code and essential extensions.',
      order: 2,
      isFreePreview: false,
    },
  });

  console.log('Created lessons for module 1');

  // Create sample services
  await prisma.service.create({
    data: {
      title: 'Custom Web Development',
      slug: 'custom-web-development',
      description: 'We build custom web applications tailored to your business needs using modern technologies.',
      priceRange: '$5,000 - $50,000',
      icon: 'code',
      isActive: true,
    },
  });

  await prisma.service.create({
    data: {
      title: 'Mobile App Development',
      slug: 'mobile-app-development',
      description: 'Native and cross-platform mobile applications for iOS and Android.',
      priceRange: '$10,000 - $100,000',
      icon: 'smartphone',
      isActive: true,
    },
  });

  await prisma.service.create({
    data: {
      title: 'UI/UX Design',
      slug: 'ui-ux-design',
      description: 'User-centered design solutions that create engaging and intuitive experiences.',
      priceRange: '$3,000 - $25,000',
      icon: 'palette',
      isActive: true,
    },
  });

  console.log('Created sample services');

  // Create sample portfolio items
  await prisma.portfolio.create({
    data: {
      title: 'E-Commerce Platform',
      slug: 'ecommerce-platform',
      description: 'A full-featured e-commerce platform with payment integration, inventory management, and analytics dashboard.',
      techUsed: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      resultsSummary: 'Increased client sales by 150% within 6 months of launch.',
      clientTestimonial: 'Webify Solutions delivered an exceptional platform that exceeded our expectations.',
      isPublished: true,
    },
  });

  await prisma.portfolio.create({
    data: {
      title: 'Healthcare Management System',
      slug: 'healthcare-management-system',
      description: 'Comprehensive healthcare management system for clinics and hospitals with patient records, appointments, and billing.',
      techUsed: ['Next.js', 'TypeScript', 'MongoDB', 'AWS'],
      resultsSummary: 'Reduced administrative workload by 40% for healthcare providers.',
      clientTestimonial: 'The system has transformed how we manage our clinic operations.',
      isPublished: true,
    },
  });

  console.log('Created sample portfolio items');

  // Create sample blog posts
  const blogPost1 = await prisma.blogPost.create({
    data: {
      title: 'The Future of Web Development in 2024',
      slug: 'future-of-web-development-2024',
      content: 'Explore the latest trends and technologies shaping the future of web development...',
      coverImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800',
      authorId: superAdmin.id,
      category: 'Technology',
      tags: ['Web Development', 'Trends', '2024'],
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  await prisma.blogPost.create({
    data: {
      title: 'Getting Started with Next.js 14',
      slug: 'getting-started-with-nextjs-14',
      content: 'A comprehensive guide to building modern web applications with Next.js 14 and the App Router...',
      coverImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
      authorId: superAdmin.id,
      category: 'Tutorial',
      tags: ['Next.js', 'React', 'Tutorial'],
      isPublished: true,
      publishedAt: new Date(),
    },
  });

  console.log('Created sample blog posts');

  // Create sample testimonials
  await prisma.testimonial.create({
    data: {
      name: 'Sarah Johnson',
      role: 'CEO',
      company: 'TechStart Inc.',
      message: 'Webify Solutions transformed our digital presence. Their expertise and dedication are unmatched.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      isPublished: true,
    },
  });

  await prisma.testimonial.create({
    data: {
      name: 'Michael Chen',
      role: 'CTO',
      company: 'DataFlow Systems',
      message: 'The team delivered a robust solution that scaled perfectly with our growth. Highly recommended!',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      isPublished: true,
    },
  });

  console.log('Created sample testimonials');

  // Create sample FAQs
  await prisma.fAQ.create({
    data: {
      question: 'What technologies do you use?',
      answer: 'We specialize in modern web technologies including React, Next.js, Node.js, TypeScript, PostgreSQL, and cloud services like AWS and Vercel.',
      category: 'General',
      order: 1,
    },
  });

  await prisma.fAQ.create({
    data: {
      question: 'How long does a typical project take?',
      answer: 'Project timelines vary based on complexity. A simple website typically takes 4-6 weeks, while complex applications can take 3-6 months.',
      category: 'Process',
      order: 2,
    },
  });

  await prisma.fAQ.create({
    data: {
      question: 'Do you provide ongoing support?',
      answer: 'Yes, we offer various maintenance and support packages to ensure your application runs smoothly after launch.',
      category: 'Support',
      order: 3,
    },
  });

  console.log('Created sample FAQs');

  // Create sample pricing plans
  await prisma.pricingPlan.create({
    data: {
      name: 'Starter',
      price: 29.99,
      billingCycle: 'monthly',
      features: ['5 Projects', 'Basic Support', '1GB Storage', 'Email Support'],
      isPopular: false,
      order: 1,
    },
  });

  await prisma.pricingPlan.create({
    data: {
      name: 'Professional',
      price: 79.99,
      billingCycle: 'monthly',
      features: ['Unlimited Projects', 'Priority Support', '10GB Storage', '24/7 Support', 'Custom Integrations'],
      isPopular: true,
      order: 2,
    },
  });

  await prisma.pricingPlan.create({
    data: {
      name: 'Enterprise',
      price: 199.99,
      billingCycle: 'monthly',
      features: ['Everything in Professional', 'Dedicated Account Manager', 'Unlimited Storage', 'SLA Guarantee', 'Custom Development'],
      isPopular: false,
      order: 3,
    },
  });

  console.log('Created sample pricing plans');

  // Create sample career listings
  await prisma.careerListing.create({
    data: {
      title: 'Senior Full-Stack Developer',
      department: 'Engineering',
      location: 'Remote',
      type: 'FULL_TIME',
      description: 'We are looking for an experienced full-stack developer to join our team and help build amazing web applications.',
      isActive: true,
    },
  });

  await prisma.careerListing.create({
    data: {
      title: 'UI/UX Designer',
      department: 'Design',
      location: 'New York, NY',
      type: 'FULL_TIME',
      description: 'Join our design team to create beautiful and intuitive user experiences for our clients.',
      isActive: true,
    },
  });

  console.log('Created sample career listings');

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
