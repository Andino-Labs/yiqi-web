# Yiqi: Open Source Community Engagement Platform

Andino is an open-source community engagement platform built for community builders, by community builders. Our vision is to be the only tool that community leaders need to manage and engage with their communities effectively.

## Features

Current features include:

- Event management (similar to Luma)
- CRM functionality (comparable to Salesforce)
- Mass messaging via WhatsApp and email
- AI-driven automations for responses and follow-ups
- Forms and surveys

Upcoming features:

- Hackathon management
- Expense tracking
- Fundraising automation
- Social media management (like Buffer)
- Networking booking app (similar to Upstream)
- Customer CSV imports
- AI agent for user data scraping
- AI-driven content generation
- Blockchain NFTs for ticketing and marketplace
- Networking proximity maps for spontaneous meetings

## Getting Started

### Prerequisites

- Node.js (version specified in `package.json`)
- Docker and Docker Compose
- Git

### Setup

1. Clone the repository:
2. Install dependencies:

   ```
   npm install
   ```

3. Set up the database:

   ```
   docker-compose up -d
   ```

4. Set up environment variables:

   - Copy `.env.example` to `.env`
   - Fill in the required values (see below for details)

5. Run database migrations:

   ```
   npm run migrate
   ```

6. Start the development server:
   ```
   npm run dev
   ```

### Environment Variables

Copy the contents of `.env.example` to a new file named `.env` and fill in the values:

- `NEXTAUTH_URL`: Your app's URL (e.g., `http://localhost:3000`)
- `NEXTAUTH_SECRET`: A secret key for NextAuth
- `CALLBACK`: OAuth callback URL
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: Google OAuth credentials
- `DIRECT_URL` and `DATABASE_URL`: PostgreSQL database URLs
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET_NAME`: AWS S3 credentials for file uploads
- Add any other required environment variables

## Architecture

- **Frontend**: Next.js with React
- **Backend**: Next.js API routes and server actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **API**: tRPC for type-safe API calls from native apps
- **Validation**: Zod for schema validation
- **File Storage**: AWS S3
- **Email**: AWS SES
- **Payments**: Mercado Pago

## Development

- We use server actions instead of REST or GraphQL for most operations
- tRPC is used for connecting native apps
- Prisma is used for database migrations and ORM
- Zod is used for data validation

For more details on available scripts and dependencies, refer to `package.json`.

## Contributing

We welcome contributions to Andino! If you'd like to contribute:

1. Fork the repository
2. Create a new branch for your feature or bug fix
3. Make your changes and commit them with clear, descriptive messages
4. Push your changes to your fork
5. Submit a pull request to the main repository

Please ensure your code follows the existing style and includes appropriate tests.

## License

WIP

## Contact

- WhatsApp Community: [Join our WhatsApp group](https://chat.whatsapp.com/JAcbw9MnFxqLEhSRLCtDNR)
- Twitter: [@andino_labs](https://x.com/andino_labs)
- Email: [paul@andinolabs.io](mailto:paul@andinolabs.io)

For more information or to get involved, feel free to reach out through any of these channels!

---

Thank you for your interest in Andino! Together, we can build the ultimate tool for community engagement.
