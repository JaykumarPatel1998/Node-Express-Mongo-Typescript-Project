# Secure File

login and signup
![Web_Photo_Editor](https://github.com/JaykumarPatel1998/Node-Express-Mongo-Typescript-Project/assets/85047980/5b3c63fb-c975-4bb8-aec6-716889d539f7)

home
<img width="959" alt="index" src="https://github.com/JaykumarPatel1998/Node-Express-Mongo-Typescript-Project/assets/85047980/7a9c499d-ebd1-497a-b713-938bf8d9a04a">

notifications
<img width="960" alt="notifications" src="https://github.com/JaykumarPatel1998/Node-Express-Mongo-Typescript-Project/assets/85047980/c0dda9b6-5e0f-4b19-a9f6-af1ea4ac030b">


##system architecture

#upload service
![image](https://github.com/JaykumarPatel1998/Node-Express-Mongo-Typescript-Project/assets/85047980/06cd7724-333f-4efe-a3d6-9a4fff84386c)

#get files service
![image](https://github.com/JaykumarPatel1998/Node-Express-Mongo-Typescript-Project/assets/85047980/fee07b6f-9e85-4ccc-8768-05e9689a516c)

#delete file service
![image](https://github.com/JaykumarPatel1998/Node-Express-Mongo-Typescript-Project/assets/85047980/ee1e35e2-49ad-4ad9-9c5d-0b0eb2b34f3b)

#share file service
![image](https://github.com/JaykumarPatel1998/Node-Express-Mongo-Typescript-Project/assets/85047980/cc0d6586-e8ed-48aa-bb7e-3ee93151f162)


Storage and Sharing Web App

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
