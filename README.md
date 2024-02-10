# Secure File Storage and Sharing Web App

## Overview
I've developed a web application that provides secure storage and sharing of files in the cloud. Users can upload files, securely store them, and share access with others. Here are the key features:

- **Secure Storage**: Files are stored securely on the cloud using Amazon Web Services (AWS) S3 buckets.
- **Access Control**: I use **presigned URLs** to restrict access to shared files. Only authorized users with the correct URL can download or view the files.
- **Authentication**: The app uses **JWT token-based authentication** to ensure that only authenticated users can access their files.
- **Best Practices**: I've followed the **MVC architecture** to keep the codebase organized and maintainable.

## Tech Stack
The application is built using the following technologies:

- **AWS S3**: For secure file storage.
- **MongoDB**: As the database to manage user accounts and metadata.
- **Typescript**: To write type-safe code.
- **Node.js** and **Express**: For the backend server.
- **EJS Templates**: To render dynamic views on the frontend.

## Future Enhancements
In the future, I plan to:

1. **Leverage AWS ECR and Fargate**: I'll deploy a Dockerized instance of the application using AWS Elastic Container Registry (ECR) and AWS Fargate. This will enhance scalability and simplify deployment.
2. **Emphasize Security**: I'll continue to emphasize the secure aspect of the application. This includes regular security audits, vulnerability assessments, and staying up-to-date with best practices.

Feel free to explore the app and experience the seamless and secure file sharing it offers! 🚀🔒
