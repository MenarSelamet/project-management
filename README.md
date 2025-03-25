# Project Management Application

A full-stack project management application with robust features for team collaboration, task management, and project visualization.

## Features

- User authentication and authorization via AWS Cognito
- Team management and collaboration
- Project creation and management
- Task tracking with priority and status
- Gantt chart visualization
- Data analytics and reporting
- File attachments support

## Tech Stack

### Frontend (Client)
- **Framework**: Next.js 15.2.1
- **Language**: TypeScript
- **State Management**: Redux
- **UI Components**:
  - Material UI
  - TailwindCSS
- **Data Visualization**:
  - Recharts
  - Gantt chart components
- **Authentication**: AWS Amplify/Cognito

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Security**:
  - Helmet middleware
  - CORS enabled
- **Logging**: Morgan

## Key Models

- **Users**: Profile management with Cognito integration
- **Teams**: Collaborative groups with defined roles
- **Projects**: Comprehensive project management
- **Tasks**: Detailed task tracking with assignments

## Deployment

The application is deployed on AWS infrastructure:
- Frontend hosted on AWS Amplify
- Backend services hosted on AWS
- Authentication handled by AWS Cognito
- Database hosted on AWS RDS (PostgreSQL)

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. Set up environment variables:
   - Create `.env` files in both client and server directories
   - Configure AWS Cognito credentials
   - Set up database connection strings

4. Initialize Prisma and seed the database:

   ```bash
   # Navigate to server directory
   cd server

   # Generate Prisma client
   npx prisma generate

   # Run Prisma migrations
   npx prisma migrate dev

   # Seed the database (optional)
   npx prisma db seed
   ```

5. Run the development servers:
   ```bash
   # Start the client
   cd ../client
   npm run dev

   # Start the server
   cd ../server
   npm run dev
   ```

## Environment Variables

### Client
```
NEXT_PUBLIC_AWS_REGION=
NEXT_PUBLIC_AWS_USER_POOL_ID=
NEXT_PUBLIC_AWS_USER_POOL_WEB_CLIENT_ID=
```

### Server
```
DATABASE_URL=
PORT=
NODE_ENV=
AWS_REGION=
AWS_USER_POOL_ID=
```



