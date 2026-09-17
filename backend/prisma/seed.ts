import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = 'demo@taskflow.ai';
  
  const existingDemo = await prisma.user.findUnique({ where: { email } });
  
  if (existingDemo) {
    console.log('Demo user already exists, skipping seed.');
    return;
  }

  const hashedPassword = await bcrypt.hash('DemoPassword123!', 10);
  
  const user = await prisma.user.create({
    data: {
      name: 'Demo User',
      email,
      passwordHash: hashedPassword,
      tasks: {
        create: [
          {
            title: 'Complete authentication API',
            description: 'Implement JWT based authentication and authorization middleware.',
            status: 'COMPLETED',
            priority: 'HIGH',
            completedAt: new Date()
          },
          {
            title: 'Design dashboard UI',
            description: 'Create a responsive grid layout for statistics and charts.',
            status: 'COMPLETED',
            priority: 'MEDIUM',
            completedAt: new Date()
          },
          {
            title: 'Implement timer service',
            description: 'Ensure accurate duration calculation using server timestamps.',
            status: 'IN_PROGRESS',
            priority: 'HIGH'
          },
          {
            title: 'Prepare deployment',
            description: 'Write docker-compose and deployment instructions.',
            status: 'PENDING',
            priority: 'LOW'
          }
        ]
      }
    },
    include: { tasks: true }
  });

  // Create sample time logs for the completed tasks
  const completedTask = user.tasks.find(t => t.title === 'Design dashboard UI');
  if (completedTask) {
    await prisma.timeLog.create({
      data: {
        userId: user.id,
        taskId: completedTask.id,
        startedAt: new Date(Date.now() - 3600 * 1000), // 1 hour ago
        endedAt: new Date(),
        durationSeconds: 3600
      }
    });
  }

  console.log(`Seed completed successfully! Demo user: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
